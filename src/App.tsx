import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainInvitation from './components/MainInvitation'
import Survey from './components/Survey'

function App() {
  return (
    <Router basename="/lipovs-wedding">
      <Routes>
        <Route path="/" element={<MainInvitation />} />
        <Route path="/survey" element={<Survey />} />
      </Routes>
    </Router>
  )
}

export default App
