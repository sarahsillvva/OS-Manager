import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import orderRoutes from "./routes/order.routes";
import { rabbitMQService } from "./services/RabbitMQService"; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// Configuração do Swagger local
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Order Service API", version: "1.0.0" },
  },
  apis: ["./src/routes/*.ts"], 
};
const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(orderRoutes);

const PORT = process.env.PORT_ORDER;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
      console.error("ERRO: A variável MONGO_URI não foi definida no arquivo .env");
      process.exit(1);
    }
    if (!PORT) {
      console.error("ERRO: A variável PORT_ORDER não foi definida no arquivo .env");
      process.exit(1);
    }
const startServer = async () => {
  try {
    
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected!");

    await rabbitMQService.start(); 
    console.log("RabbitMQ ready and Channel created!");

    app.listen(PORT, () => {
      console.log(`Order Service running on port ${PORT}`);
    });
    
  } catch (err) {
    console.error("Failed to start Order Service:", err);
    process.exit(1);
  }
};
startServer();