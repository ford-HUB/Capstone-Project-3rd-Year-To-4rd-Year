import { Outlet } from "react-router-dom"
import { useLocation } from "react-router-dom"
import Matching from "./Matching"

const LeftCard = ({open, setOpen, children}) => {
  const location = useLocation()

  return (
    <>
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-1/3 mr-4">
        <Matching/>
      </div>
    </>
  )
}

export default LeftCard