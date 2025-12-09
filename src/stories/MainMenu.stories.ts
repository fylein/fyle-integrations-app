import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { AppName } from 'src/app/core/models/enum/enum.model';
import { MainMenuComponent } from 'src/app/shared/components/menu/main-menu/main-menu.component';

const meta: Meta<MainMenuComponent> = {
  title: 'Core/MainMenu',
  component: MainMenuComponent,
  tags: ['autodocs'],
  render: (args: MainMenuComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [MainMenuComponent],
      imports: [CommonModule, RouterModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<MainMenuComponent>;

export const simple: Story = {
  args: {
    modules: [
      { label: 'Dashboard', routerLink: '/integrations/qbo/main/dashboard' },
      { label: 'Export Log', routerLink: '/integrations/qbo/main/export_log' },
      { label: 'Mapping', routerLink: '/integrations/qbo/main/mapping' },
      { label: 'Configuration', routerLink: '/integrations/qbo/main/configuration' },
    ],
    activeItem: { label: 'Dashboard', routerLink: '/integrations/qbo/main/dashboard' },
    appName: AppName.QBO,
    isDropdrownRequired: false,
  },
};
