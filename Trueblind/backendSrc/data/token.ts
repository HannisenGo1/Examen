import { Request, Response, NextFunction } from 'express';
import { auth } from './admin.js';

const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: No token provided' });
      return; 
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decodedToken = await auth.verifyIdToken(token);
      (req as any).user = decodedToken; 
      next(); 
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(403).json({ error: 'Unauthorized: Invalid token' });
    }
  };
  
  export default verifyToken;