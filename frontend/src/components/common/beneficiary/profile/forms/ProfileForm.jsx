import React from "react";
import BasicInformationSection from "../BasicInformationSection";
import ContactInformationSection from "../ContactInformationSection";
import OrganizationInformationSection from "../OrganizationInformationSection";

const ProfileForm = ({ authenticatedData, onSubmit, watch, register, isSubmitting, changesWatcher, handleSubmit, errors }) => (
  <form onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-12">
    <BasicInformationSection register={register} errors={errors} />
    <ContactInformationSection data={authenticatedData} register={register} errors={errors} />
    <OrganizationInformationSection register={register} errors={errors} />
    <div>
      <button
      disabled={!changesWatcher || isSubmitting}
      type="submit" className={`${changesWatcher && !isSubmitting ? 'bg-green-800 text-white hover:bg-green-900': 'bg-gray-300 text-gray-500 cursor-not-allowed'} px-6 py-2 rounded-md transition-colors duration-200 flex items-center gap-2`}>
        {isSubmitting ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Saving...
          </>
        ) : (
          'Save'
        )}
      </button>
    </div>
  </form>
);

export default ProfileForm;