import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { EventsService } from './core/services/core/events.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private eventsService: EventsService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) { }

  closeToast(): void {
    this.messageService.clear('');
  }

  ngOnInit(): void {
    this.eventsService.receiveEvent();
    this.primengConfig.ripple = true;
  }
}
