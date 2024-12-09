import { TypeAsset } from "../../common/types";
import CustomFieldUtils from "../../common/utils/CustomFieldUtils";

describe("popupWindow", () => {
  it("check window open funcionality", () => {
    jest.spyOn(window, "open").mockImplementation(jest.fn());
    CustomFieldUtils.popupWindow({ url: "", title: "", w: 100, h: 100 });
    expect(window.open).toHaveBeenCalled();
  });
});

describe("getHoverActions", () => {
  it("should return array of actions", () => {
    const removeAsset = jest.fn();
    expect(
      CustomFieldUtils.getHoverActions("image", removeAsset, "123", "Image 1")
        .length
    ).toEqual(2);
    expect(
      CustomFieldUtils.getHoverActions(
        "image",
        removeAsset,
        "123",
        "Image 1",
        "https://example.platformUrl.com"
      ).length
    ).toEqual(3);
    expect(
      CustomFieldUtils.getHoverActions(
        "image",
        removeAsset,
        "123",
        "Image 1",
        "https://example.platformUrl.com",
        "https://example.previewUrl.com"
      ).length
    ).toEqual(4);
  });
});

describe("getListHoverActions", () => {
  it("should return array of actions", () => {
    const removeAsset = jest.fn();
    expect(
      CustomFieldUtils.getListHoverActions(
        "image",
        removeAsset,
        "123",
        "Image 1"
      ).length
    ).toEqual(2);
    expect(
      CustomFieldUtils.getListHoverActions(
        "image",
        removeAsset,
        "123",
        "Image 1",
        "https://example.platformUrl.com"
      ).length
    ).toEqual(3);
    expect(
      CustomFieldUtils.getListHoverActions(
        "image",
        removeAsset,
        "123",
        "Image 1",
        "https://example.platformUrl.com",
        "https://example.previewUrl.com"
      ).length
    ).toEqual(4);
  });
});

describe("uniqBy", () => {
  it("should return an empty array when input array is empty", () => {
    const input: any[] = [];
    const result = CustomFieldUtils.uniqBy(input, "id");
    expect(result).toEqual([]);
  });

  it("should return the same array when no duplicates are found", () => {
    const input = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = CustomFieldUtils.uniqBy(input, "id");
    expect(result).toEqual(input);
  });

  it("should remove duplicates based on the specified property", () => {
    const input = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
      { id: 1, name: "James" },
    ];
    const expected = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
    ];
    const result = CustomFieldUtils.uniqBy(input, "id");
    expect(result).toEqual(expected);
  });

  it("should handle cases where iteratee is a custom function", () => {
    const input = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
      { id: 1, name: "James" },
    ];
    const expected = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
    ];
    const customIteratee = (item: any) => item.id;
    const result = CustomFieldUtils.uniqBy(input, customIteratee);
    expect(result).toEqual(expected);
  });
});

describe("findAssetIndex", () => {
  it("should return -1 when the input array is empty", () => {
    const assets: TypeAsset[] = [];
    const id = "1";
    const result = CustomFieldUtils.findAssetIndex(assets, id);
    expect(result).toBe(-1);
  });

  it("should return -1 when the specified id is not found in the array", () => {
    const assets: TypeAsset[] = [
      {
        id: "2",
        type: "image",
        name: "sampleImage",
        width: "100",
        height: "100",
        size: "1000",
        thumbnailUrl: "",
      },
      {
        id: "3",
        type: "image",
        name: "sampleImage",
        width: "100",
        height: "100",
        size: "1000",
        thumbnailUrl: "",
      },
      {
        id: "4",
        type: "image",
        name: "sampleImage",
        width: 100,
        height: 100,
        size: 1000,
        thumbnailUrl: "",
      },
    ];
    const id = "1";
    const result = CustomFieldUtils.findAssetIndex(assets, id);
    expect(result).toBe(-1);
  });

  it("should return the index of the specified id when found", () => {
    const assets = [
      {
        id: "2",
        type: "image",
        name: "sampleImage",
        width: 100,
        height: 100,
        size: 1000,
        thumbnailUrl: "",
      },
      {
        id: "1",
        type: "image",
        name: "sampleImage",
        width: 100,
        height: 100,
        size: 1000,
        thumbnailUrl: "",
      },
      {
        id: "3",
        type: "image",
        name: "sampleImage",
        width: 100,
        height: 100,
        size: 1000,
        thumbnailUrl: "",
      },
    ];
    const id = "1";
    const result = CustomFieldUtils.findAssetIndex(assets, id);
    expect(result).toBe(1);
  });

  it("should return the index of the first occurrence when id appears multiple times", () => {
    const assets = [
      {
        id: "2",
        type: "image",
        name: "sampleImage",
        width: 100,
        height: 100,
        size: 1000,
        thumbnailUrl: "",
      },
      {
        id: "1",
        type: "image",
        name: "sampleImage",
        width: 100,
        height: 100,
        size: 1000,
        thumbnailUrl: "",
      },
      {
        id: "3",
        type: "image",
        name: "sampleImage",
        width: 100,
        height: 100,
        size: 1000,
        thumbnailUrl: "",
      },
      {
        id: "1",
        type: "image",
        name: "sampleImage",
        width: 100,
        height: 100,
        size: 1000,
        thumbnailUrl: "",
      },
    ];
    const id = "1";
    const result = CustomFieldUtils.findAssetIndex(assets, id);
    expect(result).toBe(1);
  });
});

describe("extractKeys", () => {
  it("should return an empty array when the input array is empty", () => {
    const input: any[] = [];
    const result = CustomFieldUtils.extractKeys(input);
    expect(result).toEqual([]);
  });

  it("should extract values from an array of objects", () => {
    const input = [
      { label: "A", value: "A" },
      { label: "B", value: "B" },
      { label: "C", value: "C" },
    ];
    const expected = ["A", "B", "C"];
    const result = CustomFieldUtils.extractKeys(input);
    expect(result).toEqual(expected);
  });
});

describe("removeEmptyFromArray", () => {
  it("should remove undefined values from the array", () => {
    const input = [1, undefined, "hello", undefined, 2, null];
    const expected = [1, "hello", 2, null];
    const result = CustomFieldUtils.removeEmptyFromArray(input);
    expect(result).toEqual(expected);
  });
});

describe("convertStringAndMergeToObject", () => {
  it("should merge values into the existing object based on a dot-separated string", () => {
    const inputString = "foo.bar[0].baz";
    const value = "qux";
    const existingObject = {};
    const expected = { foo: { bar: [{ baz: "qux" }] } };
    const result = CustomFieldUtils.convertStringAndMergeToObject(
      inputString,
      value,
      existingObject
    );
    expect(result).toEqual(expected);
  });

  it("should handle existing properties and arrays", () => {
    const inputString = "foo.bar[0].baz";
    const value = "qux";
    const existingObject = { foo: { bar: [{ existing: "value" }] } };
    const expected = { foo: { bar: [{ existing: "value", baz: "qux" }] } };
    const result = CustomFieldUtils.convertStringAndMergeToObject(
      inputString,
      value,
      existingObject
    );
    expect(result).toEqual(expected);
  });
});

describe("navigateObject", () => {
  it("should navigate and retrieve a nested property", () => {
    const obj = {
      a: {
        b: {
          c: "value",
        },
      },
    };
    const keys = ["a", "b", "c"];
    const result = CustomFieldUtils.navigateObject(obj, keys);
    expect(result).toBe("value");
  });

  it("should handle array notation in keys", () => {
    const obj = {
      a: [
        {
          b: "value1",
        },
        {
          b: "value2",
        },
      ],
    };
    const keys = ["a[1]", "b"];
    const result = CustomFieldUtils.navigateObject(obj, keys);
    expect(result).toBe("value2");
  });

  it("should handle missing properties", () => {
    const obj = {
      a: {
        b: {
          c: "value",
        },
      },
    };
    const keys = ["x", "y", "z"];
    const result = CustomFieldUtils.navigateObject(obj, keys);
    expect(result).toBeUndefined();
  });
});

describe("getFilteredAssets", () => {
  it("should filter and transform assets based on keyArray", () => {
    const assets = [
      {
        id: 1,
        details: {
          name: "Asset 1",
          value: 100,
        },
      },
      {
        id: 2,
        details: {
          name: "Asset 2",
          value: 200,
        },
      },
    ];
    const keyArray = ["id", "details.name"];
    const result = CustomFieldUtils.getFilteredAssets(assets, keyArray);
    const expected = [
      {
        details: {
          name: "Asset 1",
        },
        id: 1,
      },
      {
        details: {
          name: "Asset 2",
        },
        id: 2,
      },
    ];
    expect(result).toEqual(expected);
  });

  it("should handle complex keys with array notation", () => {
    const assets = [
      {
        id: 1,
        details: {
          values: [100, 200, 300],
        },
      },
    ];
    const keyArray = ["id", "details.values[1]"];
    const result = CustomFieldUtils.getFilteredAssets(assets, keyArray);
    const expected = [
      {
        details: {
          values: [200],
        },
        id: 1,
      },
    ];
    expect(result).toEqual(expected);
  });

  it("should handle missing properties", () => {
    const assets = [
      {
        id: 1,
        details: {
          name: "Asset 1",
        },
      },
    ];
    const keyArray = ["id", "details.value", "details.name"];
    const result = CustomFieldUtils.getFilteredAssets(assets, keyArray);
    const expected = [
      {
        details: {
          name: "Asset 1",
        },
        id: 1,
      },
    ];
    expect(result).toEqual(expected);
  });
});
