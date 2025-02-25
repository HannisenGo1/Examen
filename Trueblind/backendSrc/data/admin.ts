import admin  from 'firebase-admin';

import { config } from 'dotenv';


config();
// sequred keys from env file
const serviceAccount = {
    type: process.env['TYPE'],
    project_id: process.env['PROJECT_ID'],
    private_key_id: process.env['PRIVATE_KEY_ID'],
    private_key: process.env['PRIVATE_KEY']?.replace(/\\n/g, '\n'),
    client_email: process.env['CLIENT_EMAIL'],
    client_id: process.env['CLIENT_ID'],
    auth_uri: process.env['AUTH_URI'],
    token_uri: process.env['TOKEN_URI'],
    auth_provider_x509_cert_url: process.env['AUTH_PROVIDER_X509_CERT_URL'],
    client_x509_cert_url: process.env['CLIENT_X509_CERT_URL'],
}as admin.ServiceAccount; 


  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),

  });
  console.log('Firebase Admin SDK is initialized.');
  const auth = admin.auth();
 

  // creating token with admin auth.
  export const createCustomToken = async (uid: string) => {
    try {
      const token = await admin.auth().createCustomToken(uid);
      return token;
    } catch (error) {
      console.error('Error creating custom token:', error);
      throw error;
    }
  };


    export {auth, admin  }