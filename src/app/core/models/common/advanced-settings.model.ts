export type EmailOption = {
    email: string;
    name: string;
};

export type ConditionField = {
  field_name: string;
  type: string;
  is_custom: boolean;
};

export enum Operator {
  IsNull = "isnull",
  IExact = "iexact",
  IContains = "icontains",
  LessThan = "lt",
  LessThanOrEqual = "lte"
}

export const JoinOptions = {
  AND: 'AND',
  OR: 'OR'
};

export enum JoinOption {
  AND = "AND",
  OR = "OR"
}

export enum CustomOperatorOption {
  Is = "iexact",
  IsEmpty = "is_empty",
  IsNotEmpty = "is_not_empty"
}

export type SkipExport = {
    id?: number;
    condition: string;
    custom_field_type: any;
    operator: Operator.IsNull | Operator.IExact | Operator.IContains | Operator.LessThan | Operator.LessThanOrEqual;
    values: string[];
    rank: number;
    join_by: JoinOption.AND | JoinOption.OR | null;
    is_custom: boolean;
};

export type ExpenseFilter = {
    condition: string,
    operator: string,
    values: string | string[]
    rank: number,
    join_by: string | null,
    is_custom: boolean,
    custom_field_type: string | null
};

export interface ExpenseFilterResponse extends ExpenseFilter {
    id: number,
    created_at: Date,
    update_at: Date,
    workspace: number
}

export type ExpenseFilterGetResponse = {
    count: number,
    next: string | null,
    previous: string | null,
    results: ExpenseFilterResponse[]
};
