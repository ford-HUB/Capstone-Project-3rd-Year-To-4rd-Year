import React from 'react'
import { useAuth } from '../hooks/participant/useAuth.js'
import { useEvent } from '../hooks/participant/useEvent.js'
import InterestSelection from '../components/onboarding/InterestSelection.jsx'

const CheckInterestWrapper = ({ children }) => {
    const [showInterestModal, setInterestModal] = React.useState(false)
    const { authenticatedUser } = useAuth()
    const { checkInterest } = useEvent()

    React.useEffect(() => {
        if (!authenticatedUser) return;
        
        const checkingInterest = async () => {
            const hasInterests = await checkInterest();
            setInterestModal(!hasInterests);
        }

        checkingInterest()
    }, [authenticatedUser, checkInterest]);

    if (!authenticatedUser) {
        return null
    }


    return (
        <>
            {

                showInterestModal && (
                    <InterestSelection
                        isOpen={showInterestModal} 
                        onClose={() => setInterestModal(false)} 
                        onComplete={() => setInterestModal(false)}
                    />
                )
            }
            {children}
        </>
    )
}

export default CheckInterestWrapper
