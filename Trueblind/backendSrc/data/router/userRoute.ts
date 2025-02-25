import express, { Router, Request, Response} from "express"; 
import { createCustomToken } from "../admin.js";

const router: Router = express.Router();
  
  
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