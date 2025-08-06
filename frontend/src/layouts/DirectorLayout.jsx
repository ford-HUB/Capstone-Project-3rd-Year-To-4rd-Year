import React from 'react'
import { Outlet } from 'react-router-dom'
import DirectorSidebar from '../components/director/DirectorSidebarPanel'
import DirectorNavbar from '../components/director/DirectorNavbar'
import { useIsMobile } from '../hooks/customHooks'

const DirectorLayout = () => {
  const isMobile = useIsMobile()
  const [isCollapsed, setCollapsed] = React.useState(false)
  const [isMobileCollapsed, setMobileCollapsed] = React.useState(false)
  const [activateCollapser, setActivateCollapser] = React.useState(false)

  const isSidebarCollapsed = isMobile ? isMobileCollapsed : isCollapsed && !activateCollapser

  return (
    <div className="flex h-screen overflow-hidden">
      <div 
      onMouseEnter={() => setActivateCollapser(true)}
      onMouseLeave={() => setActivateCollapser(false)}
      >
        <DirectorSidebar sidebarCollapsed={isSidebarCollapsed}/>
      </div>
      <div className="flex flex-col overflow-hidden w-full">
        <DirectorNavbar collapseSidebar={() => setCollapsed(!isSidebarCollapsed)} mobileCollapseSidebar={() => setMobileCollapsed(!isMobileCollapsed)}/>
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DirectorLayout
