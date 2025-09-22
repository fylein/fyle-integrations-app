import { Sage50AttributeType } from "../../enum/enum.model";

export interface Sage50AccountingImportDetail {
  attribute_type: Sage50AttributeType;
  last_uploaded_file_name: string | null;
  imported_to_fyle_count: number;
}
