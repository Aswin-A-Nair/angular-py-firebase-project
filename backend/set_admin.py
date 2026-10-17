import sys

from firebase_admin import auth

import firebase  # noqa: F401

email = sys.argv[1]
user = auth.get_user_by_email(email)
auth.set_custom_user_claims(user.uid, {"role": "admin"})
print(f"{email} is now an admin. Log out and log in again in the app.")