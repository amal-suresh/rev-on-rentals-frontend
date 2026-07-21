import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import UserHome from '../Pages/User/UserHome'
import JoinUs from '../Components/User/JoinUs/JoinUs'
import JoinUsSuccess from '../Components/User/JoinUs/JoinUsSuccess'
import UserTariff from '../Pages/User/UserTariff'
import UserRegisterPage from '../Pages/User/UserRegisterPage'
import UserLoginPage from '../Pages/User/UserLoginPage'
import RegisterOtpPage from '../Pages/User/RegisterOtpPage'
import UserViewBikesPage from '../Pages/User/UserViewBikesPage'
import UserProfilePage from '../Pages/User/UserProfilePage'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice'
import CheckOutPage from '../Pages/User/CheckOutPage'
import UserNewPasswordPage from '../Pages/User/UserNewPasswordPage'
import UserForgotPassOtpPage from '../Pages/User/UserForgotPassOtpPage'
import PaymentSuccessPage from '../Pages/User/PaymentSuccessPage'
import OrderRatingPage from '../Pages/User/OrderRatingPage'
import UserOffers from '../Pages/User/UserOffers'
import axios from 'axios'
import { userApi } from '../config/api'
import Page500 from '../Pages/User/Page500'
import Page404 from '../Pages/User/Page404'


function User() {
  const dispatch = useDispatch()
  const checkIfUser = async (token) => {
    const response = await axios.post(`${userApi}checkIfUser`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (response.data.success) {
      dispatch(addUser({ token: response.data.data.token, username: response.data.data.name, id: response.data.data.id }));
    }
  }

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    token && checkIfUser(token)


  }, []);
  const user = useSelector(store => store.user.userD)
  const userToken = user.token
  return (
    <Routes>
      <Route path='/' element={<UserHome />} />
      <Route path='/join-us' element={<JoinUs />} />
      <Route path='/join-us/success' element={<JoinUsSuccess />} />
      <Route path='/tariff' element={<UserTariff />} />
      <Route path='/login' element={userToken ? <Navigate to='/' /> : <UserLoginPage />} />
      <Route path='/register' element={userToken ? <UserHome /> : <UserRegisterPage />} />
      <Route path='/otp' element={userToken ? <UserHome /> : <RegisterOtpPage />} />
      <Route path='/viewBikes' element={<UserViewBikesPage />} />
      <Route path='/userProfile' element={userToken ? <UserProfilePage /> : <Navigate to='/login' />} />
      <Route path='/checkOut' element={userToken ? <CheckOutPage /> : <Navigate to='/login' />} />
      <Route path='/forgotPassword' element={<UserNewPasswordPage />} />
      <Route path='/verifyForgetPassword' element={<UserForgotPassOtpPage />} />
      <Route path='/paymentSuccess' element={userToken ? <PaymentSuccessPage /> : <Navigate to='/login' />} />
      <Route path='/orderRatingReview' element={userToken ? <OrderRatingPage /> : <Navigate to='/login' />} />
      <Route path='/offers' element={<UserOffers />} />
      <Route path='/error500' element={<Page500 />} />
      <Route path='/error404' element={<Page404 />} />
    </Routes>

  )
}

export default User