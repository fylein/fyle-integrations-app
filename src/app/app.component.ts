import { Component, OnInit } from '@angular/core';
import { EventsService } from './core/services/core/events.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private eventsService: EventsService
  ) { }

  ngOnInit(): void {
    this.eventsService.receiveEvent();
  }
}
