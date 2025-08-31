import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceStatus } from '@prisma/client';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  list(status?: InvoiceStatus) {
    return this.prisma.invoice.findMany({
      where: status ? { status } : undefined,
      orderBy: { date: 'desc' }
    });
  }

  async create(dto: CreateInvoiceDto) {
    const invoice = await this.prisma.invoice.create({
      data: {
        amount: dto.amount,
        status: dto.status,
        date: new Date(dto.date),
        customer: dto.customer
      }
    });
    return invoice;
  }
}
