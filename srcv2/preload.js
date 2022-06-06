(() => {
  browser = chrome || browser

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

    const isMediumSite = !!document.querySelector('script[src*="cdn-client.medium.com"]')

    if (!isMediumSite) {
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
      browser.runtime.sendMessage({ url: window.location.href })
    }

    const removeMeteringRequest = () => {
      const reform = (result) => {
        if (result?.[0]?.data?.meterPost) {
          log('reforming post viewer metering response')

          if (result[0].data.meterPost.unlocksRemaining <= 1) {
            log('refreshing page to reset user id')

            window.location.reload()
          }

          result[0].data.meterPost = {
            maxUnlockCount: 3,
            unlocksRemaining: 3,
            postIds: [],
            __typename: 'MeteringInfo'
          }
        }

        return result
      }

      log('hooking Response.prototype.json')

      Response.prototype.json = new Proxy(
        Response.prototype.json,
        {
          apply(...args) {
            return Reflect
              .apply(...args)
              .then(result => reform(result))
          }
        }
      )

      log('hooking JSON.parse')

      JSON.parse = new Proxy(
        JSON.parse,
        {
          apply(...args) {
            return reform(Reflect.apply(...args))
          }
        }
      )

      const testPayload = '{"a":1}'
      const test = (payload, fnName) => {
        if (!payload.a) {
          log('failed to hook ' + fnName)
        }
      }

      new Response(testPayload)
        .json()
        .then(payload => test(payload, 'Response.prototype.json'))

      test(JSON.parse(testPayload), 'JSON.parse')
    }

    removeMeteringRequest()

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
