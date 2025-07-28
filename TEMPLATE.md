# Marketplace DAM App Boilerplate Documentation

## UI Locations

- `App Configuration`
- `Custom Field`
- `JSON RTE`

<br />

> To configure App Configuration and Custom Field Locations refer [`Configure App Configuration and Custom Field`][app-config-custom-field] section and to configure JSON RTE refer [`Configure JSON RTE`][json-rte] section.

<br />

[app-config-custom-field]: #configure-app-configuration-and-custom-field

## Configure App Configuration and Custom Field

In order to configure the App Configuration and Custom Field Locations, you need to make changes to [`<APP_DIRECTORY>/ui/src/root_config`](./ui/src/root_config/index.tsx) directory.

All configurations will be done in this directory. You need to define and specify how the UI elements of your app will be handled here.

### Environment Variables

---

| Key                               | Type             | Possible Values                          | Description                                                                                                                                             |
| --------------------------------- | ---------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DAM_APP_NAME\*                    | string           | --                                       | Name of the third-party DAM.                                                                                                                            |
| ASSET_UNIQUE_ID\*                 | string           | "id"                                     | Unique parameter name of the asset object.                                                                                                              |
| SELECTOR_PAGE_LOGO\*              | svg code of Logo | --                                       | svg code of logo which is to be added to Selector Page.                                                                                                 |
| REQUIRED_CONFIG_FIELDS            | array of strings | --                                       | Array of config names. Used for config field validations on ConfigScreen.                                                                               |
| SELECTOR_CONFIG_CHECK_FIELDS      | array of strings | --                                       | Array of config field parameter names. Used for null config checks in the selector page and shows error message if any values are missing.              |
| IS_DAM_SCRIPT\*                   | boolean          | --                                       | Determines if Distribution script url is present or not. If `false`, it uses the [`Custom DAM Selector Component`][custom-dam-selector-component] flow. |
| DAM_SCRIPT_URL                    | string           | --                                       | Distribution Script URL provided by the third-party DAM.                                                                                                |
| DIRECT_SELECTOR_PAGE\*            | string           | "novalue", "url", "window", "authWindow" | Determine the flow of Selector Page. Further details can be found in the subsequent flow descriptions.                                                  |
| ADVANCED_ASSET_PARAMS             | Object           | --                                       | Property used for handling various Asset Constraint Validations                                                                                         |
| ADVANCED_ASSET_PARAMS.ASSET_NAME  | String           | --                                       | Property name for ASSET NAME. If present in nested structure, add nested structure reference.                                                           |
| ADVANCED_ASSET_PARAMS.SIZE_NAME   | String           | --                                       | Property name for ASSET SIZE. If present in nested structure, add nested structure reference.                                                           |
| ADVANCED_ASSET_PARAMS.SIZE_UNIT   | String           | "BYTES"(default), "KB", "MB", "GB", "TB" | Unit for ASSET SIZE provided by third-party dam.                                                                                                        |
| ADVANCED_ASSET_PARAMS.HEIGHT_NAME | String           | --                                       | Property name for ASSET HEIGHT. If present in nested structure, add nested structure reference.                                                         |
| ADVANCED_ASSET_PARAMS.WIDTH_NAME  | String           | --                                       | Property name for ASSET WIDTH. If present in nested structure, add nested structure reference.                                                          |

[app-configuration]: #app-configuration

### App Configuration

---

Navigate to the root_config file (ui/src/root_config/index.tsx). In this file, you need to modify the following functions for ConfigScreen based on your requirements.

- [`configureConfigScreen`][configureconfigscreen] Function

- [`customWholeJson`][customwholejson] Function`*`

- [`conditionalFieldExec`][conditionalFieldExec] Function

- [`checkConfigValidity`][checkConfigValidity] Function

<br />

[availability-of-dam-script-url]: #availability-of-dam-script-url

## Availability of DAM Script URL

DAM Script URL Flow is to be used when the third-party DAM application has a Script Url present which can be embeded in the \<script> tag of html page.

Example: `<script src="https://dam.com/dam.js"></script>`

`damEnv` Values for this flow:

```
IS_DAM_SCRIPT: true,
DIRECT_SELECTOR_PAGE: "novalue"
```

Implement the below mentioned functions to configure Custom Field and Selector Page in the DAM Script URL Flow.

- ### Custom Field

  - [`filterAssetData`][filterassetdata] Function`*`

  - [`handleConfigtoSelectorPage`][handleconfigtoselectorpage] Function

  - [`modifyAssetsToSave`][modifyAssetsToSave] Function

- ### Selector Page

  - [`openComptactView`][opencomptactview] Function`*`

<br />

[availability-of-dam-window-url]: #availability-of-dam-window-url

## Availability of DAM Window URL

DAM Window URL Flow is to be used when the third-party DAM application has a Window Url present which can be opened directly in browser.

Example: `https://dam.com/`

`damEnv` Values for this flow:

```
IS_DAM_SCRIPT: false,
DIRECT_SELECTOR_PAGE: "url"
```

Implement the below mentioned functions to configure Custom Field and Selector Page in the DAM Window URL Flow.

- ### Custom Field

  - [`filterAssetData`][filterassetdata] Function`*`

  - [`handleConfigtoSelectorPage`][handleconfigtoselectorpage] Function

  - [`getSelectorWindowUrl`][getselectorwindowurl] Function`*`

  - [`handleSelectorPageData`][handleselectorpagedata] Function`*`

  - [`modifyAssetsToSave`][modifyAssetsToSave] Function

- ### Selector Page

  No Functions are required to be configured here.

<br />

[availability-of-dam-window-component]: #availability-of-dam-window-component

## Availability of DAM Window Component

DAM Window Component Flow is to be used when the third-party DAM application has a Window Component/Frame present which can be triggered to open on click of a button.

Example: `<button onClick={openDAMComp()}>Open DAM</button>`

`damEnv` Values for this flow:

```
IS_DAM_SCRIPT: false,
DIRECT_SELECTOR_PAGE: "window"
```

Implement the below mentioned functions to configure Custom Field and Selector Page in the DAM Window Component Flow.

- ### Custom Field

  - [`filterAssetData`][filterassetdata] Function`*`

  - [`handleConfigtoSelectorPage`][handleconfigtoselectorpage] Function

  - [`handleSelectorPageData`][handleselectorpagedata] Function`*`

  - [`handleSelectorWindow`][handleselectorwindow] Function`*`

  - [`modifyAssetsToSave`][modifyAssetsToSave] Function

- ### Selector Page

  No Functions are required to be configured here.

<br />

[custom-dam-selector-component]: #custom-dam-selector-component

## Custom DAM Selector Component

Custom DAM Selector Component Flow is to be used when the third-party DAM application has API or SDK support for accessing their assets.

`damEnv` Values for this flow:

```
IS_DAM_SCRIPT: false,
DIRECT_SELECTOR_PAGE: "novalue"
```

Implement the below mentioned functions to configure Custom Field and Selector Page in the Custom DAM Selector Component Flow.

- ### Custom Field

  - [`filterAssetData`][filterassetdata] Function`*`

  - [`handleConfigtoSelectorPage`][handleconfigtoselectorpage] Function

  - [`modifyAssetsToSave`][modifyAssetsToSave] Function

- ### Selector Page

  - [`customSelectorComponent`][customselectorcomponent] Function`*`

<br />

[availability-of-auth-window]: #availability-of-auth-window

## Availability of Auth Window + DAM Selector

The Auth Window Flow should be used when the third-party DAM application uses an authentication window and needs to open another window—via API or SDK support—to access its assets.

`damEnv` Values for this flow:

```
IS_DAM_SCRIPT: true | false,
DIRECT_SELECTOR_PAGE: "authWindow"
```

Implement the functions mentioned below to configure the Custom Field and Selector Page in the Custom DAM Selector Component Flow.

- ### Custom Field

  - [`filterAssetData`][filterassetdata] Function`*`

  - [`handleAuthWindow`][handleAuthWindow] Function`*`

  - [`handleConfigtoSelectorPage`][handleconfigtoselectorpage] Function

  - [`modifyAssetsToSave`][modifyAssetsToSave] Function

- ### Selector Page

  - [`openComptactView`][opencomptactview] Function [`*` if IS_DAM_SCRIPT: true]

  - [`customSelectorComponent`][customselectorcomponent] Function [`*` if IS_DAM_SCRIPT: false]

<br />

[functions-in-root-config]: #functions-in-root-config

## Functions In Root Config

1. ### Config Screen Functions

[configureconfigscreen]: #configureconfigscreen-function

- #### `configureConfigScreen` Function

  The function is used to configure the ConfigScreen. Use this function to add TextInput Field, Select Field or Radio Options Field to ConfigScreen. Custom Components can also be added to ConfigScreen using "customInputField" type.

  Function Parameters:

  | Name                     | Type     | Description                                |
  | ------------------------ | -------- | ------------------------------------------ |
  | config                   | Object   | config object                              |
  | serverConfig             | Object   | server config object                       |
  | handleCustomConfigUpdate | Function | Function to update the saved configuration |

  ```
  Note:
  1. interface TypeCustomConfigParams {
          config: any;
          serverConfig: any;
          handleCustomConfigUpdate: (
              configLabel: string,
              fieldName: string,
              fieldValue: string,
              saveInConfig:boolean,
              saveInServerConfig:boolean,
              isMultiConfig:boolean,
          ) => void;
        }

  2. configLabel is provided in the component param callback, as a parameter named "currentConfigLabel" in customInputField type. It is used for multiConfig feature.
  ```

  To Configure ConfigScreen the function should return the following

  ```
  {
      textField: {
          type: "textInputField",
          labelText: "DAM Text Input",
          helpText: "DAM Text Input Helptext",
          placeholderText: "DAM Text Input Placeholder",
          instructionText: "DAM Text Input Instruction Text",
          inputFieldType: "password", // type: 'text' | 'password' | 'email' | 'number' | 'search' | 'url' | 'date' | 'time' | string;
          saveInConfig: false,
          saveInServerConfig: true,
          isMultiConfig: true,
      },
      selectField: {
          type: "selectInputField",
          labelText: "DAM Select Input",
          helpText: "DAM Select Input Helptext",
          placeholderText: "DAM Select Input Placeholder",
          instructionText: "DAM Select Input Instruction Text",
          options: [
              { label: "option 1", value: "option1" },
              { label: "option 2", value: "option2" },
              { label: "option 3", value: "option3" },
              { label: "option 4", value: "option4" },
              { label: "option 5", value: "option5" },
          ],
          defaultSelectedOption: "option5",
          saveInConfig: true,
          saveInServerConfig: false,
          isMultiConfig: true,
      },
      radioField: {
          type: "radioInputField",
          labelText: "DAM Radio Input",
          helpText: "DAM Radio Input Helptext",
          instructionText: "DAM Radio Input Instruction Text",
          options: [
              {
              label: "Option 1",
              value: "Option 1",
              },
              {
              label: "Option 2",
              value: "Option 2",
              },
          ],
          defaultSelectedOption: "Option 1",
          saveInConfig: true,
          saveInServerConfig: false,
          isMultiConfig: false,
      },
      customField: {
          type: "customInputField",
          component: (currentConfigLabel: string) => (
              <CustomConfig
              customConfig={params}
              currentConfigLabel={currentConfigLabel}
              />
          ),
          saveInConfig: true,
          saveInServerConfig: false,
          isMultiConfig: true,
      }
  }
  ```

  > Note:
  >
  > - The type property can be `textInputField | selectInputField | radioInputField| customInputField`.
  > - The property name (eg: textField, selectField mentioned in example) will be considered as the property name of configuration field which is added.

<br />

[customwholejson]: #customwholejson-function

- #### `customWholeJson` Function

  The function is used to configure the Custom/Whole Fields functionality present in ConfigScreen.

  The function should return the following:

  1. customJsonOptions: List of options to be added to the custom fields dropdown.
  2. defaultFeilds: List of options present in customJsonOptions which are to be selected by default

  ```
  {
      customJsonOptions: ["option 1", "option 2", "option 3", "option 4"],
      defaultFeilds: ["option 1", "option 2"],
  }
  ```

<br />

[conditionalFieldExec]: #conditionalFieldExec-function

- #### `conditionalFieldExec` Function

  The function dynamically updates the default fields of customJsonOptions based on user input config values.

  Function Parameters:

  | Name         | Type   | Description                                       |
  | ------------ | ------ | ------------------------------------------------- |
  | config       | Object | config values saved in Configuration Object       |
  | serverConfig | Object | config values saved in ServerConfiguration Object |

  Return Value:

  The function should return an array of objects, where each object specifies an operation ("remove" or "add") to be performed on the provided options.

  ```
  [{ operation: "remove", options: ["option 1"] }]
  ```

<br />

[checkConfigValidity]: #checkConfigValidity-function

- #### `checkConfigValidity` Function

  The function validates the values entered on the ConfigScreen and enables or disables the 'Save' button accordingly, displaying a custom error message if validation fails.

  Function Parameters:

  | Name         | Type   | Description                                       |
  | ------------ | ------ | ------------------------------------------------- |
  | config       | Object | config values saved in Configuration Object       |
  | serverConfig | Object | config values saved in ServerConfiguration Object |

  Return Value:

  The function should return an object with the following structure:

  ```
  { disableSave: false, message: "Enter a Valid Config" }
  ```

<br />

2. ### Custom Field Functions

[filterassetdata]: #filterassetdata-function

- #### `filterAssetData` Function

  The function is used to filter required asset properties and form a assetObject which is used for internal asset management.

  Function Parameters:

  | Name   | Type  | Description                                   |
  | ------ | ----- | --------------------------------------------- |
  | assets | Array | Array of assets saved in CustomField location |

  The function should return the following:

  ```
  [
      {
          id: asset.assetId,                // unique parameter of your asset
          type: asset.assetType,            // assetType: "Image"|"Video"|"Document" etc.
          name: asset.assetName,            // name of the asset
          width: asset.width,               // width of asset (type: number)
          height: asset.height,             // height of asset (type: number)
          size: asset.size,                 // size in bytes as string eg.'416246'
          thumbnailUrl: asset.thumbnail,    // thumbnail url of asset
          previewUrl: asset.preview,        // adds "Preview" in tooltip action items
          platformUrl: asset.damUrl,        // adds "Open In DAM" in tooltip action items
      }
  ]
  ```

<br />

[handleconfigtoselectorpage]: #handleconfigtoselectorpage-function

- #### `handleConfigtoSelectorPage` Function

  The function manages multiple config present (i.e Config from ConfigScreen, Config from Custom Field Advanced Option) and allows configuration selection that needs to be sent to a selector page.

  Function Parameters:

  | Name              | Type   | Description                                                 |
  | ----------------- | ------ | ----------------------------------------------------------- |
  | config            | Object | config object received from ConfigScreen                    |
  | contentTypeConfig | Object | config object received from advanced options of CustomField |
  | currentLocale     | string | current locale value                                        |

  Return Value:

  ```
  The Function returns a `config object` that is then passed to the selector page internally
  ```

<br />

[getselectorwindowurl]: #getselectorwindowurl-function

- #### `getSelectorWindowUrl` Function

  The function is used to get the available third-party DAM window url to open it in a pop-up window.

  Function Parameters:

  | Name              | Type   | Description                                                 |
  | ----------------- | ------ | ----------------------------------------------------------- |
  | config            | Object | config object received from ConfigScreen                    |
  | contentTypeConfig | Object | config object received from advanced options of CustomField |

  Return Value:

  ```
  The Function returns a url of type=string which will be opened in the selector page
  ```

<br />

[handleselectorpagedata]: #handleselectorpagedata-function

- #### `handleSelectorPageData` Function

  The function manages data received from the selector page, extracting it from a message event parameter for use in the application.

  Function Parameters:

  | Name  | Type   | Description                           |
  | ----- | ------ | ------------------------------------- |
  | event | Object | message event received on CustomField |

  Return Value:

  The Function returns an array of asset objects that are selected.

  ```
  [
      {
          assetId: "1",
          assetName: "Sample Asset 1"
      },
      {
          assetId: "2",
          assetName: "Sample Asset 2"
      }
  ]
  ```

<br />

[handleselectorwindow]: #handleselectorwindow-function

- #### `handleSelectorWindow` Function

  The function is triggered on the "add asset" button click and responsible for opening the third-party DAM window. The function should contain the code logic to open the DAM window.

  Function Parameters:

  | Name              | Type                          | Description                                                 |
  | ----------------- | ----------------------------- | ----------------------------------------------------------- |
  | config            | Object                        | config object received from ConfigScreen                    |
  | contentTypeConfig | Object                        | config object received from advanced options of CustomField |
  | setError          | (errObj: TypeErrorFn) => void | Function to set an error message in selector page           |

  ```
  Note: interface TypeErrorFn {
          isErr: boolean;
          errorText: string;
        }
  ```

<br />

[handleAuthWindow]: #handleAuthWindow-function

- #### `handleAuthWindow` Function

  The function is triggered on the "add asset" button click and responsible for opening the third-party Auth window. Once the Auth is successful, it opens the custom selector page window. The function should contain third-party code logic for authentication.

  Function Parameters:

  | Name              | Type     | Description                                                 |
  | ----------------- | -------- | ----------------------------------------------------------- |
  | config            | Object   | config object received from ConfigScreen                    |
  | contentTypeConfig | Object   | config object received from advanced options of CustomField |
  | resolve           | Function | Resolve function                                            |
  | reject            | Function | Reject function                                             |

<br />

[modifyAssetsToSave]: #modifyAssetsToSave-function

- #### `modifyAssetsToSave` Function

  The function is used to modify the asset data that is being saved in the custom field.

  Function Parameters:

  | Name              | Type   | Description                                                 |
  | ----------------- | ------ | ----------------------------------------------------------- |
  | config            | Object | config object received from ConfigScreen                    |
  | contentTypeConfig | Object | config object received from advanced options of CustomField |
  | assets            | Array  | Array of asset objects that are selected.                   |

  Return Value:

  ```
  The Function returns modified array of asset objects.
  ```

<br />

3. ### Selector Page Functions

[opencomptactview]: #opencomptactview-function

- #### `openComptactView` Function

  The function is used in a DAM Script URL Flow to execute functions from a script source and display a component by attaching it to a specified DOM element reference.

  Function Parameters:

  | Name                                          | Type                          | Description                                                                      |
  | --------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------- |
  | config                                        | Object                        | Config object received from CustomField                                          |
  | selectedIds                                   | Array of strings              | Selected asset ids from CustomField                                              |
  | onSuccess                                     | (assets: any[]) => void       | Function to send your data to custom field. It accepts an array of asset objects |
  | onCancel                                      | () => void                    | Function to close the Selector Page                                              |
  | { containerRef, containerClass, containerId } | TypeSelectorContainer         | Contains reference for DOM element of Selector Page                              |
  | setError                                      | (errObj: TypeErrorFn) => void | Function to set an error message in selector page                                |

  ```
  Note:
      interface TypeErrorFn {
          isErr: boolean;
          errorText: string;
      }

      interface TypeSelectorContainer {
          containerRef: any;
          containerClass: string;
          containerId: string;
      }
  ```

<br />

[customselectorcomponent]: #customselectorcomponent-function

- #### `customSelectorComponent` Function

  The function is used in Custom DAM Selector Component Flow where the entire selector page is developed by the user using APIs or SDKs to fetch the asset data.

  Function Parameters:

  | Name             | Type                          | Description                                                                      |
  | ---------------- | ----------------------------- | -------------------------------------------------------------------------------- |
  | config           | Object                        | Config object received from CustomField                                          |
  | setError         | (errObj: TypeErrorFn) => void | Function to set an error message in selector page                                |
  | successFn        | (assets: any[]) => void       | Function to send your data to custom field. It accepts an array of asset objects |
  | closeFn          | () => void                    | Function to close the Selector Page                                              |
  | selectedAssetIds | Array of strings              | Selected asset ids from CustomField                                              |

  ```
  Note: interface TypeErrorFn {
          isErr: boolean;
          errorText: string;
        }
  ```

  Return Value:

  ```
  The Function returns a React Component which is rendered on SelectorPage.
  ```

<br />

[json-rte]: #configure-json-rte

## Configure JSON RTE

In order to configure the JSON RTE plugin for your thir-party DAM, you need to make changes to [`<APP_DIRECTORY>/ui/rte/src/rte_config`](./ui/rte/src/rte_config/index.tsx) directory.

All configurations will be done in this directory. You need to define and specify how the JSON RTE elements of your app will be handled here.

### JSON RTE Environment Variables

---

| Key                               | Type                  | Possible Values                          | Description                                                                                            |
| --------------------------------- | --------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| DAM_APP_NAME\*                    | string                | --                                       | Name of the third-party DAM.                                                                           |
| ASSET_NAME_PARAM\*                | string                | --                                       | Asset Name Parameter Label.                                                                            |
| RTE_DAM_ICON\*                    | svg code of Logo icon | --                                       | svg code of logo which is to be added to JSON RTE actions panel.                                       |
| DIRECT_SELECTOR_PAGE\*            | string                | "novalue", "url", "window", "authWindow" | Determine the flow of Selector Page. Further details can be found in the subsequent flow descriptions. |
| ADVANCED_ASSET_PARAMS             | Object                | --                                       | Property used for handling various Asset Constraint Validations                                        |
| ADVANCED_ASSET_PARAMS.ASSET_NAME  | String                | --                                       | Property name for ASSET NAME. If present in nested structure, add nested structure reference.          |
| ADVANCED_ASSET_PARAMS.SIZE_NAME   | String                | --                                       | Property name for ASSET SIZE. If present in nested structure, add nested structure reference.          |
| ADVANCED_ASSET_PARAMS.SIZE_UNIT   | String                | "BYTES"(default), "KB", "MB", "GB", "TB" | Unit for ASSET SIZE provided by third-party dam.                                                       |
| ADVANCED_ASSET_PARAMS.HEIGHT_NAME | String                | --                                       | Property name for ASSET HEIGHT. If present in nested structure, add nested structure reference.        |
| ADVANCED_ASSET_PARAMS.WIDTH_NAME  | String                | --                                       | Property name for ASSET WIDTH. If present in nested structure, add nested structure reference.         |

[json-rte-availability-of-dam-script-url]: #json-rte-availability-of-dam-script-urll

## JSON RTE: Availability of DAM Script URL

DAM Script URL Flow is to be used when the third-party DAM application has a Script Url present which can be embeded in the \<script> tag of html page.

Example: `<script src="https://dam.com/dam.js"></script>`

`damEnv` Values for this flow:

```
DIRECT_SELECTOR_PAGE: "novalue"
```

Implement the below mentioned functions to configure JSON RTE in the DAM Script URL Flow.

- [`getDisplayUrl`][getDisplayUrlJsonRteFunction] Function`*`

- [`getAssetType`][getAssetTypeJsonRteFunction] Function`*`

- [`getViewIconforTooltip`][getViewIconforTooltipJsonRteFunction] Function`*`

<br />

[json-rte-availability-of-dam-window-url]: #json-rte-availability-of-dam-window-url

## JSON RTE: Availability of DAM Window URL

DAM Window URL Flow is to be used when the third-party DAM application has a Window Url present which can be opened directly in browser.

Example: `https://dam.com/`

`damEnv` Values for this flow:

```
DIRECT_SELECTOR_PAGE: "url"
```

Implement the below mentioned functions to configure JSON RTE in the DAM Window URL Flow.

- [`getDisplayUrl`][getDisplayUrlJsonRteFunction] Function`*`

- [`getAssetType`][getAssetTypeJsonRteFunction] Function`*`

- [`getViewIconforTooltip`][getViewIconforTooltipJsonRteFunction] Function`*`

- [`getSelectorWindowUrl`][getSelectorWindowUrlJsonRteFunction] Function`*`

- [`handleSelectorPageData`][handleSelectorPageDataJsonRteFunction] Function`*`

<br />

[json-rte-availability-of-dam-window-component]: #json-rte-availability-of-dam-window-component

## JSON RTE: Availability of DAM Window Component

DAM Window Component Flow is to be used when the third-party DAM application has a Window Component/Frame present which can be triggered to open on click of a button.

Example: `<button onClick={openDAMComp()}>Open DAM</button>`

`damEnv` Values for this flow:

```
DIRECT_SELECTOR_PAGE: "window"
```

Implement the below mentioned functions to configure JSON RTE in the DAM Window Component Flow.

- [`getDisplayUrl`][getDisplayUrlJsonRteFunction] Function`*`

- [`getAssetType`][getAssetTypeJsonRteFunction] Function`*`

- [`getViewIconforTooltip`][getViewIconforTooltipJsonRteFunction] Function`*`

- [`handleSelectorWindow`][handleSelectorWindowJsonRteFunction] Function`*`

- [`handleSelectorPageData`][handleSelectorPageDataJsonRteFunction] Function`*`

<br />

[json-rte-custom-dam-selector-component]: #json-rte-custom-dam-selector-component

## JSON RTE: Custom DAM Selector Component

Custom DAM Selector Component Flow is to be used when the third-party DAM application has API or SDK support for accessing their assets.

`damEnv` Values for this flow:

```
DIRECT_SELECTOR_PAGE: "novalue"
```

Implement the below mentioned functions to configure JSON RTE in the Custom DAM Selector Component Flow.

- [`getDisplayUrl`][getDisplayUrlJsonRteFunction] Function`*`

- [`getAssetType`][getAssetTypeJsonRteFunction] Function`*`

- [`getViewIconforTooltip`][getViewIconforTooltipJsonRteFunction] Function`*`

<br />

[json-rte-availability-of-auth-window]: #json-rte-availability-of-auth-window

## JSON RTE: Availability of Auth Window + DAM Selector

The Auth Window Flow should be used when the third-party DAM application uses an authentication window and needs to open another window—via API or SDK support—to access its assets.

`damEnv` Values for this flow:

```
DIRECT_SELECTOR_PAGE: "authWindow"
```

Implement the functions mentioned below to configure the JSON RTE in the Custom DAM Selector Component Flow.

- [`getDisplayUrl`][getDisplayUrlJsonRteFunction] Function`*`

- [`getAssetType`][getAssetTypeJsonRteFunction] Function`*`

- [`getViewIconforTooltip`][getViewIconforTooltipJsonRteFunction] Function`*`

- [`handleAuthWindow`][handleAuthWindow] Function`*`

- [`handleConfigtoSelectorPage`][handleconfigtoselectorpage] Function

<br />

[functions-in-rte-config]: #functions-in-rte-config

## Functions In RTE Config

[getDisplayUrlJsonRteFunction]: #getdisplayurl-json-rte-function

- #### `getDisplayUrl` JSON RTE Function

  The function is used to get the asset url to be used as thumbnail of image and for preview and OpenInDAM action of asset.

  Function Parameters:

  | Name  | Type   | Description  |
  | ----- | ------ | ------------ |
  | asset | Object | Asset Object |

  Return Value:

  ```
  {
      preview: preview_url present in asset object
      openInDam: openInDAM_url present in asset object
  }
  ```

[getAssetTypeJsonRteFunction]: #getassettype-json-rte-function

- #### `getAssetType` JSON RTE Function

  The function is used to get the asset type of the asset being loaded in JSON RTE. The possible return values are `Document | Image | Pdf | Archive | Video | Audio`

  Function Parameters:

  | Name  | Type   | Description  |
  | ----- | ------ | ------------ |
  | asset | Object | Asset Object |

  Return Value:

  ```
  The Function returns asset type of asset.
  ```

[getViewIconforTooltipJsonRteFunction]: #getviewiconfortooltip-json-rte-function

- #### `getViewIconforTooltip` JSON RTE Function

  The function is used to get the icons to be added in the tooltip actions of the asset being rendered in JSON RTE.

  Function Parameters:

  | Name | Type   | Description                            |
  | ---- | ------ | -------------------------------------- |
  | type | string | type of asset being loaded in JSON RTE |

  Return Value:

  ```
  {
      preview: "Eye",
      openInDam: "NewTab",
  }
  ```

[getSelectorWindowUrlJsonRteFunction]: #getselectorwindowurl-json-rte-function

- #### `getSelectorWindowUrl` JSON RTE Function

  The function is used to get the available third-party DAM window url to open it in a pop-up window.

  Function Parameters:

  | Name              | Type   | Description                                                               |
  | ----------------- | ------ | ------------------------------------------------------------------------- |
  | config            | Object | config object received from ConfigScreen                                  |
  | contentTypeConfig | Object | contentTypeConfig object received from CustomField advanced configuration |

  Return Value:

  ```
  The Function returns a url of type=string which will be opened in the selector page
  ```

[handleSelectorPageDataJsonRteFunction]: #handleselectorpagedata-json-rte-function

- #### `handleSelectorPageData` JSON RTE Function

  The function manages data received from the selector page, extracting it from a message event parameter for use in the application.

  Function Parameters:

  | Name  | Type   | Description                        |
  | ----- | ------ | ---------------------------------- |
  | event | Object | message event received on JSON RTE |

  Return Value:

  The Function returns an array of asset objects that are selected.

  ```
  [
      {
          assetId: "1",
          assetName: "Sample Asset 1"
      },
      {
          assetId: "2",
          assetName: "Sample Asset 2"
      }
  ]
  ```

[handleSelectorWindowJsonRteFunction]: #handleselectorwindow-json-rte-function

- #### `handleSelectorWindow` JSON RTE Function

  The function is triggered on the "Choose assets from DAM" button click and responsible for opening the third-party DAM window. The function should contain the code logic to open the DAM window.

  Function Parameters:

  | Name              | Type   | Description                                                               |
  | ----------------- | ------ | ------------------------------------------------------------------------- |
  | config            | Object | config object received from ConfigScreen                                  |
  | contentTypeConfig | Object | contentTypeConfig object received from CustomField advanced configuration |

[handleAuthWindowJsonRteFunction]: #handleAuthWindow-json-rte-function

- #### `handleAuthWindow` JSON RTE Function

  The function is triggered on the "Choose assets from DAM" button click and responsible for opening the third-party Auth window. Once the Auth is successful, it opens the custom selector page window. The function should contain third-party code logic for authentication.

  Function Parameters:

  | Name              | Type     | Description                                              |
  | ----------------- | -------- | -------------------------------------------------------- |
  | config            | Object   | config object received from ConfigScreen                 |
  | contentTypeConfig | Object   | config object received from advanced options of JSON RTE |
  | resolve           | Function | Resolve function                                         |
  | reject            | Function | Reject function                                          |

[handleConfigtoSelectorPageJsonRteFunction]: #handleConfigtoSelectorPage-json-rte-function

- #### `handleConfigtoSelectorPage` JSON RTE Function

  The function manages multiple config present (i.e Config from ConfigScreen, Config from JSON RTE Advanced Option) and allows configuration selection that needs to be sent to a selector page.

  Function Parameters:

  | Name              | Type   | Description                                              |
  | ----------------- | ------ | -------------------------------------------------------- |
  | config            | Object | config object received from ConfigScreen                 |
  | contentTypeConfig | Object | config object received from advanced options of JSON RTE |
  | currentLocale     | string | current locale value                                     |

  Return Value:

  ```
  The Function returns a `config object` that is then passed to the selector page internally
  ```
