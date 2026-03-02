import { Observable } from "rxjs";
import { Sage50AttributeType } from "../enum/enum.model";

/** Maps each app that supports CSV import to its attribute type. */
export interface CSVImportAttributeTypeMap {
  SAGE50: Sage50AttributeType;
}

/** Union of all app names that support CSV import. */
export type CSVAppName = keyof CSVImportAttributeTypeMap;

/** Resolve attribute type for a given app. E.g. CSVImportAttributeTypeForApp<'SAGE50'> → Sage50AttributeType */
export type CSVImportAttributeTypeForApp<A extends CSVAppName> = CSVImportAttributeTypeMap[A];

export interface CSVImportAttributesValidResponse {
  file_name: string;
  data: any[];
}

export interface CSVImportAttributesInvalidResponse {
  columns: string[];
  errors: {
    error: string;
    [key: string]: string;
  }[];
}

/** Base interface for CSV import attributes services. */
export interface CSVImportAttributesService<AppName extends CSVAppName> {
  importAttributes(
    attributeType: CSVImportAttributeTypeForApp<AppName>,
    fileName: string,
    jsonData: any
  ): Observable<CSVImportAttributesValidResponse>;
}