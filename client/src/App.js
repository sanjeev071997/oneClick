import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProSidebarProvider } from "react-pro-sidebar";
import { reloadUser } from "./redux/actions/userAction";
import store from "./redux/store";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ListYourBusiness from "./pages/ListYourBusiness.js";
import CategoryBusinesseView from "./pages/CategoryBusinesseView.js";
import Layout from "./admin/global/Layout";
import AdminDashboard from "./admin/Dashboard";
import AdminProfile from "./admin/Profile";
import AdminCategories from "./admin/Categories/Categories.js";
import AdminBusiness from "./admin/Business/Business.js";
import AdminReviews from "./admin/Reviews/Reviews.js";
import AdminUsers from "./admin/Users/User.js"
import NotFound from "./pages/Error";
import ConnectionStatus from "./Components/ConnectionStatus.js";
import { useSelector } from "react-redux";
import ForgotPassword from "./pages/ForgotPassword.js";
import ResetPassword from "./pages/ResetPassword.js";
import CategoryDetail from "./pages/CategoryDetail.js";
import About from "./pages/About.js";
import Contact from "./pages/Contact.js";
import Dashboard from './pages/Dashboard.js'
import Updatebusiness from "./pages/Updatebusiness.js";
import Addedbusiness from "./pages/Addedbusiness.js";
import Reviews from "./pages/Reviews.js";
import Quries from "./pages/Quries.js";
import Settings from './pages/Settings.js'


function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      store.dispatch(reloadUser());
    }
  }, []);
  const AdminDashboardHDC = Layout(AdminDashboard);
  const AdminProfileHDC = Layout(AdminProfile);
  const AdminCategoriesHDC = Layout(AdminCategories);
  const AdminBusinessHDC = Layout(AdminBusiness);
  const AdminReviewsHDC = Layout(AdminReviews);
  const AdminUsersHDC = Layout(AdminUsers)

  return (
    <>
      <ConnectionStatus />
      <ProSidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  user ? (
                    user.role === 0 ? (
                      <Home />
                    ) : user.role >= 1 ? (
                      <AdminDashboardHDC />
                    ) : (
                      <Home />
                    )
                  ) : (
                    <Login />
                  )
                ) : (
                  <Login />
                )
              }
            />

            {/* Common Routes  */}
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset/:token" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/Updated/business" element={<Updatebusiness/>} />
            <Route path="/Added/business" element={<Addedbusiness/>} />
            <Route path="/reviews" element={<Reviews/>} />
            <Route path="/quries" element={<Quries/>} />
            <Route path="/settings" element={<Settings/>} />
          
            <Route path="/category/:name" element={<CategoryDetail />} />
            <Route path="/add/business" element={<ListYourBusiness />} />
            <Route
              path="/category/:name/:id"
              element={<CategoryBusinesseView />}
            />

            {/* Admin Routes */}
            {user?.role >= 1 ? (
              <>
                <Route path="/admin/profile" element={<AdminProfileHDC />} />
                <Route
                  path="/admin/categories"
                  element={<AdminCategoriesHDC />}
                />
                <Route path="/admin/business" element={<AdminBusinessHDC />} />
                <Route path="/admin/reviews" element={<AdminReviewsHDC />} />
                <Route path="/admin/users" element={<AdminUsersHDC />} />
              </>
            ) : null}
            {/* Page not found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ProSidebarProvider>
    </>
  );
}

export default App;


