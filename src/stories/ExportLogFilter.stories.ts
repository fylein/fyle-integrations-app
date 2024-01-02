
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ExportLogFilterComponent } from 'src/app/shared/components/export-log/export-log-filter/export-log-filter.component';
import { setupStoryBookFormGroup } from './utility';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';

const meta: Meta<ExportLogFilterComponent> = {
  title: 'ExportLog/ExportLogFilter',
  component: ExportLogFilterComponent,
  tags: ['autodocs'],
  render: (args: ExportLogFilterComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, SharedModule, BrowserAnimationsModule, DropdownModule, FormsModule, ReactiveFormsModule, IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ExportLogFilterComponent>;

export const simple: Story = {
  args: {
    exportLogForm: setupStoryBookFormGroup(new FormGroup({searchOption: new FormControl(), dateRange: new FormControl(), start: new FormControl(), end: new FormControl()}))
  }
};
