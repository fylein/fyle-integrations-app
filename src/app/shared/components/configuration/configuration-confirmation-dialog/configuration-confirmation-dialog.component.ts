import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-configuration-confirmation-dialog',
  templateUrl: './configuration-confirmation-dialog.component.html',
  styleUrls: ['./configuration-confirmation-dialog.component.scss']
})
export class ConfigurationConfirmationDialogComponent implements OnInit {

  @Input() showDependentFieldWarning: any;

  @Input() headerText: string;

  @Input() contextText: string;

  @Input() iconPath: string;

  @Input() confirmBtnText: string;

  @Output() confirmationClick = new EventEmitter<boolean>();

  constructor() { }

  acceptDependentFieldWarning(arg0: boolean) {
    this.confirmationClick.emit(arg0);
  }



  ngOnInit(): void {
  }

}
