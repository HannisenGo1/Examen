import express from "express";
import { GetUser, AddUser, UpdateUser, GetUserById, DeleteUser } from "./data/getData.js";
import { router as auth } from './data/router/userRoute.js';
import verifyToken from "./data/token.js";
import { config } from 'dotenv';
config();
const app = express();
const port = process.env.PORT || 3000;
app.use('/', express.json());
import cors from 'cors';
app.use('/auth', auth);
app.use(cors());
app.use('/', (req, _, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});
app.use('/', express.static('./dist'));
app.use('/users', verifyToken);
app.get('/', (_, res) => {
    res.send('Välkommen till backend!');
});
// få ut användartestdatan 
app.get("/users", async (_, res) => {
    try {
        const users = await GetUser();
        res.json(users);
    }
    catch (error) {
        console.error("Fel vid hämtning av användare:", error);
        res.status(500).json({ error: "Ett fel uppstod vid hämtning av användare." });
    }
});
//skapandet av användaren
app.post("/users", async (req, res) => {
    try {
        const userData = req.body;
        const userId = await AddUser(userData);
        res.status(201).json({ message: "Användare skapad", userId: userId });
    }
    catch (error) {
        console.error("Fel vid skapande av användare:", error);
        res.status(500).json({ error: "Ett fel uppstod vid skapande av användare." });
    }
});
// använder patch för uppdatera en användare.
app.patch('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const partialData = req.body;
    try {
        if (req.user?.id !== userId) {
            res.status(403).json({ error: "Du har inte rätt att uppdatera den här användaren." });
            return;
        }
        await UpdateUser(userId, partialData);
        const updatedUser = await GetUserById(userId);
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("Fel vid uppdatering av användare:", error);
        res.status(500).json({ error: "Ett fel uppstod vid uppdatering av användardata." });
    }
});
// Ta bort en användare
app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        if (req.user?.id !== userId) {
            res.status(403).json({ error: "Du har inte rätt att ta bort denna användare." });
            return;
        }
        await DeleteUser(userId);
        res.status(200).json({ message: "Användare borttagen" });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
});
// 404 Middleware (om ingen route matchar)
app.use((_, res) => {
    res.status(404).json({ error: "Resursen hittades inte." });
});
// Starta servern
app.listen(port, () => {
    console.log(`Servern körs på port ${port}`);
});
