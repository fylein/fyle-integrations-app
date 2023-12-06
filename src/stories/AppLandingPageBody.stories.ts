
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { AppLandingPageBodyComponent } from 'src/app/shared/components/helper/app-landing-page-body/app-landing-page-body.component';

const meta: Meta<AppLandingPageBodyComponent> = {
  title: 'Components/AppLandingPageBody',
  component: AppLandingPageBodyComponent,
  tags: ['autodocs'],
  render: (args: AppLandingPageBodyComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [AppLandingPageBodyComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<AppLandingPageBodyComponent>;

export const simple: Story = {};
