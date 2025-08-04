/** @type {import('tailwindcss').Config} */

const customColors = {
  white: 'var(--white)',
  placeholder: 'var(--placeholder)',
  separator: 'var(--separator)',
  'normal-text-color': 'var(--normal-text-color)',
  'slightly-normal-text-color': 'var(--slightly-normal-text-color)',
  'menu-inactive-text-color': 'var(--menu-inactive-text-color)',
  'sub-text-color': 'var(--sub-text-color)',
  'faded-text-color': 'var(--faded-text-color)',
  'box-color': 'var(--box-color)',
  'hyperlink-color': 'var(--hyperlink-color)',
  'mandatory-field-color': 'var(--mandatory-field-color)',
  'disabled-bg-color': 'var(--disabled-bg-color)',
  'configuration-bg': 'var(--configuration-bg)',
  'check-box': 'var(--check-box)',
  'info-section': 'var(--info-section)',
  'info': 'var(--info)',
  'success-toast': 'var(--success-toast)',
  'alert-toast': 'var(--alert-toast)',
  'cta-disabled': 'var(--cta-disabled)',
  'line-inactive': 'var(--line-inactive)',
  'progress-bar-bg': 'var(--progress-bar-bg)',
  'mapped-green-border': 'var(--mapped-green-border)',
  'mapped-green-bg': 'var(--mapped-green-bg)',
  'unmapped-red-border': 'var(--unmapped-red-border)',
  'unmapped-red-bg': 'var(--unmapped-red-bg)',
  'pink': 'var(--pink)',
  'pink-box-border': 'var(--pink-box-border)',
  'bg-warning-lighter': 'var(--bg-warning-lighter)',
  'icon-warning': 'var(--icon-warning)',
  'bg-tertiary-lighter': 'var(--bg-tertiary-lighter)',
};

const spacings = {
  'spacing-0': 'var(--spacing-0)',
  'spacing-2': 'var(--spacing-2)',
  'spacing-4': 'var(--spacing-4)',
  'spacing-6': 'var(--spacing-6)',
  'spacing-8': 'var(--spacing-8)',
  'spacing-10': 'var(--spacing-10)',
  'spacing-12': 'var(--spacing-12)',
  'spacing-14': 'var(--spacing-14)',
  'spacing-16': 'var(--spacing-16)',
  'spacing-18': 'var(--spacing-18)',
  'spacing-20': 'var(--spacing-20)',
  'spacing-24': 'var(--spacing-24)',
  'spacing-28': 'var(--spacing-28)',
  'spacing-32': 'var(--spacing-32)',
  'spacing-40': 'var(--spacing-40)',
  'spacing-48': 'var(--spacing-48)',
  'spacing-56': 'var(--spacing-56)',
  'spacing-72': 'var(--spacing-72)',
};

const fontSizes = {
  'size-0': 'var(--size-0)',
  'size-2': 'var(--size-2)',
  'size-4': 'var(--size-4)',
  'size-6': 'var(--size-6)',
  'size-8': 'var(--size-8)',
  'size-10': 'var(--size-10)',
  'size-12': 'var(--size-12)',
  'size-14': 'var(--size-14)',
  'size-16': 'var(--size-16)',
  'size-18': 'var(--size-18)',
  'size-20': 'var(--size-20)',
  'size-24': 'var(--size-24)',
  'size-28': 'var(--size-28)',
  'size-32': 'var(--size-32)',
  'size-40': 'var(--size-40)',
  'size-48': 'var(--size-48)',
  'size-56': 'var(--size-56)',
  'size-72': 'var(--size-72)',
};

const borderRadius = {
  'border-radius-none': 'var(--border-radius-none)',
  'border-radius-3xs': 'var(--border-radius-3xs)',
  'border-radius-2xs': 'var(--border-radius-2xs)',
  'border-radius-xs': 'var(--border-radius-xs)',
  'border-radius-sm': 'var(--border-radius-sm)',
  'border-radius-md': 'var(--border-radius-md)',
  'border-radius-lg': 'var(--border-radius-lg)',
  'border-radius-xl': 'var(--border-radius-xl)',
  'border-radius-2xl': 'var(--border-radius-2xl)',
  'border-radius-full': 'var(--border-radius-full)',
};

const borderWidth = {
  'border-1': 'var(--border-1)',
  'border-2': 'var(--border-2)',
};

const borderColors = {
  'border-brand': 'var(--border-brand)',
  'border-primary': 'var(--border-primary)',
  'border-secondary': 'var(--border-secondary)',
  'border-tertiary': 'var(--border-tertiary)',
  'border-info': 'var(--border-info)',
  'border-warning': 'var(--border-warning)',
  'border-success': 'var(--border-success)',
  'border-danger': 'var(--border-danger)',
  'border-white': 'var(--border-white)',
  'border-danger-light': 'var(--border-danger-light)',
  'border-highlight-light': 'var(--border-highlight-light)',
  'border-success-light': 'var(--border-success-light)',
  'border-calm-light': 'var(--border-calm-light)',
  'border-info-light': 'var(--border-info-light)',
  'border-danger-lighter': 'var(--border-danger-lighter)',
  'border-warning-lighter': 'var(--border-warning-lighter)',
  'border-highlight-lighter': 'var(--border-highlight-lighter)',
  'border-info-lighter': 'var(--border-info-lighter)',
  'border-success-lighter': 'var(--border-success-lighter)',
  'border-calm-lighter': 'var(--border-calm-lighter)',
  'border-brand-hover': 'var(--border-brand-hover)',
  'border-brand-pressed': 'var(--border-brand-pressed)',
  'border-disable': 'var(--border-disable)',
  'border-neutral': 'var(--border-neutral)',
  'border-date-picker-border': 'var(--border-date-picker-border)',
  'border-orange': 'var(--border-orange)'
};

const colors = {
  'bg-brand-primary': 'var(--bg-brand-primary)',
  'bg-brand-disable': 'var(--bg-brand-disable)',
  'bg-brand-muted': 'var(--bg-brand-muted)',
  'bg-brand-pressed': 'var(--bg-brand-pressed)',
  'bg-brand-hover': 'var(--bg-brand-hover)',

  //grey bg
  'bg-primary': 'var(--bg-primary)',
  'bg-secondary': 'var(--bg-secondary)',
  'bg-disable': 'var(--bg-disable)',
  'bg-tertiary': 'var(--bg-tertiary)',
  'bg-white': 'var(--bg-white)',
  'bg-primary-opacity': 'var(--bg-primary-opacity)',
  //regular bg'
  'bg-success': 'var(--bg-success)',
  'bg-info': 'var(--bg-info)',
  'bg-warning': 'var(--bg-warning)',
  'bg-danger': 'var(--bg-danger)',

  //light bg
  'bg-info-light': 'var(--bg-info-light)',
  'bg-danger-light': 'var(--bg-danger-light)',
  'bg-success-light': 'var(--bg-success-light)',
  'bg-calm-light': 'var(--bg-calm-light)',
  'bg-highlight-light': 'var(--bg-highlight-light)',
  'bg-disable-light': 'var(--bg-disable-light)',
  'bg-tertiary-light': 'var(--bg-tertiary-light)',

  //lighter bg
  'bg-info-lighter': 'var(--bg-info-lighter)',
  'bg-info-lightest': 'var(--bg-info-lightest)',
  'bg-warning-lighter': 'var(--bg-warning-lighter)',
  'bg-danger-lighter': 'var(--bg-danger-lighter)',
  'bg-success-lighter': 'var(--bg-success-lighter)',
  'bg-disable-lighter': 'var(--bg-disable-lighter)',
  'bg-tertiary-lighter': 'var(--bg-tertiary-lighter)',

  //icons
  'icon-secondary': 'var(--icon-secondary)',
  'icon-white': 'var(--icon-white)',
  'icon-disable': 'var(--icon-disable)',
  'icon-brand-primary': 'var(--icon-brand-primary)',
  'icon-brand-secondary': 'var(--icon-brand-secondary)',
  'icon-brand-disable': 'var(--icon-brand-disable)',
  'icon-tertiary': 'var(--icon-tertiary)',
  'icon-success': 'var(--icon-success)',
  'icon-danger': 'var(--icon-danger)',
  'icon-info': 'var(--icon-info)',
  'icon-warning': 'var(--icon-warning)',
  'icon-muted': 'var(--icon-muted)',
  'icon-link': 'var(--icon-link)',
  'icon-primary': 'var(--icon-primary)',
};

const textColors = {
  'text-brand-primary': 'var(--text-brand-primary)',
  'text-brand-secondary': 'var(--text-brand-secondary)',
  'text-primary': 'var(--text-primary)',
  'text-secondary': 'var(--text-secondary)',
  'text-tertiary': 'var(--text-tertiary)',
  'text-success': 'var(--text-success)',
  'text-info': 'var(--text-info)',
  'text-warning': 'var(--text-warning)',
  'text-danger': 'var(--text-danger)',
  'text-highlight': 'var(--text-highlight)',
  'text-calm': 'var(--text-calm)',
  'text-white': 'var(--text-white)',
  'text-black': 'var(--text-black)',
  'text-disable': 'var(--text-disable)',
  'text-placeholder': 'var(--text-placeholder)',
  'text-label': 'var(--text-label)',
  'text-brand-hover': 'var(--text-brand-hover)',
  'text-brand-pressed': 'var(--text-brand-pressed)',
  'text-muted-light': 'var(--text-muted-light)',
  'text-muted': 'var(--text-muted)',

  //link
  'link-primary': 'var(--link-primary)',
  'link-visited': 'var(--link-visited)',
  'link-hover': 'var(--link-hover)',
  'link-pressed': 'var(--link-pressed)',

  'border-secondary': 'var(--border-secondary)',
};

const dimensions = {
  '1-px': 'var(--size-1)',
  '2-px': 'var(--size-2)',
  '4-px': 'var(--size-4)',
  '6-px': 'var(--size-6)',
  '8-px': 'var(--size-8)',
  '10-px': 'var(--size-10)',
  '12-px': 'var(--size-12)',
  '14-px': 'var(--size-14)',
  '16-px': 'var(--size-16)',
  '18-px': 'var(--size-18)',
  '20-px': 'var(--size-20)',
  '22-px': 'var(--size-22)',
  '24-px': 'var(--size-24)',
  '28-px': 'var(--size-28)',
  '32-px': 'var(--size-32)',
  '40-px': 'var(--size-40)',
  '48-px': 'var(--size-48)',
  '56-px': 'var(--size-56)',
  '72-px': 'var(--size-72)',
};

const shadow = {
  'shadow-xs': '0px 0px 4px 2px rgba(44, 48, 78, 0.06)',
  'shadow-sm': '0px 0px 8px 0px rgba(44, 48, 78, 0.10)',
  'shadow-md': '0px 1px 4px 0px rgba(0, 0, 0, 0.20);',
  'shadow-lg': '0px 2px 10px 0px rgba(44, 48, 78, 0.10)',
  'shadow-xl': '0px 12px 20px -10px rgba(65, 69, 98, 0.24)',
  'shadow-top-md': '0px -4px 10px 0px rgba(44, 48, 78, 0.05)',
  'shadow-level-1': '0px 1px 4px 0px rgba(0, 0, 0, 0.20);',
  'shadow-level-2': '0px 2px 8px 0px rgba(0, 0, 0, 0.20);',
  'shadow-level-3': '0px 4px 16px 0px rgba(0, 0, 0, 0.20);',
  'shadow-level-1-inverse': '0px -1px 4px 0px rgba(0, 0, 0, 0.20);',
  'shadow-level-2-inverse': '0px -2px 8px 0px rgba(0, 0, 0, 0.20);',
  'shadow-level-3-inverse': '0px -4px 16px 0px rgba(0, 0, 0, 0.20);',
};

const gradient = {
  'gradient-light-xs': 'linear-gradient(94deg, var(--gradient-light-start) 1.03%, var(--gradient-light-end) 100.37%)',
  'gradient-light-sm': 'linear-gradient(97deg, var(--gradient-light-end) 26.8%, var(--gradient-light-start) 97.18%)',
  'gradient-light-transparent': 'linear-gradient(143deg, var(--gradient-light-transparent-start) 20.72%, var(--gradient-light-transparent-end) 75.82%',
  'gradient-cool-md': 'linear-gradient(94deg, var(--gradient-cool-md-start) 0%, var(--gradient-cool-md-end) 98.63%)',
  'gradient-dark-xs': 'linear-gradient(314deg, var(--gradient-dark-xs-start) 45.19%,  var(--gradient-dark-xs-end) 153.45%)',
  'gradient-dark-sm': 'linear-gradient(267deg, var(--gradient-dark-sm-start) 0%, var(--gradient-dark-sm-end) 100%)',
  'gradient-dark-lg': 'linear-gradient(185deg, var(--gradient-dark-lg-start) 0%, var(--gradient-dark-lg-center) 54.02%, var(--gradient-dark-lg-end) 100.69%)',
  'gradient-white-xs': 'linear-gradient(112deg, var(--gradient-white-xs-start) 1.65%, var(--gradient-white-xs-end) 100%)',
  'gradient-white-fade-xs': ' linear-gradient(180deg, var(--gradient-white-fade-xs-start) 0%, var(--gradient-white-fade-xs-end) 100%)'
};

const componentVariables = {
  // Button Primary - Default
  'btn-primary-bg': 'var(--btn-primary-bg)',
  'btn-primary-disable-bg': 'var(--btn-primary-disable-bg)',
  'btn-primary-disable-text-color': 'var(--btn-primary-disable-text-color)',
  'btn-primary-hover-bg': 'var(--btn-primary-hover-bg)',
  'btn-primary-hover-text-color': 'var(--btn-primary-hover-text-color)',
  'btn-primary-pressed-bg': 'var(--btn-primary-pressed-bg)',
  'btn-primary-pressed-text-color': 'var(--btn-primary-pressed-text-color)',
  'btn-primary-text-color': 'var(--btn-primary-text-color)',

  // Button Primary - Outline
  'btn-outline-primary-bg': 'var(--btn-outline-primary-bg)',
  'btn-outline-primary-border-color': 'var(--btn-outline-primary-border-color)',
  'btn-outline-primary-disable-border-color': 'var(--btn-outline-primary-disable-border-color)',
  'btn-outline-primary-disable-text-color': 'var(--btn-outline-primary-disable-text-color)',
  'btn-outline-primary-hover-bg': 'var(--btn-outline-primary-hover-bg)',
  'btn-outline-primary-hover-border-color': 'var(--btn-outline-primary-hover-border-color)',
  'btn-outline-primary-hover-text-color': 'var(--btn-outline-primary-hover-text-color)',
  'btn-outline-primary-pressed-bg': 'var(--btn-outline-primary-pressed-bg)',
  'btn-outline-primary-pressed-border-color': 'var(--btn-outline-primary-pressed-border-color)',
  'btn-outline-primary-pressed-text-color': 'var(--btn-outline-primary-pressed-text-color)',
  'btn-outline-primary-text-color': 'var(--btn-outline-primary-text-color)',

  // Button Primary - Text Only
  'btn-tertiary-disable-text-color': 'var(--btn-tertiary-disable-text-color)',
  'btn-tertiary-hover-bg': 'var(--btn-tertiary-hover-bg)',
  'btn-tertiary-hover-text-color': 'var(--btn-tertiary-hover-text-color)',
  'btn-tertiary-pressed-bg': 'var(--btn-tertiary-pressed-bg)',
  'btn-tertiary-pressed-text-color': 'var(--btn-tertiary-pressed-text-color)',
  'btn-tertiary-text-color': 'var(--btn-tertiary-text-color)',

  // Button Primary - Split
  'btn-split-primary-bg': 'var(--btn-split-primary-bg)',
  'btn-split-primary-disable-bg': 'var(--btn-split-primary-disable-bg)',
  'btn-split-primary-disable-text-color': 'var(--btn-split-primary-disable-text-color)',
  'btn-split-primary-hover-bg': 'var(--btn-split-primary-hover-bg)',
  'btn-split-primary-hover-text-color': 'var(--btn-split-primary-hover-text-color)',
  'btn-split-primary-pressed-bg': 'var(--btn-split-primary-pressed-bg)',
  'btn-split-primary-pressed-text-color': 'var(--btn-split-primary-pressed-text-color)',
  'btn-split-primary-text-color': 'var(--btn-split-primary-text-color)',

  // Button Secondary - Default
  'btn-secondary-bg': 'var(--btn-secondary-bg)',
  'btn-secondary-disable-bg': 'var(--btn-secondary-disable-bg)',
  'btn-secondary-disable-text-color': 'var(--btn-secondary-disable-text-color)',
  'btn-secondary-hover-bg': 'var(--btn-secondary-hover-bg)',
  'btn-secondary-hover-text-color': 'var(--btn-secondary-hover-text-color)',
  'btn-secondary-pressed-bg': 'var(--btn-secondary-pressed-bg)',
  'btn-secondary-pressed-text-color': 'var(--btn-secondary-pressed-text-color)',
  'btn-secondary-text-color': 'var(--btn-secondary-text-color)',

  // Button Secondary - Outline
  'btn-outline-secondary-bg': 'var(--btn-outline-secondary-bg)',
  'btn-outline-secondary-border-color': 'var(--btn-outline-secondary-border-color)',
  'btn-outline-secondary-disable-border-color': 'var(--btn-outline-secondary-disable-border-color)',
  'btn-outline-secondary-disable-text-color': 'var(--btn-outline-secondary-disable-text-color)',
  'btn-outline-secondary-hover-bg': 'var(--btn-outline-secondary-hover-bg)',
  'btn-outline-secondary-hover-border-color': 'var(--btn-outline-secondary-hover-border-color)',
  'btn-outline-secondary-hover-text-color': 'var(--btn-outline-secondary-hover-text-color)',
  'btn-outline-secondary-pressed-bg': 'var(--btn-outline-secondary-pressed-bg)',
  'btn-outline-secondary-pressed-border-color': 'var(--btn-outline-secondary-pressed-border-color)',
  'btn-outline-secondary-pressed-text-color': 'var(--btn-outline-secondary-pressed-text-color)',
  'btn-outline-secondary-text-color': 'var(--btn-outline-secondary-text-color)',

  // Button Secondary - Text Only
  'btn-tertiary-neutral-disable-text-color': 'var(--btn-tertiary-neutral-disable-text-color)',
  'btn-tertiary-neutral-hover-bg': 'var(--btn-tertiary-neutral-hover-bg)',
  'btn-tertiary-neutral-hover-text-color': 'var(--btn-tertiary-neutral-hover-text-color)',
  'btn-tertiary-neutral-pressed-bg': 'var(--btn-tertiary-neutral-pressed-bg)',
  'btn-tertiary-neutral-pressed-text-color': 'var(--btn-tertiary-neutral-pressed-text-color)',
  'btn-tertiary-neutral-text-color': 'var(--btn-tertiary-neutral-text-color)',

  // Button Danger - Default
  'btn-danger-bg': 'var(--btn-danger-bg)',
  'btn-danger-disable-bg': 'var(--btn-danger-disable-bg)',
  'btn-danger-disable-text-color': 'var(--btn-danger-disable-text-color)',
  'btn-danger-hover-bg': 'var(--btn-danger-hover-bg)',
  'btn-danger-hover-text-color': 'var(--btn-danger-hover-text-color)',
  'btn-danger-pressed-bg': 'var(--btn-danger-pressed-bg)',
  'btn-danger-pressed-text-color': 'var(--btn-danger-pressed-text-color)',
  'btn-danger-text-color': 'var(--btn-danger-text-color)',

  // Button Danger - Outline
  'btn-danger-outline-bg': 'var(--btn-danger-outline-bg)',
  'btn-danger-outline-border-color': 'var(--btn-danger-outline-border-color)',
  'btn-danger-outline-disable-border-color': 'var(--btn-danger-outline-disable-border-color)',
  'btn-danger-outline-disable-text-color': 'var(--btn-danger-outline-disable-text-color)',
  'btn-danger-outline-hover-bg': 'var(--btn-danger-outline-hover-bg)',
  'btn-danger-outline-hover-border-color': 'var(--btn-danger-outline-hover-border-color)',
  'btn-danger-outline-hover-text-color': 'var(--btn-danger-outline-hover-text-color)',
  'btn-danger-outline-pressed-bg': 'var(--btn-danger-outline-pressed-bg)',
  'btn-danger-outline-pressed-border-color': 'var(--btn-danger-outline-pressed-border-color)',
  'btn-danger-outline-pressed-text-color': 'var(--btn-danger-outline-pressed-text-color)',
  'btn-danger-outline-text-color': 'var(--btn-danger-outline-text-color)',

  // Button Danger - Text Only
  'btn-tertiary-danger-disable-text-color': 'var(--btn-tertiary-danger-disable-text-color)',
  'btn-tertiary-danger-hover-bg': 'var(--btn-tertiary-danger-hover-bg)',
  'btn-tertiary-danger-hover-text-color': 'var(--btn-tertiary-danger-hover-text-color)',
  'btn-tertiary-danger-pressed-bg': 'var(--btn-tertiary-danger-pressed-bg)',
  'btn-tertiary-danger-pressed-text-color': 'var(--btn-tertiary-danger-pressed-text-color)',
  'btn-tertiary-danger-text-color': 'var(--btn-tertiary-danger-text-color)',

  // Datepicker - Default
  'date-picker-bg': 'var(--date-picker-bg)',
  'date-picker-border': 'var(--date-picker-border)',
  'date-picker-icon': 'var(--date-picker-icon)',
  'date-picker-placeholder-text': 'var(--date-picker-placeholder-text)',

  // Datepicker - Filled
  'date-picker-filled-bg': 'var(--date-picker-filled-bg)',
  'date-picker-filled-border': 'var(--date-picker-filled-border)',
  'date-picker-filled-text': 'var(--date-picker-filled-text)',
  'date-picker-filled-icon-color': 'var(--date-picker-filled-icon-color)',

  // Datepicker - Error
  'date-picker-error-bg': 'var(--date-picker-error-bg)',
  'date-picker-error-border': 'var(--date-picker-error-border)',
  'date-picker-error-icon-color': 'var(--date-picker-error-icon-color)',
  'date-picker-error-placeholder-text': 'var(--date-picker-error-placeholder-text)',

  // Datepicker - Focused
  'date-picker-focused-bg': 'var(--date-picker-focused-bg)',
  'date-picker-focused-border': 'var(--date-picker-focused-border)',
  'date-picker-focused-icon-color': 'var(--date-picker-focused-icon-color)',
  'date-picker-focused-placeholder-text': 'var(--date-picker-focused-placeholder-text)',

  // Datepicker - Buttons
  'date-picker-button-bg': 'var(--date-picker-button-bg)',
  'date-picker-button-border': 'var(--date-picker-button-border)',
  'date-picker-button-icon': 'var(--date-picker-button-icon)',
  'date-picker-button-text': 'var(--date-picker-button-text)',

  // Calendar - Date
  'calendar-date-active-bg': 'var(--calendar-date-active-bg)',
  'calendar-date-active-text-color': 'var(--calendar-date-active-text-color)',
  'calendar-date-default-text-color': 'var(--calendar-date-default-text-color)',
  'calendar-date-disabled-text-color': 'var(--calendar-date-disabled-text-color)',
  'calendar-date-selected-bg': 'var(--calendar-date-selected-bg)',
  'calendar-date-selected-text-color': 'var(--calendar-date-selected-text-color)',
  'calendar-date-todays-border-color': 'var(--calendar-date-todays-border-color)',
  'calendar-date-todays-text-color': 'var(--calendar-date-todays-text-color)',

  // Calendar - Month
  'calendar-month-hover-bg': 'var(--calendar-month-hover-bg)',
  'calendar-month-hover-text-color': 'var(--calendar-month-hover-text-color)',
  'calendar-month-selected-bg': 'var(--calendar-month-selected-bg)',
  'calendar-month-selected-text-color': 'var(--calendar-month-selected-text-color)',
  'calendar-month-text-color': 'var(--calendar-month-text-color)',

  // Calendar - Year
  'calendar-year-hover-bg': 'var(--calendar-year-hover-bg)',
  'calendar-year-hover-text-color': 'var(--calendar-year-hover-text-color)',
  'calendar-year-selected-bg': 'var(--calendar-year-selected-bg)',
  'calendar-year-selected-text-color': 'var(--calendar-year-selected-text-color)',
  'calendar-year-text-color': 'var(--calendar-year-text-color)',

  // Calendar - Other
  'calendar-day-text-color': 'var(--calendar-day-text-color)',
  'calendar-header-hover-text-color': 'var(--calendar-header-hover-text-color)',
  'calendar-header-text-color': 'var(--calendar-header-text-color)',

  // Checkbox
  'checkbox-icon-color': 'var(--checkbox-icon-color)',
  'checkbox-icon-disabled-color': 'var(--checkbox-icon-disabled-color)',
  'checkbox-icon-hover-color': 'var(--checkbox-icon-hover-color)',
  'checkbox-icon-selected-color': 'var(--checkbox-icon-selected-color)',
  'checkbox-icon-selected-disabled-color': 'var(--checkbox-icon-selected-disabled-color)',
  'checkbox-label-disabled': 'var(--checkbox-label-disabled)',
  'checkbox-label-hover': 'var(--checkbox-label-hover)',
  'checkbox-label-text': 'var(--checkbox-label-text)',

  // Dropdown Menu
  'dd-menu-item-default-bg': 'var(--dd-menu-item-default-bg)',
  'dd-menu-item-hover-bg': 'var(--dd-menu-item-hover-bg)',
  'dd-menu-item-active-bg': 'var(--dd-menu-item-active-bg)',
  'dd-menu-item-disable-bg': 'var(--dd-menu-item-disable-bg)',
  'dd-menu-item-danger-bg': 'var(--dd-menu-item-danger-bg)',
  'dd-menu-item-danger-hover-bg': 'var(--dd-menu-item-danger-hover-bg)',
  'dd-menu-item-default-text-color': 'var(--dd-menu-item-default-text-color)',
  'dd-menu-item-hover-text-color': 'var(--dd-menu-item-hover-text-color)',
  'dd-menu-item-active-text-color': 'var(--dd-menu-item-active-text-color)',
  'dd-menu-item-disable-text-color': 'var(--dd-menu-item-disable-text-color)',
  'dd-menu-item-danger-text-color': 'var(--dd-menu-item-danger-text-color)',
  'dd-menu-item-danger-hover-text-color': 'var(--dd-menu-item-danger-hover-text-color)',
  'dd-menu-item-default-meta-text-color': 'var(--dd-menu-item-default-meta-text-color)',
  'dd-menu-item-active-meta-text-color': 'var(--dd-menu-item-active-meta-text-color)',
  'dd-menu-item-disable-meta-text-color': 'var(--dd-menu-item-disable-meta-text-color)',
  'dd-menu-item-divider-color': 'var(--dd-menu-item-divider-color)',
  'dd-menu-item-section-header-text-color': 'var(--dd-menu-item-section-header-text-color)',
  'dd-menu-item-drag-icon-color': 'var(--dd-menu-item-drag-icon-color)',
  'dd-search-default-bg': 'var(--dd-search-default-bg)',

  // Input - Default
  'input-default-bg': 'var(--input-default-bg)',
  'input-default-border': 'var(--input-default-border)',
  'input-default-placeholder-text': 'var(--input-default-placeholder-text)',
  'input-default-text': 'var(--input-default-text)',

  // Input - Focused
  'input-focused-bg': 'var(--input-focused-bg)',
  'input-focused-border': 'var(--input-focused-border)',
  'input-focused-placeholder-text': 'var(--input-focused-placeholder-text)',
  'input-focused-text': 'var(--input-focused-text)',
  'input-clear-icon': 'var(--input-clear-icon)',

  // Input - Disabled
  'input-disabled-bg': 'var(--input-disabled-bg)',
  'input-disabled-border': 'var(--input-disabled-border)',
  'input-disabled-text': 'var(--input-disabled-text)',

  // Input - Readonly
  'input-read-only-bg': 'var(--input-read-only-bg)',
  'input-read-only-border': 'var(--input-read-only-border)',
  'input-read-only-text': 'var(--input-read-only-text)',

  // Input - Error
  'input-error-bg': 'var(--input-error-bg)',
  'input-error-border': 'var(--input-error-border)',
  'input-error-placeholder-text': 'var(--input-error-placeholder-text)',
  'input-error-text': 'var(--input-error-text)',

  // Input - Add-on
  'input-add-on-border': 'var(--input-add-on-border)',
  'input-add-on-default-bg': 'var(--input-add-on-default-bg)',
  'input-add-on-hover-bg': 'var(--input-add-on-hover-bg)',
  'input-add-on-icon': 'var(--input-add-on-icon)',
  'input-add-on-text': 'var(--input-add-on-text)',

  // Input - Textarea
  'textarea-char-count': 'var(--textarea-char-count)',
  'textarea-default-bg': 'var(--textarea-default-bg)',
  'textarea-default-border': 'var(--textarea-default-border)',
  'textarea-disable-bg': 'var(--textarea-disable-bg)',
  'textarea-disabled-border': 'var(--textarea-disabled-border)',
  'textarea-disabled-text': 'var(--textarea-disabled-text)',
  'textarea-drag-icon': 'var(--textarea-drag-icon)',
  'textarea-error-border': 'var(--textarea-error-border)',
  'textarea-focused-border': 'var(--textarea-focused-border)',
  'textarea-placeholder-text': 'var(--textarea-placeholder-text)',
  'textarea-text-color': 'var(--textarea-text-color)',

  // Input - Password
  'password-bg': 'var(--password-bg)',
  'password-default-border': 'var(--password-default-border)',
  'password-disabled-border': 'var(--password-disabled-border)',
  'password-disabled-text': 'var(--password-disabled-text)',
  'password-focused-border': 'var(--password-focused-border)',
  'password-icon': 'var(--password-icon)',
  'password-placeholder-text': 'var(--password-placeholder-text)',
  'password-text-color': 'var(--password-text-color)',

  // Radio
  'radio-icon-color': 'var(--radio-icon-color)',
  'radio-icon-disabled-color': 'var(--radio-icon-disabled-color)',
  'radio-icon-hover-color': 'var(--radio-icon-hover-color)',
  'radio-icon-selected-color': 'var(--radio-icon-selected-color)',
  'radio-icon-selected-disabled-color': 'var(--radio-icon-selected-disabled-color)',
  'radio-label-disabled-color': 'var(--radio-label-disabled-color)',
  'radio-label-hover-color': 'var(--radio-label-hover-color)',
  'radio-label-text-color': 'var(--radio-label-text-color)',

  // Select - Default
  'select-default-arrow-icon': 'var(--select-default-arrow-icon)',
  'select-default-bg': 'var(--select-default-bg)',
  'select-default-border': 'var(--select-default-border)',
  'select-default-placeholder-text': 'var(--select-default-placeholder-text)',
  'select-default-text': 'var(--select-default-text)',

  // Select - Focused
  'select-focused-bg': 'var(--select-focused-bg)',
  'select-focused-border': 'var(--select-focused-border)',
  'select-focused-placeholder-text': 'var(--select-focused-placeholder-text)',
  'select-focused-text': 'var(--select-focused-text)',
  'select-clear-icon': 'var(--select-clear-icon)',

  // Select - Disabled
  'select-disabled-bg': 'var(--select-disabled-bg)',
  'select-disabled-border': 'var(--select-disabled-border)',
  'select-disabled-icon': 'var(--select-disabled-icon)',
  'select-disabled-text': 'var(--select-disabled-text)',

  // Select - Error
  'select-error-bg': 'var(--select-error-bg)',
  'select-error-border': 'var(--select-error-border)',
  'select-error-icon': 'var(--select-error-icon)',
  'select-error-placeholder-text': 'var(--select-error-placeholder-text)',
  'select-error-text': 'var(--select-error-text)',

  // Search - Default
  'search-default-border': 'var(--search-default-border)',
  'search-default-filled-bg': 'var(--search-default-filled-bg)',
  'search-default-filled-text': 'var(--search-default-filled-text)',
  'search-default-icon': 'var(--search-default-icon)',
  'search-default-placeholder-text': 'var(--search-default-placeholder-text)',
  'search-clear-icon': 'var(--search-clear-icon)',

  // Search - Focused
  'search-focused-clear-icon': 'var(--search-focused-clear-icon)',
  'search-focused-filled-bg': 'var(--search-focused-filled-bg)',
  'search-focused-filled-border': 'var(--search-focused-filled-border)',
  'search-focused-placeholder-text': 'var(--search-focused-placeholder-text)',
  'search-focused-search-icon': 'var(--search-focused-search-icon)',
  'search-focused-text': 'var(--search-focused-text)',

  // Switch
  'form-switch-bg': 'var(--form-switch-bg)',
  'form-switch-checked-bg': 'var(--form-switch-checked-bg)',
  'form-switch-checked-disabled-bg': 'var(--form-switch-checked-disabled-bg)',
  'form-switch-disabled-bg': 'var(--form-switch-disabled-bg)',
  'form-switch-disabled-label-text': 'var(--form-switch-disabled-label-text)',
  'form-switch-label-text': 'var(--form-switch-label-text)',
  'switch-group-border-color': 'var(--switch-group-border-color)',

  // Upload
  'upload-filedrop-bg': 'var(--upload-filedrop-bg)',
  'upload-filedrop-border-color': 'var(--upload-filedrop-border-color)',
  'upload-fileuploaded-bg': 'var(--upload-fileuploaded-bg)',
  'upload-fileuploaded-border-color': 'var(--upload-fileuploaded-border-color)',
  'upload-fileuploading-bg': 'var(--upload-fileuploading-bg)',
  'upload-fileuploading-border-color': 'var(--upload-fileuploading-border-color)',
  'upload-header-text-color': 'var(--upload-header-text-color)',
  'upload-hover-bg': 'var(--upload-hover-bg)',
  'upload-hover-border-color': 'var(--upload-hover-border-color)',
  'upload-meta-text-color': 'var(--upload-meta-text-color)',
  'upload-normal-bg': 'var(--upload-normal-bg)',
  'upload-normal-border-color': 'var(--upload-normal-border-color)',

  // Form
  'form-bg': 'var(--form-bg)',

  // Form - Label
  'form-label-disabled-text-color': 'var(--form-label-disabled-text-color)',
  'form-label-icon-color': 'var(--form-label-icon-color)',
  'form-label-optional-text-color': 'var(--form-label-optional-text-color)',
  'form-label-readonly-text-color': 'var(--form-label-readonly-text-color)',
  'form-label-text-color': 'var(--form-label-text-color)',

  // Form - Help Text
  'form-count-help-text-color': 'var(--form-count-help-text-color)',
  'form-default-help-text-color': 'var(--form-default-help-text-color)',
  'form-disabled-help-text-color': 'var(--form-disabled-help-text-color)',
  'form-error-help-text-color': 'var(--form-error-help-text-color)',
  'form-error-icon-color': 'var(--form-error-icon-color)',
  'form-readonly-help-text-color': 'var(--form-readonly-help-text-color)',
  'form-skeleton-loader-color': 'var(--form-skeleton-loader-color)',
  'form-auto-extracted-help-text-color': 'var(--form-auto-extracted-help-text-color)',
  'form-auto-extracted-icon-color': 'var(--form-auto-extracted-icon-color)',

  // Alerts
  'alerts-close-icon-color': 'var(--alerts-close-icon-color)',
  'alerts-text-color': 'var(--alerts-text-color)',

  // Alerts - Success
  'alerts-success-bg': 'var(--alerts-success-bg)',
  'alerts-success-icon-color': 'var(--alerts-success-icon-color)',

  // Alerts - Info
  'alerts-info-bg': 'var(--alerts-info-bg)',
  'alerts-info-icon-color': 'var(--alerts-info-icon-color)',

  // Alerts - Warning
  'alerts-warning-bg': 'var(--alerts-warning-bg)',
  'alerts-warning-icon-color': 'var(--alerts-warning-icon-color)',

  // Alerts - Error
  'alerts-error-bg': 'var(--alerts-error-bg)',
  'alerts-error-icon-color': 'var(--alerts-error-icon-color)',

  // Alerts - Neutral
  'alerts-neutral-bg': 'var(--alerts-neutral-bg)',
  'alerts-neutral-icon-color': 'var(--alerts-neutral-icon-color)',

  // Avatar
  'avatar-dark-bg': 'var(--avatar-dark-bg)',
  'avatar-header-text-color': 'var(--avatar-header-text-color)',
  'avatar-initial-text-dark': 'var(--avatar-initial-text-dark)',
  'avatar-initial-text-light': 'var(--avatar-initial-text-light)',
  'avatar-light-bg': 'var(--avatar-light-bg)',
  'avatar-light-border-color': 'var(--avatar-light-border-color)',
  'avatar-meta-text-color': 'var(--avatar-meta-text-color)',

  // Badge
  'badge-brand-bg': 'var(--badge-brand-bg)',
  'badge-brand-text-color': 'var(--badge-brand-text-color)',
  'badge-dark-bg': 'var(--badge-dark-bg)',
  'badge-dark-text-color': 'var(--badge-dark-text-color)',
  'badge-light-bg': 'var(--badge-light-bg)',
  'badge-light-border-color': 'var(--badge-light-border-color)',
  'badge-light-text-color': 'var(--badge-light-text-color)',

  // Chips
  'chips-body-text-color': 'var(--chips-body-text-color)',
  'status-body-text-color': 'var(--status-body-text-color)',
  'status-label-text-color': 'var(--status-label-text-color)',
  'chips-icon-color': 'var(--chips-icon-color)',
  'chips-border-color': 'var(--chips-border-color)',
  'status-success-indicator-color': 'var(--status-success-indicator-color)',
  'status-danger-indicator-color': 'var(--status-danger-indicator-color)',

  // Corporate Cards
  'ccc-card-status-border-color': 'var(--ccc-card-status-border-color)',
  'ccc-card-status-bg': 'var(--ccc-card-status-bg)',
  'ccc-card-masking-bg': 'var(--ccc-card-masking-bg)',
  'ccc-card-text-color': 'var(--ccc-card-text-color)',
  'ccc-card-meta-text-color': 'var(--ccc-card-meta-text-color)',
  'ccc-card-icon-color': 'var(--ccc-card-icon-color)',

  // Corporate Cards - Feed Status
  'ccc-feed-status-text-color': 'var(--ccc-feed-status-text-color)',
  'ccc-feed-status-label-text-color': 'var(--ccc-feed-status-label-text-color)',

  // Corporate Cards - Virtual Card Status
  'ccc-virtual-card-status-text-color': 'var(--ccc-virtual-card-status-text-color)',
  'ccc-virtual-card-status-border-color': 'var(--ccc-virtual-card-status-border-color)',
  'ccc-virtual-card-status-bg': 'var(--ccc-virtual-card-status-bg)',

  // Modal
  'modal-bg': 'var(--modal-bg)',
  'modal-body-text-color': 'var(--modal-body-text-color)',
  'modal-border-color': 'var(--modal-border-color)',
  'modal-close-icon-color': 'var(--modal-close-icon-color)',
  'modal-danger-icon-bg': 'var(--modal-danger-icon-bg)',
  'modal-danger-icon-color': 'var(--modal-danger-icon-color)',
  'modal-header-text-color': 'var(--modal-header-text-color)',
  'modal-success-icon-bg': 'var(--modal-success-icon-bg)',
  'modal-success-icon-color': 'var(--modal-success-icon-color)',
  'modal-warning-icon-bg': 'var(--modal-warning-icon-bg)',
  'modal-warning-icon-color': 'var(--modal-warning-icon-color)',

  // Comment
  'comment-bg': 'var(--comment-bg)',
  'comment-body-text-color': 'var(--comment-body-text-color)',
  'comment-date-text-color': 'var(--comment-date-text-color)',
  'comment-header-text-color': 'var(--comment-header-text-color)',

  // Comment - Comment Editor
  'comment-editor-active-border-color': 'var(--comment-editor-active-border-color)',
  'comment-editor-active-icon-color': 'var(--comment-editor-active-icon-color)',
  'comment-editor-active-text-color': 'var(--comment-editor-active-text-color)',
  'comment-editor-bg': 'var(--comment-editor-bg)',
  'comment-editor-default-border-color': 'var(--comment-editor-default-border-color)',
  'comment-editor-default-icon-color': 'var(--comment-editor-default-icon-color)',
  'comment-editor-default-text-color': 'var(--comment-editor-default-text-color)',

  // Drawer Divider
  'drawer-bg': 'var(--drawer-bg)',
  'drawer-border-color': 'var(--drawer-border-color)',
  'drawer-close-icon-color': 'var(--drawer-close-icon-color)',
  'drawer-header-text-color': 'var(--drawer-header-text-color)',
  'drawer-meta-text-color': 'var(--drawer-meta-text-color)',
  'divider-border-color': 'var(--divider-border-color)',
  'divider-text-color': 'var(--divider-text-color)',

  // Empty State
  'empty-state-body-text-color': 'var(--empty-state-body-text-color)',
  'empty-state-header-text-color': 'var(--empty-state-header-text-color)',

  // Spinner Progress Bar
  'spinner-active-bg': 'var(--spinner-active-bg)',
  'spinner-inactive-bg': 'var(--spinner-inactive-bg)',
  'progress-bar-active-bg': 'var(--progress-bar-active-bg)',
  'progress-bar-inactive-bg': 'var(--progress-bar-inactive-bg)',
  'skeleton-loader-bg': 'var(--skeleton-loader-bg)',

  // Popup
  'popup-bg': 'var(--popup-bg)',
  'popup-body-text-color': 'var(--popup-body-text-color)',
  'popup-border-color': 'var(--popup-border-color)',
  'popup-close-icon-color': 'var(--popup-close-icon-color)',
  'popup-header-text-color': 'var(--popup-header-text-color)',
  'popup-icon-bg': 'var(--popup-icon-bg)',
  'popup-icon-color': 'var(--popup-icon-color)',

  // Popover
  'popover-bg': 'var(--popover-bg)',
  'popover-body-text-color': 'var(--popover-body-text-color)',
  'popover-border-color': 'var(--popover-border-color)',
  'popover-close-icon-color': 'var(--popover-close-icon-color)',
  'popover-header-text-color': 'var(--popover-header-text-color)',
  'popover-label-text-color': 'var(--popover-label-text-color)',

  // Results
  'results-header-text-color': 'var(--results-header-text-color)',
  'results-meta-text-color': 'var(--results-meta-text-color)',

  // Stepper
  'stepper-disable-text-color': 'var(--stepper-disable-text-color)',
  'stepper-header-text-color': 'var(--stepper-header-text-color)',
  'stepper-item-bg': 'var(--stepper-item-bg)',
  'stepper-item-border-color': 'var(--stepper-item-border-color)',
  'stepper-meta-text-color': 'var(--stepper-meta-text-color)',

  // Stepper - Inactive
  'stepper-inactive-bg': 'var(--stepper-inactive-bg)',
  'stepper-inactive-border-color': 'var(--stepper-inactive-border-color)',
  'stepper-inactive-icon-color': 'var(--stepper-inactive-icon-color)',
  'stepper-inactive-line-color': 'var(--stepper-inactive-line-color)',

  // Stepper - Active
  'stepper-active-bg': 'var(--stepper-active-bg)',
  'stepper-active-border-color': 'var(--stepper-active-border-color)',
  'stepper-active-icon-color': 'var(--stepper-active-icon-color)',

  // Stepper - Completed
  'stepper-completed-bg': 'var(--stepper-completed-bg)',
  'stepper-completed-icon-color': 'var(--stepper-completed-icon-color)',
  'stepper-completed-line-color': 'var(--stepper-completed-line-color)',

  // Tabs
  'nav-border-color': 'var(--nav-border-color)',

  // Tabs - Nav Tabs (Secondary)
  'nav-tabs-active': 'var(--nav-tabs-active)',
  'nav-tabs-active-bg': 'var(--nav-tabs-active-bg)',
  'nav-tabs-inactive-bg': 'var(--nav-tabs-inactive-bg)',
  'nav-tabs-active-border': 'var(--nav-tabs-active-border)',
  'nav-tabs-border': 'var(--nav-tabs-border)',
  'nav-tabs-hover': 'var(--nav-tabs-hover)',
  'nav-tabs-hover-bg': 'var(--nav-tabs-hover-bg)',
  'nav-tabs-hover-border': 'var(--nav-tabs-hover-border)',
  'nav-tabs-text': 'var(--nav-tabs-text)',
  'nav-tabs-inactive-text-color': 'var(--nav-tabs-inactive-text-color)',

  // Tabs - Nav Link (Primary)
  'nav-link-active-border': 'var(--nav-link-active-border)',
  'nav-link-active-text': 'var(--nav-link-active-text)',
  'nav-link-border': 'var(--nav-link-border)',
  'nav-link-hover-bg': 'var(--nav-link-hover-bg)',
  'nav-link-hover-border': 'var(--nav-link-hover-border)',
  'nav-link-hover-text': 'var(--nav-link-hover-text)',
  'nav-link-text': 'var(--nav-link-text)',

  // Timeline
  'timeline-active-bg': 'var(--timeline-active-bg)',
  'timeline-active-border-color': 'var(--timeline-active-border-color)',
  'timeline-active-icon-color': 'var(--timeline-active-icon-color)',
  'timeline-body-text-color': 'var(--timeline-body-text-color)',
  'timeline-header-text-color': 'var(--timeline-header-text-color)',
  'timeline-inactive-bg': 'var(--timeline-inactive-bg)',
  'timeline-inactive-border-color': 'var(--timeline-inactive-border-color)',
  'timeline-inactive-icon-color': 'var(--timeline-inactive-icon-color)',
  'timeline-inactive-line-color': 'var(--timeline-inactive-line-color)',
  'timeline-meta-text-color': 'var(--timeline-meta-text-color)',

  // Tooltip
  'tooltip-bg': 'var(--tooltip-bg)',
  'tooltip-close-icon-color': 'var(--tooltip-close-icon-color)',
  'tooltip-text-color': 'var(--tooltip-text-color)',

  // Toast
  'toast-text-color': 'var(--toast-text-color)',
  'toast-close-icon-color': 'var(--toast-close-icon-color)',

  // Toast - Success
  'toast-success-bg': 'var(--toast-success-bg)',
  'toast-success-icon-color': 'var(--toast-success-icon-color)',

  // Toast - Info
  'toast-info-bg': 'var(--toast-info-bg)',
  'toast-info-icon-color': 'var(--toast-info-icon-color)',

  // Toast - Warning
  'toast-warning-bg': 'var(--toast-warning-bg)',
  'toast-warning-icon-color': 'var(--toast-warning-icon-color)',

  // Toast - Error
  'toast-error-bg': 'var(--toast-error-bg)',
  'toast-error-icon-color': 'var(--toast-error-icon-color)',

  // Toast - Neutral
  'toast-neutral-bg': 'var(--toast-neutral-bg)',
  'toast-neutral-icon-color': 'var(--toast-neutral-icon-color)',

  // Stats
  'stats-body-text-color': 'var(--stats-body-text-color)',
  'stats-header-text-color': 'var(--stats-header-text-color)',
  'stats-icon-bg': 'var(--stats-icon-bg)',
  'stats-icon-color': 'var(--stats-icon-color)',
  'stats-label-text-color': 'var(--stats-label-text-color)',

  // LV Table - Items
  'lv-body-text-color': 'var(--lv-body-text-color)',
  'lv-meta-text-color': 'var(--lv-meta-text-color)',
  'lv-table-border-color': 'var(--lv-table-border-color)',
  'lv-table-list-item-bg': 'var(--lv-table-list-item-bg)',
  'lv-table-icon-disable-color': 'var(--lv-table-icon-disable-color)',

  // LV Table - Table Header
  'lv-table-header-border-color': 'var(--lv-table-header-border-color)',
  'lv-table-header-text-color': 'var(--lv-table-header-text-color)',
  'lv-table-default-bg': 'var(--lv-table-default-bg)',
  'lv-table-hover-bg': 'var(--lv-table-hover-bg)',
  'lv-table-icon-color': 'var(--lv-table-icon-color)',
  'lv-table-icon-muted-color': 'var(--lv-table-icon-muted-color)',

  // LV Table - Pagination
  'lv-pagination-bg': 'var(--lv-pagination-bg)',
  'lv-pagination-border-color': 'var(--lv-pagination-border-color)',
  'lv-pagination-dropdown-icon-color': 'var(--lv-pagination-dropdown-icon-color)',
  'lv-pagination-icon-active-color': 'var(--lv-pagination-icon-active-color)',
  'lv-pagination-icon-disable-color': 'var(--lv-pagination-icon-disable-color)',
  'lv-pagination-text-color': 'var(--lv-pagination-text-color)',

  // LV Quick Filter
  'qf-bg': 'var(--qf-bg)',
  'qf-border-color': 'var(--qf-border-color)',
  'qf-clear-color': 'var(--qf-clear-color)',
  'qf-divider': 'var(--qf-divider)',
  'qf-icon-color': 'var(--qf-icon-color)',
  'qf-saved-filter-button-color': 'var(--qf-saved-filter-button-color)',

  // LV Stats
  'lv-stats-bg': 'var(--lv-stats-bg)',
  'lv-stats-border-color': 'var(--lv-stats-border-color)',
  'lv-stats-header-text-color': 'var(--lv-stats-header-text-color)',
  'lv-stats-label-text-color': 'var(--lv-stats-label-text-color)',

  // Amount
  'amount-active-icon-color': 'var(--amount-active-icon-color)',
  'amount-brand-icon-color': 'var(--amount-brand-icon-color)',
  'amount-danger-icon-color': 'var(--amount-danger-icon-color)',
  'amount-inactive-icon-color': 'var(--amount-inactive-icon-color)',
  'amount-success-text-color': 'var(--amount-success-text-color)',
  'amount-text-color': 'var(--amount-text-color)',

  // Cards - Expense Summary Card
  'summary-card-active-bg': 'var(--summary-card-active-bg)',
  'summary-card-body-text-color': 'var(--summary-card-body-text-color)',
  'summary-card-border-color': 'var(--summary-card-border-color)',
  'summary-card-brand-bg': 'var(--summary-card-brand-bg)',
  'summary-card-dash-border-color': 'var(--summary-card-dash-border-color)',
  'summary-card-inactive-bg': 'var(--summary-card-inactive-bg)',
  'summary-card-meta-text-color': 'var(--summary-card-meta-text-color)',

  // Cards - Merchant Logo Receipt
  'merchant-active-icon-color': 'var(--merchant-active-icon-color)',
  'merchant-bg': 'var(--merchant-bg)',
  'merchant-border-color': 'var(--merchant-border-color)',
  'merchant-inactive-icon-color': 'var(--merchant-inactive-icon-color)',

  // Lists
  'expense-list-date-text-color': 'var(--expense-list-date-text-color)',
  'expense-list-danger-icon-color': 'var(--expense-list-danger-icon-color)',
  'expense-list-warning-icon-color': 'var(--expense-list-warning-icon-color)',
  'expense-list-active-icon-color': 'var(--expense-list-active-icon-color)',

  // Navbar Profile Menu
  'navbar-active-icon-color': 'var(--navbar-active-icon-color)',
  'navbar-bg': 'var(--navbar-bg)',
  'navbar-body-text-color': 'var(--navbar-body-text-color)',
  'navbar-border-color': 'var(--navbar-border-color)',
  'navbar-divider-color': 'var(--navbar-divider-color)',
  'navbar-header-text-color': 'var(--navbar-header-text-color)',
  'navbar-inactive-icon-color': 'var(--navbar-inactive-icon-color)',

  // Navbar Profile Menu - Profile Menu
  'profile-menu-bg': 'var(--profile-menu-bg)',
  'profile-menu-body-text-color': 'var(--profile-menu-body-text-color)',
  'profile-menu-border-color': 'var(--profile-menu-border-color)',
  'profile-menu-dash-border-color': 'var(--profile-menu-dash-border-color)',

  // Receipt
  'receipt-bg': 'var(--receipt-bg)',
  'receipt-body-text-color': 'var(--receipt-body-text-color)',
  'receipt-border-color': 'var(--receipt-border-color)',
  'receipt-header-text-color': 'var(--receipt-header-text-color)',
  'receipt-icon-brand-color': 'var(--receipt-icon-brand-color)',
  'receipt-icon-color': 'var(--receipt-icon-color)',
  'receipt-icon-danger-color': 'var(--receipt-icon-danger-color)',
  'receipt-inactive-bg': 'var(--receipt-inactive-bg)',

  // Sidebar
  'sidebar-active-icon-color': 'var(--sidebar-active-icon-color)',
  'sidebar-active-text-color': 'var(--sidebar-active-text-color)',
  'sidebar-icon-color': 'var(--sidebar-icon-color)',
  'sidebar-submenu-active-text-color': 'var(--sidebar-submenu-active-text-color)',
  'sidebar-submenu-text-color': 'var(--sidebar-submenu-text-color)',
  'sidebar-text-color': 'var(--sidebar-text-color)',

  'scrollbar-track': 'var(--scrollbar-track)',
  'scrollbar-thumb-hover': 'var(--scrollbar-thumb-hover)',
};

module.exports = {
  prefix: 'tw-',
  content: [
    "./src/**/*.{html,ts}",
    "./src/assets/i18n/**/*.json"
  ],
  theme: {
    textColor: {
      ...customColors,
      ...textColors,
      ...componentVariables,
      ...colors
    },
    backgroundColor: {
      ...customColors,
      ...componentVariables,
      ...colors
    },
    fontSize: {
      '9-px':'9px',
      '11-px': '11px',
      '12-px': '12px',
      '14-px': '14px',
      '16-px': '16px',
      '18-px': '18px',
      '20-px': '20px',
      '24-px': '24px',
      '36-px': '36px',
      '40-px': '40px',
      'label-text-size': 'var(--label-text-size)',
      ...fontSizes
    },
    fontWeight: {
      '100': '100',
      '200': '200',
      '300': '300',
      '400': '400',
      '500': '500',
      '600': '600',
      '700': '700',
      'nav-link-font-weight': 'var(--nav-link-font-weight)',
    },
    letterSpacing: {
      '.4-px': '.4px',
      '1.5-px': '1.5px',
      '1.6-px': '1.6px',
    },
    lineHeight: {
      'normal': 'normal',
      'app': 'var(--app-line-height)',
      '1.14': '1.14',
      '1.2': '1.2',
      '1.4': '1.4',
      '1.5': '1.5',
      '1.6': '1.6',
      '1.7': '1.7',
      '1.8': '1.8',
      '19': '19.6px'
    },
    extend: {
      animation: {
        'progress-spinner': 'p-progress-spinner-dash 1.5s ease-in-out infinite, p-progress-spinner-color 6s ease-in-out infinite',
        'progress-spinner-cta': 'p-progress-spinner-dash 1.5s ease-in-out infinite, p-progress-spinner-cta-color 6s ease-in-out infinite'
      },
      keyframes: {
        'p-progress-spinner-color': {
          '0%': { 'stroke': 'var(--mandatory-field-color)'},
          '100%': { 'stroke': 'var(--mandatory-field-color)'}
        },
        'p-progress-spinner-cta-color': {
          '0%': { 'stroke': '#ffffff'},
          '100%': { 'stroke': '#ffffff'}
        }
      },
      zIndex: {
        '1': '1',
      },
      padding: {
        '2-px': '2px',
        '3-px': '3px',
        '4-px': '4px',
        '5-px': '5px',
        '6-px': '6px',
        '7-px': '7px',
        '8-px': '8px',
        '9-px': '9px',
        '10-px': '10px',
        '12-px': '12px',
        '14-px': '14px',
        '16-px': '16px',
        '18-px': '18px',
        '20-px': '20px',
        '22-px': '22px',
        '24-px': '24px',
        '26-px': '26px',
        '28-px': '28px',
        '30-px': '30px',
        '32-px': '32px',
        '34-px': '34px',
        '36-px': '36px',
        '38-px': '38px',
        '40-px': '40px',
        '42-px': '42px',
        '44-px': '44px',
        '46-px': '46px',
        '48-px': '48px',
        '50-px': '50px',
        '56-px': '56px',
        '58-px': '58px',
        '60-px': '60px',
        '62-px': '62px',
        '64-px': '64px',
        '66-px': '66px',
        '70-px': '70px',
        '74-px': '74px',
        '76-px': '76px',
        '80-px': '80px',
        '100-px': '100px',
        '110-px': '110px',
        '120-px': '120px',
        '128-px': '128px',
        '130-px': '130px',
        '168-px': '168px',
        'checkbox-marked-icon-spacing': 'var(--checkbox-marked-icon-spacing)',
        ...spacings
      },
      margin: {
        '0-px': '0px',
        '1-px': '1px',
        '2-px': '2px',
        '4-px': '4px',
        '6-px': '6px',
        '8-px': '8px',
        '10-px': '10px',
        '12-px': '12px',
        '14-px': '14px',
        '16-px': '16px',
        '18-px': '18px',
        '20-px': '20px',
        '22-px': '22px',
        '24-px': '24px',
        '26-px': '26px',
        '28-px': '28px',
        '30-px': '30px',
        '32-px': '32px',
        '34-px': '34px',
        '36-px': '36px',
        '38-px': '38px',
        '40-px': '40px',
        '48-px': '48px',
        '50-px': '50px',
        '54-px': '54px',
        '56-px': '56px',
        '60-px': '60px',
        '70-px': '70px',
        '72-px': '72px',
        '75-px': '75px',
        '80-px': '80px',
        '96-px': '96px',
        '100-px': '100px',
        '120-px': '120px',
        '126-px': '126px',
        '130-px': '130px',
        '260-px': '260px',
        '282-px': '282px',
        ...spacings
      },
      height: {
        '1-px': '1px',
        '2-px': '2px',
        '6-px': '6px',
        '8-px': '8px',
        '10-px': '10px',
        '12-px': '12px',
        '14-px': '14px',
        '16-px': '16px',
        '18-px': '18px',
        '19-px': '19px',
        '20-px': '20px',
        '22-px': '22px',
        '24-px': '24px',
        '30-px': '30px',
        '32-px': '32px',
        '34-px': '34px',
        '36-px': '36px',
        '38-px': '38px',
        '40-px': '40px',
        '42-px': '42px',
        '44-px': '44px',
        '45-px': '45px',
        '46-px': '46px',
        '48-px': '48px',
        '50-px': '50px',
        '54-px': '54px',
        '56-px': '56px',
        '60-px': '60px',
        '64-px': '64px',
        '68-px': '68px',
        '70-px': '70px',
        '74-px': '74px',
        '78-px': '78px',
        '84-px': '84px',
        '92-px': '92px',
        '100-px': '100px',
        '110-px': '110px',
        '168-px': '168px',
        '192-px': '192px',
        '228-px': '228px',
        '240-px': '240px',
        '282-px': '282px',
        '465-px': '465px',
        '756-px': '756px',
        '62-vh': '62vh',
        '68-vh': '68vh',
        '100-vh': '100vh',
        'dropdown-option-height': 'var(--dropdown-option-height)',
        'toggle-height': 'var(--toggle-height)',
        ...dimensions
      },
      minHeight: {
        '70-px': '70px',
        '228-px': '228px',
        'dropdown-option-height': 'var(--dropdown-option-height)',
        ...dimensions
      },
      maxHeight: {
        '20-px': '20px',
        '36-px': '36px',
        'dropdown-option-height': 'var(--dropdown-option-height)',
        ...dimensions
      },
      lineHeight: {
        'normal': 'normal',
        '19': '19.6px',
        '20': '20px'
      },
      width: {
        '1-px': '1px',
        '6-px': '6px',
        '8-px': '8px',
        '10-px': '10px',
        '12-px': '12px',
        '14-px': '14px',
        '16-px': '16px',
        '18-px': '18px',
        '20-px': '20px',
        '24-px': '24px',
        '28-px': '28px',
        '30-px': '30px',
        '32-px': '32px',
        '34-px': '34px',
        '36-px': '36px',
        '38-px': '38px',
        '40-px': '40px',
        '42-px': '42px',
        '45-px': '45px',
        '46-px': '46px',
        '48-px': '48px',
        '50-px': '50px',
        '56-px': '56px',
        '60-px': '60px',
        '64-px': '64px',
        '68-px': '68px',
        '70-px': '70px',
        '80-px': '80px',
        '82-px': '82px',
        '92-px': '92px',
        '98-px': '98px',
        '100-px': '100px',
        '110-px': '110px',
        '118-px': '118px',
        '120-px': '120px',
        '138-px': '138px',
        '150-px': '150px',
        '160-px': '160px',
        '176-px': '176px',
        '180-px': '180px',
        '184-px': '184px',
        '200-px': '200px',
        '218-px': '218px',
        '220-px': '220px',
        '226-px': '226px',
        '240-px': '240px',
        '242-px': '242px',
        '246-px': '246px',
        '260-px': '260px',
        '270-px': '270px',
        '282-px': '282px',
        '288-px': '288px',
        '290-px': '290px',
        '296-px': '296px',
        '300-px': '300px',
        '302-px': '302px',
        '320-px': '320px',
        '350-px': '350px',
        '352-px': '352px',
        '354-px': '354px',
        '360-px': '360px',
        '388-px': '388px',
        '400-px': '400px',
        '404-px': '404px',
        '420-px': '420px',
        '450-px': '450px',
        '452-px': '452px',
        '466-px': '466px',
        '600-px': '600px',
        '674-px': '674px',
        '800-px': '800px',
        '960-px': '960px',
        '4-vw': '4vw',
        '10-vw': '10vw',
        '14-vw': '14vw',
        '20-vw': '20vw',
        '27-vw': '27vw',
        '28-vw': '28vw',
        '30-vw': '30vw',
        '32-vw': '32vw',
        '34-vw': '34vw',
        '36-vw': '36vw',
        '40-vw': '40vw',
        '45-vw': '45vw',
        '50-vw': '50vw',
        '52-vw': '52vw',
        '75-vw': '75vw',
        '100-vh': '100vh',
        'toggle-width': 'var(--toggle-width)',
      },
      minWidth: {
        '120-px': '120px',
        '160-px': '160px',
        '250-px': '250px',
        '300-px': '300px',
        ...dimensions
      },
      maxWidth: {
        '20-px': '20px',
        '66-px': '66px',
        '104-px': '104px',
        '144-px': '144px',
        '296-px': '296px',
        '300-px': '300px',
        '600-px': '600px',
        ...dimensions
      },
      borderRadius: {
        '0-px': '0px',
        '4-px': '4px',
        '5-px': '5px',
        '6-px': '6px',
        '8-px': '8px',
        '10-px': '10px',
        '12-px': '12px',
        '16-px': '16px',
        '20-px': '20px',
        '48-px': '48px',
        '99-px': '99px',
        '50': '50%',
        ...borderRadius
      },
      borderWidth: {
        '0-px': '0px',
        '0.5-px': '0.5px',
        '1-px': '1px',
        '2-px': '2px',
        '3-px': '3px',
        '4-px': '4px',
        '6-px': '6px',
        '8-px': '8px',
        '12-px': '12px',
        ...borderWidth
      },
      borderColor: {
        'box-color': customColors['box-color'],
        'faded-text-color': customColors['faded-text-color'],
        'slightly-normal-text-color': customColors['slightly-normal-text-color'],
        'check-box': customColors['check-box'],
        'disabled-bg-color': customColors['disabled-bg-color'],
        'success-toast': customColors['success-toast'],
        'separator': customColors['separator'],
        'line-inactive': customColors['line-inactive'],
        'alert-toast': customColors['alert-toast'],
        'sub-text-color': customColors['sub-text-color'],
        ...customColors,
        ...borderColors,
        ...componentVariables
      },
      backgroundImage: {
        'btn-cta': 'var(--mandatory-field-color)',
        'header-1': 'linear-gradient(141.67deg, rgba(225, 238, 255, 0.59) 21.38%, rgba(255, 228, 251, 0.75) 122.46%)',
        'header-2': 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%)',
        'btn-primary-bg': 'var(--btn-primary-bg)',
        ...gradient,
        ...componentVariables
      },
      fontFamily: {
        'primary': 'var(--font-primary)',
      },
      boxShadow: {
        'app-card': '0px 2px 10px rgba(44, 48, 78, 0.1)',
        'btn-cta-shadow': 'var(--btn-cta-shadow)',
        'chip-shadow': '0 2px 4px rgba(0, 0, 0, 0.2)',
        'stats-box': '0px 4px 4px 0px rgba(255, 255, 255, 0.02), 3px 3px 6px 0px rgba(255, 255, 255, 0.60) inset',
        ...shadow
      },
      dropShadow: {
      },
      screens: {
        'max-xl': {'max': '1440px'},
        'max-lg': {'max': '1024px'}
      },
      spacing: {
        '2-px': '2px',
        '8-px': '8px',
        '10-px': '10px',
        '12-px': '12px',
        '14-px': '14px',
        '24-px': '24px',
        '30-px': '30px',
        '36-px': '36px',
      },
      translate: {
        'toggle-circle-translate': 'var(--toggle-circle-translate)',
      },
      top: {
        '70': '70%'
      },
      lineHeight: {
        '16-px': '16px'
      },
      content: {
        'no': "'No'",
        'yes': "'Yes'",
        'empty': "''",
        'toggle-text-yes': 'var(--toggle-text-yes)',
        'toggle-text-no': 'var(--toggle-text-no)',
      },
      left: {
        '5px': '5px',
        '2': '0.5rem',
        '6': '1.5rem'
      },
      bottom: {
        '0': '0',
      }
    },
  },
  plugins: [],
}
