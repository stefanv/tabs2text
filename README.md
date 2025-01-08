# tabs2text: a Chrome & Firefox extension

## Export a list of tabs in markdown / org format

Please read [the accompanying blog post](https://mentat.za.net/blog/2024/11/13/exporting-chromium-tabs/) for more information.

## Installation: Chrome

- Navigate to Extensions -> Manage Extensions, and toggle the “Developer Mode” button at the top right.
- Click "Load unpacked" and select the `chrome` folder in this repository directory.
- tabs2text should now be visible under the list of extensions (typically a little puzzle piece in the top bar).

## Installation: Firefox (pre-built)

Download the `.xpi` from the [releases page](https://github.com/stefanv/tabs2text/releases) and install.

## Installation: Firefox (from source)

- Navigate to This Firefox: `about:debugging#/runtime/this-firefox`
- Choose "Load Temporary Add-on..." and select the `firefox` folder in this repository directory.
- tabs2text should now be visible under the list of extensions (typically a little puzzle piece in the top bar).

Note that, in Firefox, such developer extensions disappear after each restart, and then have to be re-added.

## Developer notes (for stefan)

To build a signed version of the package, export `JWT_ISSUER` and `JWT_SECRET` env vars, then `cd firefox && make`.
