import { Injectable } from '@angular/core';
import { MinimalUser } from '../../models/db/user.model';
import { StorageService } from '../core/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private storageService: StorageService
  ) { }

  storeUserProfile(userProfile: MinimalUser, key: string = 'user'): void {
    this.storageService.set(key, userProfile);
  }

  getUserProfile(key: string = 'user'): MinimalUser {
    return this.storageService.get(key);
  }
}
