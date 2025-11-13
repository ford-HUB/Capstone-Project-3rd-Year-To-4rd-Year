import React from 'react'
import { CheckCircle, Trash2, UserX, UserCheck, Eye } from 'lucide-react'

const Toggles = ({ open, setOpen, onComplete, modalPosition, selectedUser }) => {

    const handleAction = async(type) => {
        switch(type) {
        case 'delete':
            onComplete({ action: 'delete', selectedUser: selectedUser })
            break
        case 'deactivate':
            onComplete({ action: 'deactivate', selectedUser: selectedUser })
            break
        case 'restore':
            onComplete({ action: 'restore', selectedUser: selectedUser })
            break
        case 'view':
            onComplete({ action: 'view', selectedUser: selectedUser })
            break
        default:
            console.log('there is no match in your type')
        }
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
          onClick={() => handleAction('view')}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          View Info
        </button>

        {selectedUser?.status === 'deactivated' ? (
          <button
            onClick={() => handleAction('restore')}
            className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-gray-100 flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            Restore Account
          </button>
        ) : (
          <button
            onClick={() => handleAction('deactivate')}
            className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-gray-100 flex items-center gap-2"
          >
            <UserX className="w-4 h-4" />
            Deactivate
          </button>
        )}

        <button
          onClick={() => handleAction('delete')}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Soft Delete
        </button>
      </div>
    </>
  )
}

export default Toggles