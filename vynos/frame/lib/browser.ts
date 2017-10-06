// @flow

import Promise = require("bluebird")

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
    connect: (params: {name: string}) => {
      return chrome.runtime.connect(params)
    },
    onConnect: chrome.runtime.onConnect
  }
}
