# Contentstack Marketplace DAM App Boilerplate

This boilerplate provides a template to create your own [Marketplace](https://www.contentstack.com/marketplace) DAM app, and can be deployed on [Launch](https://www.contentstack.com/launch).

## Prerequisite

* [Contentstack Account](https://app.contentstack.com/#!/login) with marketplace & Launch enabled
* Nodejs - v20.10.0 & NPM - v10.2.4

## Features

* React.js app template
* JSON RTE integration template
* Root config support for configuring the whole app
* Launch support for the UI & RTE of the app
* Script's npm command to manage development & production marketplace app
* Contentstack's Multi-region support provided in the script's command
* Secured app signing using JWT for APIs

## Structure of the Marketplace DAM App Boilerplate

<details>
  <summary>
    Reveal/Collapse the code structure
  </summary>
  
```bash
marketplace-dam-boilerplate-app
|-- scripts
|-- ui
    ├── babel.config.js
    ├── example
    │   ├── bynder
    │   │   ├── root_config
    │   │   │   ├── ConfigScreen
    │   │   │   │   └── index.tsx
    │   │   │   ├── CustomField
    │   │   │   │   └── index.tsx
    │   │   │   ├── DamEnv
    │   │   │   │   └── index.ts
    │   │   │   ├── index.tsx
    │   │   │   └── SelectorPage
    │   │   │       └── index.tsx
    │   │   └── rte_config
    │   │       ├── DamEnv
    │   │       │   └── index.tsx
    │   │       ├── index.tsx
    │   │       └── RTEFunctions
    │   │           └── index.tsx
    │   ├── cloudinary
    │   │   ├── root_config
    │   │   │   ├── ConfigScreen
    │   │   │   │   └── index.tsx
    │   │   │   ├── CustomField
    │   │   │   │   └── index.tsx
    │   │   │   ├── DamEnv
    │   │   │   │   └── index.ts
    │   │   │   ├── index.tsx
    │   │   │   └── SelectorPage
    │   │   │       └── index.tsx
    │   │   └── rte_config
    │   │       ├── DamEnv
    │   │       │   └── index.tsx
    │   │       ├── index.tsx
    │   │       └── RTEFunctions
    │   │           └── index.tsx
    │   └── sample_dam_app
    │       ├── root_config
    │       │   ├── AssetData
    │       │   │   └── index.tsx
    │       │   ├── ConfigScreen
    │       │   │   └── index.tsx
    │       │   ├── CustomComponent
    │       │   │   └── index.tsx
    │       │   ├── CustomField
    │       │   │   └── index.tsx
    │       │   ├── DamEnv
    │       │   │   └── index.ts
    │       │   ├── index.tsx
    │       │   ├── SelectorPage
    │       │   │   └── index.tsx
    │       │   ├── styles.scss
    │       └── rte_config
    │           ├── DamEnv
    │           │   └── index.tsx
    │           ├── index.tsx
    │           └── RTEFunctions
    │               └── index.tsx
    ├── jest.config.js
    ├── jest.CSStub.js
    ├── jest.setup.js
    ├── package.json
    ├── package-lock.json
    ├── public
    │   ├── favicon.ico
    │   └── index.html
    ├── rte
    │   ├── custom.d.ts
    │   ├── LICENSE
    │   ├── package.json
    │   ├── package-lock.json
    │   ├── SECURITY.md
    │   ├── src
    │   │   ├── common
    │   │   │   ├── constants
    │   │   │   │   └── index.ts
    │   │   │   ├── locale
    │   │   │   │   └── en-us
    │   │   │   │       └── index.ts
    │   │   │   └── utils
    │   │   │       └── index.ts
    │   │   ├── components
    │   │   │   ├── DAMIcon
    │   │   │   │   └── index.js
    │   │   │   ├── DeleteModal
    │   │   │   │   └── index.js
    │   │   │   ├── EmbedBtn
    │   │   │   │   └── index.js
    │   │   │   ├── ErrorImage
    │   │   │   │   └── index.js
    │   │   │   ├── ImageEditModal
    │   │   │   │   └── index.js
    │   │   │   ├── ImageElement
    │   │   │   │   └── index.js
    │   │   │   └── styles.scss
    │   │   ├── dam.ts
    │   │   ├── plugin.tsx
    │   │   └── rte_config
    │   │       ├── DamEnv
    │   │       │   └── index.tsx
    │   │       ├── index.tsx
    │   │       └── RTEFunctions
    │   │           └── index.tsx
    │   ├── tsconfig.json
    │   ├── webpack.common.js
    │   ├── webpack.dev.js
    │   └── webpack.prod.js
    ├── src
    │   ├── common
    │   │   ├── asset
    │   │   │   ├── logo.svg
    │   │   │   └── NoImg.svg
    │   │   ├── constants
    │   │   │   └── index.tsx
    │   │   ├── contexts
    │   │   │   ├── AppConfigContext.tsx
    │   │   │   ├── ConfigStateContext.tsx
    │   │   │   ├── CustomFieldContext.tsx
    │   │   │   └── MarketplaceAppContext.tsx
    │   │   ├── hooks
    │   │   │   └── useAppLocation.ts
    │   │   ├── locale
    │   │   │   └── en-us
    │   │   │       └── index.ts
    │   │   ├── providers
    │   │   │   ├── AppConfigProvider.tsx
    │   │   │   ├── ConfigStateProvider.tsx
    │   │   │   ├── CustomFieldProvider.tsx
    │   │   │   └── MarketplaceAppProvider.tsx
    │   │   ├── types
    │   │   │   └── index.ts
    │   │   └── utils
    │   │       ├── ConfigScreenUtils.tsx
    │   │       ├── CustomFieldUtils.tsx
    │   │       ├── index.tsx
    │   │       └── SelectorPageUtils.tsx
    │   ├── components
    │   │   ├── AppFailed
    │   │   │   └── index.tsx
    │   │   ├── DeleteModal
    │   │   │   └── index.tsx
    │   │   ├── ErrorBoundary
    │   │   │   └── index.tsx
    │   │   ├── Loaders
    │   │   │   ├── ConfigLoader.tsx
    │   │   │   ├── CustomFieldLoader.tsx
    │   │   │   └── SelectorPage.tsx
    │   │   ├── NoConfigImage
    │   │   │   └── index.tsx
    │   │   ├── NoImage
    │   │   │   └── index.tsx
    │   │   └── InfoMessage
    │   │       └── index.tsx
    │   ├── containers
    │   │   ├── App
    │   │   │   ├── index.tsx
    │   │   │   └── styles.scss
    │   │   ├── ConfigScreen
    │   │   │   ├── Components.tsx
    │   │   │   ├── index.tsx
    │   │   │   └── MultiConfigModal.tsx
    │   │   │   └── styles.scss
    │   │   ├── CustomField
    │   │   │   ├── AssetContainer.tsx
    │   │   │   ├── Card
    │   │   │   │   ├── AssetCardContainer.tsx
    │   │   │   │   └── AssetCard.tsx
    │   │   │   ├── index.tsx
    │   │   │   ├── List
    │   │   │   │   ├── AssetListContainer.tsx
    │   │   │   │   └── AssetList.tsx
    │   │   │   └── styles.scss
    │   │   └── SelectorPage
    │   │       ├── index.tsx
    │   │       └── style.scss
    │   ├── index.css
    │   ├── index.tsx
    │   ├── react-app-env.d.ts
    │   ├── reportWebVitals.ts
    │   ├── root_config
    │   │   ├── Components
    │   │   │   ├── CustomConfig.tsx
    │   │   │   └── CustomSelector.tsx  
    │   │   ├── ConfigScreen
    │   │   │   └── index.tsx   
    │   │   ├── CustomField
    │   │   │   └── index.tsx
    │   │   ├── DamEnv
    │   │   │   └── index.ts
    │   │   ├── index.tsx
    │   │   ├── SelectorPage
    │   │   │   └── index.tsx
    │   │   ├── styles.scss
    │   ├── services
    │   │   └── index.ts
    │   └── __tests__
    │       ├── ConfigScreen
    │       │   ├── ConfigScreen.spec.tsx
    │       │   └── Utils.spec.tsx
    │       ├── CustomField
    │       │   ├── CustomField.spec.tsx
    │       │   └── Utils.spec.tsx
    │       └── SelectorPage
    │           ├── SelectorPage.spec.tsx
    │           └── Utils.spec.tsx
    └── tsconfig.json
└─ .gitignore
└─ LICENSE
└─ README.md
└─ SECURITY.md
└─ TEMPLATE.md
└─ build.sh
└─ package-lock.json
└─ package.json
```

</details>

* To start developing your DAM app using this boilerplate, first clone the DAM Boilerplate GitHub repository and copy its contents into a new repository for your app.

* The source folder of your new app repository will be referred to as APP_DIRECTORY from this point onward.

* Open the package.json inside the ui and rte folders (`<APP_DIRECTORY>/ui/package.json` & `<APP_DIRECTORY>/ui/rte/package.json`) and update the name field with your app's name.

* Open the main HTML file located at `<APP_DIRECTORY>/ui/public/index.html` and update the `<title>` tag with your app's name.

* Replace the default favicon.ico with your app-specific icon. The file is located at `<APP_DIRECTORY>/ui/public/favicon.ico`.

## Environment Variables

* `.env` files are required in both ui and ui/rte directories. Rename the existing `.env.example` files to `.env` and add the following values.

* UI (<APP_DIRECTORY>/ui/.env) and JSON RTE (<APP_DIRECTORY>/ui/rte/.env) ENVIRONMENT VARIABLES

  ```
  REACT_APP_CUSTOM_FIELD_URL = http://localhost:4000
  REACT_APP_REGION_MAPPING='{"NA": { "JSON_RTE_URL": "https://rte-extension.contentstack.com" },"EU": { "JSON_RTE_URL": "https://eu-rte-extension.contentstack.com" },"AZURE_NA": { "JSON_RTE_URL": "https://azure-na-rte-extension.contentstack.com" },"AZURE_EU": { "JSON_RTE_URL": "https://azure-eu-rte-extension.contentstack.com" },"GCP_NA": { "JSON_RTE_URL": "https://gcp-na-rte-extension.contentstack.com" },"GCP_EU": { "JSON_RTE_URL": "https://gcp-eu-rte-extension.contentstack.com" },"AU": {"JSON_RTE_URL": "https://au-rte-extension.contentstack.com" }}'
  ```

## Development Setup

* In the terminal go to APP_DIRECTORY and install the necessary packages :

```
cd <APP_DIRECTORY> 
npm i
```

> Note: For Linux/MacOS users, if you encounter permission errors, you may need to use `sudo` before the npm commands (e.g., `sudo npm i`).

* To install the necessary packages for scripts, navigate to the `scripts` folder:

```
cd <APP_DIRECTORY>/scripts
npm i
```

* You need to login to your Contentstack account to save credentials locally (`scripts/settings/credentials.json`). This is a must, and will be used in all the further commands. Note: Please login to your account which has required permissions for Marketplace & Launch.

```
npm run login
```

* To setup a development app, please run the following command in the scripts folder. This will create, install a marketplace app, and creates a sample content-type & entry for the same. Please follow all the prompts after executing the command. You will be asked to select the organization in which you want to create the dev app. The app's manifest will be stored in `scripts/settings/dev-app-manifest.json` and its installation details in `scripts/settings/app-installations.json`. It will also generate all the required environment variables of both UI & RTE, so no need to add them explicitly.

```
npm run dev-app-initial-setup 
```

* Then, navigate to the ui directory and install its dependencies:

```
cd <APP_DIRECTORY>/ui
npm i
```

> Note: For Linux/MacOS users, if you encounter permission errors, you may need to use `sudo` before the npm commands (e.g., `sudo npm i`).

* Run the following command in the `ui` folder to get started on all the Operation System(except Windows):

```
npm run start
```

* For Windows OS

```
npm run winStart
```

The UI server will start at port 4000.

* Next, navigate to the rte folder and install the dependencies:

```
cd <APP_DIRECTORY>/ui/rte
npm i
```

> Note: For Linux/MacOS users, if you encounter permission errors, you may need to use `sudo` before the npm commands (e.g., `sudo npm i`).

* After you install the dependencies, run the following command in the rte folder to start the webpack server:

```
npm run start
```

The RTE webpack server will start at port 1268.

* In case, if you want to create a sample content-type & entries again, run the following command and follow the prompts:

```
npm run create-dev-content-model
```

* In case, if you want to update the marketplace app, change the manifest file in `scripts/settings/dev-app-manifest.json` accordingly, and run the following command and follow the prompts:

```
npm run update-dev-app
```

## Providers (Use of React's Contexts)

- `<MarketplaceAppProvider>`: The MarketplaceAppProvider uses `MarketplaceAppContext` and initializes the Contentstack App SDK and shares its instance and configuration across components using the useContext hook, eliminating the need for prop drilling.

- `<AppConfigProvider>`:
  The AppConfigProvider uses `AppConfigContext` and generates dynamic state values based on the rootConfig's configuration and manages installation data, providing centralized state accessible via the useContext hook for child components.

- `<ConfigStateProvider>`: The ConfigStateProvider uses `ConfigStateContext` and handles local state management for ConfigScreen UI Location, accessed by sub-components.

- `<CustomFieldProvider>`: The CustomFieldProvider uses `CustomFieldContext` and consolidates the management of state and rendering data, distributing it to multiple child components. It is responsible for both retrieving and updating this data.

## Hooks

- `useAppLocation`: The useAppLocation hook retrieves the location instance from the app-sdk by accessing the MarketplaceAppContext. It returns the location name (e.g., "CustomField") and the location instance.

## Routes

Each route represents one location. It is recommended to lazy load the route components to reduce the bundle size.

#### Adding new route

* Create a new Route component inside route. Use default export
  * Inside `App.tsx`, lazy load the route component.  
    * for instance:

    ```javascript
    const ConfigScreen = React.lazy(() => import("../ConfigScreen/index"))
    ```

  * Add the route wrapped inside `Suspense`.
    * for instance:

    ```javascript
    <Route path="/config" element={
      <Suspense fallback={<ConfigLoader />}>
        <AppConfigProvider>
          <ConfigScreen />
        </AppConfigProvider>
      </Suspense>} 
    />
    ```

## Styling

* This setup uses SCSS for styling
* You can find the style files under `ui/src/containers/<COMPONENT_NAME>/styles.scss`

## Manually creating an app in Developer Hub/Marketplace

* Visit Developer Hub on the following region of your preference:

  * [NA Region](https://app.contentstack.com/#!/developerhub)
  * [EU Region](https://eu-app.contentstack.com/#!/developerhub)
  * [AZURE-NA Region](https://azure-na-app.contentstack.com/#!/developerhub)
  * [AZURE-EU Region](https://azure-eu-app.contentstack.com/#!/developerhub)
  * [GCP-NA Region](https://gcp-na-app.contentstack.com/#!/developerhub)
  * [GCP-EU Region](https://gcp-eu-app.contentstack.com/#!/developerhub)
  * [AU Region](https://au-app.contentstack.com/#!/developerhub)

* Create a new app by clicking `+ New App` button at top right and Select app type as `Stack App`, add Name and Description. The app will be initially private. To make an app public on Contentstack Marketplace, refer [App Submission and Approval Guide](https://www.contentstack.com/docs/developers/marketplace-platform-guides/app-submission-and-approval-guide).

* Once created, go to the Basic Information page and upload your app icon.

* Open the UI Locations tab and add the URL of your app.
  For e.g. : https://localhost:4000

* From Available location(s) , add App Configuration, Custom Field and JSON RTE.

  * For App Configuration, add path. The value of path is the route added for ConfigScreen in `<APP_DIRECTORY>/ui/src/containers/App/index.tsx`. Also we are using HashRouter for routing. So the value of path should be `/#/config`.

  * For Custom Field, add name and path. The value of path is the route added for CustomField in `<APP_DIRECTORY>/ui/src/containers/App/index.tsx` i.e. `/#/custom-field`. Select the Data Type as `JSON`.

  * For JSON RTE, add the name and path. For this location, there won't be a route path in `<APP_DIRECTORY>/ui/src/containers/App/index.tsx`. We are serving webpack build file. For localhost, webpack file will be served as `https://localhost:1268/dam.js`. So the path should be `/dam.js`. For production environments, path should be `/dam`.

  For all locations, Switch on the toggle for `Signed` if required. Switch on the toggle for `Enabled` to enable the location. Add the `Description` if required.

  > Note :-
  >
  > * When hosting your app locally, you can't include a JSON RTE within the same app on the Developer Hub because it uses a different port. To work around this, after completion of the UI of the Configscreen, Customfield and Selectorpage, change the `App URL` in your app and set it to "https://localhost:1268" and add the JSON RTE with the path "/dam.js."
  > * The App will now work on a different port but use the same configuration saved on configscreen. Here, the Configscreen and Customfield location will not be visible.

* Now install the app by clicking the Install App button at top right. From the next window, select the stack in which you want to install the app.

> Note : Ensure the paths defined in `<APP_DIRECTORY>/ui/src/containers/App/index.tsx` match exactly with those set in the Developer Hub UI Location settings.

## Source code file locations for various ui location

After the app is installed, you can refer to the pages developed at various UI locations in the stack. Below are the various UI locations and their corresponding page in source code:

| UI Location   | Page Source                                              |
| ------------- | -------------------------------------------------------- |
| Config Screen | <APP_DIRECTORY>/ui/src/containers/ConfigScreen/index.tsx |
| Custom Field  | <APP_DIRECTORY>/ui/src/containers/CustomField/index.tsx  |
| RTE           | <APP_DIRECTORY>/ui/rte/src/plugin.tsx                    |

## Production Setup

After making all the required root_config changes, UI & RTE implementations, run the following command to setup a production marketplace app to be deployed on Launch. Please follow all the prompts to properly setup the app. The environment variables present in `<APP_DIRECTORY>/ui/.env` and `<APP_DIRECTORY>/ui/rte/.env` will be used as whole during the app's deployment on Launch. And all the contents in the ui folder will be turned into launch's UI endpoints by adding them as cloud functions. The RTE will be accessed as cloud functions.

* In the terminal go to APP_DIRECTORY/scripts and run:

```
cd <APP_DIRECTORY>/scripts 
npm run prod-app-initial-setup 
```

The above command will build the UI & RTE and deploys the apps on Launch, creates a marketplace app and links it to the deployed app. Asks you to select the organization in which you want to create the production app, install the app, and create a sample content-type & entry linking to the installed app. Please make sure you've enough permissions for the marketplace & launch for the above command to work without any errors. In order for the custom fields to fetch assets to work, you will need to save app's configuration in the config page.

* In case, if you want to create a sample content-type & entries again, run the following command and follow the prompts:

```
npm run create-prod-content-model
```

* In case, if you want to redeploy the app on Launch again, run the following command and follow the prompts:

```
npm run deploy-prod-app
```

* In case, if you want to update the marketplace app, change the manifest file in `scripts/settings/prod-app-manifest.json` accordingly, and run the following command and follow the prompts:

```
npm run update-prod-app
```

Alternatively, to create build for development, staging and production environments, we have added build.sh file at the location `<APP_DIRECTORY>/build.sh`.

Command to run the build script is:

```
bash build.sh <UI_URL>
```

This command takes one argument, which is the UI URL of the app. We are taking this argument to rename the app URL as per the environment in the .env files of ui and ui/rte.

After the execution of the build script, the build folder will get created inside the ui folder. Inside that build folder, there will be a dist folder which has the webpack output files for RTE location. Other folders and files from the build folder will be for Configuration and Custom Field locations.

If you don't want to use build script, then use below command:

* To create build for ui, navigate to ui

  ```
  cd <APP_DIRECTORY>/ui
  npm run build
  ```

* To create build for rte, navigate to rte

  ```
  cd <APP_DIRECTORY>/ui/rte
  npm run build
  ```

You need to upload all the files from the build folder on AWS S3 or any static file hosting service of your preference.

## Updating changes to the boilerplate as per the third party platform

For continuing to develop your corresponding DAM app, you might have to do changes on root_config files on ui and rte_config files on rte as per your needs. Please refer to the TEMPLATE.md file placed in  [`<APP_DIRECTORY>/TEMPLATE.md`](./TEMPLATE.md), to get to know more details about root_config files.

An illustrative file containing samples of DAM applications like Bynder and Cloudinary app has been created within the 'example' directory. To confirm the functionality of the application, you can replicate the content of the `example/APPNAME/root_config` file and apply it to the `root_config` file of the UI. Similarly, you can replicate the content of the `example/APPNAME/rte_config` file and apply it to the `rte_config` file of the RTE. Subsequently, you can restart the execution of both the UI and RTE components.

* Refer `<APP_DIRECTORY>/ui/example/bynder/root_config` directory for UI implementation of Bynder App.
* Refer `<APP_DIRECTORY>/ui/example/bynder/rte_config` directory for JSON RTE implementation of Bynder App.
* Refer `<APP_DIRECTORY>/ui/example/cloudinary/root_config` directory for UI implementation of Cloudinary App.
* Refer `<APP_DIRECTORY>/ui/example/cloudinary/rte_config` directory for JSON RTE implementation of Cloudinary App.

## Documentation Link

[Marketplace DAM App Boilerplate](https://www.contentstack.com/docs/developers/developer-hub/marketplace-dam-app-boilerplate)
