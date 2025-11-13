import React, { useState } from 'react';
import HeroSection from '../../../components/common/beneficiary/profile/hero/HeroSection'
import NavigationTabs from '../../../components/common/beneficiary/profile/navigations/NavigationTabs';
import ProfileForm from '../../../components/common/beneficiary/profile/forms/ProfileForm';
import { updateBeneficiaryProfileSchema } from '../../../forms/BeneficiarySchemas.js';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import { useBeneficiaryAuthStore } from '../../../store/beneficiary/useBeneficiaryAuthStore.js';
import { useBeneficiaryProfileStore } from '../../../store/beneficiary/useBeneficiaryProfileStore.js';
import { useSearchParams } from 'react-router-dom';
import LocationSettingsTab from './LocationSettingsTab.jsx';
import BeneficiaryParticipationHistory from '../../../components/beneficiary/profile/BeneficiaryParticipationHistory.jsx';
import BeneficiaryChangePassword from '../../../components/beneficiary/profile/BeneficiaryChangePassword.jsx';

const BeneficiaryProfile = () => {
    const { authenticatedUser } = useBeneficiaryAuthStore()
    const { currentProfileInfo, getCurrentProfile, updateProfile } = useBeneficiaryProfileStore()
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

    const { watch, reset, setValue, register, handleSubmit, formState: { errors, isSubmitting, isDirty } }= useForm({
        resolver: zodResolver(updateBeneficiaryProfileSchema),
        defaultValues: {
            firstname: '',
            lastname: '',
            middle_initial: '',
            gender: '',
            phone_number: '',
            age: '',
            current_address: '',
            organization_name: ''
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
          console.log('Current profile info:', currentProfileInfo);
          console.log('Gender value:', currentProfileInfo?.gender);
          console.log('Gender type:', typeof currentProfileInfo?.gender);
          
          // Ensure gender value is properly matched with dropdown options
          const genderValue = currentProfileInfo?.gender;
          const validGenderValues = ['M', 'F', 'O'];
          const matchedGender = validGenderValues.includes(genderValue) ? genderValue : '';
          
          console.log('Matched gender:', matchedGender);
          
          reset({
            firstname: currentProfileInfo?.firstname || '',
            lastname: currentProfileInfo?.lastname || '',
            middle_initial: currentProfileInfo?.middle_initial || '',
            gender: matchedGender,
            phone_number: currentProfileInfo?.phone_number || '',
            age: currentProfileInfo?.age || '',
            current_address: currentProfileInfo?.current_address || '',
            organization_name: currentProfileInfo?.organization_name || '',
          });
        }
    }, [currentProfileInfo, reset])

    const onSubmitProfileUpdate = async (formData) => {
        console.log('working', formData)
        console.log('Form gender value:', formData.gender)
        const success = await updateProfile(formData)
        if(!success) return
        await getCurrentProfile()
    }

    // Watch the gender field to see its current value
    const currentGenderValue = watch('gender')
    console.log('Current gender value in form:', currentGenderValue)

    // Calculate accomplishment data for beneficiary
    // const accomplishmentData = {
    //     assistanceReceived: 0, // This would come from assistance history
    //     eventsAttended: 0, // This would come from event participation
    //     locationMatches: 0 // This would come from location-based matching
    // };

    return (
        <div className="max-h-screen overflow-y-auto bg-gray-50">
        <HeroSection userData={currentProfileInfo} accomplishmentData={null}/>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <NavigationTabs activeTab={activeTab} setActiveTab={handleTabChange} />
                {activeTab === 'profile' && (
                <ProfileForm authenticatedData={authenticatedUser} onSubmit={onSubmitProfileUpdate} changesWatcher={isDirty} isSubmitting={isSubmitting} handleSubmit={handleSubmit} watch={watch} register={register} setValue={setValue} errors={errors} />
                )}

                {activeTab === 'records' && (
                    <BeneficiaryParticipationHistory />
                )}

                {activeTab === 'change-password' && (
                    <BeneficiaryChangePassword />
                )}
            </div>
        </div>
    );
};

export default BeneficiaryProfile
