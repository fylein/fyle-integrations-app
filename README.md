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
* Install dependencies

    ```bash
    npm install
    ```

* Copy `environment.json` from integrations-central/ and add it to `src/environments`

    ```bash
    cp ../fyle-integrations-central/app-secrets/integrations-app/environment.json src/environments/environment.json
    cp ../fyle-integrations-central/app-secrets/integrations-app/config.json src/app/branding/config.json
    ```

* Run app

    ```bash
    npm start
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