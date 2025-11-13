import React from 'react';
import Section from '../profile/Section';
import FormField from '../profile/fields/FormField';
import TextInput from './fields/TextInput';
import UpdateEmailModal from '../../../modal/v2/participant/UpdateEmailModal';

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
                                className={`w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
                                value={data?.email}
                                type="text"
                                readOnly
                            />
                        </FormField>
                    </div>
                    <button onClickCapture={(e) => setUpdateEmailModal(true)}
                    type='button'
                    className="mt-6 cursor-pointer text-blue-600 hover:text-blue-700 text-sm font-medium">
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
