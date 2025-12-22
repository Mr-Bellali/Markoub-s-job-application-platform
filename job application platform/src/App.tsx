import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ApplicationDetailPage from './pages/PositionDetailPage'
import ApplicationsPage from './pages/PositionsPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ApplicationsPage />} />
        <Route path="/positions/:id" element={<ApplicationDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
