import { brandingContent } from "src/app/branding/branding-config";
import { DefaultDestinationAttribute, DestinationAttribute } from "../db/destination-attribute.model";
import { DestinationOptionKey, ExpenseGroupingFieldOption, ExportDateType, FundSource, IntacctCorporateCreditCardExpensesObject, IntacctExportSettingDestinationOptionKey, IntacctReimbursableExpensesObject, NetsuiteExportSettingDestinationOptionKey, QboExportSettingDestinationOptionKey, SplitExpenseGrouping } from "../enum/enum.model";
import { SelectFormOption } from "./select-form-option.model";
import { AbstractControl } from "@angular/forms";
import { ExportSettingsService } from "../../services/common/export-settings.service";

export type ExportSettingValidatorRule = {
    reimbursableExpense: string[];
    creditCardExpense: string[];
};

export type ExportModuleRule = {
    formController: string,
    requiredValue: Record<string, string[]>
};

export type ExportSettingOptionSearch = {
  searchTerm: string,
  destinationAttributes: any[],
  destinationOptionKey: DestinationOptionKey,
  formControllerName: string,
};