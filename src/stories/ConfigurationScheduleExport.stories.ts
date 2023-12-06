
import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { ConfigurationScheduleExportComponent } from 'src/app/shared/components/configuration/configuration-schedule-export/configuration-schedule-export.component';

const meta: Meta<ConfigurationScheduleExportComponent> = {
  title: 'Components/ConfigurationScheduleExport',
  component: ConfigurationScheduleExportComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationScheduleExportComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationScheduleExportComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationScheduleExportComponent>;

export const simple: Story = {};
