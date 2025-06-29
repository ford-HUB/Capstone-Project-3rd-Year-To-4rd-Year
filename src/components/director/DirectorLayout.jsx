import React from 'react'
import { Outlet } from 'react-router-dom'

const DirectorLayout = () => {
    return (
        <div className="director-layout">
            <Outlet />
        </div>
    )
}

export default DirectorLayout 