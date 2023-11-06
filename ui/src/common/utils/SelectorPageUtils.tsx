// function to load script
const loadDAMScript = (url: string) =>
  new Promise((resolve) => {
    const DAMScript: any = document.createElement("script");
    const bodyTag = document.getElementsByTagName("body")?.[0];
    DAMScript.src = url;
    DAMScript.id = "DAMScript";
    DAMScript.type = "text/javascript";
    if (DAMScript?.readyState) {
      DAMScript.onreadystatechange = function () {
        if (
          DAMScript.readyState === "loaded" ||
          DAMScript.readyState === "complete"
        ) {
          DAMScript.onreadystatechange = null;
          resolve(true);
        }
      };
    } else {
      DAMScript.onload = function () {
        resolve(true);
      };
    }
    bodyTag.appendChild(DAMScript);
  });

const SelectorPageUtils = {
  loadDAMScript,
};

export default SelectorPageUtils;
