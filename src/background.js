// NOTE: Additional term for possible chrome-like browsers;
browser = chrome || browser
browser.cookies = browser.cookies || browser.experimental.cookies

const medium = 'medium.com'
const domainPattern = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?([^:\/?\n]+)/igm

// NOTE: Cache for medium based websites and this should be empty as browser start to prevent false positive cases;
const mediumLike = []

const buildCookieURL = cookie => {
  const protocol = cookie.secure ? 'https:' : 'http:'

  return protocol + '//' + cookie.domain + cookie.path
}
const buildCookieDetails = cookie => {
  return {
    name: cookie.name,
    storeId: cookie.storeId,
    url: buildCookieURL(cookie)
  }
}
const getAllCookies = domain => {
  return new Promise((resolve, reject) => {
    browser.cookies.getAll({ domain }, cookies => resolve(cookies))
  })
}
const removeCookie = cookie => {
  return new Promise((resolve, reject) => {
    browser.cookies.remove(buildCookieDetails(cookie), result => {
      if (!result) {
        console.error('Failed to remove cookie:', cookie.domain, cookie.path, cookie.name)
      } else {
        console.log('Successfully removed cookie:', result)
      }

      resolve()
    })
  })
}
const removeAllCookies = domain => {
  Promise.all([
    getAllCookies(domain),
    getAllCookies('.' + domain)
  ])
    .then(sites => {
      let sitesLn = sites.length

      while (--sitesLn) {
        const cookies = sites[sitesLn]

        if (!cookies) return

        let cookiesLn = cookies.length

        while (--cookiesLn) {
          removeCookie(cookies[cookiesLn])
        }
      }
    })
}

// NOTE: Remove cookies on medium-related cookies added;
browser.cookies.onChanged.addListener(changedInfo => {
  const { cookie, removed } = changedInfo

  if (!removed) return

  const isMediumCookie =
    (cookie.domain.endsWith(medium))
  const isMediumBasedCookie =
    (mediumLike.indexOf(cookie.domain) > -1)
  if (!isMediumCookie || !isMediumBasedCookie) return

  removeCookie(cookie)
})

// NOTE: Detect cookies on medium-based sites;
browser.webRequest.onCompleted.addListener(
  details => {
    if (!details.url.includes('cdn-client.medium.com') || !details.initiator) return

    const result = domainPattern.exec(details.initiator)

    if (!result) return

    const [, domain] = result

    if (domain && mediumLike.indexOf(domain) === -1) {
      mediumLike.push(domain)
      mediumLike.push('.' + domain)

      removeAllCookies(domain)

      console.log('Detected new Medium based website:', domain)
    }
  },
  {
    urls: [
      '<all_urls>'
    ]
  }
)

// NOTE: Remove all cookies on initial installation;
removeAllCookies(medium)
