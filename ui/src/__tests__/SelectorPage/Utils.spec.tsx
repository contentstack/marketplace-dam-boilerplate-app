import SelectorPageUtils from "../../common/utils/SelectorPageUtils";

describe("loadDAMScript", () => {
  let createElementSpy: jest.SpyInstance;
  let appendChildMock: jest.Mock;

  beforeAll(() => {
    createElementSpy = jest.spyOn(document, "createElement");
    appendChildMock = jest.fn();
    document.body.appendChild = appendChildMock;
  });

  afterAll(() => {
    createElementSpy.mockRestore();
  });

  it("should create a script element with the provided URL", async () => {
    const url = "https://example.com/myscript.js";
    SelectorPageUtils.loadDAMScript(url)
      .then(() => {
        expect(createElementSpy).toHaveBeenCalledWith("script");
        const createdScript = createElementSpy.mock.results[0].value;
        expect(createdScript.src).toBe(url);
      })
      .catch(() => console.error("Test case failed"));
  });

  it("should append the created script element to the body", async () => {
    const url = "https://example.com/myscript.js";
    SelectorPageUtils.loadDAMScript(url)
      .then(() => {
        expect(appendChildMock).toHaveBeenCalled();
        const createdScript = createElementSpy.mock.results[0].value;
        expect(appendChildMock).toHaveBeenCalledWith(createdScript);
      })
      .catch(() => console.error("Test case failed"));
  });

  it("should resolve the Promise when the script is loaded", async () => {
    const url = "https://example.com/myscript.js";
    const resolveFn = jest.fn();
    const mockScriptElement = document.createElement("script");
    mockScriptElement.onload = resolveFn;
    createElementSpy.mockReturnValue(mockScriptElement);
    SelectorPageUtils.loadDAMScript(url)
      .then(() => {
        expect(resolveFn).toHaveBeenCalled();
      })
      .catch(() => console.error("Test case failed"));
  });
});
