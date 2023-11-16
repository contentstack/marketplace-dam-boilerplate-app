# Contentstack Marketplace DAM App Boilerplate

This boilerplate provides a template to customize your own marketplace DAM app.

##  Prerequisite

* [Contentstack Account](https://app.contentstack.com/#!/login)
* `Nodejs` - v14.18.2 & `NPM` - 8.1.4

## Structure of the Marketplace DAM App Boilerplate
<details>
  <summary>
    Reveal/Collapse the code structure
  </summary>
  
```bash
marketplace-dam-boilerplate-app
└── ui
    ├── babel.config.js
    ├── example
    │   ├── bynder
    │   │   ├── root_config
    │   │   │   └── index.tsx
    │   │   └── rte_config
    │   │       └── index.tsx
    │   └── cloudinary
    │       ├── root_config
    │       │   └── index.tsx
    │       └── rte_config
    │           └── index.tsx
    ├── gulpFile.js
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
    │   │   ├── NoImage
    │   │   │   └── index.tsx
    │   │   └── WarningMessage
    │   │       └── index.tsx
    │   ├── containers
    │   │   ├── App
    │   │   │   ├── index.tsx
    │   │   │   └── styles.scss
    │   │   ├── ConfigScreen
    │   │   │   ├── Components.tsx
    │   │   │   ├── index.spec.tsx
    │   │   │   ├── index.tsx
    │   │   │   └── styles.scss
    │   │   ├── CustomField
    │   │   │   ├── AssetContainer.tsx
    │   │   │   ├── Card
    │   │   │   │   ├── AssetCardContainer.tsx
    │   │   │   │   └── AssetCard.tsx
    │   │   │   ├── index.spec.tsx
    │   │   │   ├── index.tsx
    │   │   │   ├── List
    │   │   │   │   ├── AssetListContainer.tsx
    │   │   │   │   └── AssetList.tsx
    │   │   │   └── styles.scss
    │   │   └── SelectorPage
    │   │       ├── index.spec.tsx
    │   │       ├── index.tsx
    │   │       └── style.scss
    │   ├── index.css
    │   ├── index.tsx
    │   ├── react-app-env.d.ts
    │   ├── reportWebVitals.ts
    │   ├── root_config
    │   │   ├── ConfigScreen
    │   │   │   └── index.tsx
    │   │   ├── CustomComponent
    │   │   │   └── index.tsx
    │   │   ├── CustomField
    │   │   │   └── index.tsx
    │   │   ├── DamEnv
    │   │   │   └── index.ts
    │   │   ├── index.tsx
    │   │   ├── SelectorPage
    │   │   │   └── index.tsx
    │   │   ├── styles.scss
    │   │   └── utils
    │   │       └── index.tsx
    │   └── services
    │       └── index.ts
    ├── build.sh
    ├── README.md
    ├── TEMPLATE.md
    └── tsconfig.json
```

</details>
<br />

* To start the development of a DAM app using boilerplate, first Clone DAM Boilerplate GitHub Repository and copy the content of this repo to the new repo of your APP. 

* The new app repo source folder will be referred to as APP_DIRECTORY from now on.

* Open the package.json inside the ui and rte folders (`<APP_DIRECTORY>/ui/package.json` & `<APP_DIRECTORY>/ui/rte/package.json`) and update the name attribute to your app name. 

* Open the root html file of the app (available at `<APP_DIRECTORY>/ui/public/index.html`) and update the `<title>` tag value to the name of your app.

* Change the favicon.ico as per the requirement of your app. favicon.ico file is available at `<APP_DIRECTORY>/ui/public/favicon.ico`.

## Environment Variables

* `.env` files are required in both ui and ui/rte. Rename `.env.example` files to `.env` and add the following values.

* UI ENVIRONMENT VARIABLES (<APP_DIRECTORY>/ui/.env)
  ```
  REACT_APP_UI_URL_NA = https://rte-extension.contentstack.com
  REACT_APP_UI_URL_EU = https://eu-rte-extension.contentstack.com
  REACT_APP_UI_URL_AZURE_NA = https://azure-na-rte-extension.contentstack.com
  REACT_APP_UI_URL_AZURE_EU = https://azure-eu-rte-extension.contentstack.com
  REACT_APP_CUSTOM_FIELD_URL = http://localhost:4000
  ```

* RTE ENVIRONMENT VARIABLES (<APP_DIRECTORY>/ui/rte/.env)
  ```
  REACT_APP_UI_URL_NA = https://rte-extension.contentstack.com
  REACT_APP_UI_URL_EU = https://eu-rte-extension.contentstack.com
  REACT_APP_UI_URL_AZURE_NA = https://azure-na-rte-extension.contentstack.com
  REACT_APP_UI_URL = http://localhost:4000
  ```

## Install Dependencies

* In the terminal go to APP_DIRECTORY and install the necessary packages :
```
cd <APP_DIRECTORY> 
npm i
```
* To install the necessary packages for ui , navigate to the ui folder
```
cd <APP_DIRECTORY>/ui 
npm i
``` 
* After you install the packages, run the following command in the ui folder to get started:
```
npm run start
```
The UI server will start at port 4000.
* To install the necessary packages for rte , navigate to the rte folder
```
cd <APP_DIRECTORY>/ui/rte
npm i
```
* After you install the packages, run the following command in the rte folder to start the webpack server.
```
npm run start
```
The webpack server will start at port 1268.

## Providers (Use of React's Contexts)

- `<MarketplaceAppProvider>`: The MarketplaceAppProvider uses `MarketplaceAppContext` and initializes the Contentstack App SDK and shares its instance and configuration across components using the useContext hook, eliminating the need for prop drilling.

- `<AppConfigProvider>`: 
The AppConfigProvider uses `AppConfigContext` and generates dynamic state values based on the rootConfig's configuration and manages installation data, providing centralized state accessible via the useContext hook for child components.

- `<ConfigStateProvider>`: The ConfigStateProvider uses `ConfigStateContext` and handles local state management for ConfigScreen UI Location, accessed by sub-components.

- `<CustomFieldProvider>`: The CustomFieldProvider uses `CustomFieldContext` and consolidates the management of state and rendering data, distributing it to multiple child components. It is responsible for both retrieving and updating this data.

## Hooks

- `useAppLocation`: The useAppLocation hook retrieves the location instance from the app-sdk by accessing the MarketplaceAppContext. It returns the location name (e.g., "CustomField") and the location instance.

## Routes

Each route represents one location. It is recommended to lazy load the route components to reduce the bundle
size. 

#### Existing Routes

- ConfigScreen `(path = "/config")`
- CustomField `(path = "/custom-field")`
- SelectorPage `(path = "/selector-page")`

#### Adding new route

- Create a new Route component inside route. Use default export
  - Inside `ui/src/containers/App/index.tsx`, lazy load the route component.  Example: 
      ```
      const ConfigScreen = React.lazy(() => import("../ConfigScreen"));
      ```
  - Add the route wrapped inside `Suspense`. 
    Example: 
      ```
      <Route
          path="/config"
          element={
            <Suspense fallback={<ConfigLoader />}>
              <AppConfigProvider>
                <ConfigScreen />
              </AppConfigProvider>
            </Suspense>
          }
        />
      ```

## Styling

- This setup uses basic SCSS for styling


## Creating an app in Developer Hub/Marketplace

* Go to developer hub at [NA Region](https://app.contentstack.com/#!/developerhub), [EU Region](https://eu-app.contentstack.com/#!/developerhub), [AZURE-NA Region](https://azure-na-app.contentstack.com/#!/developerhub), [AZURE-EU Region](https://azure-eu-app.contentstack.com/#!/developerhub).

* Create a new app by clicking `+ New App` button at top right and Select app type as `Stack App`, add Name and Description. The app will be initially private. To make an app public on Contextstack Marketplace, refer [App Submission and Approval Guide](https://www.contentstack.com/docs/developers/marketplace-platform-guides/app-submission-and-approval-guide).

* After creating an app, you will be redirected to the Basic Information page. Add the icon for your app. 

* Open the UI Locations tab and add the URL of your app. 
For e.g. : https://localhost:4000

* From Available location(s) , add App Configuration, Custom Field and JSON RTE. 

  * For App Configuration, add path. The value of path is the route added for ConfigScreen in `<APP_DIRECTORY>/ui/src/containers/App/index.tsx`. Also we are using HashRouter for routing. So the value of path should be `/#/config`. 

  * For Custom Field, add name and path. The value of path is the route added for CustomField in `<APP_DIRECTORY>/ui/src/containers/App/index.tsx` i.e. `/#/custom-field`. Select the Data Type as `JSON`.
  
  * For JSON RTE, add the name and path. For this location, there won’t be a route path in `<APP_DIRECTORY>/ui/src/containers/App/index.tsx`. We are serving webpack build file. For localhost, webpack file will be served as `https://localhost:1268/dam.js`. So the path should be `/dam.js`. For production environments, path should be `/dist/dam.js`. 

  For all locations, Switch on the toggle for `Signed` if required. Switch on the toggle for `Enabled` to enable the location. Add the `Description` if required.

  > Note :- When hosting your app locally, you can't include a JSON RTE within the same app on the Developer Hub because it uses a different port. To work around this, create a second app on the Developer Hub with the URL set to "https://localhost:1268" and add the JSON RTE with the path "/dam.js."

* Now install the app by clicking the Install App button at top right. From the next window, select the stack in which you want to install the app.

> Note : You can give any path values but make sure the path value in `<APP_DIRECTORY>/ui/src/containers/App/index.tsx` and in UI location should be the same.

## Source code file locations for various ui location

After the app is installed, you can refer to the pages developed at various UI locations in the stack. Below are the various UI locations and their corresponding page in source code:

|UI Location      | Page Source                                                 |
|------------     |-------------                                                |
|Config Screen    |<APP_DIRECTORY>/ui/src/containers/ConfigScreen/index.tsx     |
|Custom Field     |<APP_DIRECTORY>/ui/src/containers/CustomField/index.tsx      |
|RTE              |<APP_DIRECTORY>/ui/rte/src/plugin.tsx                        |

## Create Build

To create build for development, staging and production environments, we have added build.sh file at the location `<APP_DIRECTORY>/build.sh`

Command to run the build script is 
```
bash build.sh <UI_URL>
```

This command takes one argument, which is the UI URL of the app. We are taking this argument to rename the app URL as per the environment in the .env files of ui and ui/rte. 

After the execution of the build script, the build folder will get created inside the ui folder. Inside that build folder, there will be a dist folder which has the webpack output files for RTE location. Other folders and files from the build folder will be for Configuration and Custom Field locations. 

If you don’t want to use build script, then use below command 
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

## Steps for Developing Marketplace DAM App

To develop your Marketplace DAM App, you have to customize `root_config` files for UI and `rte_config` files for JSON RTE as per your needs. 

Please refer to the [`TEMPLATE.md`](./TEMPLATE.md) file placed in `<APP_DIRECTORY>/TEMPLATE.md`, for more details.

For reference purpose, Examples of DAM Apps like `Bynder` and `Cloudinary` are added to the `'example'` directory. 
  * Refer `<APP_DIRECTORY>/ui/example/bynder/root_config` directory for UI implementation of Bynder App.
  * Refer `<APP_DIRECTORY>/ui/example/bynder/rte_config` directory for JSON RTE implementation of Bynder App.

## Reference to documentation

* [Marketplace DAM App Boilerplate](https://www.contentstack.com/docs/developers/developer-hub/marketplace-dam-app-boilerplate)
