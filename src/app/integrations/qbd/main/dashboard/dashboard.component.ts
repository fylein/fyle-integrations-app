import { Component, Input, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  listItems: SelectItem[] = [{label: 'fa fa-user', value: 'v1'}, {label: 'fa fa-user-cog', value: 'v2'}];

  selectedItem: any;

  @Input() options:any;

  first: number = 0;

  cars = [{
    vin: '12',
    year: '2022',
    brand: 'soda',
    color: 'white'
  }, {
    vin: '12',
    year: '2022',
    brand: 'soda',
    color: 'white'
  }, {
    vin: '12',
    year: '2022',
    brand: 'soda',
    color: 'white'
  }, {
    vin: '12',
    year: '2022',
    brand: 'soda',
    color: 'white'
  }, {
    vin: '12',
    year: '2022',
    brand: 'soda',
    color: 'white'
  }];

  constructor() { }

  ngOnInit(): void {
  }

}
