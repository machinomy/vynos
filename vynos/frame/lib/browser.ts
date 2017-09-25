// @flow

import Promise from "bluebird";

export default {
  tabs: {
    create: function(options: any) {
      if (chrome.tabs) {
        chrome.tabs.create(options)
      }
    }
  },
  extension: {
    getBackgroundPage: () => {
      return chrome.extension.getBackgroundPage()
    },
    getURL: (resourceName: string) => {
      return chrome.extension.getURL(resourceName)
    }
  },
  runtime: {
    sendMessage: (message: Object): Promise<Object> => {
      const promisified = Promise.promisify(chrome.runtime.sendMessage);
      return promisified(message, () => {});
    },
    connect: (params: {name: string}) => {
      return chrome.runtime.connect(params)
    },
    onConnect: chrome.runtime.onConnect
  }
}
