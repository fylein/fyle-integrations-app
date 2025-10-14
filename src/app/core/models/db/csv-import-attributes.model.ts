import { Observable } from "rxjs";
import { Sage50AttributeType } from "../enum/enum.model";

export type CSVImportAttributeType =
  | Sage50AttributeType;

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

export interface CSVImportAttributesService {
  importAttributes(
    attributeType: CSVImportAttributeType,
    fileName: string,
    jsonData: any
  ): Observable<CSVImportAttributesValidResponse>;
}