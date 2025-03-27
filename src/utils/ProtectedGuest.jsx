import React from 'react'
import LoginForm from '../pages/guest/LoginForm'
import { useParams } from 'react-router-dom'
import Cookie from 'js-cookie'

const ProtectedGuest = ({ children }) => {
    const [showLogin, setLogin] = React.useState(false)
    const { id } = useParams()

    React.useEffect(() => {
        const checkToken = setInterval(() => {
            let currentToken = Cookie.get('token')
            if (currentToken) {
                if (currentToken === id) {
                    console.log(`Token is Valid: ${currentToken}`);
                    setLogin(false)
                } else if (currentToken !== id) {
                    console.log(`Token Expired: ${currentToken}`);
                    setLogin(true) // setting login into true after the page is loaded
                }
            } else {
                setLogin(true)
            }
        }, 1000)

        return () => clearInterval(checkToken)
    }, [id])
    return (
        <>
            {
                showLogin && <LoginForm />
            }
            {children}
        </>
    )
}

export default ProtectedGuest