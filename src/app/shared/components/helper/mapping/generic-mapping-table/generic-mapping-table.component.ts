import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { DropdownFilterOptions } from 'primeng/dropdown';
import { Observable, Subject, debounceTime } from 'rxjs';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ExtendedGenericMapping } from 'src/app/core/models/db/extended-generic-mapping.model';
import { GenericMapping, MappingClass } from 'src/app/core/models/db/generic-mapping.model';
import { MappingStats } from 'src/app/core/models/db/mapping.model';
import { AppName, IntacctCorporateCreditCardExpensesObject, FyleField, IntacctReimbursableExpensesObject, ToastSeverity, QBOCorporateCreditCardExpensesObject, QboExportSettingDestinationOptionKey } from 'src/app/core/models/enum/enum.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-generic-mapping-table',
  templateUrl: './generic-mapping-table.component.html',
  styleUrls: ['./generic-mapping-table.component.scss']
})
export class GenericMappingTableComponent implements OnInit {

  @Input() isLoading: boolean;

  @Input() appName: AppName;

  @Input() filteredMappings: ExtendedGenericMapping[];

  @Input() sourceField: string;

  @Input() sourceFieldDisplayName?: string;

  @Input() mappingStats: MappingStats;

  @Input() destinationField: string;

  @Input() destinationFieldDisplayName?: string;

  @Input() employeeFieldMapping: FyleField;

  @Input() reimbursableExpenseObject?: IntacctReimbursableExpensesObject;

  @Input() cccExpenseObject?: IntacctCorporateCreditCardExpensesObject;

  @Input() destinationOptions: DestinationAttribute[];

  @Input() isDashboardMappingResolve: boolean;

  @Input() displayName: string | undefined;

  @Input() isMultiLineOption: boolean = false;

  @Input() detailAccountType: string[] | undefined;

  @Input() destinationAttributes?: string | string[];

  @Input() searchHandler?: (query?: string) => Observable<void>;

  private searchSubject = new Subject<string>();

  searchQuery: string;

  isSearching: boolean;

  form: FormGroup = new FormGroup({
    searchOption: new FormControl('')
  });

  isSearchFocused: boolean;

  uiExposedAppName: string;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  optionSearchUpdate = new Subject<{searchTerm: string}>();

  @ViewChild('filterInput') filterInput!: ElementRef;

  private optionsMap: {[key: string]: boolean} = {};

  constructor(
    private mappingService: MappingService,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    public helper: HelperService,
    private translocoService: TranslocoService
  ) { }

  clearSearch($event: Event) {
    this.form.controls.searchOption.reset();
  }

  isOverflowing(element: any, mapping: DestinationAttribute): string {
    return element.offsetWidth < element.scrollWidth ? mapping.value : '';
  }

  tableDropdownWidth() {
    const element = document.querySelector('.p-dropdown-panel.p-component.ng-star-inserted') as HTMLElement;
    if (element) {
      element.style.width = '300px';
      if (this.isDashboardMappingResolve) {
        element.style.left = '700px';
      }
      setTimeout(() => {
        this.filterInput.nativeElement.focus();
    }, 0);
    }
  }

  constructDestinationOptions() {
    const mappingType:string = this.filteredMappings.flatMap(mapping =>
      Object.keys(mapping).filter(key => key.includes('mapping'))
    )[0];

    this.filteredMappings.forEach((data: any) => {
      const mapping = data[mappingType];
      if (mapping && mapping.length > 0) {
        const mappingDestinationKey = this.getMappingDestinationKey(data);
        const destinationAttribute = mapping[0][mappingDestinationKey];
        if (destinationAttribute && (this.isMultiLineOption || !this.destinationOptions.some((map: any) => map.value === destinationAttribute.value))) {
          // Prevent duplicates by checking value and code combination
          const isDuplicate = this.destinationOptions.some((map: any) =>
            map.value === destinationAttribute.value && map.code === destinationAttribute.code
          );
          if (!isDuplicate) {
            this.destinationOptions.push(destinationAttribute);
          }
        }
      }
    });

    this.sortDropdownOptions();

    this.destinationOptions.forEach((option) => {
      this.optionsMap[option.id.toString()] = true;
    });
  }

  sortDropdownOptions() {
    this.destinationOptions.sort((a, b) => a.value.localeCompare(b.value));
  }

  optionSearchWatcher() {
    this.optionSearchUpdate.pipe(
      debounceTime(1000)
      ).subscribe((event: any) => {
        if (this.searchHandler !== undefined) {
          this.searchHandler(event.searchTerm).subscribe(() => {
            this.isSearching = false;
          });
          return;
        }
        const existingOptions = this.destinationOptions.concat();
        const newOptions: DestinationAttribute[] = [];
        this.destinationAttributes ||= this.destinationField;

        this.mappingService.getPaginatedDestinationAttributes(this.destinationAttributes, event.searchTerm, this.displayName, this.appName, this.detailAccountType).subscribe((response) => {
          response.results.forEach((option) => {
            // If option is not already present in the list, add it
            if (!this.optionsMap[option.id.toString()]) {
              this.optionsMap[option.id.toString()] = true;
              newOptions.push(option);
            }
          });

          this.destinationOptions = existingOptions.concat(newOptions);
          this.sortDropdownOptions();
          this.isSearching = false;
        });
      }
    );
  }

  searchOptions(event: any) {
    if (event.filter) {
      this.isSearching = true;
      this.optionSearchUpdate.next({searchTerm: (event.filter as string).trim()});
    }
  }

  getMappingDestinationKey(genericMapping: ExtendedGenericMapping) {
    if (genericMapping.employeemapping?.length) {
      if (this.employeeFieldMapping===FyleField.VENDOR) {
        return 'destination_vendor';
      } else if (this.employeeFieldMapping===FyleField.EMPLOYEE) {
        return 'destination_employee';
      }
    } else if (genericMapping.categorymapping?.length) {
      if (this.destinationField === 'ACCOUNT') {
        return 'destination_account';
      }
        return 'destination_expense_head';

    }
    return 'destination';
  }

  getDropdownValue(genericMapping: ExtendedGenericMapping, isForDestinationType: boolean = false) {
    if (genericMapping.employeemapping?.length) {
      if (genericMapping?.employeemapping?.[0]?.destination_vendor) {
        return genericMapping?.employeemapping[0].destination_vendor;
      } else if (genericMapping?.employeemapping?.[0]?.destination_employee) {
        return genericMapping?.employeemapping[0].destination_employee;
      }
      return null;
    } else if (genericMapping.categorymapping?.length) {
      if (this.destinationField === 'ACCOUNT') {
        return genericMapping.categorymapping[0].destination_account;
      }
        return genericMapping.categorymapping[0].destination_expense_head;

    } else if (genericMapping.mapping?.length) {
      return genericMapping.mapping[0].destination;
    }
    return null;
  }

  save(selectedRow: ExtendedGenericMapping, event: any): void {
    if (selectedRow.employeemapping) {
      const employeeMapping = MappingClass.constructEmployeeMappingPayload(selectedRow, event, this.employeeFieldMapping, this.workspaceService.getWorkspaceId());
      this.mappingService.postEmployeeMappings(employeeMapping).subscribe((response) => {
        this.appName === AppName.NETSUITE ? this.decrementUnmappedCountInNetsuiteEmployeeMapping(selectedRow.employeemapping) : this.decrementUnmappedCountIfNeeded(selectedRow.employeemapping);
        selectedRow.employeemapping = [response];
        this.displaySuccessToast(this.translocoService.translate('mapping.employeeMappingToastText'));
      }, () => {
        this.displayErrorToast();
      });
    } else if (selectedRow.categorymapping) {
      const categoryMappingsPayload = MappingClass.constructCategoryMappingPayload(selectedRow, event, this.destinationField, this.workspaceService.getWorkspaceId());

      this.mappingService.postCategoryMappings(categoryMappingsPayload).subscribe((response) => {
        this.decrementUnmappedCountIfNeeded(selectedRow.categorymapping);
        selectedRow.categorymapping = [response];
        this.displaySuccessToast(this.translocoService.translate('mapping.categoryMappingToastText'));
      }, () => {
        this.displayErrorToast();
      });
    } else {
      const genericMappingPayload = MappingClass.constructGenericMappingPayload(selectedRow, event, {source_field: this.sourceField, destination_field: event.value.attribute_type, app_name: this.appName});

      this.mappingService.postMapping(genericMappingPayload).subscribe((response: GenericMapping) => {
        this.decrementUnmappedCountIfNeeded(selectedRow.mapping);
        selectedRow.mapping = [response];
        this.displaySuccessToast(this.translocoService.translate('mapping.mappingToastText'));
      }, () => {
        this.displayErrorToast();
      });
    }
  }

  decrementUnmappedCountIfNeeded(mapping: any): void {
    if (!mapping?.length && !this.isDashboardMappingResolve) {
      this.mappingStats.unmapped_attributes_count -= 1;
    }
  }

  decrementUnmappedCountInNetsuiteEmployeeMapping(mapping: any): void {
    if (mapping[0]?.destination_employee === null && !this.isDashboardMappingResolve && this.destinationField === FyleField.EMPLOYEE) {
      this.mappingStats.unmapped_attributes_count -= 1;
    } else if (mapping[0]?.destination_vendor === null && !this.isDashboardMappingResolve && this.destinationField === FyleField.VENDOR) {
      this.mappingStats.unmapped_attributes_count -= 1;
    }
  }

  displaySuccessToast(message: string): void {
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, message);
  }

  displayErrorToast(): void {
    this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('genericMappingTable.somethingWentWrong'));
  }

  ngOnInit(): void {
    this.uiExposedAppName = this.appName === AppName.QBD_DIRECT ? AppName.QBD : this.appName;
    this.constructDestinationOptions();
    this.optionSearchWatcher();
  }

}
