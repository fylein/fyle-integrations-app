
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfigurationScheduleExportComponent } from 'src/app/shared/components/configuration/configuration-schedule-export/configuration-schedule-export.component';
import { setupStoryBookFormGroup } from './utility';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MessageService } from 'primeng/api';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const meta: Meta<ConfigurationScheduleExportComponent> = {
  title: 'Configuration/AdvancedSetting/ConfigurationScheduleExport',
  component: ConfigurationScheduleExportComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationScheduleExportComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, SharedModule, MultiSelectModule],
      providers: [MessageService, IntegrationsToastService]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationScheduleExportComponent>;

export const simple: Story = {
  args: {
    form: setupStoryBookFormGroup(new FormGroup({ exportScheduleFrequency: new FormControl(1), exportSchedule: new FormControl(true), email: new FormControl([{ email: 'ashwin.t@fyle.in', name: 'Ashwin' }]), search: new FormControl('') })),
    isFieldMandatory: false,
    mandatoryErrorListName: 'automatic export method',
    label: 'Set up export frequency',
    subLabel: 'Set a frequency based on how often you want your expenses in ' + 'brandingConfig.brandName' + ' to be exported to QuickBooks Online',
    options: [...Array(24).keys()].map(day => {
      return {
        label: (day + 1).toString(),
        value: day + 1
      };
    }),
    isEmailPresent: true,
    formControllerName: 'exportScheduleFrequency',
    adminEmails: [{ email: 'ashwin.t@fyle.in', name: 'Ashwin' }]
  }
};
