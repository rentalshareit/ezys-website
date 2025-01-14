import {
  ON_AUTHSTATE_FAIL,
  ON_AUTHSTATE_SUCCESS,
  SET_AUTH_PERSISTENCE,
  SIGNOUT,
  SIGNUP,
  SEND_OTP,
  VERIFY_OTP,
} from "@/constants/constants";
import defaultAvatar from "@/images/defaultAvatar.jpg";
import defaultBanner from "@/images/defaultBanner.jpg";
import { call, put } from "redux-saga/effects";
import { signInSuccess, signOutSuccess } from "@/redux/actions/authActions";
import { clearBasket, setBasketItems } from "@/redux/actions/basketActions";
import { resetCheckout } from "@/redux/actions/checkoutActions";
import { resetFilter } from "@/redux/actions/filterActions";
import {
  setAuthenticating,
  setAuthStatus,
  setLoading,
} from "@/redux/actions/miscActions";
import { clearProfile, setProfile } from "@/redux/actions/profileActions";
import { history } from "@/routers/AppRouter";
import firebase from "@/services/firebase";

function* handleError(e) {
  const obj = { success: false, type: "auth", isError: true };
  yield put(setAuthenticating(false));

  switch (e.code) {
    case "auth/network-request-failed":
      yield put(
        setAuthStatus({
          ...obj,
          message: "Network error has occured. Please try again.",
        })
      );
      break;
    case "auth/invalid-verification-code":
      yield put(setAuthStatus({ ...obj, message: "Invalid OTP" }));
      break;
    case "auth/invalid-phone-number":
      yield put(setAuthStatus({ ...obj, message: "Invalid phone number" }));
      break;
    default:
      yield put(setAuthStatus({ ...obj, message: e.message }));
      break;
  }
}

function* authSaga({ type, payload }) {
  switch (type) {
    case SEND_OTP:
      try {
        yield put(setLoading(true));
        yield put(setAuthStatus({}));
        yield call(firebase.sendOTP, payload.phoneNumber);
        yield put(setAuthenticating());
      } catch (e) {
        yield handleError(e);
      } finally {
        yield put(setLoading(false));
      }
      break;
    case VERIFY_OTP:
      try {
        yield put(setLoading(true));
        yield call(firebase.verifyOTP, payload.otp);
      } catch (e) {
        yield handleError(e);
      } finally {
        yield put(setLoading(false));
      }
      break;
    case SIGNOUT: {
      try {
        yield put(setAuthStatus({}));
        yield call(firebase.signOut);
        yield put(clearBasket());
        yield put(clearProfile());
        yield put(resetFilter());
        yield put(resetCheckout());
        yield put(signOutSuccess());
        yield put(setAuthenticating(false));
      } catch (e) {
        console.log(e);
      }
      break;
    }
    case ON_AUTHSTATE_SUCCESS: {
      const snapshot = yield call(firebase.getUser, payload.uid);

      if (snapshot.data()) {
        // if user exists in database
        const user = snapshot.data();

        yield put(setProfile(user));
        yield put(setBasketItems(user.basket));
        yield put(setBasketItems(user.basket));
        yield put(
          signInSuccess({
            id: payload.uid,
            role: user.role,
            provider: payload.providerData[0].providerId,
          })
        );
      } else {
        const user = {
          fullname: payload.displayName ? payload.displayName : "User",
          avatar: payload.photoURL ? payload.photoURL : defaultAvatar,
          banner: defaultBanner,
          email: payload.email,
          address: "",
          basket: [],
          mobile: {
            country: "in",
            countryCode: "+91",
            dialCode: "91",
            value: payload.phoneNumber,
          },
          role: "USER",
          dateJoined: payload.metadata.creationTime,
        };
        yield call(firebase.addUser, payload.uid, user);
        yield put(setProfile(user));
        yield put(
          signInSuccess({
            id: payload.uid,
            role: user.role,
            provider: payload.providerData[0].providerId,
          })
        );
      }

      yield put(
        setAuthStatus({
          success: true,
          type: "auth",
          isError: false,
          message: "Successfully signed in. Redirecting...",
        })
      );
      yield put(setAuthenticating(false));
      break;
    }
    case ON_AUTHSTATE_FAIL: {
      yield put(clearProfile());
      yield put(signOutSuccess());
      break;
    }
    case SET_AUTH_PERSISTENCE: {
      try {
        yield call(firebase.setAuthPersistence);
      } catch (e) {
        console.log(e);
      }
      break;
    }
    default: {
      throw new Error("Unexpected Action Type.");
    }
  }
}

export default authSaga;
