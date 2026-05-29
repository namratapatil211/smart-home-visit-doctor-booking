// Improved UI version of MyProfile.jsx (structure unchanged)
// All logic, state, and functionality kept exactly the same.
// Only styling and interface layout refined.

import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyProfile = () => {

    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)

    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    const updateUserProfileData = async () => {
        try {
            const formData = new FormData();

            formData.append('name', userData.name);
            formData.append('phone', userData.phone);
            formData.append('address', JSON.stringify(userData.address));
            formData.append('gender', userData.gender);
            formData.append('dob', userData.dob);

            formData.append("weight", userData.weight);
            formData.append("bp", userData.bp);
            formData.append("sugar", userData.sugar);
            formData.append("notes", userData.notes);

            image && formData.append('image', image);

            const { data } = await axios.post(
                backendUrl + '/api/user/update-profile',
                formData,
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                await loadUserProfileData();
                setIsEdit(false);
                setImage(false);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    return userData ? (
        <div className='max-w-xl mx-auto rounded-2xl bg-white shadow-md p-6 mt-6 flex flex-col gap-4 text-sm'>

            {/* IMAGE */}
            <div className='flex flex-col items-center'>
                {isEdit ? (
                    <label htmlFor='image'>
                        <div className='relative cursor-pointer hover:opacity-80 transition'>
                            <img className='w-36 h-36 object-cover rounded-full border shadow-sm opacity-80' src={image ? URL.createObjectURL(image) : userData.image} alt='' />
                            {!image && <img className='w-8 absolute bottom-2 right-2' src={assets.upload_icon} alt='' />}
                        </div>
                        <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden />
                    </label>
                ) : (
                    <img className='w-36 h-36 object-cover rounded-full border shadow-md' src={userData.image} alt='' />
                )}
            </div>

            {/* NAME */}
            <div className='text-center'>
                {isEdit ? (
                    <input className='bg-gray-50 text-2xl text-center font-semibold w-full p-2 rounded-lg border' type='text' onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
                ) : (
                    <p className='font-semibold text-2xl text-[#262626]'>{userData.name}</p>
                )}
            </div>

            <hr className='border-gray-300' />

            {/* CONTACT INFORMATION */}
            <div>
                <p className='font-semibold text-gray-700 mb-2'>Contact Information</p>
                <div className='grid grid-cols-[1fr_2fr] gap-y-3 text-[#363636] bg-gray-50 p-4 rounded-xl shadow-inner'>
                    <p className='font-medium'>Email:</p>
                    <p className='text-blue-600'>{userData.email}</p>

                    <p className='font-medium'>Phone:</p>
                    {isEdit ? (
                        <input className='bg-white p-1 rounded border' type='text' onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} />
                    ) : (
                        <p className='text-blue-600'>{userData.phone}</p>
                    )}

                    <p className='font-medium'>Address:</p>
                    {isEdit ? (
                        <div>
                            <input className='bg-white p-1 rounded border w-full mb-1' type='text' onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address.line1} />
                            <input className='bg-white p-1 rounded border w-full' type='text' onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address.line2} />
                        </div>
                    ) : (
                        <p className='text-gray-600'>{userData.address.line1}<br />{userData.address.line2}</p>
                    )}
                </div>
            </div>

            {/* BASIC INFORMATION */}
            <div>
                <p className='font-semibold text-gray-700 mb-2'>Basic Information</p>
                <div className='grid grid-cols-[1fr_2fr] gap-y-3 text-gray-700 bg-gray-50 p-4 rounded-xl shadow-inner'>
                    <p className='font-medium'>Gender:</p>
                    {isEdit ? (
                        <select className='bg-white p-1 rounded border' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender}>
                            <option value='Not Selected'>Not Selected</option>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                        </select>
                    ) : (
                        <p>{userData.gender}</p>
                    )}

                    <p className='font-medium'>Birthday:</p>
                    {isEdit ? (
                        <input className='bg-white p-1 rounded border' type='date' onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
                    ) : (
                        <p>{userData.dob}</p>
                    )}
                </div>
            </div>

            {/* HEALTH INFORMATION */}
            <div>
                <p className='font-semibold text-gray-700 mb-2'>Health Information</p>
                <div className='grid grid-cols-[1fr_2fr] gap-y-3 text-gray-700 bg-gray-50 p-4 rounded-xl shadow-inner'>

                    <p className='font-medium'>Weight (kg):</p>
                    {isEdit ? (
                        <input className='bg-white p-1 rounded border' type='number' onChange={(e) => setUserData(prev => ({ ...prev, weight: e.target.value }))} value={userData.weight} />
                    ) : (
                        <p>{userData.weight} kg</p>
                    )}

                    <p className='font-medium'>Blood Pressure:</p>
                    {isEdit ? (
                        <select className='bg-white p-1 rounded border' onChange={(e) => setUserData(prev => ({ ...prev, bp: e.target.value }))} value={userData.bp || 'Not Selected'}>
                            <option value='Not Selected'>Not Selected</option>
                            <option value='Yes'>Yes</option>
                            <option value='No'>No</option>
                        </select>
                    ) : (
                        <p>{userData.bp}</p>
                    )}

                    <p className='font-medium'>Sugar Level:</p>
                    {isEdit ? (
                        <select className='bg-white p-1 rounded border' onChange={(e) => setUserData(prev => ({ ...prev, sugar: e.target.value }))} value={userData.sugar || 'Not Selected'}>
                            <option value='Not Selected'>Not Selected</option>
                            <option value='Yes'>Yes</option>
                            <option value='No'>No</option>
                        </select>
                    ) : (
                        <p>{userData.sugar}</p>
                    )}

                    <p className='font-medium'>Notes:</p>
                    {isEdit ? (
                        <textarea className='bg-white p-2 rounded border h-20' onChange={(e) => setUserData(prev => ({ ...prev, notes: e.target.value }))} value={userData.notes}></textarea>
                    ) : (
                        <p className='whitespace-pre-line'>{userData.notes}</p>
                    )}
                </div>
            </div>

            {/* BUTTON */}
            <div className='text-center mt-4'>
                {isEdit ? (
                    <button onClick={updateUserProfileData} className='bg-primary text-white px-8 py-2 rounded-full shadow hover:opacity-90 transition'>Save Information</button>
                ) : (
                    <button onClick={() => setIsEdit(true)} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition'>Edit</button>
                )}
            </div>
        </div>
    ) : null
}

export default MyProfile;
