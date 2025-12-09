import { Injectable } from '@angular/core';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class IntegrationsUserService {
  constructor(private storageService: StorageService) {}

  getUserProfile(): MinimalUser {
    return this.storageService.get('user');
  }
}
