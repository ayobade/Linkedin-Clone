import db, { auth, provider, storage } from "../firebase";
import { SET_USER, SET_LOADING_STATUS } from "./actionType";
import firebase from "firebase/compat/app";

export const setUser = (payload) => {
  return {
    type: SET_USER,
    user: payload,
  };
};

export const setLoadingStatus = (status) => {
  return {
    type: SET_LOADING_STATUS,
    status: status,
  };
};

export function signInAPI() {
  return (dispatch) => {
    auth
      .signInWithPopup(provider)
      .then((payload) => {
        dispatch(setUser(payload.user));
      })
      .catch((error) => {
        alert(error.message);
      });
  };
}

export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  };
}

export function postArticleAPI(payload) {
  return async (dispatch) => {
   dispatch(setLoadingStatus(true));

    try {
      const { description = "", user } = payload || {};
      const inputFiles = (payload && (payload.files || payload.images)) || [];
      const imageUrls = [];

      for (const file of inputFiles) {
        const storageRef = storage.ref(`images/${user?.uid || "anon"}/${Date.now()}-${file.name}`);
        const metadata = { contentType: file.type || "application/octet-stream" };
        const snapshot = await storageRef.put(file, metadata);
        const url = await snapshot.ref.getDownloadURL();
        imageUrls.push(url);
      }

      const simplifiedUser = user ? {
        uid: user.uid || "",
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
      } : null;

      await db.collection("posts").add({
        user: simplifiedUser,
        description,
        imageUrl: imageUrls[0] || "",
        imageUrls,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setLoadingStatus(false));
    }
  };
}