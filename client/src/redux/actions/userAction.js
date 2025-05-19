import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  RELOAD_USER_REQUEST,
  RELOAD_USER_SUCCESS,
  RELOAD_USER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  CLEAR_ERRORS,
} from "../constants/userConstants";
import axios from "../../axiosInstance";

// Register 
export const userRegister = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });
    const { data } = await axios.post(`/api/v1/auth/register`, userData);
    // Save the user data in localStorage as a string
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: error?.response?.data?.message,
    });
  }
};

// login
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    const { data } = await axios.post(`/api/v1/auth/login`, {
      email,
      password,
    });
    localStorage.setItem("token", data.token);
    dispatch({ type: LOGIN_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: LOGIN_FAIL, payload: error?.response?.data?.message });
  }
};

// User reload action (profile)
export const reloadUser = () => async (dispatch) => {
  try {
    dispatch({ type: RELOAD_USER_REQUEST });
    const { data } = await axios.get(`/api/v1/auth/profile`);
    dispatch({ type: RELOAD_USER_SUCCESS, payload: data.user });
    return { type: RELOAD_USER_SUCCESS, payload: data.user }; 
  } catch (error) {
    dispatch({
      type: RELOAD_USER_FAIL,
      payload: error?.response?.data?.message,
    });
    return { type: RELOAD_USER_FAIL, payload: error?.response?.data?.message };
  }
};

// Logout User
export const logout = () => async (dispatch) => {
  try {
    await axios.get("/api/v1/auth/logout");
    localStorage.removeItem("token");
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    dispatch({ type: LOGOUT_FAIL, payload: error?.response?.data?.message });
  }
};

// Profile Update
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });
    const { data } = await axios.put(`/api/v1/auth/profile/update`, userData);
    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error?.response?.data?.message,
    });
  }
};

// Profile Update Password (change password)
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PASSWORD_REQUEST });
    const { data } = await axios.put(
      `/api/v1/auth/profile/password/update`,
      passwords
    );
    dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_PASSWORD_FAIL,
      payload: error?.response?.data?.message,
    });
  }
};

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });
    const { data } = await axios.post("/api/v1/auth/password/forgot", email);
    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data?.message });
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error?.response?.data?.message,
    });
  }
};

// Reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });
    const { data } = await axios.put(
      `/api/v1/auth/password/reset/${token}`,
      passwords
    );

    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: error?.response?.data?.message,
    });
  }
}; 

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
