import { asset } from '../../assets/asset'

const OptionModal = ({ open, setOpen, children }) => {
    return (
        <>
            {/* our z or z-[9999] is making sure that our modal naa gyud sa taas na layer */}
            {/* to prevent overriding the modal */}
            <div className={`fixed inset-0 z-[9999] flex justify-center items-center transition-colors  
                ${open ? 'visible bg-black/20' : 'invisible'}`} onClick={() => setOpen}
            >
                {/* Modal Interface */}
                <div onClick={(e) => stopPropagation()}
                    className={`bg-white rounded-xl shadow p-6 transition-all 
                    ${open ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}`}>
                    {children}
                </div>
            </div>
        </>
    )
}

export default OptionModal
