
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MainMenuComponent } from 'src/app/shared/components/menu/main-menu/main-menu.component';

const meta: Meta<MainMenuComponent> = {
  title: 'Components/MainMenu',
  component: MainMenuComponent,
  tags: ['autodocs'],
  render: (args: MainMenuComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [MainMenuComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<MainMenuComponent>;

export const simple: Story = {};
