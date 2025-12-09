import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CSVError } from '../../models/common/csv-error.model';
import Papa from 'papaparse';

@Injectable({
  providedIn: 'root',
})
export class CsvJsonTranslatorService {
  constructor() {}

  /**
   * Validates and converts CSV content to JSON format using Observable pattern
   * @param file - The CSV file
   * @param options - The options for the CSV to JSON conversion
   * @param options.rowLimit - The maximum number of rows the CSV file can have
   * @returns Observable<any> - Parsed JSON data
   */
  csvToJson(file: File, options: { rowLimit?: number } = {}): Observable<any> {
    return new Observable((observer) => {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        throw new CSVError('FILE_IS_NOT_CSV', `File ${file.name} is not a CSV file`);
      }

      if (file.size > 15_000_000) {
        observer.error(new CSVError('FILE_SIZE_EXCEEDED', `File size exceeded: ${file.size} > 15000000`));
        return;
      }

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: (column) => column === 'Account Type',
        complete: (results) => {
          if (options.rowLimit && results.data.length > options.rowLimit) {
            observer.error(
              new CSVError('ROW_LIMIT_EXCEEDED', `Row limit exceeded: ${results.data.length} > ${options.rowLimit}`),
            );
            return;
          }
          observer.next(results.data);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

  /**
   * Converts JSON data to CSV format
   * @param jsonData - The JSON data to convert
   * @returns Promise resolving to CSV string
   */
  jsonToCsv(jsonData: any): string {
    return Papa.unparse(jsonData);
  }
}
