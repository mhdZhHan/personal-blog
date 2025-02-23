import type { ServiceAccount } from "firebase-admin";
import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = {
  type: "service_account",
  project_id: import.meta.env.FIREBASE_PROJECT_ID,
  private_key_id: import.meta.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: import.meta.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email:
    "firebase-adminsdk-ldvxz@my-personal-blog-f1a2b.iam.gserviceaccount.com",
  client_id: "107969091410513032223",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ldvxz%40my-personal-blog-f1a2b.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

const app = !getApps().length
  ? initializeApp({ credential: cert(serviceAccount as ServiceAccount) })
  : getApp();

export const auth = getAuth(app);
