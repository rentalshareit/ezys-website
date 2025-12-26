import * as ACTION from "@/constants/constants";
import { takeLatest, all, fork } from "redux-saga/effects";
import authSaga from "./authSaga";
import productSaga from "./productSaga";
import profileSaga from "./profileSaga";
import basketSaga from "./basketSaga";

function* rootSaga() {
  yield all([
    fork(basketSaga), // Your new basketSaga
  ]);
  yield takeLatest(
    [
      ACTION.SIGNOUT,
      ACTION.SEND_OTP,
      ACTION.VERIFY_OTP,
      ACTION.ON_AUTHSTATE_CHANGED,
      ACTION.ON_AUTHSTATE_SUCCESS,
      ACTION.ON_AUTHSTATE_FAIL,
      ACTION.SET_AUTH_PERSISTENCE,
    ],
    authSaga
  );
  yield takeLatest(
    [
      ACTION.ADD_PRODUCT,
      ACTION.SEARCH_PRODUCT,
      ACTION.REMOVE_PRODUCT,
      ACTION.EDIT_PRODUCT,
      ACTION.GET_PRODUCTS,
    ],
    productSaga
  );
  yield takeLatest([ACTION.UPDATE_PROFILE], profileSaga);
}

export default rootSaga;
