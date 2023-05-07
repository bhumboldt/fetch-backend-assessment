import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReceiptController } from './lib/receipt/receipt.controller';
import { ReceiptService } from './lib/receipt/receipt.service';
import { PersistenceService } from './lib/shared/persistence/persistence.service';

@Module({
  imports: [],
  controllers: [AppController, ReceiptController],
  providers: [AppService, ReceiptService, PersistenceService],
})
export class AppModule {}
