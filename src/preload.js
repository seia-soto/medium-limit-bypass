(() => {
  const script = async () => {
    /**
     * @param {string} message
     */
    const log = (message) => {
      console.log(
        '[medium-limit-bypass] ' +
        message
      )
    }

    if (
      typeof window === 'undefined' ||
      !window.localStorage
    ) {
      log('failed to load window or localStroage object!')

      return
    }

    const isMediumSite = () => !!document.querySelector('script[src*="cdn-client.medium.com"]')

    if (!isMediumSite) {
      log('not a medium site!')

      return
    }

    const removeAnalytics = () => {
      const keys = Object.keys(window.localStorage)

      for (let i = 0, l = keys.length; i < l; i++) {
        if (!keys[i].startsWith('EventReporter')) {
          continue
        }

        log('removing ' + keys[i])

        window.localStorage.removeItem(keys[i])
      }
    }

    const removePageViews = () => {
      const keys = Object.keys(window.localStorage)

      for (let i = 0, l = keys.length; i < l; i++) {
        if (keys[i][0] !== 'p') {
          continue
        }

        log('removing ' + keys[i])

        window.localStorage.removeItem(keys[i])
      }
    }

    const removeIdentifier = () => {
      chrome.runtime.sendMessage({ url: window.location.href })
    }

    const stack = () => {
      removeIdentifier()
      removePageViews()
      removeAnalytics()
    }

    stack()

    window.addEventListener('popstate', () => stack())
  }

  script()
})()
