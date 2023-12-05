/* Import React modules */
/* Import other node modules */
/* Import our modules */
/* Import node module CSS */
/* Import our CSS */

/* Below is just an example function which can be called
from any of the app container pages. */
const getDataFromAPI: Function = (data?: any): Promise<any> =>
  fetch(`${process.env.REACT_APP_API_URL ?? ""}?${data?.queryParams}`, {
    headers: {
      ...data?.headers,
      "x-api-key": process.env.REACT_APP_API_KEY ?? "",
    },
    method: data?.method,
    body: JSON.stringify(data?.body),
  });

export default getDataFromAPI;
