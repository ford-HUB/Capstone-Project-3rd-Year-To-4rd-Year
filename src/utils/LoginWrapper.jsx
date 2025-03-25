import React from 'react'
import LoginForm from '../pages/guest/LoginForm'
const LoginWrapper = ({ children }) => {
    const [showLogin, setLogin] = React.useState(false)

    React.useEffect(() => {
        setLogin(true) // setting login into true after the page is loaded
    }, [])

    return (
        <>
            {
                showLogin && <LoginForm />
            }
            {children}
        </>
    )

}

export default LoginWrapper