import db, { auth, provider, storage } from "../firebase";
import { SET_USER, SET_LOADING_STATUS, SET_POSTS } from "./actionType";
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

export const setPosts = (posts) => {
  return {
    type: SET_POSTS,
    posts,
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
        likesCount: 0,
        commentsCount: 0,
        repostCount: 0,
        likedBy: [],
        repostedBy: [],
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      
      dispatch(fetchPostsAPI());
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setLoadingStatus(false));
    }
  };
}

export function fetchPostsAPI(sort = "Recent") {
  return async (dispatch) => {
    try {
      const collectionRef = db.collection("posts");
      const snapshot = await collectionRef.orderBy("timestamp", "desc").get();
      let posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (sort === "Top") {
        posts = posts
          .map((p) => ({
            ...p,
            likesCount: typeof p.likesCount === 'number' ? p.likesCount : 0,
          }))
          .sort((a, b) => b.likesCount - a.likesCount || (b.timestamp?.toMillis?.() || 0) - (a.timestamp?.toMillis?.() || 0));
      }
      dispatch(setPosts(posts));
    } catch (err) {
      console.error(err);
      dispatch(setPosts([]));
    }
  };
}

export function updatePostReactionAPI(postId, user, reaction, sort = "Recent") {
  return async (dispatch) => {
    try {
      if (!user || !user.uid) return;
      const uid = user.uid;
      const docRef = db.collection("posts").doc(postId);

      await db.runTransaction(async (tx) => {
        const snap = await tx.get(docRef);
        if (!snap.exists) return;
        const data = snap.data() || {};
        if (reaction === 'like') {
          const likedBy = Array.isArray(data.likedBy) ? data.likedBy : [];
          if (likedBy.includes(uid)) {
            tx.update(docRef, {
              likedBy: firebase.firestore.FieldValue.arrayRemove(uid),
              likesCount: firebase.firestore.FieldValue.increment(-1),
            });
          } else {
            tx.update(docRef, {
              likedBy: firebase.firestore.FieldValue.arrayUnion(uid),
              likesCount: firebase.firestore.FieldValue.increment(1),
            });
          }
        } else if (reaction === 'repost') {
          const repostedBy = Array.isArray(data.repostedBy) ? data.repostedBy : [];
          if (repostedBy.includes(uid)) {
            tx.update(docRef, {
              repostedBy: firebase.firestore.FieldValue.arrayRemove(uid),
              repostCount: firebase.firestore.FieldValue.increment(-1),
            });
          } else {
            tx.update(docRef, {
              repostedBy: firebase.firestore.FieldValue.arrayUnion(uid),
              repostCount: firebase.firestore.FieldValue.increment(1),
            });
          }
        }
      });

      dispatch(fetchPostsAPI(sort));
    } catch (err) {
      console.error(err);
    }
  };
}



export function getArticlesAPI() {
    return async (dispatch) => {
        let payload;

        db.collection("articles").orderBy("actor.date", "desc").onSnapshot((snapshot) => {
            payload = snapshot.docs.map((doc) => doc.data());
            console.log(payload);
        });
    };
}




