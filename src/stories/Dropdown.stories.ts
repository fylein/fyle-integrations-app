import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SelectModule } from 'primeng/select';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownComponent } from 'src/app/shared/components/input/dropdown/dropdown.component';
import { setupStoryBookFormGroup } from './utility';

const form = setupStoryBookFormGroup(new FormGroup({
  emotion: new FormControl('hehe')
}));

const meta: Meta<DropdownComponent> = {
  title: 'Input/Dropdown',
  component: DropdownComponent,
  tags: ['autodocs'],
  render: (args: DropdownComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [DropdownComponent],
      imports: [CommonModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, SelectModule, TooltipModule, RippleModule]
    })
  ],
  argTypes: {}
};

export default meta;
type Story = StoryObj<DropdownComponent>;

export const preFilled: Story = {
  args: {
    placeholder: 'Select an option',
    options: [{key: 'hehe', value: 'hehe'}, {'key': 'haha', 'value': 'haha'}],
    form: form,
    formControllerName: 'emotion',
    displayKey: 'key'
  }
};

const newFieldForm = setupStoryBookFormGroup(new FormGroup({
  emotion: new FormControl()
}));
export const newField: Story = {
  args: {
    placeholder: 'Select an option',
    options: [{key: 'hehe', value: 'hehe'}, {'key': 'haha', 'value': 'haha'}],
    form: newFieldForm,
    formControllerName: 'emotion',
    displayKey: 'key'
  }
};
