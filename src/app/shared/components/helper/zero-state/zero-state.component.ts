import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-zero-state',
  templateUrl: './zero-state.component.html',
  styleUrls: ['./zero-state.component.scss']
})
export class ZeroStateComponent implements OnInit {

  @Input() zeroStateImageURL: string;

  @Input() zeroStateCaption: string;

  constructor() { }

  ngOnInit(): void {
  }

}
