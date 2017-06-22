// @flow

type Extension = {
  getBackgroundPage(): Window,
  getURL(resource: string): string
}

type OnEvent = {
  addListener: (handler: () => void) => void
}

type OnMessageEvent = {
  addListener: (handler: (message: any) => void) => void
}

declare type Port = {
  name: string,
  disconnect: () => void,
  onDisconnect: OnEvent,
  onMessage: OnMessageEvent,
  postMessage: (message: any) => void
}

type Runtime = {
  onMessage: {
    addListener: (handler: (message: any, sender: any, sendResponse: (r: any) => void) => void) => void
  },
  sendMessage: (message: any, callback: (response: any) => void) => void,
  Port: Port,
  connect: (params: {name: string}) => Port,
  onConnect: {
    addListener: (handler: (port: Port) => void) => void
  }
}

type CreateProperties = {
  active?: boolean,
  url?: string
}

type Tabs = {
  create: (createProperties: CreateProperties) => void
}

type Chrome = {
  extension: Extension,
  runtime: Runtime,
  tabs: Tabs
}

declare var chrome: Chrome;
