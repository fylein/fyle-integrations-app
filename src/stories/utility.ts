import type { AbstractControl } from '@angular/forms';
import { FormArray, FormGroup, FormRecord } from '@angular/forms';

export const setupStoryBookFormGroup = <TControl extends AbstractControl>(control: TControl): TControl => {
  // @ts-ignore
  delete control._parent;
  if (control instanceof FormGroup || control instanceof FormRecord) {
    for (const childKey of Object.keys(control.controls)) {
      setupStoryBookFormGroup(control.controls[childKey]);
    }
  } else if (control instanceof FormArray) {
    for (const child of control.controls) {
      setupStoryBookFormGroup(child);
    }
  }
  return control;
};
