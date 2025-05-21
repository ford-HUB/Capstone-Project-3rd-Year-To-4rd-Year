import React from 'react'

const SuccessAlert = ({ open, children }) => {
    return (
        <>
            {
                open ? <div role="alert" className="alert alert-success alert-soft">
                    <span>{ children }</span>
                </div> : null
            }
        </>
    )
}

export default SuccessAlert