import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { brandingConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-mandatory-error-message',
  templateUrl: './mandatory-error-message.component.html',
  styleUrls: ['./mandatory-error-message.component.scss']
})
export class MandatoryErrorMessageComponent implements OnInit {

  @Input() listName: string;

  @Input() customErrorMessage: string;

  readonly brandingConfig = brandingConfig;

  constructor() { }

  ngOnInit(): void {
    if (this.listName) {
      const vowels = ['a', 'e', 'i', 'o', 'u'];
      if (this.listName.search('how') !== -1) {
        this.listName = this.listName;
      } else if (vowels.indexOf(this.listName[0].toLowerCase()) === -1) {
        this.listName = `a ${this.listName}`;
      } else {
        this.listName = `an ${this.listName}`;
      }
    }
  }

}
