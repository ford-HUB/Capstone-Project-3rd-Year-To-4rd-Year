import React from "react";
import BasicInformationSection from "../BasicInformationSection";
import ContactInformationSection from "../ContactInformationSection";
import OptionalInformationSection from "../OptionalInformationSection";
import CommunicationsSection from "../CommunicationsSection";
import CareerSection from "../CareerSection";

const ProfileForm = ({ authenticatedData ,onSubmit, watch, register, isSubmitting, changesWatcher, handleSubmit, errors }) => (
  <form onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-12">
    <BasicInformationSection register={register} errors={errors} />
    <ContactInformationSection data={authenticatedData}  register={register} errors={errors} />
    <CareerSection watch={watch} register={register} errors={errors} />
    <OptionalInformationSection register={register} errors={errors} watch={watch} />
    <CommunicationsSection register={register} errors={errors} />
    <div>
      <button
      disabled={changesWatcher ?  false : true}
      type="submit" className={`${changesWatcher ? 'bg-blue-800 text-white': 'bg-gray-300 text-gray-500 cursor-not-allowed'} px-6 py-2 rounded-md`}>
        Save
      </button>
    </div>
  </form>
);

export default ProfileForm;