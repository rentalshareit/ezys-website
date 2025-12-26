import { takeLatest, put, call, take } from "redux-saga/effects"; // ← Added take
import { showDisclaimerModal } from "../actions/miscActions";
import {
  ADD_TO_BASKET,
  DISCLAIMER_CONFIRMED,
  DISCLAIMER_CANCELLED,
} from "@/constants/constants";

function* handleAddToBasketSaga(action) {
  // ← Renamed to handler
  console.log("🎯 BASKET SAGA TRIGGERED!", action.payload); // Debug

  const product = action.payload;

  if (action._meta?.confirmed) {
    console.log("⏭️ Already confirmed, skipping");
    return;
  }

  if (isGamingConsoleWithPSPlus(product)) {
    yield put(showDisclaimerModal({ product }));
    const confirmed = yield call(waitForDisclaimerConfirmation);

    if (!confirmed) {
      console.log("❌ User cancelled");
      return; // DON'T add
    }
  }

  // SINGLE DISPATCH with _meta - NO LOOP!
  yield put({
    type: ADD_TO_BASKET,
    payload: product,
    _meta: { confirmed: true }, // ← Reducer checks this
  });
}

function* waitForDisclaimerConfirmation() {
  const action = yield take([DISCLAIMER_CONFIRMED, DISCLAIMER_CANCELLED]);
  return action.type === DISCLAIMER_CONFIRMED;
}

function isGamingConsoleWithPSPlus(product) {
  return product.category === "Gaming Consoles";
}

export default function* basketSaga() {
  // ← Watcher function
  yield takeLatest(ADD_TO_BASKET, handleAddToBasketSaga);
}
