import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  // Having any here is okay, since we store different types of data in localstorage
  set(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Having any here is okay, since we get different types of data in localstorage
  get(key: string) {
    const stringifiedItem = localStorage.getItem(key);
    return stringifiedItem ? JSON.parse(stringifiedItem) : null;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
