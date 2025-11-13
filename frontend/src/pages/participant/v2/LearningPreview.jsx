import React from "react"

const Card = () => (
  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow transition">
    <div className="h-36 md:h-40 bg-gray-200" />
    <div className="p-3 md:p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-green-100 text-green-700">BEGINNER</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-100 text-red-700">CLASS ENDED</span>
      </div>
      <h3 className="font-semibold text-gray-900 leading-snug">Introduction to IoT and Digital Transformation</h3>
      <div className="mt-2 md:mt-3 text-xs text-gray-500 space-x-2">
        <span>University of Cebu - Lapulapu-Mandaue</span>
        <span>•</span>
        <span>Course | Instructor-led</span>
      </div>
      <div className="mt-2 text-xs text-gray-500">Jan 21, 2025 — Jun 21, 2025</div>
    </div>
  </div>
)

const LeftRecommended = () => (
  <aside className="w-full md:w-48 lg:w-56 flex-none">
    <div className="bg-white border border-gray-200 p-5 md:p-6 shadow-lg min-h-screen">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Recommended</h4>
      <div className="space-y-3">
        <div className="border border-gray-200 p-4">
          <div className="text-sm font-medium text-gray-800">Introduction to Volunteering</div>
          <div className="text-xs text-gray-500 mt-0.5">Beginner • Self-paced</div>
        </div>
        <div className="border border-gray-200 p-4">
          <div className="text-sm font-medium text-gray-800">Community Engagement Basics</div>
          <div className="text-xs text-gray-500 mt-0.5">Workshop • 2h</div>
        </div>
        <div className="border border-gray-200 p-4">
          <div className="text-sm font-medium text-gray-800">Effective Team Collaboration</div>
          <div className="text-xs text-gray-500 mt-0.5">Course • Instructor-led</div>
        </div>
      </div>
    </div>
  </aside>
)

const RightAchievements = () => (
  <aside className="w-full md:w-96 lg:w-[28rem] flex-none ml-auto">
    <div className="bg-white border border-gray-200 p-5 md:p-6 shadow-lg min-h-screen">
      <h4 className="text-sm font-semibold text-gray-900 mb-3 md:mb-4">Latest Achievements</h4>
      <div className="border border-dashed border-gray-300 p-6 md:p-8 text-center">
        <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
          <span className="text-green-600 text-lg">★</span>
        </div>
        <p className="text-gray-800 font-semibold break-words whitespace-normal text-sm">You have no badges and certificates to display!</p>
        <p className="text-gray-500 text-xs md:text-sm mt-1 break-words whitespace-normal">Enroll into a course to earn your badge and certificate.</p>
        <button className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm">Browse catalog</button>
      </div>
    </div>
  </aside>
)

const Filters = () => (
  <div className="flex flex-wrap items-center gap-3 md:gap-4">
    <div className="relative flex-1 min-w-[220px] md:min-w-[260px]">
      <input className="w-full h-10 pl-9 pr-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Search course, training" />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
    </div>
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600">Academy</label>
      <select className="h-10 rounded-md border border-gray-300 px-2 text-sm">
        <option>All</option>
      </select>
    </div>
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600">Type</label>
      <select className="h-10 rounded-md border border-gray-300 px-2 text-sm">
        <option>All</option>
      </select>
    </div>
    <div className="ml-auto hidden md:flex items-center gap-2">
      <button className="h-10 w-10 grid place-items-center rounded-md border border-gray-300">▦</button>
      <button className="h-10 w-10 grid place-items-center rounded-md border border-gray-300">☰</button>
    </div>
  </div>
)

const ProfileDrawer = ({ open, onClose }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 h-screen w-[360px] max-w-[90vw] bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="relative h-28 bg-gradient-to-b from-gray-100 to-white">
          <button onClick={onClose} className="absolute top-3 right-3 h-8 w-8 grid place-items-center rounded-full bg-gray-100 hover:bg-gray-200" aria-label="Close">✕</button>
          <div className="absolute left-5 -bottom-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-300 border-4 border-white" />
            <div>
              <div className="text-sm font-semibold text-gray-900">Sean Allen Curaraton</div>
              <button className="mt-1 px-3 py-1 text-xs bg-green-600 text-white rounded-full">Logout</button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-8 px-5 pb-6 overflow-y-auto h-[calc(100vh-7rem)]">
          {/* Dashboard */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm mb-2">
              <span>🗂️</span>
              <span>Dashboard</span>
            </div>
            <button className="w-full flex items-center justify-between text-sm text-gray-700 py-2 px-2 rounded hover:bg-gray-50">
              <span>My Learning</span>
              <span className="text-green-600">›</span>
            </button>
            <div className="mt-4 border-t border-gray-200" />
          </div>

          {/* News */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm mb-2">
              <span>📰</span>
              <span>News</span>
            </div>
            <button className="w-full flex items-center justify-between text-sm text-gray-700 py-2 px-2 rounded hover:bg-gray-50">
              <span>For Learners</span>
              <span className="text-green-600">›</span>
            </button>
            <div className="mt-4 border-t border-gray-200" />
          </div>

          {/* Profile */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm mb-2">
              <span>👤</span>
              <span>Profile</span>
            </div>
            {[
              'Update Profile',
              'Badges & Certificates',
              'Discounts',
              'Learning History',
              'Transcript'
            ].map((item) => (
              <button key={item} className="w-full flex items-center justify-between text-sm text-gray-700 py-2 px-2 rounded hover:bg-gray-50">
                <span>{item}</span>
                <span className="text-green-600">›</span>
              </button>
            ))}
            <div className="mt-4 border-t border-gray-200" />
          </div>

          {/* Language */}
          <div className="mb-2">
            <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm mb-2">
              <span>🌐</span>
              <span>Language</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-700 py-2 px-2 rounded">
              <span>English (English)</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

const LearningPreview = () => {
  const [openProfile, setOpenProfile] = React.useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full pl-0 pr-0 md:pl-0 md:pr-0 lg:pl-0 lg:pr-0 pt-0 pb-6">
        <div className="flex flex-col md:flex-row md:flex-nowrap gap-4 md:gap-6 lg:gap-8 items-stretch">
          <LeftRecommended />
          <div className="flex-1 min-w-0">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 justify-center md:justify-start">
                <span className="text-2xl">📖</span>
                My Learning
              </h1>
              <div className="mt-2 text-sm font-semibold text-gray-800">In-Progress</div>
            </div>
            <Filters />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6 mt-5">
              <Card />
              <Card />
              <Card />
            </div>
          </div>

          <RightAchievements />
        </div>
      </div>

      <ProfileDrawer open={openProfile} onClose={() => setOpenProfile(false)} />

      <div className=''>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-4 mt-5 pr-3">
                                
                            </div>
                        </div>
    </div>
  )
}

export default LearningPreview 