import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WindowService } from '../core/services/core/window.service';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss']
})
export class IntegrationsComponent implements OnInit {

  windowReference: Window;

  constructor(
    private router: Router,
    private windowService: WindowService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private setupPage(): void {
    const pathName = this.windowReference.location.pathname;
    if (pathName === '/integrations') {
      this.router.navigate(['/integrations/landing']);
    }
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
