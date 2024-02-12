import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-netsuite',
  templateUrl: './netsuite.component.html',
  styleUrls: ['./netsuite.component.scss']
})
export class NetsuiteComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('i am her')
  }

}
