import axios from "axios";

const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api`;

const websiteData = async () => {
  try {
    const response = await axios.get(`${URL}/website`);
    if (response.data.success) {
      return response.data;
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "No response from the server";
    return { success: false, message: errorMessage };
  }
};

const login = async (loginData) => {
  try {
    const response = await axios.post(`${URL}/user/login`, loginData, {
      withCredentials: true,
    });
    if (response.data.success) {
      return response.data;
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "No response from the server";
    return { success: false, message: errorMessage };
  }
};

const signUp = async (signUpData) => {
  try {
    const response = await axios.post(`${URL}/user/signup`, signUpData, {
      withCredentials: true,
    });
    if (response.data.success) {
      return response.data;
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "No response from the server";
    return { success: false, message: errorMessage };
  }
};

const signUpOTPVerification = async (otpVerificationData) => {
  try {
    const response = await axios.put(
      `${URL}/user/sign-up/verify`,
      otpVerificationData,
      {
        withCredentials: true,
      },
    );
    if (response.data.success) {
      return response.data;
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "No response from the server";
    return { success: false, message: errorMessage };
  }
};

const performTask = async (taskData, token) => {
  try {
    const response = await axios.post(`${URL}/task`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    if (response.data.success) {
      return response.data;
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "No response from the server";

    return { success: false, message: errorMessage };
  }
};

const getAllTasks = async (token) => {
  try {
    const response = await axios.get(`${URL}/task`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    if (response.data.success) {
      return response.data;
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "No response from the server";

    return { success: false, message: errorMessage };
  }
};

export { websiteData, login, signUp, signUpOTPVerification, performTask, getAllTasks };
