import { Component, Input, OnInit } from '@angular/core';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-zero-state-with-illustration',
  templateUrl: './zero-state-with-illustration.component.html',
  styleUrls: ['./zero-state-with-illustration.component.scss']
})
export class ZeroStateWithIllustrationComponent implements OnInit {

  @Input() mainText: string;

  @Input() subText: string;

  illustrationsAllowed: boolean = brandingFeatureConfig.illustrationsAllowed;

  constructor() { }

  ngOnInit(): void {
  }

}
