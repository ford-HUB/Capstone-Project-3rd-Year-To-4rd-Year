import React from 'react';
import { asset } from '../../assets/asset';

const Accomplishments = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto relative">
        <div className="relative bg-white shadow-lg rounded-xl p-10 flex flex-col items-center overflow-hidden space-y-10">

          <h2 className="text-2xl font-bold text-black text-center mt-8">
            PROGRAMS/ACTIVITIES OF UCLM-CARES OFFICE <br />   
            CONDUCTED  AT THE PARTNER COMMUNITIES
          </h2>

          <p className="text-lg text-black leading-relaxed text-justify text pl-20 pr-20">
            September 15, 2022, the CARES personnel and CARES Coordinators visited Brgy. <br />
            Opao to present the different CARES Programs offered by the University.
            <br /><br />
            The said activity was attended by the Brgy. Captain Hon. Allan Frias, Brgy. Secretary
            Maam Ma. Meraluna Gepega, SK Chairman Hon. Jayvee Amamento, Purok leaders,
            and representatives from different sectors and its constituents.
          </p>

          <img 
            src={asset.raaaa} 
            alt="CARES at Brgy. Opao"
            className="w-[70%] h-auto rounded-lg mx-auto"
          />

          

          <p className="text-lg text-black leading-relaxed text-justify pl-20 pr-20">
            UCLM CARES visited Barangay Looc Mandaue City last December 10, 2023, 
            and gathered the representatives from different sectors and purok leaders 
            to present the different programs and activities offered. The said community 
            visit was also attended by the newly elected Barangay Captain Hon. Raul Kevin 
            Flores Cabahug V and its Councilors.
          </p>

          <img 
            src={asset.ako} 
            alt="CARES Barangay Looc"
            className="w-[70%] h-auto rounded-lg mx-auto"
          />

          <img 
            src={asset.brg} 
            alt="Barangay activity"
            className="w-[70%] h-auto rounded-lg mx-auto"
          />

          <img 
            src={asset.brgtwo} 
            alt="Community program"
            className="w-[70%] h-auto rounded-lg mx-auto"
          />

          <img 
            src={asset.weee} 
            alt="Community members"
            className="w-[70%] h-auto rounded-lg mx-auto"
          />

          <img 
            src={asset.wooo} 
            alt="lakjdsalk"
            className="w-[70%] h-auto rounded-lg mx-auto"
          />

          <img 
            src={asset.quuu} 
            alt="lak"
            className="w-[70%] h-auto rounded-lg mx-auto"
          />

          <img 
            src={asset.jaaa} 
            alt="lakasd"
            className="w-[70%] h-auto rounded-lg mx-auto"
          />

          <img 
            src={asset.kaaa} 
            alt="lakasasdd"
            className="w-[70%] h-auto rounded-lg mx-auto"
          />

          <img 
            src={asset.tuuu} 
            alt="di tooo"
            className="w-[70%] h-auto rounded-lg mx-auto"
          />
      
          <img 
            src={asset.yve} 
            alt="ml paps"
            className="w-[70%] h-auto rounded-lg mx-auto"
          />

          <img 
            src={asset.lunox} 
            alt="ml nasad"
            className="w-[70%] h-auto rounded-lg mx-auto"
          />

        </div>
      </div>
    </div>
  );
};

export default Accomplishments;