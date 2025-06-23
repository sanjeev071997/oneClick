import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProSidebarProvider } from "react-pro-sidebar";
import { useSelector } from "react-redux";
import { reloadUser } from "./redux/actions/userAction";
import store from "./redux/store";
import ConnectionStatus from "./Components/ConnectionStatus.js";

// Pages
import Home from "./pages/Home";
import About from "./pages/About.js";
import Contact from "./pages/Contact.js";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword.js";
import ResetPassword from "./pages/Auth/ResetPassword.js";
import Plans from './pages/Plans.js'
import ListYourBusiness from "./pages/ListYourBusiness.js";
import CategoryBusinesseView from "./pages/CategoryBusinesseView.js";
import CategoryDetail from "./pages/CategoryDetail.js";




// Admin Components
import Layout from "./admin/global/Layout";
import AdminDashboard from "./admin/Dashboard";
import AdminHomeBanner from "./admin/HomeBanner";
import AdminHomeHighlights from "./admin/HomeHighlights";
import AdminProfile from "./admin/Profile";
import AdminCategories from "./admin/Categories/Categories.js";
import AdminBusiness from "./admin/Business/Business.js";
import AdminReviews from "./admin/Reviews/Reviews.js";
import AdminUsers from "./admin/Users/User.js"
import AdminContact from './admin/Contact/AdminContact.js'
import AdminPlans from './admin/Plans/Plans.js'
import NotFound from "./pages/Error";


// User Dahboard
import LayoutUser  from "./BusinessDashboard/global/LayoutUser.js";
import UserDashboard from './BusinessDashboard/pages/Businessdashboard.js'
import UserBusiness from './BusinessDashboard/pages/BusinessUser.js'
import UserProduct from './BusinessDashboard/pages/Product.js'
import UserReviews from  './BusinessDashboard/pages/UserReviews.js'
import UserProfile from './BusinessDashboard/pages/Profile.js'
import UserEnquries from './BusinessDashboard/pages/UserEnquries.js';
import UserPLans from './BusinessDashboard/pages/UserPlan.js'
import UserCateogry from './BusinessDashboard/pages/BusinessCategory.js'



function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      store.dispatch(reloadUser());
    }
  }, []);

  // Layouts for Admin Pages
  const AdminHomeBannerHDC = Layout(AdminHomeBanner);
  const AdminDashboardHDC = Layout(AdminDashboard);
  const AdminHomeHighlightsHDC = Layout(AdminHomeHighlights);
  const AdminProfileHDC = Layout(AdminProfile);
  const AdminCategoriesHDC = Layout(AdminCategories);
  const AdminBusinessHDC = Layout(AdminBusiness);
  const AdminReviewsHDC = Layout(AdminReviews);
  const AdminUsersHDC = Layout(AdminUsers)
  const AdminContactHDC = Layout(AdminContact )
  const AdminPlansHDC = Layout(AdminPlans )


  //Layout User
  const UserDashboardHDC = LayoutUser(UserDashboard);
  const  BusinessUsersHDC =  LayoutUser(UserBusiness);
  const  UserProdcutHDC =  LayoutUser(UserProduct)
  const UserReviewsHDC =  LayoutUser(UserReviews);
  const UserPlansHDC = LayoutUser(UserPLans )
  const UserProfileHDC = LayoutUser(UserProfile)
  const UserEnquriesHDC = LayoutUser(UserEnquries)
  const UserCategoryHDC = LayoutUser(UserCateogry)

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
                      <UserDashboardHDC />
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
          
            <Route path="/plans" element={<Plans/>} />
           
            <Route path="/category/:name" element={<CategoryDetail />} />
            <Route path="/add/business" element={<ListYourBusiness />} />
            <Route
              path="/category/:name/:id"
              element={<CategoryBusinesseView />}
            />
           
           {/* Busniess Dahboard Routes  */}
             <Route path="/business/dashboard" element={<UserDashboardHDC />} />
            <Route path="/user/business" element={<BusinessUsersHDC />} />
            <Route path="/user/product" element={<UserProdcutHDC />} />
            <Route path="/user/reviews" element={< UserReviewsHDC  />} />
            <Route path="/user/plans" element={<UserPlansHDC />} />
            <Route path="/user/profile" element={<UserProfileHDC />} />
            <Route path="/user/enquries" element={<UserEnquriesHDC />} />
            <Route path="/user/category" element={<UserCategoryHDC />} />


            {/* Admin Routes */}
            {user?.role >= 1 ? (
              <>
               <Route path="/admin/home/banner" element={<AdminHomeBannerHDC />} />
                <Route
                  path="/admin/home/highlights"
                  element={<AdminHomeHighlightsHDC />}
                />
                <Route path="/admin/profile" element={<AdminProfileHDC />} />
                <Route
                  path="/admin/categories"
                  element={<AdminCategoriesHDC />}
                />
                <Route path="/admin/business" element={<AdminBusinessHDC />} />
                <Route path="/admin/reviews" element={<AdminReviewsHDC />} />
                <Route path="/admin/users" element={<AdminUsersHDC />} />
                <Route path="/admin/contact" element={<AdminContactHDC/>} />
                <Route path="/admin/plans" element={<AdminPlansHDC/>} />
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


