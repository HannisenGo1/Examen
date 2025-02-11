import express, { Express, Request, Response, NextFunction } from "express";
import { GetUser, AddUser, UpdateUser, GetUserById} from "./data/getData.js";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json()); 
import cors from 'cors';


app.use(cors());

app.use('/', (req: Request, _, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
  });


  app.get("/users", async (_, res: Response) => {
    try {
      const users = await GetUser();
      res.json(users); 
    } catch (error) {
      console.error("Fel vid hämtning av användare:", error);
      res.status(500).json({ error: "Ett fel uppstod vid hämtning av användare." });
    }
  });

app.post("/users", async (req: Request, res: Response) => {
  try {
    const userData = req.body; 
    const userId = await AddUser(userData); 
    res.status(201).json({ message: "Användare skapad", userId: userId });
  } catch (error) {
    console.error("Fel vid skapande av användare:", error);
    res.status(500).json({ error: "Ett fel uppstod vid skapande av användare." });
  }
});

app.patch('/users/:id', async (req: Request, res: Response) => {
  const userId = req.params.id; 
  const partialData = req.body; 

  try {
    await UpdateUser(userId, partialData);
    
    const updatedUser = await GetUserById(userId); 
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Fel vid uppdatering av användare:", error);
    res.status(500).json({ error: "Ett fel uppstod vid uppdatering av användardata." });
  }
});


// 404 Middleware (om ingen route matchar)
app.use((_: any, res: Response) => {
    res.status(404).json({ error: "Resursen hittades inte." });
  });

// Starta servern
app.listen(port, () => {
  console.log(`Servern körs på port ${port}`);
});
