import express from "express";
import { AppDataSource } from "./config/data-source";
import userRoutes from "./routes/user.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./config/swagger";

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", userRoutes);

const PORT = process.env.PORT || 3001;

// Inicializa o Banco de Dados e depois sobe o servidor
AppDataSource.initialize()
  .then(() => {
    console.log(" Database connected!");
    app.listen(PORT, () => {
      console.log(`Auth Service running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("Error during Data Source initialization", error));