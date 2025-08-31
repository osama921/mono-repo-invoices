import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { InvoicesGateway } from './invoices.gateway';
import { BullModule } from '@nestjs/bullmq';
import { InvoicesProcessor } from './invoices.processor';

@Module({
  imports: [BullModule.registerQueue({ name: 'notifications' })],
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoicesGateway, InvoicesProcessor],
  exports: [InvoicesService]
})
export class InvoicesModule {}
