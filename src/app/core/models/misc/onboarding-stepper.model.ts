export type OnboardingStepper = {
    active: boolean,
    number: number,
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
