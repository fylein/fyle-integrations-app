import { Component, Input, OnInit } from '@angular/core';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-mandatory-error-message',
  templateUrl: './mandatory-error-message.component.html',
  styleUrls: ['./mandatory-error-message.component.scss']
})
export class MandatoryErrorMessageComponent implements OnInit {

  @Input() listName: string;

  @Input() customErrorMessage: string;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(private translocoService: TranslocoService) { }

  ngOnInit(): void {
    if (this.listName) {
      const vowels = ['a', 'e', 'i', 'o', 'u'];
      if (this.listName.search('how') !== -1) {
        this.listName = this.listName;
      } else if (vowels.indexOf(this.listName[0].toLowerCase()) === -1) {
        this.listName = `${this.translocoService.translate('mandatoryErrorMessage.articleA')}${this.listName}`;
      } else {
        this.listName = `${this.translocoService.translate('mandatoryErrorMessage.articleAn')}${this.listName}`;
      }
    }
  }

}
