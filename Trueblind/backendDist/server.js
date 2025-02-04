import express from "express";
import { GetUser, AddUser } from "./data/getData.js";
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json()); // För att kunna läsa JSON-requests
// Middleware för att logga alla requests
app.use('/', (req, _, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});
app.get("/users", async (_, res) => {
    try {
        const users = await GetUser(); // Hämta användare
        res.json(users); // Skicka tillbaka användarna i JSON-format
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
// 404 Middleware (om ingen route matchar)
app.use((_, res) => {
    res.status(404).json({ error: "Resursen hittades inte." });
});
// Starta servern
app.listen(port, () => {
    console.log(`Servern körs på port ${port}`);
});
