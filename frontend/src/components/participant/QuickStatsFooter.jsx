import React from 'react'
import { Bell, Trophy } from 'lucide-react'

const QuickStatsFooter = () => {
  return (
    <>
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
                <Bell className="w-4 h-4" />
                <span>5 notifications today</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600 font-medium">
                <Trophy className="w-4 h-4" />
                <span>3 certificates earned this week</span>
            </div>
      </div>
    </>
  )
}

export default QuickStatsFooter