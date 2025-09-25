import { CSVImportAttributesInvalidResponse, CSVImportAttributesValidResponse } from "../../db/csv-import-attributes.model";
import { Sage50AttributeType } from "../../enum/enum.model";

export interface Sage50AccountingImportDetail {
  attribute_type: Sage50AttributeType;
  last_uploaded_file_name: string | null;
  imported_to_fyle_count: number;
}

export interface Sage50ImportAttributesValidResponse extends CSVImportAttributesValidResponse {
  attribute_type: Sage50AttributeType;
}

export interface Sage50ImportAttributesInvalidResponse extends CSVImportAttributesInvalidResponse {
  error_type:
    | "LIMIT_EXCEEDED"
    | "NO_DATA_PROVIDED"
    | "INVALID_DIMENSION"
    | "ROW_VALIDATION_ERROR"
    | "MISSING_REQUIRED_COLUMN";
}
