declare module "little-router" {
  interface RouteElement {
    path: string;
    component: Object
  }

  export class RouteSomething {
    route: RouteElement
  }

  export function match(args: any): RouteSomething
}
