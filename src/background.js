chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (!request.url) {
      return
    }

    chrome.cookies.remove(
      {
        name: 'uid',
        url: request.url
      }
    )
  }
)

const navigationEventHandler = (details) => {
  chrome.scripting.executeScript(
    {
      files: [
        'hook.js'
      ],
      injectImmediately: true,
      world: 'MAIN',
      target: {
        tabId: details.tabId
      }
    }
  )
}

chrome.webNavigation.onHistoryStateUpdated.addListener(navigationEventHandler)
