# Leaflet

Mobile-friendly interactive maps - within WaxedPHP environment.

This package contains helper plugin functionality for WaxedPHP.
All required third party sources will be downloaded to npm during composer installation.
Prior to installation, this package must be already installed: waxedphp/waxedphp .

## Install:

Prior to installation, this package must be already installed: waxedphp/waxedphp .


```bash

# installs php package:
composer require waxedphp/leaflet
# installs npm packages:
composer exec "wax --install=leaflet"

```

## Build:

Before deployment to production, you need to compile.
Wax utilize internally Webpack.
Assuming, that you properly installed and configured package
waxedphp/waxedphp, you can use wax binary:


```bash

# be sure, that you switched WaxedPHP to development mode:
composer exec "wax --development"

# list created package combinations:
composer exec "wax --list"

# compile either all of them:
composer exec "wax --compile-all"

# or compile just particular one:
composer exec "wax --compile=[NUMBER]"

# switch WaxedPHP to production, to see results:
composer exec "wax --production"


```
