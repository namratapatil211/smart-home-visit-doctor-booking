import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { DoctorContext } from "../../context/DoctorContext";

const DoctorHealthInfo = () => {
  const { backendUrl } = useContext(AppContext);
  const { dToken } = useContext(DoctorContext);
  const { appointmentId } = useParams();

  const [healthData, setHealthData] = useState(null);

  const getHealthInfo = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/health-info/${appointmentId}`,
        { headers: { token: dToken } }
      );

      console.log("API response:", data);
      console.log("Health Info Object:", data.healthInfo);

      setHealthData(data.healthInfo);
    } catch (err) {
      console.log("Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    getHealthInfo();
  }, []);

  return healthData ? (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 border border-gray-200">

        <h2 className="text-3xl font-semibold mb-8 text-gray-700 text-center">
          Patient Health Information
        </h2>

        <div className="space-y-6 text-gray-800">

          <div className="flex justify-between border-b pb-3 text-lg">
            <strong>Weight:</strong>
            <span>{healthData.weight}</span>
          </div>

          <div className="flex justify-between border-b pb-3 text-lg">
            <strong>Blood Pressure:</strong>
            <span>{healthData.bp}</span>
          </div>

          <div className="flex justify-between border-b pb-3 text-lg">
            <strong>Sugar Level:</strong>
            <span>{healthData.sugar}</span>
          </div>

          <div className="border-b pb-3 text-lg">
            <strong>Notes:</strong>
            <p className="mt-2 text-gray-600 whitespace-pre-wrap">
              {healthData.notes || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-center p-6 text-gray-600">Loading...</p>
  );
};

export default DoctorHealthInfo;
