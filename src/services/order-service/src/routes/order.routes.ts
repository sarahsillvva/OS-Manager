import { Router } from "express";
import { OrderController } from "../controllers/OrderController";
import { authMiddleware } from "../middlewares/auth";
import { OrderService } from "../services/OrderService";

const orderRoutes = Router();
const service = new OrderService(); 
const controller = new OrderController(service);

/**
 * @openapi
 * /orders:
 * post:
 * summary: Cria uma nova Ordem de Serviço
 * security:
 * - bearerAuth: []
 */
// Repare que passamos o authMiddleware ANTES do controller
// Isso garante que só usuários logados criem ordens
orderRoutes.post("/orders", authMiddleware, controller.create);

// Rota para listar ordens (também protegida)
orderRoutes.get("/orders", authMiddleware, controller.listAll);

export default orderRoutes;