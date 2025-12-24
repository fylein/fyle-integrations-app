export type CSVErrorName =
  | 'MULTIPLE_FILES_PROVIDED'
  | 'FILE_IS_NOT_CSV'
  | 'ROW_LIMIT_EXCEEDED'
  | 'FILE_SIZE_EXCEEDED';

export class CSVError extends Error {
  constructor(
    public override name: CSVErrorName,
    public override message: string
  ) {
    super(message);
  }
}