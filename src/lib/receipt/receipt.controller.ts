import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Receipt } from './models/receipt.interface';
import { ReceiptService } from './receipt.service';
import { map } from 'rxjs';

@Controller('receipts')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post('process')
  processReceipt(@Body() receipt: Receipt) {
    return this.receiptService
      .processReceipt(receipt)
      .pipe(map((id) => ({ id })));
  }

  @Get(':id/points')
  getPoints(@Param('id') id: string) {
    return this.receiptService.getPoints(id).pipe(
      map((points) => ({
        points,
      })),
    );
  }
}
