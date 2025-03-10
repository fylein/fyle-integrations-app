import { Injectable } from '@angular/core';
import { IframeOrigin } from '../../models/enum/enum.model';

@Injectable({
  providedIn: 'root'
})

/**
 * Keeps track of the page into which the integrations app is being embedded (as an iframe)
 */
export class IframeOriginStorageService {

  constructor() { }

  private _iframeOrigin: IframeOrigin | undefined;

  set(iframeOrigin?: IframeOrigin) {
    this._iframeOrigin = iframeOrigin;
  }

  get() {
    return this._iframeOrigin;
  }
}
