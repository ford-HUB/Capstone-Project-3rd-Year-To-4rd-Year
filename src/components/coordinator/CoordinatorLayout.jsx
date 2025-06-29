import React from 'react'
import { Outlet } from 'react-router-dom'

const CoordinatorLayout = () => {
    return (
        <div className="coordinator-layout">
            <Outlet />
        </div>
    )
}

export default CoordinatorLayout 