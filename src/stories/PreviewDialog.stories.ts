import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { PreviewDialogComponent } from 'src/app/shared/components/configuration/preview-dialog/preview-dialog.component';

const meta: Meta<PreviewDialogComponent> = {
  title: 'Configuration/PreviewDialog',
  component: PreviewDialogComponent,
  tags: ['autodocs'],
  render: (args: PreviewDialogComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [PreviewDialogComponent],
      imports: [CommonModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<PreviewDialogComponent>;

export const simple: Story = {
  args: {
    isPreviewDialogVisible: true,
    iconPath: 'assets/illustrations/sageIntacct/IntacctImportSettings.png',
    header: 'Preview',
  },
};
