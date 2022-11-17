import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bamboo-hr',
  templateUrl: './bamboo-hr.component.html',
  styleUrls: ['./bamboo-hr.component.scss']
})
export class BambooHrComponent implements OnInit {

  showDialog: boolean = false;

  constructor() { }

  openDialog(): void {
   this.showDialog = true;
  }

  ngOnInit(): void {
  }

}
