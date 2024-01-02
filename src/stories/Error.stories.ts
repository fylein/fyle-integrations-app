
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { MessageService } from 'primeng/api';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { ErrorComponent } from 'src/app/shared/components/core/error/error.component';

const meta: Meta<ErrorComponent> = {
  title: 'Onboarding/Error',
  component: ErrorComponent,
  tags: ['autodocs'],
  render: (args: ErrorComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })],
      providers: [MessageService, IntegrationsToastService]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ErrorComponent>;

export const simple: Story = {};
