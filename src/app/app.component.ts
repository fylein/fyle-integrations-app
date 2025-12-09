import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EventsService } from './core/services/common/events.service';
import { brandingStyle } from './branding/branding-config';
import { NavigationEnd, Router } from '@angular/router';
import { PrimeNG } from 'primeng/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  readonly brandingStyle = brandingStyle;

  constructor(
    private eventsService: EventsService,
    private messageService: MessageService,
    private primengConfig: PrimeNG,
    private router: Router,
  ) {}

  closeToast(): void {
    this.messageService.clear('');
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        (window as any).Appcues && (window as any).Appcues.page();
      }
    });
    this.eventsService.receiveEvent();
    this.primengConfig.ripple.set(true);
  }
}
