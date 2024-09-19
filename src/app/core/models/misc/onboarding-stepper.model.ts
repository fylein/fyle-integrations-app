export interface OnboardingStepper {
    active: boolean,
    completed: boolean,
    step: string,
    icon: string,
    route: string,
    styleClasses?: string[]
  }
