import { Request, Response } from "express";
import { OrderService } from "../services/OrderService";

export class OrderController {
  constructor(private orderService: OrderService) {}

  create = async (req: Request, res: Response) => {
    try {
      const order = await this.orderService.createOrder(req.body);
      return res.status(201).json(order);
    } catch (error) {
      return res.status(500).json({ 
        message: "Erro ao criar OS", 
        error: error instanceof Error ? error.message : error 
      });
    }
  }

  // Também transforme o listAll para evitar o mesmo erro depois
  listAll = async (req: Request, res: Response) => {
    try {
      const orders = await this.orderService.getAllOrders();
      return res.json(orders);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao listar OS" });
    }
  }
}