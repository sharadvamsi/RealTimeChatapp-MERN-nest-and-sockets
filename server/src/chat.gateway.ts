import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors:{
    origin:"*"
}
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  onlineUsers = new Map<string, string>();

  handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);

    socket.on('add-user', (userId: string) => {
      this.onlineUsers.set(userId, socket.id);
    });

    socket.on('send-msg', (data: { to: string, message: string }) => {
      const senderId = socket.id;
      const receiverSocketId = this.onlineUsers.get(data.to);
      
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('msg-recieve', data.message);
        
        
      } else {
        console.log(`User ${data.to} is not online.`);
        
      }
    });
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
    // Remove user from onlineUsers map
    this.onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        this.onlineUsers.delete(key);
      }
    });
  }
}
