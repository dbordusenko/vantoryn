"""API-key auth for mutating endpoints + a simple per-IP rate limiter.

Design notes:
  • Fail-safe: if API_KEY is not configured, writes are refused outright rather
    than left open. A misconfigured deploy degrades to read-only, never to
    "anyone on the internet can DELETE".
  • The rate limiter is in-process and approximate — enough to stop an F5 storm
    from pinning the 1-core VM. For multi-instance use, move to Redis.
"""
import hmac
import time
from collections import defaultdict, deque
from fastapi import Header, HTTPException, Request

from .config import API_KEY, RATE_LIMIT_RUNS, RATE_LIMIT_WINDOW_S


def require_api_key(x_api_key: str = Header(default="")) -> None:
    """Dependency for POST/PUT/DELETE. Raises 401/503 unless the key matches."""
    if not API_KEY:
        raise HTTPException(503, "Write API is disabled (server has no API_KEY configured).")
    # constant-time compare — avoids leaking the key via response timing
    if not hmac.compare_digest(x_api_key, API_KEY):
        raise HTTPException(401, "Invalid or missing X-API-Key.")


def has_api_key(x_api_key: str = Header(default="")) -> bool:
    """Non-raising variant: lets public endpoints behave differently for admins."""
    return bool(API_KEY) and hmac.compare_digest(x_api_key, API_KEY)


def client_ip(request: Request) -> str:
    """Real client IP behind the nginx reverse proxy."""
    fwd = request.headers.get("x-forwarded-for", "")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


_hits: dict[str, deque] = defaultdict(deque)


def rate_limit(request: Request) -> None:
    """Sliding-window limiter for the public planning endpoint."""
    ip = client_ip(request)
    now = time.monotonic()
    window = _hits[ip]
    while window and now - window[0] > RATE_LIMIT_WINDOW_S:
        window.popleft()
    if len(window) >= RATE_LIMIT_RUNS:
        retry = int(RATE_LIMIT_WINDOW_S - (now - window[0])) + 1
        raise HTTPException(
            429, f"Rate limit exceeded ({RATE_LIMIT_RUNS} runs / {RATE_LIMIT_WINDOW_S}s). "
                 f"Retry in {retry}s.",
        )
    window.append(now)
    # keep the dict from growing unbounded across many IPs
    if len(_hits) > 5000:
        for k in [k for k, v in list(_hits.items()) if not v]:
            _hits.pop(k, None)
