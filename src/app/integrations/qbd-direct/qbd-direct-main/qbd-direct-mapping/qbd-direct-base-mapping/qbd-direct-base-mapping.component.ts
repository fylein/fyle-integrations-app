
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { brandingConfig } from 'src/app/branding/branding-config';
import { FyleField, AppName } from 'src/app/core/models/enum/enum.model';
import { QbdDirectMappingService } from 'src/app/core/services/qbd-direct/qbd-direct-core/qbd-direct-mapping.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-qbd-direct-base-mapping',
    imports: [SharedModule],
    templateUrl: './qbd-direct-base-mapping.component.html',
    styleUrl: './qbd-direct-base-mapping.component.scss'
})
export class QbdDirectBaseMappingComponent implements OnInit {

  readonly AppName = AppName;

  readonly FyleField = FyleField;

  readonly brandingConfig = brandingConfig;

  isLoading: boolean = true;

  sourceField: string;

  handleSearch = (query?: string) => {
    return this.qbdDirectMappingService.updateDestinationOptions(query);
  };

  constructor(
    public qbdDirectMappingService: QbdDirectMappingService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.isLoading = true;
      this.sourceField = decodeURIComponent(this.route.snapshot.params.source_field.toUpperCase());
      this.qbdDirectMappingService.initialize(this.sourceField).subscribe(() => {
        this.isLoading = false;
      });
    });
  }

}
