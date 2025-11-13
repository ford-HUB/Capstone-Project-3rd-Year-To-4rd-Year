import React from 'react';
import { asset } from '../../assets/asset';

export default function UCLMCaresUI() {
  return (
    <div className="bg-gray-100 min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto relative">
        <div className="space-y-16 relative z-10">
          <div className="relative bg-white shadow-lg rounded-xl p-10 min-h-96 flex flex-col overflow-hidden">
            <h2 className="text-2xl font-bold text-black mb-8 text-center">
              UCLM CARES Departmental Programs
            </h2>

            <div className="flex-1 flex flex-col items-center">
              <div className="w-full">
                <table className="w-full table-fixed border-collapse border border-gray-300 text-center">
                  <thead>
                    <tr className="bg-blue-900 text-white">
                      <th className="w-2/5 border border-black px-4 py-3 font-bold text-lg text-center align-middle">
                        Department
                      </th>
                      <th className="w-3/5 border border-black px-4 py-3 font-bold text-lg text-center align-middle">
                        Specific Activities/Components
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black px-4 py-4 align-middle text-center">
                        <p className="font-semibold text-black">Basic Education Department</p>
                        <p className="font-semibold text-black">(Grade School)</p>
                      </td>
                      <td className="border border-black px-6 py-4 align-middle text-center">
                        <ul className="space-y-2 text-black">
                          <li className="font-semibold text-lg">GATE Program</li>
                          <li>(Greening and Academic Tutorial Enrichment)</li>
                          <li>Seedling Giveaways</li>
                          <li>School Gardening</li>
                          <li>Academic Tutorial for Literacy (Grade School)</li>
                        </ul>
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-black px-4 py-4 align-middle text-center">
                        <p className="font-semibold text-black">Basic Education Department</p>
                        <p className="font-semibold text-black">(Junior High School)</p>
                      </td>
                      <td className="border border-black px-6 py-4 align-middle text-center">
                        <ul className="space-y-2 text-black">
                          <li className="font-semibold text-lg">GATE Program</li>
                          <li>(Greening and Academic Tutorial Enrichment)</li>
                          <li>Seedling Giveaways</li>
                          <li>School Gardening</li>
                          <li>Academic Tutorial for Literacy (Junior High School)</li>
                        </ul>
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-black px-4 py-4 align-middle text-center">
                        <p className="font-semibold text-black">
                          Senior High School Department
                        </p>
                      </td>
                      <td className="border border-black px-6 py-4 align-middle text-center">
                        <ul className="space-y-2 text-black">
                          <li className="font-semibold text-lg">Youth SMILE Program</li>
                          <li>(Supporting Mental-health and Improving Literacy</li>
                          <li>for Empowerment)</li>
                          <li>Study Ta as A 'Friend: Academic Tutorial</li>
                          <li>Youth Empowerment Webinars</li>
                          <li>Be Job Ready Workshop</li>
                          <li>BJMP SHS Academic Program</li>
                        </ul>
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-black px-4 py-4 align-middle text-center">
                        <p className="font-semibold text-black">College of Teacher Education</p>
                        <p className="font-semibold text-black">(BSED) and (BEED)</p>
                      </td>
                      <td className="border border-black px-6 py-4 align-middle text-center">
                        <ul className="space-y-2 text-black">
                        <li className="font-semibold text-lg">CTE CARES: Adopt a Learner Program</li>
                          <li>Reading Tutorial for Grade School Learners</li>
                          <li>(Lood READS)</li>
                          <li>ALS Assistance (Learning Centers for Lapu-Lapu</li>
                          <li> and Mandaue Division and BJMP)</li>
                        </ul>
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-black px-4 py-4 align-middle text-center">
                        <p className="font-semibold text-black">College of Business and Accountancy</p>
                      </td>
                      <td className="border border-black px-6 py-4 align-middle text-center">
                        <ul className="space-y-2 text-black">
                          <li className="font-semibold text-lg">Build Program</li>
                          <li>(Business Upliftment through Innovation, Literacy</li>
                          <li>and Development)</li>
                          <li>Basic Business Seminar</li>
                          <li>Bookkeeping </li>
                          <li>Product Costing</li>
                        </ul>
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-black px-4 py-4 align-middle text-center">
                        <p className="font-semibold text-black">College of Custom Adminstration</p>
                      </td>
                      <td className="border border-black px-6 py-4 align-middle text-center">
                        <ul className="space-y-2 text-black">
                          <li className="font-semibold text-lg">GLOBE PROGRAM</li>
                          <li>(Guiding Local Opportunities into Business Expansion)</li>
                          <li>Seminar</li>
                          <li>Awarness</li>
                        </ul>
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-black px-4 py-4 align-middle text-center">
                        <p className="font-semibold text-black">College of Computer Studies</p>
                      </td>
                      <td className="border border-black px-6 py-4 align-middle text-center">
                        <ul className="space-y-2 text-black">
                          <li className="font-semibold text-lg">CLiP</li>
                          <li>(Computer Literacy Program)</li>
                          <li>Basic Computer Network Cabling</li>
                          <li>Computer Literacy Training in MS Office</li>
                          <li>Application</li>
                          <li>Computer Literacy Training in Google</li>
                          <li>Productivity Tools</li>
                          <li>Computer and Internet Basics Literacy Traning</li>
                          <li>CLiP Immersion</li>
                          <li>Graphic Desing</li>
                        </ul>
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-black px-4 py-4 align-middle text-center">
                        <p className="font-semibold text-black">College of Criminology</p>
                      </td>
                      <td className="border border-black px-6 py-4 align-middle text-center">
                        <ul className="space-y-2 text-black">
                          <li className="font-semibold text-lg">SELF CARE Program</li>
                          <li>(Social Empowerment and Lawful Fullfillment through Community</li>
                          <li>Awareness, Resilience and Engagement)</li>
                          <li>Seminar</li>
                          <li>Awareness</li>
                          <li>Training for Barangay Police Security Officer</li>
                        </ul>
                      </td>
                    </tr>
                    
                    <tr>
                      <td className="border border-black px-4 py-4 align-middle text-center">
                        <p className="font-semibold text-black">College of Engineering</p>
                      </td>
                      <td className="border border-black px-6 py-4 align-middle text-center">
                        <ul className="space-y-2 text-black">
                          <li className="font-semibold text-lg">LIGHT Program</li>
                          <li>(Learning Innovation through Guided Hands-on Training)</li>
                          <li>Computer Innovation and Repair Program</li>
                          <li>Welding Training</li>
                          <li>Electrical Installation Program</li>
                          <li>Safety Training and Seminars</li>
                          <li>Comsumer Electornics</li>
                        </ul>
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-black px-4 py-4 align-middle text-center">
                        <p className="font-semibold text-black">College of Hospitality &</p>
                        <p className="font-semibold text-black">Tourism Management</p>
                      </td>
                      <td className="border border-black px-6 py-4 align-middle text-center">
                        <ul className="space-y-2 text-black">
                          <li className="font-semibold text-lg">SALT Program</li>
                          <li>(Skills and Livelihood Training Program)</li>
                          <li>Housekeeping leading to NC II by Tesda</li>
                          <li>Public Area Clearing</li>
                          <li>Food Processing and Preservation (Meat, </li>
                          <li>Seafood & Fruits/Vegetables Processing)</li>
                          <li>Food and Beverage Services</li>
                          <li>Catering Services</li>
                          <li>Cookery NC II</li>
                        </ul>
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-black px-4 py-4 align-middle text-center">
                        <p className="font-semibold text-black">College of Nursing</p>
                      </td>
                      <td className="border border-black px-6 py-4 align-middle text-center">
                        <ul className="space-y-2 text-black">
                          <li className="font-semibold text-lg">HELP Program</li>
                          <li>(Health Education and Literacy Program)</li>
                          <li>Diabetes Society</li>
                          <li>Hypertenion Society</li>
                          <li>Disaster Nursing</li>
                          <li>Healthy Lung Club</li>
                          <li>Mental Health Club</li>
                          <li>Traditional Hilot</li>
                        </ul>
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-black px-4 py-4 align-middle text-center">
                        <p className="font-semibold text-black">College of Marine Engineering</p>
                      </td>
                      <td className="border border-black px-6 py-4 align-middle text-center">
                        <ul className="space-y-2 text-black">
                          <li className="font-semibold text-lg">SAILOR Program</li>
                          <li>(Seafarers Alternate Information, Learning and Providing</li>
                          <li>Opportunities through sharing of Resources)</li>
                          <li>Basic Seamaship</li>
                          <li>Basic Safety & Firefighting Literacy</li>
                          <li>Navigation & Collision Regulatory Literacy</li>
                          <li>Coastal Clean Up Drive</li>
                        </ul>
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-black px-4 py-4 align-middle text-center">
                        <p className="font-semibold text-black">College of Maritime Transportation</p>
                      </td>
                      <td className="border border-black px-6 py-4 align-middle text-center">
                        <ul className="space-y-2 text-black">
                        <li className="font-semibold text-lg">SAILOR Program</li>
                          <li>(Seafarers Alternate Information, Learning and Providing</li>
                          <li>Opportunities through sharing of Resources)</li>
                          <li>Basic Seamaship</li>
                          <li>Basic Safety & Firefighting Literacy</li>
                          <li>Navigation & Collision Regulatory Literacy</li>
                          <li>Coastal Clean Up Drive</li>
                        </ul>
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-black px-4 py-4 align-middle text-center">
                        <p className="font-semibold text-black">Non-teaching Staff</p>
                      </td>
                      <td className="border border-black px-6 py-4 align-middle text-center">
                        <ul className="space-y-2 text-black">
                          <li className="font-semibold text-lg">Environment Stewardship Program</li>
                          <li>Tree in a Pot</li>
                          <li>Butuanon River Watershed Water Quality</li>
                          <li>Management Area</li>
                        </ul>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}