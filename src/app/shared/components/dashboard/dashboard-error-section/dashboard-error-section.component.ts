import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-error-section',
  templateUrl: './dashboard-error-section.component.html',
  styleUrls: ['./dashboard-error-section.component.scss']
})
export class DashboardErrorSectionComponent implements OnInit {

  @Input() isLoading: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
