import { CommonModule } from '@angular/common';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { SharedModule } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { MandatoryErrorMessageComponent } from 'src/app/shared/components/helper/mandatory-error-message/mandatory-error-message.component';


const meta: Meta<MandatoryErrorMessageComponent> = {
  title: 'Helper/Mandatory Error Message Component',
  component: MandatoryErrorMessageComponent,
  tags: ['autodocs'],
  render: (args: MandatoryErrorMessageComponent) => ({
    props: {
      ...args
    }
  }),
  decorators: [
    moduleMetadata({
      imports: [SharedModule, TabMenuModule, CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<MandatoryErrorMessageComponent>;


export const example1: Story = {
  args: {
    listName: 'project'
  }
};


export const example2: Story = {
  args: {
    listName: 'user'
  }
};

export const custom: Story = {
  args: {
    customErrorMessage: 'Please select hehe huhu hoho'
  }
};

