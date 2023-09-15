import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit {

  isLoading: boolean;

  mappingPages: MenuItem[] = [
    {label: 'Employee', routerLink: '/integrations/intacct/main/mapping/employee_mapping'},
    {label: 'Category', routerLink: '/integrations/intacct/main/mapping/category_mapping'},
  ];

  activeModule: MenuItem;

  constructor(
    private router: Router,
    private mappingService: SiMappingsService
  ) { }

  private snakeToTitleCase(str: string): string {
    return str
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); // Title case
      });
  }

  private setupPages(): void {
    this.isLoading = true;
    this.mappingService.getMappingSettings().subscribe((response) => {
      if (response.results && Array.isArray(response.results)) {
        response.results.forEach((item) => {
          this.mappingPages.push({
            label: this.snakeToTitleCase(item.source_field),
            routerLink: '/integrations/intacct/main/mapping/generic_mapping'
          });
        });
      }
    });
    this.isLoading = false;
  }  

  ngOnInit(): void {
    this.activeModule = this.mappingPages[0];
    this.router.navigateByUrl(this.mappingPages[0].routerLink);
    this.setupPages();
    console.log(this.mappingPages);
  }

}
