// import React from 'react'
// import { assets } from '../assets/assets'

// const Contact = () => {
//   return (
//     <div>

//       <div className='text-center text-2xl pt-10 text-[#707070]'>
//         <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
//       </div>

//       <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
//         <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
//         <div className='flex flex-col justify-center items-start gap-6'>
//           <p className=' font-semibold text-lg text-gray-600'>OUR OFFICE</p>
//           <p className=' text-gray-500'>#24, 1st Main Road, Indiranagar<br />Near CMH Hospital, Bengaluru – 560038</p>
//           <p className=' text-gray-500'>Tel: (0831) 555-0132 <br /> Email: gitstudent@gmail.com</p>
//           <p className=' font-semibold text-lg text-gray-600'>CAREERS AT BookMyDoctor</p>
//           <p className=' text-gray-500'>Learn more about our teams and job openings.</p>
//           <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
//         </div>
//       </div>

//     </div>
//   )
// }

// export default Contact


import React, { useState } from "react";
import axios from "axios";
import Symptom from "../assets/Symptom.mp4";

const SymptomChecker = () => {
  const [symptom, setSymptom] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!symptom.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await axios.post("http://localhost:9000/api/symptom-check", {
        symptom,
      });
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching data. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg w-full mx-auto mt-10 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <div className="bg-blue-50 px-6 py-4 flex flex-col items-center justify-center">
        <video
          src={Symptom}
          autoPlay
          loop
          muted
          className="w-40 h-40 object-cover rounded-xl shadow-md border border-blue-200"
        />
        <h2 className="mt-4 text-xl font-bold text-blue-800 tracking-wide">
          🩺 Symptom Checker
        </h2>
        <p className="text-gray-600 text-sm text-center mt-1">
          Get instant advice based on your health symptom.
        </p>
      </div>

      <div className="p-6">
        <input
          type="text"
          placeholder="Enter your symptom (e.g., headache, nausea)..."
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          disabled={loading}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
        />

        <button
          onClick={handleCheck}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg font-semibold text-white text-sm transition-colors duration-200 ${
            loading || !symptom.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Checking..." : "Check"}
        </button>

        {response && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-80 overflow-y-auto space-y-5 text-sm">
            <div>
              <h3 className="font-semibold text-green-700 mb-1">✅ Advice:</h3>
              <p className="text-gray-800">{response.patient_message}</p>
            </div>

            <div>
              <h3 className="font-semibold text-indigo-700 mb-1">🧘‍♀️ Relief Tips:</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {response.relief_tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-yellow-700 mb-1">🔍 Possible Causes:</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {response.possible_causes.map((cause, i) => (
                  <li key={i}>{cause}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-red-700 mb-1">🚨 Emergency Signs:</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {response.emergency_signs.map((sign, i) => (
                  <li key={i}>{sign}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t text-gray-600">
              <strong>Note:</strong> {response.important_note}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;
