import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-configuration-step-footer',
  templateUrl: './configuration-step-footer.component.html',
  styleUrls: ['./configuration-step-footer.component.scss']
})
export class ConfigurationStepFooterComponent implements OnInit {

  @Input() ctaText: string;

  @Input() isButtonDisabled: boolean;

  @Input() showBackButton: boolean;

  @Output() save = new EventEmitter();

  @Output() navigateToPreviousStep = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  navigate(): void {
    this.navigateToPreviousStep.emit();
  }

  saveChanges(): void {
    this.save.emit();
  }

}
