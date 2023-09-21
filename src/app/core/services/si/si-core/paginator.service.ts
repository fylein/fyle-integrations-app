import { Injectable } from "@angular/core";
import { StorageService } from "../../core/storage.service";
import { Paginator } from "src/app/core/models/si/misc/paginator.model";
import { PaginatorPage } from "src/app/core/models/enum/enum.model";



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
