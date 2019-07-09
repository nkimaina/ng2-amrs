[![Build Status](https://travis-ci.org/AMPATH/ng2-amrs.svg?branch=master)](https://travis-ci.org/AMPATH/ng2-amrs)

# Ng2Amrs

This is the point of care system used by Ampath Clinics. It should be compatible with most openmrs versions but it is tested against platform 2.0.2 with the REST module. It also requires https://github.com/AMPATH/etl-rest-server for all features to work properly.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Single SPA HOW-TO

1. Serve the application from port 4200 (or whichever you prefer)

```sh
ng serve --port 4200 --deploy-url http://localhost:4200 --disable-host-check --ssl
```

2. Open the running app that you want to overide ng2-amrs e.g https://ngx.ampath.or.ke/amrs-backup/spa, and run the following on the browser web tool console

```js
importMapOverrides.addOverride('@ampath/poc', 'https://localhost:4200/main.js');
```

3. Modify any part of ng2-amrs, and refresh the app in the browser to see if the changes are reflected

