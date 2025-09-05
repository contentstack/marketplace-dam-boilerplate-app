const axios = require("axios");
const constants = require("../constants");

const makeApiCall = async ({ url, method, headers, data }) => {
	try {
		const res = await axios({
			url,
			method,
			timeout: 60 * 1000,
			headers,
			...(["PUT", "POST", "DELETE", "PATCH"].includes(method) && {
				data,
			}),
		});

		return res?.data;
	} catch (e) {
		throw e;
	}
};

const safePromise = (promise, errorText) => promise.then((res) => [null, res]).catch((err) => {
		console.error(errorText);
	return [err];
});

const getBaseUrl = (region) => {
	const baseUrl = constants.BASE_URLS.find((item) => item.region === region);
	return baseUrl ? baseUrl.url : constants.BASE_URLS[0].url;
};

module.exports = {
	makeApiCall,
	safePromise,
	getBaseUrl,
};
