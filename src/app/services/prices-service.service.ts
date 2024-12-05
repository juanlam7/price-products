import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map, Observable } from 'rxjs';

interface IGetPrices {
  id: number;
  price: string;
}

@Injectable({
  providedIn: 'root',
})
export class PricesService {
  constructor(private dbService: NgxIndexedDBService) {}

  savePrices(prices: string[]): void {
    this.dbService.clear('detectedPrices').subscribe({
      next: () => {
        prices.forEach((price) => {
          this.dbService.add('detectedPrices', { price }).subscribe({
            error: (err) => console.error('Error saving price:', err),
          });
        });
      },
      error: (err) => console.error('Error clearing old prices:', err),
    });
  }

  getPrices(): Observable<string[]> {
    return this.dbService
      .getAll<IGetPrices>('detectedPrices')
      .pipe(map((p) => p.map((item) => item.price)));
  }
}
