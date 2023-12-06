
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { AppLandingPageHeaderComponent } from 'src/app/shared/components/helper/app-landing-page-header/app-landing-page-header.component';

const meta: Meta<AppLandingPageHeaderComponent> = {
  title: 'Components/AppLandingPageHeader',
  component: AppLandingPageHeaderComponent,
  tags: ['autodocs'],
  render: (args: AppLandingPageHeaderComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [AppLandingPageHeaderComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<AppLandingPageHeaderComponent>;

export const simple: Story = {};
