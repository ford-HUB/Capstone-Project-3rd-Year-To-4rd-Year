import React from 'react'
import LoginPage from '../pages/auth/LoginPage'
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
                    setLogin(true) // redirect to login if the token is expired
                }
            } else {
                setLogin(true) // redirect to login if there is no token
            }
        }, 1000)

        return () => clearInterval(checkToken) // clear the Interval realTime
    }, [id]) // watch out the id changes
    return (
        <>
            {
                showLogin && <LoginPage />
            }

            {children}
        </>
    )
}

export default ProtectedGuest