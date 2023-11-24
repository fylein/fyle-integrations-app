import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-onboarding-done',
  templateUrl: './onboarding-done.component.html',
  styleUrls: ['./onboarding-done.component.scss']
})
export class OnboardingDoneComponent implements OnInit {

  @Output() launchIntegrationClick = new EventEmitter();

  constructor() { }

  navigateToDashboard(): void {
    this.launchIntegrationClick.emit();
  }

  ngOnInit(): void {
  }

}
