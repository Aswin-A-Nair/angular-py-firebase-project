# BigB

Login and admin dashboard built with Angular, Python (FastAPI) and Firebase (Authentication + Firestore).

## How it works
Angular logs the user in with Firebase and gets an ID token. It sends the token to the FastAPI backend, which verifies it, checks the admin role, and reads or writes products in Firestore.

## Run it
1. Create a Firebase project. Enable Email/Password sign-in and create a Firestore database.
2. Frontend: put your Firebase web config in `frontend/src/environments/environment.ts`, then run `npm install` and `ng serve`.
3. Backend (Python 3.12): in `backend`, create a venv, run `pip install -r requirements.txt`, and save your Firebase service account key as `backend/serviceAccountKey.json`.
4. Make a user admin: `python set_admin.py user@email.com`.
5. Start the API: `uvicorn main:app --reload`, then open http://localhost:4200 and log in.

Note: `serviceAccountKey.json` is secret and is not included in this repository.
