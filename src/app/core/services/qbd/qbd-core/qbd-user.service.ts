import { Injectable } from '@angular/core';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { StorageService } from '../../core/storage.service';

@Injectable({
  providedIn: 'root'
})
export class QbdUserService {

  constructor(
    private storageService: StorageService
  ) { }

  qbdGetUserProfile(): MinimalUser {
    return this.storageService.get('user');
  }
}
