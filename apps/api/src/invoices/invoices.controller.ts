import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { InvoiceStatus } from '@prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { InvoicesGateway } from './invoices.gateway';

@Controller('api/invoices')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class InvoicesController {
  constructor(
    private readonly invoices: InvoicesService,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    private readonly gateway: InvoicesGateway
  ) {}

  @Get()
  @Roles('admin', 'executive')
  async list(@Query('status') status?: InvoiceStatus) {
    return this.invoices.list(status as InvoiceStatus | undefined);
  }

  @Post()
  @Roles('admin')
  async create(@Body() dto: CreateInvoiceDto) {
    const invoice = await this.invoices.create(dto);
    this.gateway.emitCreated(invoice); // real-time signal
    await this.notificationsQueue.add('notify', {
      type: 'invoice.created',
      payload: { invoice }
    });
    return invoice;
  }
}
