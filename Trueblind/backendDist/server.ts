import express, { Express}  from "express";
import { GetUser, AddUser, UpdateUser } from "./data/getData.js";
import cors from 'cors';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/', express.json()) 

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
app.put("/users/:id", async (req, res) => {
    try {
      const userId = req.params.id; 
      const updatedData = req.body; 
      console.log('Received updated data:', updatedData);
      await UpdateUser(userId, updatedData);
      res.json({ message: "Användardata uppdaterad!" });
    } catch (error) {
      console.error("Fel vid uppdatering av användare:", error);
      res.status(500).json({ error: "Ett fel uppstod vid uppdatering av användare." });
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
