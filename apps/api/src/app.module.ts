import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { InvoicesModule } from './invoices/invoices.module';
import { AuthModule } from './auth/auth.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: { url: process.env.REDIS_URL! }
    }),
    InvoicesModule,
    AuthModule
  ],
  providers: [PrismaService]
})
export class AppModule {}
