import React from 'react';
import Section from '../profile/Section';
import FormField from '../profile/fields/FormField';
import TextInput from './fields/TextInput';
import UpdateEmailModal from '../../../modal/v2/beneficiary/UpdateEmailModal';

const ContactInformationSection = ({ data, register, errors }) => {
    const [showUpdateEmailModal, setUpdateEmailModal] = React.useState(false)
    
    return (
        <Section
            title="Contact Information"
            helpIcon>
            <div className="space-y-3">
                <div className="flex items-center gap-x-3.5">
                    <div className='flex items-center'>
                        <FormField label="Email">
                            <input
                                className={`w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50`}
                                value={data?.email}
                                type="text"
                                readOnly
                            />
                        </FormField>
                    </div>
                    <button onClickCapture={(e) => setUpdateEmailModal(true)}
                    type='button'
                    className="mt-6 cursor-pointer text-green-600 hover:text-green-700 text-sm font-medium">
                        Change Email
                    </button>
                </div>

                <FormField
                    label={'Contact Number'}
                    error={errors?.phone_number?.message}>
                    <TextInput
                        name={'phone_number'}
                        {...register('phone_number')}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Please enter your phone number in the format: 09XX XXX XXXX
                    </p>
                </FormField>

                
            </div>
            <UpdateEmailModal
            isOpen={showUpdateEmailModal}
            setOpen={() => setUpdateEmailModal(false)}
            data={data}
            />
        </Section>
    )
};

export default ContactInformationSection;