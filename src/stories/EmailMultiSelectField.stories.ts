
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { EmailMultiSelectFieldComponent } from 'src/app/shared/components/configuration/email-multi-select-field/email-multi-select-field.component';
import { setupStoryBookFormGroup } from './utility';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService, SharedModule } from 'primeng/api';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';
import { brandingConfig } from 'src/app/branding/branding-config';
import { TooltipModule } from 'primeng/tooltip';
import { MandatoryErrorMessageComponent } from 'src/app/shared/components/helper/mandatory-error-message/mandatory-error-message.component';

const meta: Meta<EmailMultiSelectFieldComponent> = {
  title: 'Configuration/AdvancedSetting/EmailMultiSelectField',
  component: EmailMultiSelectFieldComponent,
  tags: ['autodocs'],
  render: (args: EmailMultiSelectFieldComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [MandatoryErrorMessageComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule, SharedModule, MultiSelectModule, DialogModule, TooltipModule, ],
      providers: [MessageService, IntegrationsToastService]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<EmailMultiSelectFieldComponent>;

export const simple: Story = {
  args: {
    form: setupStoryBookFormGroup(new FormGroup({exportScheduleFrequency: new FormControl(1), exportSchedule: new FormControl(true), email: new FormControl([{email: 'ashwin.t@fyle.in', name: 'Ashwin'}]), search: new FormControl('')})),
    isFieldMandatory: false,
    mandatoryErrorListName: 'automatic export method',
    label: 'Set up export frequency',
    subLabel: 'Set a frequency based on how often you want your expenses in ' + brandingConfig.brandName + ' to be exported to QuickBooks Online',
    formControllerName: 'exportScheduleFrequency',
    options: [{email: 'ashwin.t@fyle.in', name: 'Ashwin'}]
  }
};
