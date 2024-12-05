import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideIndexedDb, DBConfig } from 'ngx-indexed-db';

const dbConfig: DBConfig = {
  name: 'AppDatabase',
  version: 1,
  objectStoresMeta: [
    {
      store: 'detectedPrices',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'price', keypath: 'price', options: { unique: false } },
      ],
    },
  ],
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideIndexedDb(dbConfig)
  ],
};
