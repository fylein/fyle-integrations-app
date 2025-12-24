import { Sage50AttributeType } from "../../enum/enum.model";

export const sage50AttributeDisplayNames = {
    JOB: 'Job',
    ITEM: 'Item',
    PHASE: 'Phase',
    VENDOR: 'Vendor',
    EMPLOYEE: 'Employee',
    COST_CODE: 'Cost Code',
    ACCOUNT: 'Chart of accounts'
} satisfies Record<Sage50AttributeType, string>;
