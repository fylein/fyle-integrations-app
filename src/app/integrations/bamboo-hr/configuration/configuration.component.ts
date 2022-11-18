import { Component, OnInit } from '@angular/core';
import { FrequencyFormOption } from 'src/app/core/models/bamboo-hr/bamboo-hr.model';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  frequencyIntervals: FrequencyFormOption[] = [...Array(24).keys()].map(day => {
    return {
      label: (day + 1) === 1 ? (day + 1) + ' Hour' : (day + 1) + ' Hours',
      value: day + 1
    };
  });

  emails: string[] = ['ashwin.t@fyle.in', 'hello@ashwin.com', 'hey@ashwin.com'];

  constructor() { }

  ngOnInit(): void {
  }

}
