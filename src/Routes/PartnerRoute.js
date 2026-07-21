import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import PartnerDashboardPage from '../Pages/Partner/PartnerDashboardPage'
import PartnerLoginPage from '../Pages/Partner/PartnerLoginPage'
import PartnerAddBikesPage from '../Pages/Partner/PartnerAddBikesPage'
import PartnerViewBikesPage from '../Pages/Partner/PartnerViewBikesPage'
import PartnerNewPassPage from '../Pages/Partner/PartnerNewPassPage'
import PartnerForgetOtpPage from '../Pages/Partner/PartnerForgetOtpPage'
import PartnerProfilePage from '../Pages/Partner/PartnerProfilePage'
import { useDispatch, useSelector } from 'react-redux'
import { addPartner } from '../utils/partnerSlice'
import PartnerBookingsPage from '../Pages/Partner/PartnerBookingsPage'
import axios from 'axios'
import { partnerApi } from '../config/api'



function Partner() {
  const dispatch = useDispatch()

  const checkIfPartner = async (token) => {
    const response = await axios.post(`${partnerApi}/checkIfPartner`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.data.success) {
      dispatch(addPartner({ token: response.data.data.token, username: response.data.data.username }));
    }
  }

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    token && checkIfPartner(token)

  }, []);

  const partner = useSelector(store => store.partner.partnerD)

  return (
    <Routes>
      <Route path='/' element={partner.token ? <PartnerDashboardPage /> : <PartnerLoginPage />} />
      <Route path='/login' element={partner.token ? <PartnerDashboardPage /> : <PartnerLoginPage />} />
      <Route path='/bikes' element={partner.token ? <PartnerViewBikesPage /> : <PartnerLoginPage />} />
      <Route path='/addBikes' element={partner.token ? <PartnerAddBikesPage /> : <PartnerLoginPage />} />
      <Route path='/forgotpass' element={<PartnerNewPassPage />} />
      <Route path='/verifyForgotOtp' element={<PartnerForgetOtpPage />} />
      <Route path='/profile' element={partner.token ? <PartnerProfilePage /> : <PartnerLoginPage />} />
      <Route path='/bookings' element={partner.token ? <PartnerBookingsPage /> : <PartnerLoginPage />} />


    </Routes>
  )
}

export default Partner