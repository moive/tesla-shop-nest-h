import { Socket } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';

@WebSocketGateway({ cors: true })
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messageWsService: MessageWsService) {}
  handleConnection(client: Socket) {
    this.messageWsService.registerClient(client);
    console.log({ conectados: this.messageWsService.getConnectionClients() });
  }
  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
  }
}
