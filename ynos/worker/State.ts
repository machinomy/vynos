export interface RuntimeState {

}

export interface PageState {
  name: string
}

export interface SharedState {
  page: PageState
}

export interface BackgroundState {

}

export interface State {
  background: BackgroundState,
  runtime: RuntimeState,
  shared: SharedState
}

export const INITIAL_STATE: State = {
  background: {},
  runtime: {},
  shared: {
    page: {
      name: "wallet"
    }
  }
}
