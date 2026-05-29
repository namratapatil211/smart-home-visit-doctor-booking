// import { createContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import axios from 'axios'

// export const AppContext = createContext()

// const AppContextProvider = (props) => {

//     const currencySymbol = '₹'
//     const backendUrl = import.meta.env.VITE_BACKEND_URL

//     const [doctors, setDoctors] = useState([])
//     const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
//     const [userData, setUserData] = useState(false)

//     // Getting Doctors using API
//     const getDoctosData = async () => {

//         try {

//             const { data } = await axios.get(backendUrl + '/api/doctor/list')
//             if (data.success) {
//                 setDoctors(data.doctors)
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }

//     }

//     // Getting User Profile using API
//     const loadUserProfileData = async () => {

//         try {

//             const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

//             if (data.success) {
//                 setUserData(data.userData)
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }

//     }

//     useEffect(() => {
//         getDoctosData()
//     }, [])

//     useEffect(() => {
//         if (token) {
//             loadUserProfileData()
//         }
//     }, [token])

//     const value = {
//         doctors, getDoctosData,
//         currencySymbol,
//         backendUrl,
//         token, setToken,
//         userData, setUserData, loadUserProfileData
//     }

//     return (
//         <AppContext.Provider value={value}>
//             {props.children}
//         </AppContext.Provider>
//     )

// }

// export default AppContextProvider

import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  const [userData, setUserData] = useState(false);

  // ----------------------
  // Format slot date: 1_12_2025 → "1 Dec 2025"
  // ----------------------
  const slotDateFormat = (slotDate) => {
    if (!slotDate) return "";

    const [day, month, year] = slotDate.split("_");

    const monthName = ["Jan"];

    return `${day} ${monthName} ${year}`;
  };

  // ----------------------
  // Fetch all doctors
  // ----------------------
  const getDoctosData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ----------------------
  // Fetch user profile
  // ----------------------
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/get-profile`,
        { headers: { token } }
      );

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Load doctors when page loads
  useEffect(() => {
    getDoctosData();
  }, []);

  // Load user profile when token changes
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    }
  }, [token]);

  // ----------------------
  // Provided Values
  // ----------------------
  const value = {
    doctors,
    getDoctosData,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
    slotDateFormat,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
