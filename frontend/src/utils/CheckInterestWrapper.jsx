import React from 'react'
import { useAuthStore } from '../store/participant/useAuthStore.js'
import { useEventStore } from '../store/participant/useEventStore.js'
import InterestSelection from '../components/onboarding/InterestSelection.jsx'

const CheckInterestWrapper = ({ children }) => {
    const [showInterestModal, setInterestModal] = React.useState(false)
    const { authenticatedUser } = useAuthStore()
    const { checkInterest } = useEventStore()

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
