import React from "react";
import ProfileForm from "./forms/ProfileForm";
import FormField from "./fields/FormField";
import TextInput from "./fields/TextInput";
import Select from "./fields/Select";
import Section from "./Section";

const BasicInformationSection = ({ register, errors }) => {
  
    return (
      <Section title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FormField label="First Name" required error={errors?.firstname?.message}>
            <TextInput name={'firstname'} {...register('firstname')} />
          </FormField>
          <FormField label="Last Name" required error={errors?.lastname?.message}>
            <TextInput name={'lastname'} {...register('lastname')} />
          </FormField>
          <FormField label="Middle Initial" required error={errors?.middle_initial?.message}>
            <TextInput name={'middle_initial'} {...register('middle_initial')} />
          </FormField>
          <FormField label="Current Address" required error={errors?.current_address?.message}>
            <TextInput name={'current_address'} {...register('current_address')} />
          </FormField>
        </div>
      </Section>
    );
};

export default BasicInformationSection;