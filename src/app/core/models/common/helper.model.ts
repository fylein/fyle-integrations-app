import { FormGroup, Validators } from "@angular/forms";

export class HelperUtility {
    static markControllerAsRequired(form: FormGroup, controllerName: string): void {
        form.controls[controllerName].setValidators(Validators.required);
    }

    static clearValidatorAndResetValue(form: FormGroup, controllerName: string): void {
    form.controls[controllerName].clearValidators();
    form.controls[controllerName].setValue(null);
    }
}