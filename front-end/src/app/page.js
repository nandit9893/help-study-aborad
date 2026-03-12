"use client";
import { setCurrentForm, signInFailure, signInStart, signInSuccess, signUpFailure, signUpStart, signUpSuccess, verifyOTPFailure, verifyOTPStart, verifyOTPSuccess } from "@/Redux/User/UserSlice";
import { login, signUp, signUpOTPVerification, websiteData } from "@/Utils/API";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Info, Loader, LockKeyholeOpen, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isSignUpPasswordHovered, setIsSignUpPasswordHovered] = useState({
    password: false,
    reEnterPassword: false,
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    reEnterPassword: "",
  });

  const [updatePasswordData, setUpdatePasswordData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [websiteResponse, setWebsiteResponse] = useState(null);

  useEffect(() => {
    const websiteDataResponse = async () => {
      const response = await websiteData();
      if (response.success) {
        setWebsiteResponse(response.data);
      } else {
        setWebsiteResponse(null);
      }
    };
    websiteDataResponse();
  }, []);

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const signUpInputChangeHandler = (event) => {
    const { name, value } = event.target;
    setSignUpData((prevData) => ({ ...prevData, [name]: value }));
  };

  const forgotPasswordInputChangeHandler = (event) => {
    setForgotEmail(event.target.value);
  };

  const updatePasswordInputChangeHandler = (event) => {
    const { name, value } = event.target;
    setUpdatePasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const setCurrentFormSpecific = (type) => {
    dispatch(setCurrentForm(type));
  };

  const loginForm = async (event) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(loginData.email)) {
      const message = "Invalid Email Format";
      dispatch(signInFailure(message));
      return;
    }
    dispatch(signInStart());
    const result = await login(loginData);
    if (result.success) {
      dispatch(signInSuccess({
        currentUser: result?.data?.user,
        accessToken: result?.data?.accessToken,
      }));
      router.push("/dashboard")
    } else {
      dispatch(signInFailure(result?.message));
    }
  };

  const signUpForm = async (event) => {
   event.preventDefault();
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   const nameRegex = /^[A-Za-z]{2,30}$/;
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
   if (!nameRegex.test(signUpData.firstName)) {
     dispatch(signUpFailure("First name must contain only alphabets"));
     return;
   }
   if (!nameRegex.test(signUpData.lastName)) {
     dispatch(signUpFailure("Last name must contain only alphabets"));
     return;
   }
   if (!emailRegex.test(signUpData.email)) {
     dispatch(signUpFailure("Invalid Email Format"));
     return;
   }
   if (!passwordRegex.test(signUpData.password)) {
     dispatch(signUpFailure("Password must contain uppercase, lowercase, number and minimum 8 characters"));
     return;
   }
   if (signUpData.password !== signUpData.reEnterPassword) {
     dispatch(signUpFailure("Passwords do not match"));
     return;
   }
   dispatch(signUpStart());
   const result = await signUp(signUpData);
   if (result.success) {
     dispatch(setCurrentForm("signup-verification"));
     dispatch(signUpSuccess(result?.data));
    } else {
     dispatch(signUpFailure(result?.message));
    }
  };

  const verifySignUpOTP = async (event) => {
    event.preventDefault();
    dispatch(verifyOTPStart());
    const otpValue = otp.join("");
    const loginOTPData = {
      otp: otpValue,
      email: user?.currentUser?.email,
    }
    const result = await signUpOTPVerification(loginOTPData);
    if (result.success) {
      dispatch(verifyOTPSuccess());
      dispatch(setCurrentForm("login"));
    } else {
      dispatch(verifyOTPFailure(result?.message));
    }
  };

  const forgotPasswordForm = async (event) => {
    event.preventDefault();
    // Add your forgot password API call here
    console.log("Forgot Password Email:", forgotEmail);
  };

  const updatePasswordForm = async (event) => {
    event.preventDefault();
    // Add your update password API call here
    console.log("Update Password Data:", updatePasswordData);
  };

  const resendOTP = async () => {
    // Add your resend OTP API call here
    console.log("Resend OTP");
  };

  useEffect(() => {
    if (user?.currentForm !== "signup-verification") return;
    if (!user?.currentUser?.otpExpiryTime) return;
    const expiryTime = new Date(user.currentUser.otpExpiryTime);
    const interval = setInterval(() => {
      const now = new Date();
      const diffInSeconds = Math.floor((expiryTime - now) / 1000);
      if (diffInSeconds <= 0) {
        setRemainingSeconds(0);
        clearInterval(interval);
      } else {
        setRemainingSeconds(diffInSeconds);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [user.currentForm, user.currentUser?.otpExpiryTime]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const loginValid =
    loginData?.email?.trim() !== "" && loginData?.password?.trim() !== "";
  const isLoginDisabled = user?.loading || !loginValid;

  const signUpValid =
    signUpData?.firstName?.trim() !== "" &&
    signUpData?.lastName?.trim() !== "" &&
    signUpData?.email?.trim() !== "" &&
    signUpData?.password?.trim() !== "" &&
    signUpData?.reEnterPassword?.trim() !== "" &&
    signUpData?.password === signUpData?.reEnterPassword;
  const isSignUpDisabled = user?.loading || !signUpValid;

  const isOTPDisabled = user?.loading || otp.some(digit => digit === "") || remainingSeconds === 0;

  const isForgotEmailDisabled = user?.loading || !forgotEmail?.trim();

  const updatePasswordValid =
    updatePasswordData?.newPassword?.trim() !== "" &&
    updatePasswordData?.confirmNewPassword?.trim() !== "" &&
    updatePasswordData?.newPassword === updatePasswordData?.confirmNewPassword;
  const isUpdatePasswordDisabled = user?.loading || !updatePasswordValid;

  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 h-full flex items-center justify-center bg-[#050A24]">
        <div className="ml-40 flex flex-col gap-10 p-10 w-full h-[75%] bg-[linear-gradient(to_bottom_right,#050A24_30%,#0E1B54_50%,#050A24_80%)] relative">
          <div className="w-60">
            { 
              websiteResponse?.logo && (
                <img src={websiteResponse?.logo} alt={websiteResponse?.title} className="w-full" />
              )
            }
          </div>
          <div className="flex flex-col gap-5 justify-center items-center w-full">
            <p className="text-5xl text-white font-medium font-enriqueta">{websiteResponse?.title}</p>
          </div>
          <div className="flex justify-between items-center w-full absolute bottom-5">
            <p className="text-[14px] leading-6 text-gray-300">{websiteResponse?.copyright}</p>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-full flex items-center justify-center bg-[linear-gradient(to_bottom_right,#050A24_30%,#0E1B54_50%,#050A24_80%)]">
        <div className={`w-xl h-125 transition-transform duration-700 ease-out transform-3d ${user.currentForm !== "login" ? "transform-[rotateX(180deg)]" : ""}`}>
          {
            user?.currentForm === "login" && (
              <div className="absolute w-full h-full bg-[#00000059] backdrop-blur-xl rounded-tl-[100px] rounded-br-[100px] p-20 backface-hidden">
                <form onSubmit={loginForm} className="flex flex-col gap-10 w-full items-center">
                  <p className="text-3xl font-medium text-white">Login</p>
                  <div className="flex flex-col gap-5 w-full">
                    <div className="flex flex-col gap-2 w-full">
                      <p className="text-[14px] leading-6 font-medium text-white ml-6">Email</p>
                      <div className="flex gap-3 w-full items-center">
                        <Mail className="text-white w-5 h-5" />
                        <input disabled={user?.loading} name="email" onChange={inputChangeHandler} value={loginData.email} type="text" className="w-full border-b border-gray-200 outline-none placeholder:font-light font-light text-white placeholder:text-gray-200 text-[14px] leading-6 placeholder:text-[14px] placeholder:leading-6" placeholder="Enter Email" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <p className="text-[16px] leading-6.5 font-medium text-white ml-6">Password</p>
                      <div className="flex gap-3 w-full items-center">
                        <LockKeyholeOpen className="text-white w-5 h-5" />
                        <div className="flex gap-3 border-b border-gray-200 w-full">
                          <input disabled={user?.loading} name="password" onChange={inputChangeHandler} value={loginData.password} type={isPasswordVisible ? "text" : "password"} className="w-full outline-none placeholder:font-light font-light text-white placeholder:text-gray-200 text-[14px] leading-6 placeholder:text-[14px] placeholder:leading-6" placeholder="Enter Password" />
                          {
                            isPasswordVisible ? 
                            (
                              <button onClick={() => setIsPasswordVisible(false)} type="button" className="cursor-pointer">
                                <Eye className="text-white w-5 h-5" />
                              </button>
                            ) 
                            : 
                            (
                              <button onClick={() => setIsPasswordVisible(true)} type="button" className="cursor-pointer">
                                <EyeOff className="text-white w-5 h-5" />
                              </button>
                            )
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button disabled={user?.loading} type="button" onClick={() => setCurrentFormSpecific("forgot-password")} className="text-[#E6C97A] disabled:cursor-not-allowed disabled:opacity-50 text-[14px] leading-6 font-normal cursor-pointer rounded-sm">Forgot Password</button>
                    </div>
                  </div>
                  <button disabled={isLoginDisabled} type="submit" className="w-full flex items-center justify-center py-1 cursor-pointer bg-[#E6C97A] disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-500 disabled:hover:bg-gray-600">{user?.loading ? <Loader className="w-6 h-6 text-white animate-spin" /> : "Login"}</button>
                </form>
                <div className="flex gap-2 items-center mt-2">
                  <p className="text-[#E6C97A] disabled:cursor-not-allowed disabled:opacity-50 text-[14px] leading-6 font-normal cursor-pointer rounded-sm">Don't have an account?</p>
                  <button disabled={user?.loading} type="button" onClick={() => setCurrentFormSpecific("signup")} className="text-[#E6C97A] disabled:cursor-not-allowed disabled:opacity-50 text-[14px] leading-6 font-normal cursor-pointer rounded-sm">Create Account</button>
                </div>
                {
                  user?.error && user?.message?.trim() !== "" && (
                    <p className="text-[12px] leading-5.5 text-red-100 font-medium mt-2">{user?.message}</p>
                  )
                }
              </div>   
            )
          }

          {
            user?.currentForm === "signup" && (
              <div className="absolute w-full h-full bg-[#00000059] backdrop-blur-xl rounded-tl-[100px] rounded-br-[100px] px-20 py-10 backface-hidden transform-[rotateX(180deg)]">
                <form onSubmit={signUpForm} className="flex flex-col gap-6 w-full items-center">
                  <p className="text-3xl font-medium text-white">Create Account</p>
                  <div className="flex flex-col gap-4 w-full">
                    <div className="flex gap-5 w-full items-center">
                      <div className="flex flex-col gap-1 w-full">
                        <p className="text-[14px] leading-6 font-medium text-white ml-7">First Name</p>
                        <div className="flex gap-3 w-full items-center">
                          <User className="text-white w-5 h-5" />
                          <input disabled={user?.loading} name="firstName" onChange={signUpInputChangeHandler} value={signUpData.firstName} type="text" className="w-full border-b border-gray-200 outline-none placeholder:font-light font-light text-white placeholder:text-gray-200 text-[14px] leading-6 placeholder:text-[14px] placeholder:leading-6" placeholder="Enter First Name" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <p className="text-[14px] leading-6 font-medium text-white ml-7">Last Name</p>
                        <div className="flex gap-3 w-full items-center">
                          <User className="text-white w-5 h-5" />
                          <input disabled={user?.loading} name="lastName" onChange={signUpInputChangeHandler} value={signUpData.lastName} type="text" className="w-full border-b border-gray-200 outline-none placeholder:font-light font-light text-white placeholder:text-gray-200 text-[14px] leading-6 placeholder:text-[14px] placeholder:leading-6" placeholder="Enter Last Name" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <p className="text-[14px] leading-6 font-medium text-white ml-8">Email</p>
                      <div className="flex gap-3 w-full items-center">
                        <Mail className="text-white w-5 h-5" />
                        <input disabled={user?.loading} name="email" onChange={signUpInputChangeHandler} value={signUpData.email} type="email" className="w-full border-b border-gray-200 outline-none placeholder:font-light font-light text-white placeholder:text-gray-200 text-[14px] leading-6 placeholder:text-[14px] placeholder:leading-6" placeholder="Enter Email" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <div className="relative flex gap-3 items-center">
                        <p className="text-[14px] leading-6 font-medium text-white ml-8">Password</p>
                        <div onMouseEnter={() => setIsSignUpPasswordHovered((prev) => ({ ...prev, password: true }))} onMouseLeave={() => setIsSignUpPasswordHovered((prev) => ({ ...prev, password: false }))} className="w-4 h-4 flex items-center justify-center cursor-pointer">
                          <Info className="text-white w-full h-full" />
                        </div>
                        {
                          isSignUpPasswordHovered?.password && (
                            <div className="absolute top-0 right-10 w-64 z-40 bg-teal-600 rounded-sm px-3 py-1">
                              <p className="text-[12px] leading-5.5 text-white font-semibold">Password must contain uppercase, lowercase, special character and number.</p>
                            </div>
                          )
                        }
                      </div>
                      <div className="flex gap-3 w-full items-center">
                        <LockKeyholeOpen className="text-white w-5 h-5" />
                        <div className="flex gap-3 border-b border-gray-200 w-full">
                          <input disabled={user?.loading} name="password" onChange={signUpInputChangeHandler} value={signUpData.password} type={isPasswordVisible ? "text" : "password"} className="w-full outline-none placeholder:font-light font-light text-white placeholder:text-gray-200 text-[14px] leading-6 placeholder:text-[14px] placeholder:leading-6" placeholder="Enter Password" />
                          {
                            isPasswordVisible ? 
                            (
                              <button onClick={() => setIsPasswordVisible(false)} type="button" className="cursor-pointer">
                                <Eye className="text-white w-4 h-4" />
                              </button>
                            ) 
                            : 
                            (
                              <button onClick={() => setIsPasswordVisible(true)} type="button" className="cursor-pointer">
                                <EyeOff className="text-white w-4 h-4" />
                              </button>
                            )
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <div className="relative flex gap-3 items-center">
                        <p className="text-[14px] leading-6 font-medium text-white ml-8">Re-enter Password</p>
                        <div onMouseEnter={() => setIsSignUpPasswordHovered((prev) => ({ ...prev, reEnterPassword: true }))} onMouseLeave={() => setIsSignUpPasswordHovered((prev) => ({ ...prev, reEnterPassword: false }))} className="w-4 h-4 flex items-center justify-center cursor-pointer">
                          <Info className="text-white w-full h-full" />
                        </div>
                        {
                          isSignUpPasswordHovered?.reEnterPassword && (
                            <div className="absolute top-0 -right-6 w-64 z-40 bg-teal-600 rounded-sm px-3 py-1">
                              <p className="text-[12px] leading-5.5 text-white font-semibold">Password must contain uppercase, lowercase, special character and number.</p>
                            </div>
                          )
                        }
                      </div>
                      <div className="flex gap-3 w-full items-center">
                        <LockKeyholeOpen className="text-white w-5 h-5" />
                        <div className="flex gap-3 border-b border-gray-200 w-full">
                          <input disabled={user?.loading} name="reEnterPassword" onChange={signUpInputChangeHandler} value={signUpData.reEnterPassword} type={isConfirmPasswordVisible ? "text" : "password"} className="w-full outline-none placeholder:font-light font-light text-white placeholder:text-gray-200 text-[14px] leading-6 placeholder:text-[14px] placeholder:leading-6" placeholder="Re-enter Password" />
                          {
                            isConfirmPasswordVisible ? 
                            (
                              <button onClick={() => setIsConfirmPasswordVisible(false)} type="button" className="cursor-pointer">
                                <Eye className="text-white w-4 h-4" />
                              </button>
                            ) 
                            : 
                            (
                              <button onClick={() => setIsConfirmPasswordVisible(true)} type="button" className="cursor-pointer">
                                <EyeOff className="text-white w-4 h-4" />
                              </button>
                            )
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <button disabled={isSignUpDisabled} type="submit" className="w-full flex items-center justify-center py-1 cursor-pointer bg-[#E6C97A] disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-500 disabled:hover:bg-gray-600">{user?.loading ? <Loader className="w-6 h-6 text-white animate-spin" /> : "Sign Up"}</button>
                </form>
                <button disabled={user?.loading} type="button" onClick={() => setCurrentFormSpecific("login")} className="flex gap-2 items-center mt-2">
                  <p className="text-[#E6C97A] disabled:cursor-not-allowed disabled:opacity-50 text-[14px] leading-6 font-normal cursor-pointer rounded-sm">Already have an account?</p>
                  <p className="text-[#E6C97A] disabled:cursor-not-allowed disabled:opacity-50 text-[14px] leading-6 font-normal cursor-pointer rounded-sm">Login</p>
                </button>
              </div>   
            )
          }

          {
            user?.currentForm === "signup-verification" && (
              <div className="absolute w-full h-full bg-[#00000059] backdrop-blur-xl rounded-tl-[100px] rounded-br-[100px] p-20 backface-hidden transform-[rotateX(180deg)]">
                <form onSubmit={verifySignUpOTP} className="flex flex-col gap-10 w-full items-center">
                  <p className="text-3xl font-semibold text-white">Verification Code</p>
                  <div className="flex flex-col gap-5 w-full">
                    <div className="flex flex-col gap-2 w-full">
                      <p className="text-[16px] leading-6.5 font-semibold text-white ml-6">OTP</p>
                      <div className="flex gap-3 w-full items-center justify-center">
                        {
                          otp?.map((digit, index) => (
                            <div className="p-1 rounded-md border border-yellow-100 transition-all duration-300 ease-in-out focus-within:border-yellow-500 focus-within:shadow-[0_0_8px_0_rgba(0,132,165,0.3)]" key={index}>
                              <input type="text" id={`otp-${index}`} value={digit} onChange={(e) => handleChange(e, index)} onKeyDown={(e) => handleKeyDown(e, index)} maxLength={1} className="w-6 sm:w-8 h-6 sm:h-8 rounded-md text-center text-white text-lg border-none outline-none" disabled={user?.loading}/>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    <p className="text-white text-sm text-center">Enter the code sent to your email</p>
                    <div className="flex justify-between">
                      {
                        remainingSeconds === 0 ?
                        (
                          <button disabled={user?.loading} className="text-[14px] leading-6 text-[#E6C97A] font-normal cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" type="button">Resend OTP</button>
                        )
                        :
                        (
                          <div className="flex gap-0.5 items-center">
                            <p className="text-[14px] leading-6 text-[#E6C97A] font-normal">Expires in</p>
                            <p className="text-[14px] leading-6 text-[#E6C97A] font-semibold">{formattedTime}</p>
                          </div>
                        )
                      }
                      <button disabled={user?.loading} type="button" onClick={() => setCurrentFormSpecific("login")} className="text-[#E6C97A] text-[14px] disabled:cursor-not-allowed disabled:opacity-50 leading-6 font-normal cursor-pointer rounded-sm">Back to Login</button>
                    </div>
                  </div>
                  <button disabled={isOTPDisabled} type="submit" className="w-full flex items-center justify-center py-1 cursor-pointer bg-[#E6C97A] disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-500 disabled:hover:bg-gray-600">{user?.loading ? <Loader className="w-6 h-6 text-white animate-spin" /> : "Submit"}</button>
                </form>
                {
                  user?.error && user?.message?.trim() !== "" && (
                    <p className="text-[12px] leading-5.5 text-red-100 font-medium mt-2">{user?.message}</p>
                  )
                }
              </div>
            )
          }

          {
            user?.currentForm === "forgot-password" && (
              <div className="absolute w-full h-full bg-[#00000059] backdrop-blur-xl rounded-tl-[100px] rounded-br-[100px] p-20 backface-hidden transform-[rotateX(180deg)]">
                <form onSubmit={forgotPasswordForm} className="flex flex-col gap-10 w-full items-center">
                  <p className="text-3xl font-medium text-white">Forgot Password</p>
                  <p className="text-[14px] leading-5 text-gray-300 text-center">Enter your email address to receive a verification code</p>
                  <div className="flex flex-col gap-5 w-full">
                    <div className="flex flex-col gap-2 w-full">
                      <p className="text-[16px] leading-6.5 font-medium text-white ml-6">Email</p>
                      <div className="flex gap-3 w-full items-center">
                        <Mail className="text-white w-5 h-5" />
                        <input disabled={user?.loading} name="forgotEmail" onChange={forgotPasswordInputChangeHandler} value={forgotEmail} type="email" className="w-full border-b border-gray-200 outline-none placeholder:font-light font-light text-white placeholder:text-gray-200 text-[16px] leading-6.5 placeholder:text-[16px] placeholder:leading-6.5" placeholder="Enter Email" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 w-full">
                    <button disabled={isForgotEmailDisabled} type="submit" className="w-full flex items-center justify-center py-1 cursor-pointer bg-[#E6C97A] disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-500 disabled:hover:bg-gray-600">{user?.loading ? <Loader className="w-6 h-6 text-white animate-spin" /> : "Send Code"}</button>
                  </div>
                </form>
                <div className="flex gap-2 items-center mt-2">
                  <p className="text-[#E6C97A] disabled:cursor-not-allowed disabled:opacity-50 text-[14px] leading-6 font-normal cursor-pointer rounded-sm">Remember your password?</p>
                  <button disabled={user?.loading} type="button" onClick={() => setCurrentFormSpecific("login")} className="text-[#E6C97A] disabled:cursor-not-allowed disabled:opacity-50 text-[14px] leading-6 font-normal cursor-pointer rounded-sm">Login</button>
                </div>
              </div>
            )
          }

          {
            user?.currentForm === "update-password" && (
              <div className="absolute w-full h-full bg-[#00000059] backdrop-blur-xl rounded-tl-[100px] rounded-br-[100px] p-20 backface-hidden transform-[rotateX(180deg)]">
                <form onSubmit={updatePasswordForm} className="flex flex-col gap-10 w-full items-center">
                  <p className="text-3xl font-medium text-white">Update Password</p>
                  <div className="flex flex-col gap-5 w-full">
                    <div className="flex flex-col gap-2 w-full">
                      <p className="text-[16px] leading-6.5 font-medium text-white ml-6">New Password</p>
                      <div className="flex gap-3 w-full items-center">
                        <LockKeyholeOpen className="text-white w-5 h-5" />
                        <div className="flex gap-3 border-b border-gray-200 w-full">
                          <input disabled={user?.loading} name="newPassword" onChange={updatePasswordInputChangeHandler} value={updatePasswordData.newPassword} type={isNewPasswordVisible ? "text" : "password"} className="w-full outline-none placeholder:font-light font-light text-white placeholder:text-gray-200 text-[16px] leading-6.5 placeholder:text-[16px] placeholder:leading-6.5" placeholder="Enter New Password" />
                          {
                            isNewPasswordVisible ? 
                            (
                              <button onClick={() => setIsNewPasswordVisible(false)} type="button" className="cursor-pointer">
                                <Eye className="text-white w-5 h-5" />
                              </button>
                            ) 
                            : 
                            (
                              <button onClick={() => setIsNewPasswordVisible(true)} type="button" className="cursor-pointer">
                                <EyeOff className="text-white w-5 h-5" />
                              </button>
                            )
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <p className="text-[16px] leading-6.5 font-medium text-white ml-6">Confirm New Password</p>
                      <div className="flex gap-3 w-full items-center">
                        <LockKeyholeOpen className="text-white w-5 h-5" />
                        <div className="flex gap-3 border-b border-gray-200 w-full">
                          <input disabled={user?.loading} name="confirmNewPassword" onChange={updatePasswordInputChangeHandler} value={updatePasswordData.confirmNewPassword} type={isConfirmPasswordVisible ? "text" : "password"} className="w-full outline-none placeholder:font-light font-light text-white placeholder:text-gray-200 text-[16px] leading-6.5 placeholder:text-[16px] placeholder:leading-6.5" placeholder="Confirm New Password" />
                          {
                            isConfirmPasswordVisible ? 
                            (
                              <button onClick={() => setIsConfirmPasswordVisible(false)} type="button" className="cursor-pointer">
                                <Eye className="text-white w-5 h-5" />
                              </button>
                            ) 
                            : 
                            (
                              <button onClick={() => setIsConfirmPasswordVisible(true)} type="button" className="cursor-pointer">
                                <EyeOff className="text-white w-5 h-5" />
                              </button>
                            )
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <button disabled={isUpdatePasswordDisabled} type="submit" className="w-full flex items-center justify-center py-1 cursor-pointer bg-[#E6C97A] disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-500 disabled:hover:bg-gray-600">{user?.loading ? <Loader className="w-6 h-6 text-white animate-spin" /> : "Update Password"}</button>
                </form>
                <div className="flex gap-2 items-center mt-2">
                  <p className="text-[#E6C97A] disabled:cursor-not-allowed disabled:opacity-50 text-[14px] leading-6 font-normal cursor-pointer rounded-sm">Password updated?</p>
                  <button disabled={user?.loading} type="button" onClick={() => setCurrentFormSpecific("login")} className="text-[#E6C97A] disabled:cursor-not-allowed disabled:opacity-50 text-[14px] leading-6 font-normal cursor-pointer rounded-sm">Login</button>
                </div>
              </div>
            )
          }

        </div>
      </div>
    </div>
  );
};

export default page;