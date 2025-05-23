import * as type from "@/constants/constants";

export const sendOtp = (phoneNumber) => ({
  type: type.SEND_OTP,
  payload: { phoneNumber },
});

export const verifyOtp = (otp) => ({
  type: type.VERIFY_OTP,
  payload: { otp },
});

export const signInSuccess = (auth) => ({
  type: type.SIGNIN_SUCCESS,
  payload: auth,
});

export const setAuthPersistence = () => ({
  type: type.SET_AUTH_PERSISTENCE,
});

export const signOut = () => ({
  type: type.SIGNOUT,
});

export const signOutSuccess = () => ({
  type: type.SIGNOUT_SUCCESS,
});

export const onAuthStateChanged = () => ({
  type: type.ON_AUTHSTATE_CHANGED,
});

export const onAuthStateSuccess = (user) => ({
  type: type.ON_AUTHSTATE_SUCCESS,
  payload: user,
});

export const onAuthStateFail = (error) => ({
  type: type.ON_AUTHSTATE_FAIL,
  payload: error,
});
