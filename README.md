# Seia-Soto/medium-limit-bypass

A simple chrome extension to bypass medium free reading limit.
Also, you can get how to bypass permanently without using extension.

> The concept of this extension is proof, not working one.

## Table of Contents

- [Usage](#usage)
- [Behind the scense](#behind-the-scense)

----

# Usage

To use this extension, you can with few steps.

1. Clone or download this repository.
2. Go to 'chrome://extensions' page or your webbrowser extension manager page.
3. Enable developer mode.
  - On Chrome, you can toggle the mode with switch at top right.
4. Load extension from sources or files.
5. Select `src` folder in this repository.
6. Refresh the webpage.

> For Firefox or browsers require manifest v2, please use `srcv2` directory instead.

# Behind the scense

## v1.1.0

> [Manifest v3 is deceitful](https://www.eff.org/deeplinks/2021/12/chrome-users-beware-manifest-v3-deceitful-and-threatening) but I decided to move over Manifest v3 as Firefox follows.

I've upgraded the way to bypass the Medium and its tracking service.
They did move the user detection to server-side to enforce userscripts and simple extensions.

However, I am introducing new extension to support:
- Manifest v3
- Automatic refresh before reaching on server-side limit
- Fake reading limit data generation for client-side
- Inject again when popstate(browser history) changes
- Removal of Medium tracking and temporal post view history
- Faster medium website detection (client-side)

In this case, I improved the extension to mitigate both server-side and client-side detection.

For client-side, as always, removing the value from localStorage is helpful.
Also, by moving the Medium detection logic to client-side, the speed to detect the Medium site hugely leaped.
It's because of SSR feature of Medium.
We can query the DOM to search script tags.

For server-side, refreshing the UID cookie is required.
To reduce useless loads, I decided to use dynamically refreshing the webpage by Medium API response and remove the cookie when requested.

## v1.0.0

Basically, you can do same as this extension does because this is a simple trick.
Just follow the steps below:

1. Open [`medium.com`](https://medium.com).
2. Click a lock icon or site information icon before URL begins at search input.
3. Open or show a window related to Cookie.
4. Delete or prevent all cookies from `medium.com` or Medium related ones.
5. Refresh the webpage.

Cookies can track you with unique ID generated because your ID is unique.
Also, there is no reason that Medium not to use this simple trick.

# LICENSE

This project is distributed under [MIT license](./LICENSE).
All icons are from [UXFree.com](https://img.uxfree.com/wp-content/uploads/2017/03/medium-icon-white-on-black.png) and resized.
