import { Injectable, NotFoundException } from '@nestjs/common';
import { PersistenceService } from '../shared/persistence/persistence.service';
import { Receipt } from './models/receipt.interface';
import { map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { createNewId } from '../shared/utils/id.util';
import {
  getItemDescriptionPoints,
  getItemPairPoints,
  getOddDayPoints,
  getRetailerNamePoints,
  getTimeBetween2And4PMPoints,
  getTotalPriceIsMultipleOfPoints,
  getTotalPriceIsRoundPoints,
} from '../shared/utils/points.util';
import { sum } from '../shared/utils/func.util';

@Injectable()
export class ReceiptService {
  constructor(private readonly persistenceService: PersistenceService) {}

  processReceipt(receipt: Receipt): Observable<string> {
    return of(createNewId()).pipe(
      tap((id) => this.persistenceService.setItem(id, receipt)),
    );
  }

  getPoints(id: string): Observable<number> {
    return of(this.persistenceService.getItem<Receipt>(id)).pipe(
      switchMap((receipt) =>
        !receipt
          ? throwError(
              () => new NotFoundException(`No receipt for id ${id} found`),
            )
          : of({
              receipt,
              totalPriceFloat: parseFloat(receipt.total),
            }).pipe(
              map(
                ({
                  receipt: { items, retailer, purchaseDate, purchaseTime },
                  totalPriceFloat,
                }) =>
                  sum(
                    getRetailerNamePoints(retailer),
                    getTotalPriceIsRoundPoints(totalPriceFloat),
                    getTotalPriceIsMultipleOfPoints(totalPriceFloat),
                    getItemPairPoints(items),
                    getItemDescriptionPoints(items),
                    getOddDayPoints(purchaseDate),
                    getTimeBetween2And4PMPoints(purchaseTime),
                  ),
              ),
            ),
      ),
    );
  }
}
