import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// @Context
import { DepartmentProvider } from './context/useDepartmentContext'
import { GraduatedYearsProvider } from './context/useGraduatedYearsContext'

createRoot(document.getElementById('root')).render(
    <DepartmentProvider>
      <GraduatedYearsProvider>
        <BrowserRouter>
          <StrictMode>
            <App />
          <Toaster/>
          </StrictMode>
        </BrowserRouter>
      </GraduatedYearsProvider>
    </DepartmentProvider>
)
