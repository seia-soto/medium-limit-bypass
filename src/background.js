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
})()
