# TheRARBG Tampermonkey Theme

A local Tampermonkey userscript that gives TheRARBG a cleaner, responsive dark interface without changing the site's main search, sorting, pagination or download behaviour.

## Features

- Includes 12 persistent dark palettes: Midnight, Black, Slate, Blue, Teal, Emerald, Olive, Amber, Crimson, Magenta, Purple and Espresso.
- Applies a consistent responsive theme across home, results, trending, catalogue, feature and torrent-detail pages.
- Improves torrent tables, catalogue cards and poster listings for clearer reading on desktop and mobile.
- Unifies navigation, search filters, pagination and footer controls throughout the site.
- Uses no external dependencies or privileged userscript APIs.

## Requirements

- A current desktop browser supported by [Tampermonkey](https://www.tampermonkey.net/).
- The Tampermonkey extension installed and enabled.

## Install with Tampermonkey

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser.
2. Open the [userscript installation link](https://raw.githubusercontent.com/noswimmingplease/therarbg-modern-theme/main/therarbg-modern-theme.user.js).
3. Tampermonkey should open an installation page. Review the script details and select **Install**.
4. Visit a supported TheRARBG page or reload one that is already open.

If the installation page does not open, create a new script in the Tampermonkey dashboard, replace the template with the complete contents of [`therarbg-modern-theme.user.js`](therarbg-modern-theme.user.js), then save it.

## Supported pages

The script runs on:

- `https://therarbg.com/`
- `https://therarbg.com/get-posts...` results and category pages
- `https://therarbg.com/trending...` trending pages
- `https://therarbg.com/catalog...` catalogue pages
- `https://therarbg.com/main-page-list...` compact navigation pages
- `https://therarbg.com/hot-pick-post/...` Hot Picks pages
- `https://therarbg.com/top-ten-post/...` Top Ten pages
- `https://therarbg.com/latest-trailer...` latest-trailer pages
- `https://therarbg.com/box-office...` box-office pages
- `https://therarbg.com/post-detail/...` torrent-detail pages

It deliberately does not run on unrelated TheRARBG routes.

## How to use it

1. Open a supported page while the script is enabled in Tampermonkey.
2. Use the **Colour** selector in the top navigation to choose one of the 12 palettes.
3. On home and results pages, use **Show thumbnails** to reveal secondary carousels, tags and recent searches; select **Hide thumbnails** to collapse them again.

The selected colour and thumbnail setting are stored locally for later visits. To restore the default appearance, select **Midnight** and **Hide thumbnails**.

## Updates

Tampermonkey can check the repository automatically using the update addresses in the userscript metadata. You can also reinstall from the installation link above to obtain the current version.

If you installed v0.1.4 manually, open the installation link once and confirm the update to the current version. Earlier versions did not contain the repository update address, so they cannot discover later releases automatically. Future versions can then be found through Tampermonkey's update checks.

## Disable or remove

Open the Tampermonkey dashboard and either switch off **TheRARBG Tampermonkey Theme** temporarily or delete it. Reload TheRARBG afterwards; the website itself is not modified.

## Troubleshooting

- Confirm the script is enabled in the Tampermonkey dashboard.
- Confirm the address starts with one of the supported routes above.
- Reload the page after installing or updating the script.
- If another style extension overrides the theme, temporarily disable that extension to identify the conflict.
- Report reproducible problems through [GitHub Issues](https://github.com/noswimmingplease/therarbg-modern-theme/issues), including the page address, browser, Tampermonkey version and a screenshot where useful.

## Permissions and privacy

The script requests no privileged Tampermonkey permissions. It does not make network requests, load remote code, read credentials or transmit usage data. Its only stored values are the selected palette and whether extras are expanded.

## Scope and safety

This is a presentation-only userscript. It does not send credentials, call site APIs or add network requests. It cosmetically hides validated full-page click-catchers from known advertising hosts, but it does not stop their scripts or network activity; use a reputable content blocker for that.

This project is not affiliated with TheRARBG or Tampermonkey.
