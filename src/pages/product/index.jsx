import { useState, useEffect } from 'react'
import { C, FONT } from '../../tokens'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import Overview from './views/Overview'
import Forecasting from './views/Forecasting'
import Reports from './views/Reports'
import AIBrief from './views/AIBrief'
import Alerts from './views/Alerts'
import Integrations from './views/Integrations'
import AppSettings from './views/AppSettings'
import Guide from './views/Guide'

export default function Product({ navigate, onLogout, session }) {
  const [view, setView]               = useState('overview')
  const [lastSync, setLastSync]       = useState('2 min ago')
  const [importedData, setImportedData] = useState(null)

  useEffect(() => {
    const id = setInterval(() => {
      const mins = Math.floor(Math.random() * 3) + 1
      setLastSync(`${mins} min ago`)
    }, 30000)
    return () => clearInterval(id)
  }, [])

  const renderView = () => {
    switch (view) {
      case 'overview':     return <Overview setView={setView} importedData={importedData} />
      case 'forecasting':  return <Forecasting />
      case 'reports':      return <Reports />
      case 'ai-brief':     return <AIBrief />
      case 'alerts':       return <Alerts setView={setView} />
      case 'integrations': return <Integrations onImport={setImportedData} importedData={importedData} />
      case 'settings':     return <AppSettings />
      case 'guide':        return <Guide />
      default:             return <Overview setView={setView} importedData={importedData} />
    }
  }

  return (
    <div style={{ background: C.bg0, minHeight: '100vh', fontFamily: FONT, display: 'flex' }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
        input[type=range]{height:4px;border-radius:2px}
      `}</style>

      <Sidebar view={view} setView={setView} navigate={navigate} session={session} />

      <div style={{ marginLeft: 224, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar
          view={view}
          lastSync={lastSync}
          importedData={importedData}
          session={session}
          onLogout={onLogout}
        />
        <main style={{ marginTop: 56, padding: '28px', minHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <div key={view} style={{ animation: 'fadeIn 0.25s ease' }}>
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  )
}
