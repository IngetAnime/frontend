import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginUser from './pages/LoginUser'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/'>
          <Route path='login' element={<LoginUser />} />
        </Route>
      </Routes>
    </Router>
  )
}
