import { Server, Socket } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { MessageWsService } from './message-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    // console.log({ token });
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      client.disconnect();
      return;
    }

    console.log({ payload });

    this.messageWsService.registerClient(client);
    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectionClients(),
    );
  }
  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);

    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectionClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  onMessageFrontClient(client: Socket, payload: NewMessageDto) {
    // console.log(client.id, payload);

    // !Emite únicamente al cliente
    // client.emit('message-from-server', {
    //   fullName: 'I am!',
    //   message: payload.message ?? 'no message',
    // });

    // !Emitir a todos MENOS, al cliente incial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'I am!',
    //   message: payload.message ?? 'no message',
    // });

    // !Emitir a todos
    this.wss.emit('message-from-server', {
      fullName: 'I am',
      message: payload.message ?? 'no message',
    });
  }
}
