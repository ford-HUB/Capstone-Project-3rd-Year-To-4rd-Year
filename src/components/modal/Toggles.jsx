import React from 'react'
import { CheckCircle, Trash2, UserX } from 'lucide-react'
import { useManageUsersHooks } from '../../hooks/director/useManageUsersHooks.js'

const Toggles = ({ open, setOpen, onComplete, modalPosition, selectedUser }) => {
  const { deleteUser } = useManageUsersHooks()

  const handleDelete = async(type) => {
    switch(type) {
      case 'whitelist':

        break
      case 'delete':
        const success = await deleteUser(selectedUser)
        if(!success) return
        onComplete('delete', selectedUser)

        break
      case 'deactivate':
        // Handle deactivate action
        onComplete('deactivate', selectedUser)
        break
      default:
        console.log('there is no match in your type')
    }
    setOpen(false)
  }

  if(!open) return null
  
  return (
    <>
      <div 
        className={`fixed inset-0 z-40 ${open ? 'visible' : 'hidden'}`}
        onClick={() => setOpen(false)}
      />
      <div 
        className="absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48"
        style={{
          top: `${modalPosition.y}px`,
          left: `${modalPosition.x}px`,
          transform: 'translateX(-100%)'
        }}
      >
        <button
          onClick={() => handleDelete('whitelist')}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Whitelist
        </button>
        <button
          onClick={() => handleDelete('delete')}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
        <button
          onClick={() => handleDelete('deactivate')}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
        >
          <UserX className="w-4 h-4" />
          Deactivate
        </button>
      </div>
    </>
  )
}

export default Toggles