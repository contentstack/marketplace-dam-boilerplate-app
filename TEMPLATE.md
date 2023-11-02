# Marketplace DAM App Boilerplate Documentation

## UI Locations

-   `App Configuration`
-   `Custom Field`
-   `JSON RTE`

<br />

> To configure App Configuration and Custom Field Locations refer `Configure App Configuration and Custom Field` section and to configure JSON RTE refer `Configure JSON RTE` section.

## Configure App Configuration and Custom Field

In order to configure the App Configuration and Custom Field Locations, you need to make changes to `<APP_DIRECTORY>/ui/src/root_config` directory.

All configurations will be done in this directory. You need to define and specify how the UI elements of your app will be handled here.

### Environment Variables

---

| Key                    | Type             | Possible Values            | Description                                                                                                                                |
| ---------------------- | ---------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| DAM_APP_NAME\*         | string           | --                         | Name of the third-party DAM.                                                                                                               |
| ASSET_UNIQUE_ID\*      | string           | "id"                       | Unique parameter name of the asset object.                                                                                                 |
| SELECTOR_PAGE_LOGO\*   | svg code of Logo | --                         | svg code of logo which is to be added to Selector Page.                                                                                    |
| CONFIG_FIELDS          | array of strings | --                         | Array of config field parameter names. Used for null config checks in the selector page and shows error message if any values are missing. |
| IS_DAM_SCRIPT\*        | boolean          | --                         | Determines if Distribution script url is present or not. If `false`, it uses the `Custom DAM Selector Component` flow.                     |
| DAM_SCRIPT_URL         | string           | --                         | Distribution Script URL provided by the third-party DAM.                                                                                   |
| DIRECT_SELECTOR_PAGE\* | string           | "novalue", "url", "window" | Determine the flow of Selector Page. Further details can be found in the subsequent flow descriptions.                                     |

### App Configuration

---

Navigate to the root_config file (ui/src/root_config/index.tsx). In this file, you need to modify the following functions for ConfigScreen based on your requirements.

-   `configureConfigScreen` Function

-   `customConfigComponent` Function

-   `customWholeJson` Function`*`

## Availability of DAM Script URL

DAM Script URL Flow is to be used when the third-party DAM application has a Script Url present which can be embeded in the \<script> tag of html page.

Example: `<script src="https://dam.com/dam.js"></script>`

`damEnv` Values for this flow:

```
IS_DAM_SCRIPT: true,
DIRECT_SELECTOR_PAGE: "novalue"
```

Implement the below mentioned functions to configure Custom Field and Selector Page in the DAM Script URL Flow.

-   ### Custom Field

    -   `filterAssetData` Function`*`

    -   `handleConfigtoSelectorPage` Function

-   ### Selector Page

    -   `openComptactView` Function`*`

## Availability of DAM Window URL

DAM Window URL Flow is to be used when the third-party DAM application has a Window Url present which can be opened directly in browser.

Example: `https://dam.com/`

`damEnv` Values for this flow:

```
IS_DAM_SCRIPT: false,
DIRECT_SELECTOR_PAGE: "url"
```

Implement the below mentioned functions to configure Custom Field and Selector Page in the DAM Window URL Flow.

-   ### Custom Field

    -   `filterAssetData` Function`*`

    -   `handleConfigtoSelectorPage` Function

    -   `getSelectorWindowUrl` Function`*`

    -   `handleSelectorPageData` Function`*`

-   ### Selector Page

    No Functions are required to be configured here.

## Availability of DAM Window Component

DAM Window Component Flow is to be used when the third-party DAM application has a Window Component/Frame present which can be triggered to open on click of a button.

Example: `<button onClick={openDAMComp()}>Open DAM</button>`

`damEnv` Values for this flow:

```
IS_DAM_SCRIPT: false,
DIRECT_SELECTOR_PAGE: "window"
```

Implement the below mentioned functions to configure Custom Field and Selector Page in the DAM Window Component Flow.

-   ### Custom Field

    -   `filterAssetData` Function`*`

    -   `handleConfigtoSelectorPage` Function

    -   `handleSelectorPageData` Function`*`

    -   `handleSelectorWindow` Function`*`

-   ### Selector Page

    No Functions are required to be configured here.

## Custom DAM Selector Component

Custom DAM Selector Component Flow is to be used when the third-party DAM application has API or SDK support for accessing their assets.

`damEnv` Values for this flow:

```
IS_DAM_SCRIPT: false,
DIRECT_SELECTOR_PAGE: "novalue"
```

Implement the below mentioned functions to configure Custom Field and Selector Page in the Custom DAM Selector Component Flow.

-   ### Custom Field

    -   `filterAssetData` Function`*`

    -   `handleConfigtoSelectorPage` Function

-   ### Selector Page

    -   `customSelectorComponent` Function`*`

## Functions In Root Config

1. ### Config Screen Functions

-   `configureConfigScreen` Function

    The function is used to configure the ConfigScreen. Use this function to add TextInput Field, Select Field or Radio Options Field to ConfigScreen.

    To Configure ConfigScreen the function should return the following

    ```
    {
        textField: {
            type: "textInputFields",
            labelText: "DAM Text Input",
            helpText: "DAM Text Input Helptext",
            placeholderText: "DAM Text Input Placeholder",
            instructionText: "DAM Text Input Instruction Text",
            inputFieldType: "password",
            /* inputFieldType: 'text'|'password'|'email'|'number'|'search'|'url'|'date'|'time'|'string'; */
            saveInConfig: false,
            saveInServerConfig: true,
        },
        selectField: {
            type: "selectInputFields",
            labelText: "DAM Select Input",
            helpText: "DAM Select Input Helptext",
            placeholderText: "DAM Select Input Placeholder",
            instructionText: "DAM Select Input Instruction Text",
            options: [
                { label: "option 1", value: "option1" },
                { label: "option 2", value: "option2" },
            ],
            defaultSelectedOption: "option2",
            saveInConfig: true,
            saveInServerConfig: false,
        }
    }
    ```

    > Note:
    >
    > -   The type property can be `textInputFields|selectInputFields|radioInputFields`.
    > -   The property name (eg: textField, selectField mentioned in example) will be considered as the property name of configuration field which is added.

<br />

-   `customConfigComponent` Function

    The function is used to add extra custom configurations to ConfigScreen. Use this function to add custom fields other than TextInput Field, Select Field or Radio Options Field.

    Function Parameters:

    | Name                     | Type                                                    | Description                          |
    | ------------------------ | ------------------------------------------------------- | ------------------------------------ |
    | config                   | Object                                                  | config object                        |
    | serverConfig             | Object                                                  | server config object                 |
    | handleCustomConfigUpdate | (updateConfigObj: TypeCustomConfigUpdateParams) => void | Function to update the configuration |

    ```
    Note: interface TypeCustomConfigUpdateParams {
            fieldName: string;
            fieldValue: string;
            saveConfig: boolean;
            saveServerConfig: boolean;
        }
    ```

    Return Value:

    ```
    The Function returns a React Component which is rendered in ConfigScreen.
    ```

<br />

-   `customWholeJson` Function

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

2. ### Custom Field Functions

-   `filterAssetData` Function

    The function is used to filter required asset properties and form a assetObject which is used for internal asset management.

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

-   `handleConfigtoSelectorPage` Function

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

-   `getSelectorWindowUrl` Function

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

-   `handleSelectorPageData` Function

    The function manages data received from the selector page, extracting it from a message event parameter for use in the application.

    The function is used to get the available third-party DAM window url to open it in a pop-up window.

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

-   `handleSelectorWindow` Function

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

3. ### Selector Page Functions

-   `openComptactView` Function

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

-   `customSelectorComponent` Function

    The function is used in Custom DAM Selector Component Flow where the entire selector page is developed by the user using APIs or SDKs to fetch the asset data.

    Function Parameters:

    | Name      | Type                          | Description                                                                      |
    | --------- | ----------------------------- | -------------------------------------------------------------------------------- |
    | config    | Object                        | Config object received from CustomField                                          |
    | setError  | (errObj: TypeErrorFn) => void | Function to set an error message in selector page                                |
    | successFn | (assets: any[]) => void       | Function to send your data to custom field. It accepts an array of asset objects |
    | closeFn   | () => void                    | Function to close the Selector Page                                              |

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

## Configure JSON RTE

The backend implementation for this app will be present in the /api folder at the root level.

# add links to functions
