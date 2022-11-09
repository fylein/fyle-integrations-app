import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss']
})
export class IntegrationsComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
   this.router.navigate(['/integrations/landing']);
  }

}
