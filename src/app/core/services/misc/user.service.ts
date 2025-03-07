import { Injectable } from '@angular/core';
import { MinimalUser } from '../../models/db/user.model';
import { StorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private storageService: StorageService
  ) { }

  storeUserProfile(userProfile: MinimalUser): void {
    console.log('[x] updating user:', userProfile);
    this.storageService.set('user', userProfile);
  }

  getUserProfile(): MinimalUser {
    return this.storageService.get('user');
  }
}
