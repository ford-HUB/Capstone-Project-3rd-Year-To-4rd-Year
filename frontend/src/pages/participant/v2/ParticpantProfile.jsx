import React, { useState } from 'react';
import HeroSection from '../../../components/common/participant/profile/hero/HeroSection'
import NavigationTabs from '../../../components/common/participant/profile/navigations/NavigationTabs';
import ProfileForm from '../../../components/common/participant/profile/forms/ProfileForm';
import { updateProfileSchema } from '../../../forms/StudentSchemas.js';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import InterestTab from './InterestTab.jsx';
import ParticipantHistory from './ParticipantHistory.jsx';
import { useAuthStore } from '../../../store/participant/useAuthStore.js';
import { useProfileStore } from '../../../store/participant/useProfileStore.js';
import { useEventStore } from '../../../store/participant/useEventStore.js';
import { useCertificateStore } from '../../../store/common/useCertificateStore.js';
import { useSearchParams } from 'react-router-dom';
import CertificateSection from '../../../components/common/certificate/CertificateSection.jsx';
import CertificatePage from '../../common/CertificatePage.jsx';
import ParticipantChangePassword from '../../../components/participant/v2/ParticipantChangePassword.jsx';

const ParticipantProfile = () => {
    const { authenticatedUser } = useAuthStore()
    const { currentProfileInfo, getCurrentProfile, updateProfile } = useProfileStore()
    const { getCertificateTotalAndEventTotal, certificateTotal, eventCompletedTotal } = useCertificateStore()
    const { checkInterest, interest } = useEventStore()
    const [hasInterest, setHasInterest] = React.useState(false)
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'profile'

    React.useEffect(() => {
        if (!searchParams.get('tab')) {
          setSearchParams({ tab: 'profile' });
        }
    }, [searchParams, setSearchParams]);


    const handleTabChange = (tab) => {
        setSearchParams(prev => {
          const next = new URLSearchParams(prev);
          next.set("tab", tab);
          return next;
        });
    };

    const accomplishmentData = {
        certificateTotal: certificateTotal,
        eventCompletedCount: eventCompletedTotal
    }

    React.useEffect(() => {
        getCertificateTotalAndEventTotal()
    }, [certificateTotal, eventCompletedTotal])
      

    const { watch, reset, setValue, register, handleSubmit, formState: { errors, isSubmitting, isDirty } }= useForm({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            firstname: '',
            lastname: '',
            gender: '',
            middle_initial: '',
            phone_number: '',
            current_address: '',
            course: '',
            department: '',
            year_level: undefined,
            disability: '',
            disability_specification: '',
            is_subscribed: false
        }
    })

    React.useEffect(() => {
        let isMounted = true
        
        const fetchInfo = async () => {
            try {
                await getCurrentProfile()
                console.log(currentProfileInfo)
            } catch(error) {
                if (isMounted) {
                    console.error("Fetch error:", error);
                }
            }
        }

        fetchInfo()

        return () => {
            isMounted = false
        }
    }, [getCurrentProfile])


    React.useEffect(() => {
        if (currentProfileInfo) {
          // Handle both regular courses and strand courses
          const courseName = currentProfileInfo?.CampusUser?.Course?.course_name || 
                           currentProfileInfo?.CampusUser?.StrandCourse?.name || '';
          
          reset({
            firstname: currentProfileInfo?.CampusUser?.firstname || '',
            lastname: currentProfileInfo?.CampusUser?.lastname || '',
            gender: currentProfileInfo?.CampusUser?.gender.trim() || '',
            middle_initial: currentProfileInfo?.CampusUser?.middle_initial || '',
            phone_number: currentProfileInfo?.CampusUser?.phone_number || '',
            current_address: currentProfileInfo?.CampusUser?.current_address || '',
            course: courseName,
            department: currentProfileInfo?.CampusUser?.Department?.department_name || '',
            year_level: currentProfileInfo?.CampusUser?.YearLevel?.year_level || undefined,
            disability: currentProfileInfo?.CampusUser?.disability || '',
            disability_specification: currentProfileInfo?.CampusUser?.disability_specification || '',
            is_subscribed: currentProfileInfo?.is_subscribed ?? false,
          });
        }
    }, [currentProfileInfo, reset])

    React.useEffect(() => {
        const fetchInterest = async () => {
            try {
                const hasInterest = await checkInterest()
                setHasInterest(hasInterest)
            } catch (error) {
                console.error("Interest fetch error:", error);
                setHasInterest(false)
            }
        }

        fetchInterest()
    }, [checkInterest])


    const onSubmitProfileUpdate = async (formData) => {
        console.log('working', formData)
        const success = await updateProfile(formData)
        if(!success) return
        await getCurrentProfile()
    }


    return (
        <div className="max-h-screen overflow-y-auto bg-gray-50">
        <HeroSection userData={currentProfileInfo} accomplishmentData={accomplishmentData}/>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <NavigationTabs activeTab={activeTab} setActiveTab={handleTabChange} />
                {activeTab === 'profile' && (
                <ProfileForm authenticatedData={authenticatedUser} onSubmit={onSubmitProfileUpdate} changesWatcher={isDirty} isSubmitting={isSubmitting} handleSubmit={handleSubmit} watch={watch} register={register} setValue={setValue} errors={errors} />
                )}

                {activeTab === 'change-password' && (
                    <ParticipantChangePassword/>
                )}

                {activeTab === 'certificates' && (
                    <CertificatePage />
                )}

                {activeTab === 'interest' &&
                    <InterestTab
                    setActiveTab={handleTabChange}
                    hasInterest={hasInterest}
                    currentInterest={interest}
                    />
                }

                {activeTab === 'history' && (
                    <ParticipantHistory />
                )}
            </div>
        </div>
    );
}

export default ParticipantProfile