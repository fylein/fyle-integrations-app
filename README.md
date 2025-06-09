# Fyle Integrations Settings App
Frontend Repository for Fyle Integrations Settings Dashboard App

## Pre-requisite repo
required for running Integration setting app
[Integration Settings API](https://github.com/fylein/fyle-integrations-settings-api)

required based on the your needs
[qbd-api](https://github.com/fylein/fyle-qbd-api) while working in QBD

## Storybook
Please refer this link to find the [storybook](https://fylein.github.io/fyle-integrations-app/) of the project.

## Local development setup
### Setup - 1 (Recommended)
Follow instructions mentioned in [Integrations Central](https://github.com/fylein/fyle-integrations-central/)

### Setup - 2
* Run the `integrations-settings-api` service following instructions from [Integrations Central](https://github.com/fylein/fyle-integrations-central/)


* Install dependencies

    ```bash
    npm install
    ```

* Copy `environment.json` from integrations-central/ and add it to `src/environments`

    ```bash
    cp ../fyle-integrations-central/app-secrets/integrations-app/environment.json src/environments/environment.json
    cp ../fyle-integrations-central/app-secrets/integrations-app/config.json src/app/branding/config.json
    ```

* Copy `fyle-environment.json` from integrations-central/ and add it to `src/environments`

    ```bash
    cp ../fyle-integrations-central/app-secrets/integrations-app/fyle-environment.json src/environments/fyle-environment.json
    cp ../fyle-integrations-central/app-secrets/integrations-app/fyle-config.json src/app/branding/fyle-config.json
    ```

* Copy `c1-environment.json` from integrations-central/ and add it to `src/environments`

    ```bash
    cp ../fyle-integrations-central/app-secrets/integrations-app/c1-environment.json src/environments/c1-environment.json
    cp ../fyle-integrations-central/app-secrets/integrations-app/c1-config.json src/app/branding/c1-config.json
    ```

* Run app

    ```bash
    npm start
    ```

* Run app in Fyle theme

    ```bash
    npm run start:fyle
    ```

    or

    ```bash
    ng serve --configuration=fyle
    ```

* Run app in Capital One theme

    ```bash
    npm run start:c1
    ```

    or

    ```bash
    ng serve --configuration=c1
    ```

* Run unit test 

    ```bash
    npm test
    ```

* Checkout code coverage

    1. Naviage to coverage/index.html
    2. Right click and select `Reveal in Finder`
    3. Open the file in chrome/other browser

* Login to app

    ```bash
    http://localhost:4200/auth/redirect
    ```
