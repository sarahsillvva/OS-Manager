import Order, { IOrder } from "../entities/Order";
import { rabbitMQService } from "../services/RabbitMQService";

export class OrderService {

  async createOrder(data: any) {
    const order = new Order(data);
    await order.save();
    // Publicando o evento 
    await rabbitMQService.start();
    await rabbitMQService.sendToQueue("orders_queue", JSON.stringify(order));    
    return order;
}

  async getAllOrders(): Promise<IOrder[]> {
    return await Order.find().sort({ createdAt: -1 }); // Mais recentes primeiro
  }

  async getOrderById(id: string): Promise<IOrder | null> {
    return await Order.findById(id);
  }
}