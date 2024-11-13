import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { brandingConfig } from 'src/app/branding/branding-config';
import { ConfigurationWarningEvent } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';

@Component({
  selector: 'app-configuration-confirmation-dialog',
  templateUrl: './configuration-confirmation-dialog.component.html',
  styleUrls: ['./configuration-confirmation-dialog.component.scss']
})
export class ConfigurationConfirmationDialogComponent implements OnInit {

  @Input() isWarningVisible: boolean;

  @Input() headerText: string;

  @Input() contextText: string;

  @Input() confirmBtnText: string;

  @Input() showSecondaryCTA: boolean = true;

  @Input() event: ConfigurationWarningEvent;

  @Output() warningAccepted = new EventEmitter<ConfigurationWarningOut>();

  readonly brandingConfig = brandingConfig;

  constructor() { }

  acceptWarning(isWarningAccepted: boolean) {
    this.warningAccepted.emit({hasAccepted: isWarningAccepted, event: this.event});
  }

  ngOnInit(): void {
  }

}
