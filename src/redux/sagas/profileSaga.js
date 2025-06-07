import { UPDATE_PROFILE } from "@/constants/constants";
import { ACCOUNT } from "@/constants/routes";
import { call, put, select } from "redux-saga/effects";
import { history } from "@/routers/AppRouter";
import firebase from "@/services/firebase";
import { setLoading } from "../actions/miscActions";
import { updateProfileSuccess } from "../actions/profileActions";

function* profileSaga({ type, payload }) {
  switch (type) {
    case UPDATE_PROFILE: {
      try {
        const state = yield select();
        const { avatarFile, bannerFile } = payload.files;

        yield put(setLoading(true));

        if (avatarFile || bannerFile) {
          const bannerURL = bannerFile
            ? yield call(
                firebase.storeImage,
                state.auth.id,
                "banner",
                bannerFile
              )
            : payload.updates.banner;
          const avatarURL = avatarFile
            ? yield call(
                firebase.storeImage,
                state.auth.id,
                "avatar",
                avatarFile
              )
            : payload.updates.avatar;
          const updates = {
            ...payload.updates,
            avatar: avatarURL,
            banner: bannerURL,
          };

          yield call(firebase.updateProfile, state.auth.id, updates);
          yield put(updateProfileSuccess(updates));
        } else {
          yield call(firebase.updateProfile, state.auth.id, payload.updates);
          yield put(updateProfileSuccess(payload.updates));
        }

        yield put(setLoading(false));
        yield call(history.push, ACCOUNT);
        yield call(payload.notification.success, {
          message: "Profile Updated Successfully!",
        });
      } catch (e) {
        console.log(e);
        yield put(setLoading(false));
        yield call(payload.notification.error, {
          message: `Failed to update profile. ${e.message ? e.message : ""}`,
        });
      }
      break;
    }
    default: {
      throw new Error("Unexpected action type.");
    }
  }
}

export default profileSaga;
