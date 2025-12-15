import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'app-dynamic-dialog',
    imports: [DialogComponent],
    templateUrl: './dynamic-dialog.component.html',
    styleUrl: './dynamic-dialog.component.scss'
})
export class DynamicDialogComponent {

  constructor(
    public config: DynamicDialogConfig,
    public dialogRef: DynamicDialogRef
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
