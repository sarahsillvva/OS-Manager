import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { AppDataSource } from "./database/data-source";
import authRoutes from "./routes/user.routes";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas do Auth
app.use("/auth", authRoutes);

const PORT = process.env.PORT_AUTH || 3001;

AppDataSource.initialize()
  .then(() => {
    console.log("🐘 Postgres Connected (Auth Service)!");
    app.listen(PORT, () => {
      console.log(`🔐 Auth Service running on port ${PORT}`);
    });
  })
  .catch((error: any) => console.log("❌ Postgres connection error:", error));