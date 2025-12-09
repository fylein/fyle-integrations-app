import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { brandingConfig } from './branding/branding-config';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = new HttpClient(inject(HttpBackend));

  private deepMerge(target: Translation, source: Translation): Translation {
    const result = { ...target };

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (
          key in result &&
          typeof result[key] === 'object' &&
          result[key] !== null &&
          !Array.isArray(result[key]) &&
          typeof source[key] === 'object' &&
          source[key] !== null &&
          !Array.isArray(source[key])
        ) {
          // Deep merge nested objects
          result[key] = this.deepMerge(result[key], source[key]);
        } else if (!(key in result)) {
          // Only add new keys, don't override existing ones
          result[key] = source[key];
        }
      }
    }

    return result;
  }

  getTranslation(lang: string): Observable<Translation> {
    const brandId = brandingConfig.brandId;
    return forkJoin({
      brandSpecificContent: this.http.get<Translation>(`./assets/i18n/${brandId}/${lang}.json`),
      app: this.http.get<Translation>(`./assets/i18n/${lang}.json`),
    }).pipe(map(({ brandSpecificContent, app }) => this.deepMerge(brandSpecificContent, app)));
  }
}
