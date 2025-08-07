import { Component, Input, OnInit } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export type LoaderSpinnerVariants = 'neutral' | 'action';
export type LoaderSpinnerSizes = 'horizontal-sm' | 'vertical-sm' | 'vertical-md' | 'vertical-lg' | 'vertical-xl';

const DEFAULT_VARIANT: LoaderSpinnerVariants = 'neutral';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  constructor(private translocoService: TranslocoService) {}

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
    return [this.variant, this.size, this.showSpinnerLabel ? '' : 'no-label'].filter((c) => !!c);
  }

  ngOnInit(): void {}
}
