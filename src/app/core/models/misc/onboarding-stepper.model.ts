export type OnboardingStepper = {
    active: boolean,
    completed: boolean,
    step: string,
    icon: string,
    route: string,
    size: {
      height: string,
      width: string
    },
    styleClasses?: string[]
  }
