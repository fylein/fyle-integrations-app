import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {

  @Output() openDialog = new EventEmitter<void>();

  @Input() isBambooConnected: boolean = false;

  @Input() isRecipeActive: boolean = false;

  @Input() isBambooSetupInProgress: boolean;

  constructor() { }

  connectBambooHR(): void {
    this.openDialog.emit();
  }

  disconnectBambooHR(): void {
    // TODO
  }

  ngOnInit(): void {
  }

}
