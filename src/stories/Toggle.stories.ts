
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { ToggleComponent } from 'src/app/shared/components/input/toggle/toggle.component';
import { setupStoryBookFormGroup } from './utility';

const meta: Meta<ToggleComponent> = {
  title: 'Input/Toggle',
  component: ToggleComponent,
  tags: ['autodocs'],
  render: (args: ToggleComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ToggleComponent],
      imports: [CommonModule, BrowserAnimationsModule, InputSwitchModule, FormsModule, ReactiveFormsModule, RippleModule]
    })
  ],
  argTypes: {
  }
};

export default meta;
type Story = StoryObj<ToggleComponent>;

export const simple: Story = {
  args: {
    form: setupStoryBookFormGroup(new FormGroup({ field: new FormControl(true) })),
    formControllerName: 'field'
  }
};
