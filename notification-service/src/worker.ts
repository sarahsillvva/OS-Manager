import amqp from 'amqplib';
import * as dotenv from 'dotenv'; // 1. Importe o dotenv

dotenv.config();

async function consumeMessages() {
  try {
    const rabbitUrl = process.env.RABBITMQ_URL ;
    if (!rabbitUrl) {
        console.error(" ERRO: RABBITMQ_URL não definida no .env do Worker.");
        process.exit(1);
    }
    console.log(` [*] Tentando conectar ao RabbitMQ em: ${rabbitUrl}`);
    const connection = await amqp.connect(rabbitUrl);   
    const channel = await connection.createChannel();

    const queue = 'orders_queue';
    await channel.assertQueue(queue, { durable: true });

    // Define que o worker só recebe uma mensagem por vez (fair dispatch)
    channel.prefetch(1);

    console.log(` [*] Aguardando mensagens em ${queue}. Para sair use CTRL+C`);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const orderData = JSON.parse(msg.content.toString());
        
        console.log(" -----------------------------------------");
        console.log(" [x] NOVA ORDEM RECEBIDA");
        console.log(` [x] OS ID: ${orderData.orderId}`);
        console.log(` [x] Equipamento: ${orderData.equipment}`);
        console.log(` [x] Descrição: ${orderData.description}`);
        console.log(` [x] TecnicoId: ${orderData.technicianId}`);
        console.log(` [x] Email: ${orderData.userEmail}`);
        console.log(" -----------------------------------------");
        
        // Confirma o processamento (Ack) para o RabbitMQ remover da fila
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Erro no Consumidor:", error);
  }
}

consumeMessages();