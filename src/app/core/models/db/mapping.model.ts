import { ExpenseAttributeDetail } from "./expense-attribute.model";

export type IntegrationField = {
    attribute_type: string,
    display_name: string
}

export type FyleField = {
    attribute_type: string,
    display_name: string,
    is_dependent: boolean
}