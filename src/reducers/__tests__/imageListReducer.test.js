import reducer, { initialState, getImageList, getImages } from "../imageListReducer";
import * as types from "../../actions/types";
import {
  imagePayload0, imageListState0, fullState0,
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

  it("should get the images", () => {
    expect(getImages(fullState0)).toEqual({
      [imagePayload0.imageId]: imagePayload0
    });
  });

});