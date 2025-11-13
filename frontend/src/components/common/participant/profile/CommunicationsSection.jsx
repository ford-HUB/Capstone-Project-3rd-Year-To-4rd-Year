import React from "react";
import Checkbox from "./fields/Checkbox";

const CommunicationsSection = ({ register, errors }) => (
    <div className="mb-8">
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Stay Connected with UCLM Cares</h2>
        <div>
        <Checkbox
          id="is_subscribed"
          {...register('is_subscribed')}
        >
          <div>
            I would like to receive updates, announcements, and helpful resources from UCLM Cares, including
            information about new features, events, and support services. I understand I can unsubscribe at any time.
            <p className="text-xs text-gray-500 mt-2 italic">
              By not subscribing, you may miss out on important UCLM Cares news and opportunities, but you will
              still receive essential notifications regarding your account, system usage, and urgent updates.
            </p>
          </div>
        </Checkbox>
        {errors?.is_subscribed?.message && (
          <p className="text-xs text-red-600 mt-2">{errors.is_subscribed.message}</p>
        )}
        </div>
      </div>
    </div>
);

export default CommunicationsSection;