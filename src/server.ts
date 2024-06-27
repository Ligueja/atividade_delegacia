import express from "express";
import cors from "cors";
import "dotenv/config";
import { criminalsRoutes } from "./routes/criminals.routes";
import { crimesRoutes } from "./routes/crimes.routes";
import { weaponsRoutes } from "./routes/weapons.routes";

const app = express();
app.use(express.json());
app.use(cors());

// definição das rotas

app.get("/", (request, response) => {
  response.status(200).json({ message: "Teste servidor.", ok: true });
});

app.use("/criminals", criminalsRoutes.execute());
app.use("/crimes", crimesRoutes.execute());
app.use("/weapons", weaponsRoutes.execute());

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT} 🚀`);
});
