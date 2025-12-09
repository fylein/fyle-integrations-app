import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MessageService } from 'primeng/api';
import {
  AccountingErrorType,
  AccountingExportStatus,
  AppName,
  AppUrl,
  ExportErrorSourceType,
  FundSource,
} from 'src/app/core/models/enum/enum.model';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { DashboardErrorSectionComponent } from 'src/app/shared/components/dashboard/dashboard-error-section/dashboard-error-section.component';
import { SharedModule } from 'src/app/shared/shared.module';

const meta: Meta<DashboardErrorSectionComponent> = {
  title: 'Dashboard/DashboardErrorSection',
  component: DashboardErrorSectionComponent,
  tags: ['autodocs'],
  render: (args: DashboardErrorSectionComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, SharedModule, BrowserAnimationsModule],
      providers: [
        IntegrationsToastService,
        MessageService,
        {
          provide: DashboardService,
          useValue: {},
        },
        {
          provide: MappingService,
          useValue: {},
        },
        {
          provide: WorkspaceService,
          useValue: {},
        },
      ],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<DashboardErrorSectionComponent>;

export const simple: Story = {
  args: {
    appName: AppName.QBO,
    apiModuleUrl: AppUrl.QBO,
    errors: {
      EMPLOYEE_MAPPING: [
        {
          id: 1,
          expense_attribute: {
            id: 1,
            attribute_type: 'EMPLOYEE',
            display_name: 'Employee',
            value: 'ashwin.t@fyle.in',
            source_id: 'ash',
            auto_mapped: false,
            auto_created: false,
            active: true,
            detail: null,
            created_at: '2021-06-01T06:30:00.000Z',
            updated_at: '2021-06-01T06:30:00.000Z',
            workspace: 1,
          },
          expense_group: {
            id: 1,
            type: 'EXPENSE',
            description: {
              claim_number: '123',
              employee_email: '',
              expense_id: '',
              report_id: '',
              settlement_id: '',
            },
            status: AccountingExportStatus.COMPLETE,
            mapping_errors: [],
            response: {},
            created_at: new Date(),
            updated_at: new Date(),
            exported_at: new Date(),
            workspace: 1,
            export_url: '',
            expenses: [],
            fund_source: FundSource.CCC,
          },
          type: AccountingErrorType.EMPLOYEE_MAPPING,
          is_resolved: false,
          error_title: 'Employee Mapping Error',
          error_detail: 'Employee Mapping Error',
          created_at: new Date(),
          updated_at: new Date(),
          workspace: 1,
        },
      ],
      CATEGORY_MAPPING: [],
      ACCOUNTING_ERROR: [
        {
          id: 1,
          expense_attribute: {
            id: 1,
            attribute_type: 'EMPLOYEE',
            display_name: 'Employee',
            value: 'ashwin.t@fyle.in',
            source_id: 'ash',
            auto_mapped: false,
            auto_created: false,
            active: true,
            detail: null,
            created_at: '2021-06-01T06:30:00.000Z',
            updated_at: '2021-06-01T06:30:00.000Z',
            workspace: 1,
          },
          expense_group: {
            id: 1,
            type: 'EXPENSE',
            description: {
              claim_number: '123',
              employee_email: '',
              expense_id: '',
              report_id: '',
              settlement_id: '',
            },
            status: AccountingExportStatus.COMPLETE,
            mapping_errors: [],
            response: {},
            created_at: new Date(),
            updated_at: new Date(),
            exported_at: new Date(),
            workspace: 1,
            export_url: '',
            expenses: [],
            fund_source: FundSource.CCC,
          },
          type: AccountingErrorType.ACCOUNTING_ERROR,
          is_resolved: false,
          error_title: 'Invalid account code for expense',
          error_detail: "Account code 223 doesn't exist in QuickBooks Online",
          created_at: new Date(),
          updated_at: new Date(),
          workspace: 1,
        },
      ],
    },
    groupedErrorStat: {
      [AccountingErrorType.EMPLOYEE_MAPPING]: null,
      [AccountingErrorType.CATEGORY_MAPPING]: null,
    },
    destinationFieldMap: {
      [ExportErrorSourceType.EMPLOYEE]: 'EMPLOYEE',
      [ExportErrorSourceType.CATEGORY]: 'ACCOUNT',
    },
    isCategoryMappingGeneric: true,
    isImportItemsEnabled: false,
    destinationOptionsVersion: 'v1',
    errorsVersion: 'v1',
  },
};
