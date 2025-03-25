import React from 'react'

const ErrorAlert = ({ open }) => {
    return (
        <>
            {
                open ? <div role="alert" className="alert alert-error alert-soft">
                    <span>Invalid Credentials</span>
                </div> : null
            }
        </>
    )
}

export default ErrorAlert