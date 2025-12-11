
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { SubMenuComponent } from 'src/app/shared/components/menu/sub-menu/sub-menu.component';

const meta: Meta<SubMenuComponent> = {
  title: 'Core/SubMenu',
  component: SubMenuComponent,
  tags: ['autodocs'],
  render: (args: SubMenuComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, RouterModule],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
        }
      }]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<SubMenuComponent>;

export const simple: Story = {
  args: {
    modules: [
      {label: 'Export Settings', routerLink: '/integrations/qbo/main/configuration/export_settings'},
      {label: 'Import Settings', routerLink: '/integrations/qbo/main/configuration/import_settings'},
      {label: 'Advanced Settings', routerLink: '/integrations/qbo/main/configuration/advanced_settings'}
    ],
    activeModule: {label: 'Export Settings', routerLink: '/integrations/qbo/main/configuration/export_settings'}
  }
};
