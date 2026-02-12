import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import Register from './pages/Registerpage.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>
    <App />
    {/* <Register/> */}
    </BrowserRouter>
  </StrictMode>,
)
