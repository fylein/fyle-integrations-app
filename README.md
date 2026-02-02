# Fyle Integrations Settings App
Frontend Repository for Fyle Integrations Settings Dashboard App


## Local development setup

#### 1. Setup all integrations-related repos

   If not already done, clone the [integrations central repo](https://github.com/fylein/fyle-integrations-central) and follow the [workspace setup instructions](https://github.com/fylein/fyle-integrations-central/?tab=readme-ov-file#setup-workspace) to clone all required repositories


#### 2. Start backend services

   After setting up integrations central and its [commands](https://github.com/fylein/fyle-integrations-central/?tab=readme-ov-file#interact-with-services), start the Integration settings API:

   ```bash
   start integrations-settings-api
   ```

   Certain features require additional services. For example, to support all features of Sage 50, run:

   ```bash
   start sage-file-export-api sage-file-utility-worker sage-file-import-worker sage-file-export-worker sage-file-worker
   ```

   For more info, check out the [docker-compose.yaml](https://github.com/fylein/fyle-integrations-central/blob/master/docker-compose.yml) or tag someone in `@integrations_engineering`


#### 3. Setup NVM & Node

   It's recommended to use Node Version Manager (nvm) to manage Node.js versions. Install NVM following [this guide](https://collabnix.com/how-to-install-and-configure-nvm-on-mac-os/).



   After installing NVM, use it to install the required Node.js version:

   ```bash
   nvm install v22.14.0
   nvm use v22.14.0
   nvm alias default v22.14.0
   ```

   > [!NOTE]
   >
   > * `nvm alias default v22.14.0` will set the node version to v22.14.0. Whenever a new    shell session is opened, the default Node.js version will be v22.14.0.
   > * If you're upgrading your node version, all your global packages needs to be    re-installed. For example, if you're upgrading from v20.17.0 to v22.14.0, you can do    following:
   >
   > ```bash
   > nvm reinstall-packages v20.17.0
   >  ```


#### 4. Install dependencies

   Use `npm ci` to install all necessary dependencies. This command removes any existing `node_modules` directory before installing to ensure a clean, repeatable install.

   ```bash
   npm ci
   ```

#### 5. Copy environement files from Integrations Central

* Copy `environment.json` from integrations-central/ and add it to `src/environments`

    ```bash
    cp ../fyle-integrations-central/app-secrets/integrations-app/environment.json src/environments/environment.json
    cp ../fyle-integrations-central/app-secrets/integrations-app/config.json src/app/branding/config.json
    ```

* Copy `fyle-environment.json` from integrations-central/ and add it to `src/environments`

    ```bash
    cp ../fyle-integrations-central/app-secrets/integrations-app/fyle-environment.json src/environments/fyle-environment.json
    cp ../fyle-integrations-central/app-secrets/integrations-app/fyle-config.json src/app/branding/fyle/config.json
    ```

* Copy `c1-environment.json` from integrations-central/ and add it to `src/environments`

    ```bash
    cp ../fyle-integrations-central/app-secrets/integrations-app/c1-environment.json src/environments/c1-environment.json
    cp ../fyle-integrations-central/app-secrets/integrations-app/c1-config.json src/app/branding/c1/config.json
    ```

#### 6. Run the app

   ```bash
   npm start
   ```

   Alternatively, you can specify the theme in which you'd like to start the app. You can run both side-by-side as well.

   * Run app in Fyle theme

       ```bash
       npm run start:fyle
       ```

   * Run app in Capital One theme

       ```bash
       npm run start:c1
       ```


#### 7. Access the app

   Head to the following URL in your browser to access the app:
   ```bash
   http://localhost:4200/auth/redirect
   ```

## Storybook 📖
> [!WARNING]
> This section is not actively maintained.

Please refer this link to find the [storybook](https://fylein.github.io/fyle-integrations-app/) of the project.


## Testing 🧪
> [!WARNING]
> This section is not actively maintained.

* Run unit test

    ```bash
    npm test
    ```

* Checkout code coverage

    1. Naviage to coverage/index.html
    2. Right click and select `Reveal in Finder`
    3. Open the file in chrome/other browser
