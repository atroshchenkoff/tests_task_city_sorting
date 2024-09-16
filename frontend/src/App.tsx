import { lazy } from 'react'
import { BrowserRouter } from 'react-router-dom'

const Dashboard = lazy(() => import('./components/Layout'))

function App() {
  return (
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  )
}

export default App
