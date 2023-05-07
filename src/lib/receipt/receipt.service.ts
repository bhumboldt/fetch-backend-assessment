import { Injectable } from '@nestjs/common';
import { PersistenceService } from '../shared/persistence/persistence.service';
import { Receipt } from './models/receipt.interface';
import { map, Observable, of, tap } from 'rxjs';
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
import { add } from '../shared/utils/func.util';
import { MOMENT_HOURS_MINUTES_FORMAT } from '../shared/utils/constants.util';
import { getMoment } from '../shared/utils/time.util';

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
      map((receipt) => ({
        receipt,
        totalPriceFloat: parseFloat(receipt.total),
      })),
      map(
        ({
          receipt: { items, retailer, purchaseDate, purchaseTime },
          totalPriceFloat,
        }) =>
          add(
            getRetailerNamePoints(retailer),
            getTotalPriceIsRoundPoints(totalPriceFloat),
            getTotalPriceIsMultipleOfPoints(totalPriceFloat),
            getItemPairPoints(items),
            getItemDescriptionPoints(items),
            getOddDayPoints(getMoment(purchaseDate)),
            getTimeBetween2And4PMPoints(
              getMoment(purchaseTime, MOMENT_HOURS_MINUTES_FORMAT),
            ),
          ),
      ),
    );
  }
}
