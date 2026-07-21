import React, { useEffect } from "react";
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboadPage from "../Pages/Admin/AdminDashboadPage";
import PartnerRequest from "../Pages/Admin/PartnerRequestsPage";
import PartnerSingleViewPage from "../Pages/Admin/PartnerSingleViewPage";
import UserManagement from "../Pages/Admin/UserManagement";
import PartnerVerifiedList from "../Pages/Admin/PartnerVerifiedList";
import AdminLoginPage from "../Pages/Admin/AdminLoginPage"
import AdminSideChats from "../Pages/Admin/AdminSideChats";
import AdminViewCoupons from "../Pages/Admin/AdminViewCoupons";
import axios from "axios";
import { adminApi } from "../config/api";
import { addAdmin } from "../utils/adminSlice";
import { useDispatch, useSelector } from "react-redux";

function Admin() {
  const dispatch = useDispatch()
  const checkIfAdmin = async (token) => {
    const response = await axios.post(`${adminApi}/checkIfAdmin`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.data.success) {
      dispatch(addAdmin({ token: response.data.data.token, username: response.data.data.username }));
    }
  }
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('adminToken'));
    token && checkIfAdmin(token)

  }, []);
  const admin = useSelector(store => store.admin.adminD)
  return (

    <Routes>
      <Route path="/" element={admin.token ? <AdminDashboadPage /> : <Navigate to='/admin/login' />} />
      <Route path="/login" element={admin.token ? <Navigate to='/admin' /> : <AdminLoginPage />} />
      <Route path="/partnerRequests" element={admin.token ? <PartnerRequest /> : <Navigate to='/admin/login' />} />
      <Route path="/partnerSingleView" element={admin.token ? <PartnerSingleViewPage /> : <Navigate to='/admin/login' />} />
      <Route path="/users" element={admin.token ? <UserManagement /> : <Navigate to='/admin/login' />} />
      <Route path="/partnerVerifiedList" element={admin.token ? <PartnerVerifiedList /> : <Navigate to='/admin/login' />} />
      <Route path="/chats" element={admin.token ? <AdminSideChats /> : <Navigate to='/admin/login' />} />
      <Route path="/coupons" element={admin.token ? <AdminViewCoupons /> : <Navigate to='/admin/login' />} />
    </Routes>
  )
}

export default Admin;