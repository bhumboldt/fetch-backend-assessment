import { Injectable } from '@nestjs/common';

@Injectable()
export class PersistenceService {
  private db = {};

  getItem<T>(id: string): T {
    return this.db[id];
  }

  setItem<T>(id: string, item: T): void {
    this.db[id] = item;
  }
}
