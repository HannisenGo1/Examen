import express from "express";
import { GetUser, AddUser, UpdateUser } from "./data/getData.js";
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
import cors from 'cors';
app.use(cors());
app.use('/', (req, _, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});
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
app.patch('/:id', async (req, res) => {
    const userId = req.params.id;
    const partialData = req.body;
    try {
        await UpdateUser(userId, partialData);
        res.status(200).json({ message: "Assignment partially updated successfully" });
    }
    catch (error) {
        console.error("Fel vid partiell uppdatering av assignment:", error);
        res.status(500).json({ error: "Ett fel uppstod vid uppdatering av assignment" });
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
