import admin  from 'firebase-admin';
import express, { Router, Request, Response} from "express"; 
import { config } from 'dotenv';

const router: Router = express.Router();
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
  export { auth, admin };

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
  // uid become a token for firebase! 
  router.post('/create-token', async (req: Request, res: Response) => {
      const { uid } = req.body;
    
      if (!uid) {
        res.status(400).json({ error: 'UID is required' });
        return;
      }
    
      try {
        const token = await createCustomToken(uid);
        res.json({ token });
      } catch (error) {
        res.status(500).json({ error: 'Error generating custom token' });
      }
    });


    export {router}