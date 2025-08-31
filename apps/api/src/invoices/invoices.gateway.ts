// WebSocket for live counte
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: true } })
export class InvoicesGateway {
  @WebSocketServer() server: Server;

  emitCreated(invoice: any) {
    this.server.emit('invoice.created', { id: invoice.id });
  }
}
