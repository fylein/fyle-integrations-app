
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfigurationToggleFieldComponent } from 'src/app/shared/components/configuration/configuration-toggle-field/configuration-toggle-field.component';
import { setupStoryBookFormGroup } from './utility';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { brandingConfig } from 'src/app/branding/branding-config';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { IconSpriteModule } from 'ng-svg-icon-sprite';

const meta: Meta<ConfigurationToggleFieldComponent> = {
  title: 'Configuration/ConfigurationToggleField',
  component: ConfigurationToggleFieldComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationToggleFieldComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationToggleFieldComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule, ToggleSwitchModule, IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationToggleFieldComponent>;


export const simple: Story = {
  args: {
    form: setupStoryBookFormGroup(new FormGroup({autoCreateVendors: new FormControl(true)})),
    iconPath: 'building',
    label: 'Auto-Create Vendors',
    subLabel: 'While exporting reimbursable expenses from ' + brandingConfig.brandName + ', the integration will automatically create a vendor if a match does not exist in QuickBooks Online already.',
    formControllerName: 'autoCreateVendors'
  }
};
