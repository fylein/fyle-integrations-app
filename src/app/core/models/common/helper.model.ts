import { FormGroup, Validators } from "@angular/forms";

export type checkBoxEvent = {
    id: number;
    value: boolean;
}

export class HelperUtility {
    static markControllerAsRequired(form: FormGroup, controllerName: string): void {
        form.controls[controllerName].setValidators(Validators.required);
    }

    static clearValidatorAndResetValue(form: FormGroup, controllerName: string): void {
        form.controls[controllerName].clearValidators();

        // Temporary hack: Don't reset value for fields that are used in reimbursable + ccc section
        if (controllerName !== 'accountsPayable' && controllerName !== 'defaultCCCAccount' && controllerName !== 'bankAccount' && controllerName !== 'creditCardAccount' && controllerName !== 'defaultCreditCardVendor' && controllerName !== 'nameInJournalEntry' && controllerName !== 'exportScheduleFrequency') {
            form.controls[controllerName].setValue(null);
        }
    }
}
