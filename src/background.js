(() => {
  browser = chrome || browser

  browser.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      if (
        !request.url ||
        !request.url.startsWith('https://')
      ) {
        return
      }

      browser.cookies.remove(
        {
          name: 'uid',
          url: request.url
        }
      )
    }
  )

  const navigationEventHandler = (details) => {
    if (
      !details.url ||
      !details.url.startsWith('https://')
    ) {
      return
    }

    browser.scripting.executeScript(
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

  browser.webNavigation.onHistoryStateUpdated.addListener(navigationEventHandler)
})()
