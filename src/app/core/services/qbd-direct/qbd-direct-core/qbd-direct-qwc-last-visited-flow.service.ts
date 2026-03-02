import { Injectable } from '@angular/core';
import { StorageService } from '../../common/storage.service';
import { QwcRegenerationFlowType } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-qwc-file.model';

@Injectable({
  providedIn: 'root'
})
export class QbdDirectQwcLastVisitedFlowService {

  constructor(
    private storageService: StorageService
  ) { }

  get(): QwcRegenerationFlowType {
    return this.storageService.get('qwc-last-visited-flow') || QwcRegenerationFlowType.NEW;
  }

  set(flow: QwcRegenerationFlowType): void {
    this.storageService.set('qwc-last-visited-flow', flow);
  }
}
