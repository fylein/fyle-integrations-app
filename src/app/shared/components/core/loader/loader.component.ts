import { Component, Input, OnInit } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';

export type LoaderSpinnerVariants = 'neutral' | 'action';
export type LoaderSpinnerSizes = 'horizontal-sm' | 'vertical-sm' | 'vertical-md' | 'vertical-lg' | 'vertical-xl';

const DEFAULT_VARIANT: LoaderSpinnerVariants = 'neutral';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html'
})
export class LoaderComponent implements OnInit {
  constructor(private translocoService: TranslocoService) {}

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingConfig = brandingConfig;

  @Input() styleClass: string = '!tw-w-50-px !tw-h-50-px spinner-default';

  /** Text label below spinner */
  @Input() spinnerLabel: string = this.translocoService.translate('common.loader.defaultLabel');

  /** Whether to show the label caption */
  @Input() showSpinnerLabel = true;

  /** Color variant of the spinner */
  @Input() variant: LoaderSpinnerVariants = DEFAULT_VARIANT;

  /** Size of the spinner */
  @Input() size: LoaderSpinnerSizes = 'vertical-md';

  /** Compute CSS classes for host */
    get hostClasses(): string[] {
    const classes: string[] = [];

    // Base loader classes
    classes.push('tw-inline-flex', 'tw-items-center', 'tw-text-center');

    // Size-specific classes (includes flex direction)
    const sizeConfig = this.getSizeConfig(this.size);
    classes.push(...sizeConfig.containerClasses);

    // Hide label if needed
    if (!this.showSpinnerLabel) {
      classes.push('tw-space-y-0');
    }

    return classes;
  }

  /** Get spinner size classes */
  get spinnerClasses(): string[] {
    const classes: string[] = ['tw-relative'];
    const sizeConfig = this.getSizeConfig(this.size);
    classes.push(...sizeConfig.spinnerClasses);
    return classes;
  }

  /** Get SVG classes */
  get svgClasses(): string[] {
    return ['tw-w-full', 'tw-h-full'];
  }

    /** Get spinner track classes */
  get spinnerTrackClasses(): string[] {
    const classes: string[] = ['tw-fill-none', 'tw-stroke-[6px]'];

    // Variant-specific colors
    if (this.variant === 'neutral') {
      classes.push('tw-stroke-loader-neutral-track');
    } else {
      classes.push('tw-stroke-loader-action-track');
    }

    return classes;
  }

      /** Get spinner segment classes */
  get spinnerSegmentClasses(): string[] {
    const classes: string[] = [
      'tw-fill-none',
      'tw-stroke-[6px]',
      'tw-stroke-round',
      'tw-origin-[25px_25px]',
      'tw-animate-loader-spin'
    ];

    // Variant-specific colors
    if (this.variant === 'neutral') {
      classes.push('tw-stroke-loader-neutral');
    } else {
      classes.push('tw-stroke-loader-action');
    }

    return classes;
  }

  /** Get title classes */
  get titleClasses(): string[] {
    const classes: string[] = ['tw-text-14-px'];
    const sizeConfig = this.getSizeConfig(this.size);
    classes.push(...sizeConfig.titleClasses);
    return classes;
  }

  /** Get size configuration */
  private getSizeConfig(size: LoaderSpinnerSizes) {
    const configs = {
      'horizontal-sm': {
        containerClasses: ['tw-flex-row'],
        spinnerClasses: ['tw-w-20-px', 'tw-h-20-px'],
        titleClasses: ['tw-ml-8-px', 'tw-mt-0']
      },
      'vertical-sm': {
        containerClasses: ['tw-flex-col'],
        spinnerClasses: ['tw-w-32-px', 'tw-h-32-px'],
        titleClasses: ['tw-mt-12-px']
      },
      'vertical-md': {
        containerClasses: ['tw-flex-col'],
        spinnerClasses: ['tw-w-56-px', 'tw-h-56-px'],
        titleClasses: ['tw-mt-16-px']
      },
      'vertical-lg': {
        containerClasses: ['tw-flex-col'],
        spinnerClasses: ['tw-w-80-px', 'tw-h-80-px'],
        titleClasses: ['tw-mt-22-px']
      },
      'vertical-xl': {
        containerClasses: ['tw-flex-col'],
        spinnerClasses: ['tw-w-[104px]', 'tw-h-[104px]'],
        titleClasses: ['tw-mt-26-px']
      }
    };

    return configs[size] || configs['vertical-md'];
  }

  ngOnInit(): void {}
}
