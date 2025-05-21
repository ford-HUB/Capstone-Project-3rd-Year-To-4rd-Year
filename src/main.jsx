import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

// @Context
import { DepartmentProvider } from './context/useDepartmentContext'

createRoot(document.getElementById('root')).render(
  <DepartmentProvider>
    <BrowserRouter>
      <StrictMode>
       <App />
      </StrictMode>
    </BrowserRouter>
  </DepartmentProvider>
)
