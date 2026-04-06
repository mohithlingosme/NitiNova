import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import ResearchPage from '@/pages/ResearchPage' // Placeholder
import Dashboard from '@/pages/Dashboard' // Placeholder

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/research" element={<ResearchPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

