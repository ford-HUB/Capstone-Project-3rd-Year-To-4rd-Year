import React from 'react'

const WarningAlert = ({ open }) => {
    return (
        <>
            {
                open ? <div role="alert" className="alert alert-warning alert-soft">
                    <span>Fill Out the Blank</span>
                </div> : null
            }
        </>
    )
}

export default WarningAlert