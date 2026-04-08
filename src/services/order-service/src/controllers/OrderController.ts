import { Request, Response } from "express";
import { OrderService } from "../services/OrderService";
import { rabbitMQService } from "../services/RabbitMQService";

export class OrderController {
  constructor(private orderService: OrderService) {}

  create = async (req: Request, res: Response) => {
    try {
      const { equipment, description, details } = req.body;
      const technicianId = (req as any).user.id;
      console.log(equipment, description, details, technicianId);
      const order = await this.orderService.createOrder({
        equipment,
        description,
        technicianId,
        details
      });
      // Após salvar no banco, enviamos para a fila. 
      // Isso permite que outros serviços (como o de notificações que será implementado) reajam a esse evento
      // de forma assíncrona, sem travar a resposta para o usuário.
      await rabbitMQService.sendToQueue("orders_queue", JSON.stringify(order));

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