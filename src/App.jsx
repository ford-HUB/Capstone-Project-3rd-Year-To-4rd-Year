import { Routes, Route, useLocation, Router } from "react-router-dom"
import Home from "./pages/guest/Home"
import Fallback from "./pages/fallback"
import MainLayout from "./MainLayout"

const App = () => {
  return (
    <>
      <MainLayout />
    </>
  )
}

export default App