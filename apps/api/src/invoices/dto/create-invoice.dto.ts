import { IsNumber, IsPositive, IsEnum, IsISO8601, IsString } from 'class-validator';
import { InvoiceStatus } from '@prisma/client';

export class CreateInvoiceDto {
  @IsNumber()
  @IsPositive({ message: 'amount must be > 0' })
  amount: number;

  @IsEnum(InvoiceStatus)
  status: InvoiceStatus;

  @IsISO8601()
  date: string;

  @IsString()
  customer: string;
}
