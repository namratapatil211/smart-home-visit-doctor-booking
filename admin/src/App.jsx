// import React, { useContext } from 'react'
// import { DoctorContext } from './context/DoctorContext';
// import { AdminContext } from './context/AdminContext';
// import { Route, Routes } from 'react-router-dom'
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import Navbar from './components/Navbar'
// import Sidebar from './components/Sidebar'

// // Admin pages
// import Dashboard from './pages/Admin/Dashboard';
// import AllAppointments from './pages/Admin/AllAppointments';
// import AddDoctor from './pages/Admin/AddDoctor';
// import DoctorsList from './pages/Admin/DoctorsList';

// // Doctor pages
// import DoctorAppointments from './pages/Doctor/DoctorAppointments';
// import DoctorDashboard from './pages/Doctor/DoctorDashboard';
// import DoctorProfile from './pages/Doctor/DoctorProfile';
// import DoctorHealthInfo from './pages/Doctor/DoctorHealthInfo';

// // Login page
// import Login from './pages/Login';

// const App = () => {

//   const { dToken } = useContext(DoctorContext)
//   const { aToken } = useContext(AdminContext)

//   return dToken || aToken ? (
//     <div className='bg-[#F8F9FD]'>
//       <ToastContainer />
//       <Navbar />

//       <div className='flex items-start'>
//         <Sidebar />

//         <Routes>
//           <Route path='/' element={<></>} />

//           {/* Admin Routes */}
//           <Route path='/admin-dashboard' element={<Dashboard />} />
//           <Route path='/all-appointments' element={<AllAppointments />} />
//           <Route path='/add-doctor' element={<AddDoctor />} />
//           <Route path='/doctor-list' element={<DoctorsList />} />

//           {/* Doctor Routes */}
//           <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
//           <Route path='/doctor-appointments' element={<DoctorAppointments />} />
//           <Route path='/doctor-profile' element={<DoctorProfile />} />
//           <Route path='/doctor/health-info/:appointmentId' element={<DoctorHealthInfo />} />
//         </Routes>
//       </div>
//     </div>
//   ) : (
//     <>
//       <ToastContainer />
//       <Login />
//     </>
//   )
// }

// export default App


import React, { useContext } from 'react'
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

// Admin Pages
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';

// Doctor Pages
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';

// ⭐ NEW PAGE: Prescription Generator
import PrescriptionGenerator from './pages/Doctor/PrescriptionGenerator';

const App = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  return dToken || aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />

      <div className='flex items-start'>
        <Sidebar />

        <Routes>
          <Route path='/' element={<></>} />

          {/* Admin Routes */}
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />

          {/* Doctor Routes */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />

          {/* ⭐ NEW DOCTOR ROUTE */}
          <Route path='/prescription-generator' element={<PrescriptionGenerator />} />


        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App