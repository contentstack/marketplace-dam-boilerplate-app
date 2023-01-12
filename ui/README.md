Contentstack Marketplace DAM App Boilerplate
This boilerplate provides a template to customize your own marketplace DAM app.

Prerequisite
Contentstack Account
Nodejs - v14.18.2 & NPM - 8.1.4

Structure of the Marketplace DAM App Boilerplate
MARKETPLACE-DAM-APP-BOILERPLATE
├─ ui
| ├─ rte
| | ├─ src
| | | └─ common
| | | └─ components
| | | └─ rte_config
| | | └─ dam.ts
| | | └─ plugin.tsx
| | └─ .babelrc
| | └─ .env.example
| | └─ custom.d.ts
| | └─ package-lock.json
| | └─ package.json
| | └─ README.md
| | └─ tsconfig.json
| | └─ webpack.common.js
| | └─ webpack.dev.js
| | └─ webpack.prod.js
| ├─ src
| | ├─ common
| | | └─ constants
| | | └─ locale
| | | | └─ en-us
| | | └─ types
| | | └─ utils
| | └─ components
| | | └─ ErrorBoundary
| | └─ container
| | | └─ App
| | | | └─ index.tsx
| | | | └─ styles.scss
| | | └─ ConfigScreen
| | | | └─ Components.tsx
| | | | └─ index.spec.tsx
| | | | └─ index.tsx
| | | | └─ styles.scss
| | | └─ CustomField
| | | | └─ AssetCard.tsx
| | | | └─ AssetCardContainer.tsx
| | | | └─ index.spec.tsx
| | | | └─ index.tsx
| | | | └─ styles.scss
| | | └─ SelectorPage
| | | | └─ index.spec.tsx
| | | | └─ index.tsx
| | | | └─ styles.scss
| | └─ root_config
| | | └─ CustomComponent.tsx
| | | └─ index.tsx
| | └─ services
| | | └─ index.ts
| | └─ index.css
| | └─ index.tsx
| | └─ react-app-env.d.ts
| | └─ reportWebVitals.ts
| ├─ public
| | └─ favicon.ico
| | └─ index.html
| | └─ .env.example
| | └─ .eslintrc.js
| └─ babel.config.js
| └─ gulpFile.js
| └─ package-lock.json
| └─ package.json
| └─ README.md
| └─ tsconfig.json
| └─ build.sh

To start the development of a DAM app using boilerplate, first Clone DAM Boilerplate GitHub Repository and copy the content of this repo to the new repo of your APP.
The new app repo source folder will be referred to as APP_DIRECTORY from now on.
Open the package.json inside the ui and rte folders (<APP_DIRECTORY>/ui/package.json & <APP_DIRECTORY>/ui/rte/package.json) and update the name attribute to your app name.
Open the root html file of the app (available at <APP_DIRECTORY>/ui/public/index.html) and update the <title> tag value to the name of your app.
Change the favicon.ico as per the requirement of your app. favicon.ico file is available at <APP_DIRECTORY>/ui/public/favicon.ico.

Install Dependencies
In the terminal go to APP_DIRECTORY and install the necessary packages :
cd <APP_DIRECTORY>
npm i
To install the necessary packages for ui , navigate to the ui folder
cd <APP_DIRECTORY>/ui
npm i

After you install the packages, run the following command in the ui folder to get started:
npm run start
The UI server will start at port 4000.
To install the necessary packages for rte , navigate to the rte folder
cd <APP_DIRECTORY>/ui/rte
npm i
After you install the packages, run the following command in the rte folder to start the webpack server.
npm run start
The webpack server will start at port 1268.
Environment Variables
.env files are required in both ui and ui/rte. Rename .env.example files to .env and add value for REACT_APP_UI_URL. The value of REACT_APP_UI_URL is the URL of your app (the url for ui will be http://localhost:4000 and the url for ui/rte will be http://localhost:1268).
Creating an app in Developer Hub/Marketplace
Go to developer hub at https://app.contentstack.com/#!/developerhub
Create a new app by clicking + New App button at top right and Select app type, add name and description.The app will be initially private. If you want to make that app public,then you need to contact us.
After creating an app, you will be redirected to the Basic Information page. Add the icon for your app.
Open the UI Locations tab and add the URL of your app.
For e.g. : https://localhost:4000
From Available location(s) , add App Configuration, Custom Field and JSON RTE.
For App Configuration, add name and path. In <APP_DIRECTORY>/ui/src/containers/App/index.tsx, for App Configuration we have added route path as /config. Also we are using HashRouter for routing. So the value of path should be /#/config. Switch on the toggle for Signed if required. Switch on the toggle for Enabled to enable the Configuration location. Add the description if required.
For Custom Field, add name and path. The value of path should be /#/custom-field.Switch on the toggle for Enabled to enable the Custom Field location.Select the required Data Type. Add the description if required.
For JSON RTE, add the name and path. For this location, there won’t be a route path in <APP_DIRECTORY>/ui/src/containers/App/index.tsx. We are serving webpack build file. For localhost, webpack file will be served as https://localhost:1268/dam.js. So the path should be /dam.js.For other environments, path should be /dist/dam.js.
Nore :- If you are hosting your app on localhost, then you can’t add JSON RTE in the same app in developer hub as port no is different for JSON RTE. And while creating app in developer hub, we can add only one app URL. So you need to create one more app in developer hub by giving app url as https://localhost:1268 and add JSON RTE location with the path /dam.js
Now install the app by clicking the Install App button at top right. From the next window, select the stack in which you want to install the app.
Note : You can give any path values but make sure the path value in <APP_DIRECTORY>/ui/src/containers/App/index.tsx and in UI location should be the same.
Source code file locations for various ui location
After the app is installed, you can refer to the pages developed at various UI locations in the stack. Below are the various UI locations and their corresponding page in source code:
UI Location
Page Source
Config Screen
<APP_DIRECTORY>/ui/src/containers/ConfigScreen/index.tsx
Custom Field
<APP_DIRECTORY>/ui/src/containers/CustomField/index.tsx
RTE
<APP_DIRECTORY>/ui/rte/src/plugin.tsx

You can change the source codes and refer to the changes in UI now at corresponding places as mentioned above.

Create Build
To create build for dev , stag and production environments, we have added build.sh file at the location <APP_DIRECTORY>/build.sh

Command to run the build script is

bash build.sh <uiUrl>

This command takes one argument, which is the UI URL of the app. We are taking this argument to rename the app URL as per the environment in the .env files of ui and ui/rte.
After the execution of the build script, the build folder will get created inside the ui folder. Inside that build folder, there will be a dist folder which has the webpack output files for RTE location. Other folders and files from the build folder will be for Configuration and Custom Field locations.
If you don’t want to use build script, then use below command
To create build for ui, navigate to ui
cd <APP_DIRECTORY>/ui
npm run build
To create build for rte, navigate to rte
cd <APP_DIRECTORY>/rte/ui
npm run build
You need to upload all the files from the build folder on AWS S3 or any static file hosting service of your preference.
Reference to documentation
Marketplace DAM App Boilerplate
