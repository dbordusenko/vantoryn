import React from 'react'
import { C, f } from '../tokens'

function FallbackUI({ error, onReset }) {
  return (
    <div style={{
      minHeight: '100vh', background: C.bg0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: C.bg2, border: `1px solid ${C.red}40`,
        borderRadius: 16, padding: '40px 48px', maxWidth: 480,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>⚠️</div>
        <div style={f({ fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 8 })}>
          Something went wrong
        </div>
        <div style={f({ fontSize: 13, color: C.t2, lineHeight: 1.7, marginBottom: 24 })}>
          {error?.message || 'An unexpected error occurred.'}
        </div>
        <button
          onClick={onReset}
          style={f({
            padding: '10px 28px', borderRadius: 9, border: 'none',
            background: C.blue, color: '#fff', fontSize: 14,
            fontWeight: 600, cursor: 'pointer',
            boxShadow: `0 4px 16px ${C.blue}40`,
          })}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Try again
        </button>
      </div>
    </div>
  )
}

export default class ErrorBoundary extends React.Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <FallbackUI
          error={this.state.error}
          onReset={() => this.setState({ error: null })}
        />
      )
    }
    return this.props.children
  }
}
