import express from "express";
import { createCustomToken } from "../admin.js";
const router = express.Router();
// uid become a token for firebase! 
router.post('/create-token', async (req, res) => {
    const { uid } = req.body;
    if (!uid) {
        res.status(400).json({ error: 'UID is required' });
        return;
    }
    try {
        const token = await createCustomToken(uid);
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ error: 'Error generating custom token' });
    }
});
export { router };
