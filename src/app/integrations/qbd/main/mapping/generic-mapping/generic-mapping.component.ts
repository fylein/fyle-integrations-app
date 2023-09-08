import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PaginatorPage, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { Mapping, MappingPost, MappingResponse, MappingStats } from 'src/app/core/models/qbd/db/mapping.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { QbdMappingService } from 'src/app/core/services/qbd/qbd-mapping/qbd-mapping.service';

@Component({
  selector: 'app-generic-mapping',
  templateUrl: './generic-mapping.component.html',
  styleUrls: ['./generic-mapping.component.scss']
})
export class GenericMappingComponent implements OnInit {

  isLoading: boolean;

  mappingState: MappingStats;
  
  mappings: MappingResponse;

  originMapping: MappingResponse;

  sourceType: string;

  limit: number = 10;

  pageNo: number = 0;

  totalCount: number;
  
  selectedMappingFilter: any;

  PaginatorPage = PaginatorPage;

  currentPage: number = 1;
  
  searchValue: string;

  constructor(
    private mappingService: QbdMappingService,
    private route: ActivatedRoute,
    private toastService: IntegrationsToastService,
  ) { }

  private callGetMappings() {
    this.mappingService.getMappings(this.limit, this.pageNo,this.sourceType ,this.selectedMappingFilter).subscribe((qbdMappingResult: MappingResponse) => {
      this.mappings = qbdMappingResult;
      this.totalCount = this.mappings.count;
      this.isLoading = false;
    });
  }

  mappingSeachingFilter(searchValue: string) {
    console.log(searchValue)
    if(searchValue.length > 0) {
      console.log('ed')
      const results: any[] = this.originMapping.results.filter((mapping) => 
        mapping.source_value.toLowerCase().includes(searchValue)
      )
      this.mappings.results = results
    }
    else {
      this.callGetMappings()
    }
    this.totalCount = this.mappings.results.length
    console.log(this.totalCount, 'ds')
  }

  postMapping(mappingPayload: MappingPost) {
    this.mappingService.postMappings(mappingPayload).subscribe(() => {
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Mapping done successfully');
      // this.callGetMappings()
    }, ()=>{
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving the mappings, please try again later');
    })
  }

  offsetChanges(limit: number): void {
    this.isLoading = true;
    this.limit = limit;
    this.pageNo = 0;
    this.currentPage = 1
    this.selectedMappingFilter = this.selectedMappingFilter ? this.selectedMappingFilter : null;
    this.callGetMappings()
  }

  pageChanges(pageNo: number): void {
    this.isLoading = true;
    this.pageNo = pageNo;
    this.currentPage = Math.ceil(this.pageNo / this.limit)+1
    this.selectedMappingFilter = this.selectedMappingFilter ? this.selectedMappingFilter : null;
    this.callGetMappings()
  }

  mappingStateFilter(state: boolean | null): void {
    this.isLoading = true;
    this.selectedMappingFilter = state;
    this.currentPage = 1
    this.callGetMappings()
  }

  setupPage() {
    this.isLoading = true
    this.sourceType = decodeURIComponent(decodeURIComponent(this.route.snapshot.params.source_field));
    forkJoin([
      this.mappingService.getMappingStats(this.sourceType),
      this.mappingService.getMappings(this.limit,this.pageNo,this.sourceType,null)
    ]).subscribe((response) => {
      this.mappingState = response[0]
      this.originMapping = response[1]
      this.mappings = response[1]
      this.totalCount = this.mappings.count
      this.isLoading = false
    })
  }

  ngOnInit(): void {
    this.setupPage()
  }

}
