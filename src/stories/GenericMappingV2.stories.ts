import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { AppName, FyleField } from 'src/app/core/models/enum/enum.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { GenericMappingV2Component } from 'src/app/shared/components/helper/mapping/generic-mapping-v2/generic-mapping-v2.component';
import { SharedModule } from 'src/app/shared/shared.module';

const meta: Meta<GenericMappingV2Component> = {
  title: 'Mapping/GenericMappingV2',
  component: GenericMappingV2Component,
  tags: ['autodocs'],
  render: (args: GenericMappingV2Component) => ({
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
          provide: MappingService,
          useValue: {
            getGenericMappingsV2: () =>
              of({
                count: 0,
                next: null,
                previous: null,
                results: [],
              }),
            getMappingStats: () =>
              of({
                all_attributes_count: 10,
                unmapped_attributes_count: 10,
              }),
          },
        },
        {
          provide: WorkspaceService,
          useValue: {},
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                source_field: 'employee',
              },
            },
          },
        },
      ],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<GenericMappingV2Component>;

export const simple: Story = {
  args: {
    isLoading: false,
    destinationOptions: [
      {
        id: 1,
        attribute_type: 'EMPLOYEE',
        display_name: 'Employee',
        value: 'Ashwin',
        destination_id: '1',
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        workspace: 1,
      },
      {
        id: 2,
        attribute_type: 'EMPLOYEE',
        display_name: 'Employee',
        value: 'Dhoni',
        destination_id: '2',
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        workspace: 1,
      },
    ],
    employeeFieldMapping: FyleField.EMPLOYEE,
    sourceField: 'employee',
    destinationField: 'employee',
    showAutoMapEmployee: true,
    appName: AppName.QBO,
    isCategoryMappingGeneric: true,
  },
};
