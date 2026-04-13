import Order, { IOrder } from "../entities/Order";
import { rabbitMQService } from "../services/RabbitMQService";

export class OrderService {

  async createOrder(orderData: any , userData: any) {
    const order = new Order({
        ...orderData,
        technicianId: userData.id 
    });
    await order.save();

    const orderEvent = {
        orderId: order._id || order.id, 
        equipment: order.equipment,
        description: order.description,
        userEmail: order.userEmail,
        technicianId: order.technicianId,
        details: order.details,
        createdAt: order.createdAt,
    };
    // Publicando o evento 
    await rabbitMQService.start();
    await rabbitMQService.sendToQueue("orders_queue", JSON.stringify(orderEvent));    
    return order;
}

  async getAllOrders(): Promise<IOrder[]> {
    return await Order.find().sort({ createdAt: -1 }); // Mais recentes primeiro
  }

  async getOrderById(id: string): Promise<IOrder | null> {
    return await Order.findById(id);
  }
}