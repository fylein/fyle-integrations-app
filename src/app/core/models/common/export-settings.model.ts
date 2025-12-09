import { DestinationOptionKey } from '../enum/enum.model';

export type ExportSettingValidatorRule = {
  reimbursableExpense: string[];
  creditCardExpense: string[];
};

export type ExportModuleRule = {
  formController: string;
  requiredValue: Record<string, string[]>;
};

export type ExportSettingOptionSearch = {
  searchTerm: string;
  destinationAttributes: any[];
  destinationOptionKey: DestinationOptionKey;
  formControllerName: string;
};
