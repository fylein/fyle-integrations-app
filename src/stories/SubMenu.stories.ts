
import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { SubMenuComponent } from 'src/app/shared/components/menu/sub-menu/sub-menu.component';

const meta: Meta<SubMenuComponent> = {
  title: 'Components/SubMenu',
  component: SubMenuComponent,
  tags: ['autodocs'],
  render: (args: SubMenuComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [SubMenuComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<SubMenuComponent>;

export const simple: Story = {};
