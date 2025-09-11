## LinkedIn Clone (Vite + React + Redux + Firebase)

This is a LinkedIn-style social feed built with React (Vite), Styled Components, Redux, and Firebase (Auth, Firestore, Storage). It focuses on a polished UI, post creation with image gallery uploads, authenticated feed, reactions, sorting, and secure post deletion.

### Features
- Header with search, nav, responsive mobile bottom bar
- "Me" dropdown with mobile/desktop positioning and outside-click closing
- Home layout with left/main/right columns
- Start Post + full Post Modal with multi-image upload, removable gallery and mobile-friendly UI
- Feed posts with images, counts, and actions (Like, Comment, Repost, Share)
- Reactions (like/repost) are toggleable per-user and persisted in Firestore
- Sort by Recent (default) or Top (by likesCount)
- Secure delete (only the author can delete their own post and images)
- Responsive design and mobile optimizations

### Tech Stack
- React 18 + Vite
- Styled Components
- Redux + Thunk
- Firebase compat SDKs: Auth, Firestore, Storage

### Prerequisites
- Node 18+ recommended
- A Firebase project with: Auth (Google enabled), Firestore, Storage

### Environment Variables (Vite)
Create a `.env` file in the project root (`linkedinclone/linkedinclone/.env`) with:

```
VITE_FIREBASE_API_KEY=YOUR_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

Restart the dev server after editing `.env`.

### Firebase Setup
1) Auth
- Enable Google sign-in
- Add authorized domains: `localhost`, `127.0.0.1`, and your production domain

2) Firestore Security Rules (minimum viable)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.user.uid;
    }
  }
}
```

3) Storage
- Bucket must be `your-project-id.appspot.com`

Storage Rules (minimum viable):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /{allPaths=**} {
      allow read: if true;
    }
  }
}
```

Storage CORS (apply once using gsutil):
`cors.json` example used here:
```
[
  {
    "origin": ["http://localhost:5173", "https://YOUR_SITE.netlify.app"],
    "method": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "responseHeader": ["Content-Type", "x-goog-meta-*"],
    "maxAgeSeconds": 3600
  }
]
```
Apply:
```
gsutil cors set cors.json gs://your-project-id.appspot.com
gsutil cors get gs://your-project-id.appspot.com
```

### Install & Run
```
npm install
npm run dev
```
Visit `http://localhost:5173`.

### Build
```
npm run build
```
Output in `dist/`.

### Deploy (Netlify)
- Publish directory: `dist`
- Build command: `npm run build`
- Add the same VITE_ environment variables in Netlify → Site settings → Environment variables
- Add SPA redirect: create `public/_redirects` with:
```
/* /index.html 200
```

### Usage Notes
- Start a post → add text and/or upload multiple images. Remove any image via red “×” on the thumbnail.
- Post creates a Firestore document in `posts` and uploads images to Storage under `images/{uid}/...`.
- Reactions (like/repost) toggle per-user; counts update immediately; sorting preserves current selection.
- Delete is available only to the author and also removes uploaded images.

### Folder Structure (key parts)
- `src/components/header.jsx` — top nav, search, “Me” dropdown, mobile bottom nav
- `src/components/main.jsx` — feed, sort, posts, menus, reactions
- `src/components/PostModal.jsx` — rich create-post modal and image gallery
- `src/components/rightside.jsx`, `leftside.jsx` — sidebars
- `src/actions/index.jsx` — auth, posts CRUD, reactions, loading state
- `src/reducers/*` — user and article reducers
- `src/firebase.jsx` — compat Firebase initialization using Vite envs

### Troubleshooting
- invalid-api-key: ensure `.env` lives in project root, keys are prefixed with `VITE_`, restart dev server, verify `storageBucket` uses `appspot.com`.
- Storage CORS preflight failure: apply `cors.json` to your bucket with `gsutil cors set ...` and ensure you’re authenticated before write.
- Multiple React instances / hooks error: ensure a single React install and correct Vite aliases if needed.

### Scripts
- `dev`: start Vite dev server
- `build`: build production assets

### License
For educational/demo use.
