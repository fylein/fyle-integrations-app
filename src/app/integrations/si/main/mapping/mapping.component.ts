import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { FyleField } from 'src/app/core/models/enum/enum.model';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit {

  isLoading: boolean;

  mappingPages: MenuItem[] = [
    {label: 'TestMapping', routerLink: '/integrations/intacct/main/mapping/test_mapping/EMPLOYEE'},   
    {label: 'Employee', routerLink: '/integrations/intacct/main/mapping/employee_mapping'},
    {label: 'Category', routerLink: '/integrations/intacct/main/mapping/test_mapping/CATEGORY'}
  ];

  activeModule: MenuItem;

  constructor(
    private router: Router,
    private mappingService: SiMappingsService
  ) { }

  private setupPages(): void {
    this.isLoading = true;
    this.mappingService.getMappingSettings().subscribe((response) => {
      if (response.results && Array.isArray(response.results)) {
        response.results.forEach((item) => {
          if (item.source_field!==FyleField.EMPLOYEE && item.source_field!=='CATEGORY') {
          this.mappingPages.push({
            label: new TitleCasePipe().transform(new SnakeCaseToSpaceCasePipe().transform(item.source_field)),
            routerLink: `/integrations/intacct/main/mapping/${item.source_field.toLowerCase()}`
          });
        }
        });
      }
      this.router.navigateByUrl(this.mappingPages[0].routerLink);
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.activeModule = this.mappingPages[0];
    this.setupPages();
  }

}
