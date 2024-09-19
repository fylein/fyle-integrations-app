import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { MessageService, PrimeNGConfig } from 'primeng/api';
import type { EventsService } from './core/services/common/events.service';

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
