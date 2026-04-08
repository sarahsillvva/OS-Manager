import amqp, { ChannelModel, Channel } from "amqplib";

class RabbitMQService {
  private conn!: ChannelModel;
  private channel!: Channel;

  async start(): Promise<void> {
    try {
      this.conn = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
      console.log("RabbitMQ: Conectado!");
      this.channel = await this.conn.createChannel();
      console.log("RabbitMQ: Conectado e canal criado!");
    } catch (error) {
      console.error("Erro ao conectar no RabbitMQ:", error);
      throw error;
    }
  }

  async sendToQueue(queue: string, message: string): Promise<void> {
    if (!this.channel) {
      throw new Error("Canal não inicializado");
    }
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(message));
  }
}
// Exportamos uma instância única (Singleton) para que todo o microsserviço
// utilize a mesma conexão e canal, evitando estouro de conexões no Broker.
export const rabbitMQService = new RabbitMQService();