import reducer, { initialState, getImageList, getImageSources } from "../imageListReducer";
import * as types from "../../actions/types";
import { imagePayload0, imageListState0, fullState0,
} from "../../__fixtures__/imageList.fixtures";

describe("image list reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("should add an image", () => {
    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_IMAGE,
      payload: imagePayload0
    });

    expect(reducer0).toEqual(imageListState0);
  });

  it("should delete an image from the list", () => {

    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_IMAGE,
      payload: imagePayload0
    });

    expect(reducer0).toEqual(imageListState0);

    const reducer1 = reducer(reducer0, {
      type: types.REMOVE_IMAGE,
      payload: "grummelschnubbel.png"
    });

    expect(reducer1).toEqual({
      ...initialState,
    });
  });

  it("should clear the image list", () => {
    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_IMAGE,
      payload: imagePayload0
    });

    expect(reducer0).toEqual(imageListState0);

    const reducer1 = reducer(reducer0, {
      type: types.CLEAR_IMAGELIST,
    });

    expect(reducer1).toEqual({
      ...initialState,
    });
  });

});

describe("selector functions", () => {

  it("should get the image list", () => {
    expect(getImageList(fullState0)).toEqual([imagePayload0]);
  });

  it("should get the image sources", () => {
    expect(getImageSources(fullState0)).toEqual(
      {
        "grummelschnubbel.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAAAeCAYAAAAoyywTAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAACLSURBVHhe7daxDQIxEADBg+7o4akOeqA8nsAh+g/YgGBGsnyJHa0sX2bm/VkceNyeazp2f21r+u7snrPz/+66dviZmMiIiYyYyPiAk/EykRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERE5GZHUbWCDnvLRwMAAAAAElFTkSuQmCC"
      }
    );
  });




});