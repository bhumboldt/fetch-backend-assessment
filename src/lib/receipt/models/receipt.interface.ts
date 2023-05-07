import { ReceiptItem } from './receipt-item.interface';

export interface Receipt {
  retailer: string;
  purchaseDate: string;
  purchaseTime: string;
  items: ReceiptItem[];
  total: string;
}
