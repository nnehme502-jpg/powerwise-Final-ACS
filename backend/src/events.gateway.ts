import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
@WebSocketGateway({
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" },
})
export class EventsGateway {
  @WebSocketServer() server: Server;
  @SubscribeMessage("join") join(
    @MessageBody() userId: number,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(`user:${userId}`);
  }
  emitToUser(userId: number, event: string, payload: any) {
    this.server?.to(`user:${userId}`).emit(event, payload);
  }
}
