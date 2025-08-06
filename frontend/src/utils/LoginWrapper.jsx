import React from 'react'
import LoginPage from '../pages/auth/LoginPage'

const LoginWrapper = ({ children }) => {
    const [showLogin, setLogin] = React.useState(false)

    React.useEffect(() => {
        setLogin(true) // setting login into true after the page is loaded
    }, [])

    return (
        <>
            {
                showLogin && <LoginPage />
            }
            {children}
        </>
    )

}

export default LoginWrapper