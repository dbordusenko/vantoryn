/**
 * VantorynMark — точная копия финального логотипа
 * Круг · 3 ромба-акцента (12, 9, 3 часа) · двойной V · центральный ромб
 */
import { C } from '../tokens'

export default function VantorynMark({ size = 36, mono = false }) {
  const id = `vm${size}`

  // Gold palette
  const hi  = mono ? C.t1  : '#e2c45a'   // светлое золото
  const mid = mono ? C.t2  : '#b8922e'   // среднее
  const lo  = mono ? C.t3  : '#7a5c18'   // тёмное

  const GA = `url(#${id}A)`  // основной градиент
  const GB = `url(#${id}B)`  // внутренний V
  const GR = `url(#${id}R)`  // кольцо
  const GD = `url(#${id}D)`  // ромб-центр

  // Геометрия — viewBox 0 0 200 210
  // Центр круга: (100, 108), радиус: 80
  const cx = 100, cy = 108, r = 80

  // Координаты верхушек V: они касаются верхней дуги круга ~(100, 28)
  // Левый верх V: (32, 55)  Правый верх V: (168, 55)  Кончик: (100, 178)
  // Внутренний V (чуть уже): (52, 55) → (100, 152) ← (148, 55)

  return (
    <svg width={size} height={size * 210 / 200}
      viewBox="0 0 200 210" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-label="Vantoryn">
      <defs>
        {/* Основной золотой */}
        <linearGradient id={`${id}A`} x1="30" y1="20" x2="170" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={hi}/>
          <stop offset="45%"  stopColor={mid}/>
          <stop offset="100%" stopColor={lo}/>
        </linearGradient>
        {/* Внутренний V — немного светлее */}
        <linearGradient id={`${id}B`} x1="52" y1="55" x2="148" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={hi}  stopOpacity="1"/>
          <stop offset="100%" stopColor={mid} stopOpacity="0.5"/>
        </linearGradient>
        {/* Кольцо — ярче сверху, затухает снизу */}
        <linearGradient id={`${id}R`} x1="100" y1="28" x2="100" y2="188" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={hi}  stopOpacity="1"/>
          <stop offset="50%"  stopColor={mid} stopOpacity="0.8"/>
          <stop offset="100%" stopColor={lo}  stopOpacity="0.3"/>
        </linearGradient>
        {/* Центральный ромб */}
        <linearGradient id={`${id}D`} x1="100" y1="82" x2="100" y2="114" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={hi}/>
          <stop offset="100%" stopColor={lo}/>
        </linearGradient>
      </defs>

      {/* ══ КОЛЬЦО ═══════════════════════════════════════════════════════ */}
      <circle cx={cx} cy={cy} r={r}
        stroke={GR} strokeWidth="4" fill="none"/>

      {/* ══ АКЦЕНТ СВЕРХУ — вытянутый 4-лучевой ромб на 12 часов ════════ */}
      {/* Центр верхней точки кольца: (100, 28) */}
      {/* Вертикальный ромб: вверх 14, вниз 14, стороны 5 */}
      <path d="M 100 10 L 105 28 L 100 46 L 95 28 Z"
        fill={GA}/>
      {/* Горизонтальная перекладина (4-й луч) */}
      <path d="M 90 28 L 100 32 L 110 28 L 100 24 Z"
        fill={GA} opacity="0.7"/>

      {/* ══ АКЦЕНТ СЛЕВА — горизонтальный ромб на 9 часов ═══════════════ */}
      {/* Левая точка кольца: (20, 108) */}
      <path d="M 2  108 L 20 113 L 38 108 L 20 103 Z"
        fill={GA}/>
      <path d="M 20 96 L 24 108 L 20 120 L 16 108 Z"
        fill={GA} opacity="0.7"/>

      {/* ══ АКЦЕНТ СПРАВА — горизонтальный ромб на 3 часа ═══════════════ */}
      {/* Правая точка кольца: (180, 108) */}
      <path d="M 162 108 L 180 113 L 198 108 L 180 103 Z"
        fill={GA}/>
      <path d="M 180 96 L 184 108 L 180 120 L 176 108 Z"
        fill={GA} opacity="0.7"/>

      {/* ══ ВНЕШНИЙ V — толстый ══════════════════════════════════════════ */}
      {/* Левый верх (32,55) → кончик (100,178) → правый верх (168,55) */}
      <path d="M 32 55 L 100 178 L 168 55"
        stroke={GA} strokeWidth="13"
        strokeLinecap="round" strokeLinejoin="round"/>

      {/* ══ ВНУТРЕННИЙ V — тонкий, создаёт двойной штрих ════════════════ */}
      {/* (52,55) → (100,152) → (148,55) */}
      <path d="M 52 55 L 100 152 L 148 55"
        stroke={GB} strokeWidth="4.5"
        strokeLinecap="round" strokeLinejoin="round"/>

      {/* ══ ЦЕНТРАЛЬНЫЙ РОМБ — в месте пересечения внутренних плеч ══════ */}
      {/* Примерно на 40% высоты V: (100, 98) */}
      <path d="M 100 82 L 110 98 L 100 114 L 90 98 Z"
        fill={GD} opacity="0.95"/>
      {/* Внутренняя грань — тёмнее */}
      <path d="M 100 87 L 107 98 L 100 109 L 93 98 Z"
        fill={lo} opacity="0.5"/>
      {/* Верхний блик */}
      <path d="M 100 82 L 110 98 L 100 92 L 90 98 Z"
        fill={hi} opacity="0.3"/>
    </svg>
  )
}
