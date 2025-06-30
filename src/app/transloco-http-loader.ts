import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { brandingConfig } from './branding/branding-config';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = new HttpClient(inject(HttpBackend));

  getTranslation(lang: string): Observable<Translation> {
    const brandId = brandingConfig.brandId;
    return forkJoin({
      brandSpecificContent: this.http.get<Translation>(`./assets/i18n/${brandId}/${lang}.json`),
      app: this.http.get<Translation>(`./assets/i18n/${lang}.json`)
    }).pipe(map(({brandSpecificContent, app}) => ({
      ...brandSpecificContent,
      ...app
    })));
  }
}
