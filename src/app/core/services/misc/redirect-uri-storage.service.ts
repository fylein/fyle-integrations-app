import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RedirectUriStorageService {
  private _redirect_uri: string | undefined;

  constructor() {}

  set(redirect_uri?: string) {
    this._redirect_uri = redirect_uri;
  }

  pop() {
    const redirect_uri = this._redirect_uri;
    this._redirect_uri = undefined;
    return redirect_uri;
  }
}
