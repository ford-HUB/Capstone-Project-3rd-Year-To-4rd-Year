import React from 'react'

const WarningAlert = ({ open, children }) => {
    return (
        <>
            {
                open ? <div role="alert" className="alert alert-warning alert-soft">
                    <span>{children}</span>
                </div> : null
            }
        </>
    )
}

export default WarningAlert