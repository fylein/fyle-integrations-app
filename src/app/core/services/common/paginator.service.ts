import { Injectable } from '@angular/core';
import type { StorageService } from './storage.service';
import type { PaginatorPage } from '../../models/enum/enum.model';
import type { Paginator } from "src/app/core/models/misc/paginator.model";

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {

  constructor(private storageService: StorageService) { }

  getPageSize(module: PaginatorPage): Paginator {
    const defaultPageSize = 50;

    return {
      limit: this.storageService.get(`page-size.${module}`) || defaultPageSize,
      offset: 0
    };
  }

  storePageSize(module: PaginatorPage, pageSize: number): void {
    this.storageService.set(`page-size.${module}`, pageSize);
  }
}
