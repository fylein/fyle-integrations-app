import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-mapping-resolve',
  templateUrl: './dashboard-mapping-resolve.component.html',
  styleUrls: ['./dashboard-mapping-resolve.component.scss']
})
export class DashboardMappingResolveComponent implements OnInit {

  isLoading: boolean = false;

  dummyData = [{ email: 'john.doe@example.com', sageIntacctEmployee: 'John Doe' }];

  @Input() mappingType: string;

  @Input() isDialogVisible: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
