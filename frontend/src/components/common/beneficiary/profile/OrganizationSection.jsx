import React from "react";
import FormField from "./fields/FormField";
import TextInput from "./fields/TextInput";
import Section from "./Section";

const OrganizationSection = ({ register, errors }) => {
    return (
        <Section title="Organization Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField 
                    label="Organization Name" 
                    error={errors?.organization_name?.message}
                    helpText="Leave blank if you're an individual beneficiary">
                    <TextInput 
                        name={'organization_name'} 
                        placeholder="Enter organization name (if applicable)"
                        {...register('organization_name')} 
                    />
                </FormField>
            </div>
        </Section>
    );
};

export default OrganizationSection;
