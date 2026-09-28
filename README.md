# PogoMapper Waze Button

A lightweight Tampermonkey userscript that adds a **Waze button** on [PogoMapper](https://pogomapper.co.uk/). Opens the selected Pokemon's location in Waze using the exact coordinates from its Google Maps link.

The original Map button stays available. No API key, build step, or external JavaScript library is needed.

## Features

- Preserves every decimal digit of the original destination coordinates.
- Matches the site's icon buttons and keeps Waze beside Map.
- Handles newly opened popups and changes to the selected destination.
- Uses a Waze HTTPS link in a new tab on both desktop and Android.
- Embeds the logo as SVG, with no external image download.
- Batches relevant page changes without continuous polling, and skips link rescans for unrelated marker/countdown updates.
- Also works on other map objects that expose the same Google Maps coordinate links.

## Compatibility

| Platform | Requirements and behaviour |
| --- | --- |
| Android | Supported browsers with Tampermonkey. Install Waze to navigate in the app; opening it depends on browser and Android link handling. |
| Desktop | Supported browsers with Tampermonkey. The button opens Waze's website in a new tab. |

Use PogoMapper in the browser where you installed the script, with your usual site access. The script runs only on HTTPS pages at `pogomapper.co.uk` and its subdomains.

The button requests navigation through [Waze's supported HTTPS links](https://developers.google.com/waze/deeplinks). It does not force-end or replace an active route. You may need to confirm the new destination or end the existing route inside Waze.

## Installation

### Firefox on Android

1. Install the Waze app if you want navigation in the app, and open it once to finish setup.
2. In Firefox, install [Tampermonkey](https://addons.mozilla.org/en-US/android/addon/tampermonkey/). Mozilla also provides an [extension installation guide](https://support.mozilla.org/en-US/kb/find-and-install-add-ons-firefox-android).
3. Open [pogomapper-waze.js](pogomapper-waze.js) in this repository and tap **Raw** to view the code.
4. Copy the code and follow the manual installation steps below.
5. Reload PogoMapper and select a Pokemon. Tap the **Waze logo** and accept any prompt to open Waze.

### Desktop

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser.
2. Open [pogomapper-waze.js](pogomapper-waze.js), select **Raw**, and copy the code. Follow the manual installation steps below.
3. Reload PogoMapper, select a Pokemon, and click its Waze button.

### Manual installation or a script shared as a file

1. Copy the entire contents of `pogomapper-waze.js`, including the metadata at the top. Open a downloaded file in a text editor/viewer if needed.
2. Open Tampermonkey's **Dashboard**, then **+ / Add a new script**. On Android, access Tampermonkey through the browser's **Extensions** menu.
3. Delete all placeholder code and paste the copied script.
4. Choose **File > Save** in the editor (or press **Ctrl+S** on desktop).
5. Check that **PogoMapper - Waze button** is enabled, then reload PogoMapper.

For more detail, see [Tampermonkey's script installation instructions](https://www.tampermonkey.net/faq.php?q=Q102).

## Updating and removing

To update manually, open the existing script in Tampermonkey, replace its contents with the latest file, save, and reload PogoMapper. Keep only one copy enabled.

Manual copy/paste installations do not have a configured update URL. To check your installed version, look at `@version` near the top of the script or the version listed in Tampermonkey.

To remove the button, disable or delete the script in Tampermonkey and reload PogoMapper.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| No Waze button | Enable Tampermonkey and the script, reload the site, then open a map popup. The original Map button must contain a supported Google Maps link with numeric coordinates. |
| Waze opens in a browser instead of the app | Check that Waze is installed and accept any external-app prompt. The script opens an HTTPS link; browser and system settings determine whether it reaches the app. |
| Waze keeps the previous route | End or replace the route inside Waze. Automatic route replacement is not provided by this script. |
| Duplicate Waze buttons | Remove or disable older copies of the userscript, then reload. |
| Layout changes or button stops appearing | PogoMapper may have changed its markup or link format. Report the browser, script version, and reproduction steps in a repository issue. |

## Privacy and permissions

The script reads Google Maps links already present on the page and adds a Waze link beside them. It does not request your device location, store data, load remote code, or make background network requests. It uses `@grant none` and adds no privileged Tampermonkey API permissions; the extension itself has its own permissions.

Clicking the button passes the selected destination to Waze. The link includes the fixed source label `utm_source=pogomapper_userscript`, with no user identifier added by this script. Waze's own service and app behaviour apply after opening the link.

## Development

Edit the userscript directly; there is no package installation or build process. Only `pogomapper-waze.js` is needed for installation or sharing.

After making changes, reload PogoMapper and check that the Waze button appears beside Map, uses the same coordinates, and updates when you select a different Pokemon. Open and close several popups to check for duplicate buttons. Check app handoff separately on your phone.

## Licence and attribution

The project code is available under the [MIT licence](LICENSE). The embedded Waze icon is separately licensed under **CC BY 4.0**; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for its source and attribution.

This is an independent userscript, not an official PogoMapper, Waze, or Tampermonkey product.
