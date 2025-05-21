import React from 'react'

const ErrorAlert = ({ open, children }) => {
    return (
        <>
            {
                open ? <div role="alert" className="alert alert-error alert-soft">
                    <span>{children}</span>
                </div> : null
            }
        </>
    )
}

export default ErrorAlert