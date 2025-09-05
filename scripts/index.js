const readlineSync = require("readline-sync");
const contentstack = require("@contentstack/marketplace-sdk");
const { makeApiCall, safePromise, getBaseUrl } = require("./utils");
const { createApp } = require("./ops/create");
const { installApp } = require("./ops/install");
const constants = require("./constants");

(async () => {
  try {
    regionIndex = readlineSync.keyInSelect(
      constants.CS_REGIONS.map((region) => region.name),
      "Please select Contentstack region"
    );
    if (regionIndex === -1) {
      console.info("No region selected...");
      return;
    }

    const csBaseUrl = getBaseUrl(constants.CS_REGIONS[regionIndex].value);

    const email = readlineSync.question("Email: ");
    const password = readlineSync.question("Password: ", {
      hideEchoBack: true,
    });

    // Step 1: Try login without OTP
    const [loginError, loginData] = await safePromise(
      makeApiCall({
        url: `${csBaseUrl}/v3/user-session`,
        method: "POST",
        //   headers: { "Content-Type": "application/json" },
        data: { user: { email, password } },
      }),
      "Looks like your email or password is invalid. Please try again or reset your password."
    );

    if (loginError) return;

    let authtoken, userOrgs;
    if (loginData.user) {
      authtoken = loginData.user.authtoken;
      userOrgs = loginData.user.organizations;
    }

    // Step 2: If 2FA required
    if (loginData.statusCode === 294) {
      authIndex = readlineSync.keyInSelect(
        constants.AUTHENTICATORS.map((auth) => auth.name),
        "Please select an authenticator"
      );
      if (authIndex === -1) {
        console.info("No authenticator selected...");
        return;
      }

      if (constants.AUTHENTICATORS[authIndex].value === "sms") {
        const [smsError] = await safePromise(
          makeApiCall({
            url: `${csBaseUrl}/v3/user/request_token_sms`,
            method: "POST",
            data: {
              user: { email, password },
            },
          }),
          "Error while requesting SMS 2FA token."
        );

        if (!smsError)
          console.info("SMS 2FA token requested. Please check your phone.");
      }

      const tfa_token = readlineSync.question(
        constants.AUTHENTICATORS[authIndex].value === "sms"
          ? "Enter the 2FA code sent to your phone: "
          : "Enter the 2FA code generated on your authenticator app: "
      );

      const [retryError, retryData] = await safePromise(
        makeApiCall({
          url: `${csBaseUrl}/v3/user-session`,
          method: "POST",
          data: {
            user: { email, password, tfa_token },
          },
        }),
        "Two-Factor Authentication verification failed."
      );

      if (retryError) return;

      authtoken = retryData?.user?.authtoken;
      userOrgs = retryData?.user?.organizations;
    }

    if (!userOrgs.length) {
      console.info("No organisations found...");
      return;
    }

    orgIndex = readlineSync.keyInSelect(
      userOrgs.map((org) => org.name),
      "Please select an organization"
    );
    if (orgIndex === -1) {
      console.info("No organization selected...");
      return;
    }

    const selectedOrgUid = userOrgs[orgIndex].uid;

    // Step 3: Create Marketplace App
    const client = contentstack.client({ authtoken });
    const marketplace = client.marketplace(selectedOrgUid);

    const appName = readlineSync.question("Enter name of app: ");
    console.log("What you want to execute");
    const selection = readlineSync.keyInSelect(
      ["CustomField", "RTE"],
      "Select an option"
    );

    const app = await createApp(marketplace, appName, selection);

    console.log("App created:", app.uid);

    console.log("Do you want to install this app now?");
    const choice = readlineSync.keyInSelect(["Yes", "No"], "Select an option");

    if (choice === 0) {
      await installApp(app, marketplace, csBaseUrl, authtoken, selectedOrgUid);
    } else {
      console.log("App created but not installed.");
    }
  } catch (error) {
    console.info(error);
    console.error("Error:", error.message || error);
  }
})();
