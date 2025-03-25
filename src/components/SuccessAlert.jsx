import React from 'react'

const SuccessAlert = ({ open }) => {
    return (
        <>
            {
                open ? <div role="alert" className="alert alert-success alert-soft">
                    <span>Account Successfuly Logged In</span>
                </div> : null
            }
        </>
    )
}

export default SuccessAlert