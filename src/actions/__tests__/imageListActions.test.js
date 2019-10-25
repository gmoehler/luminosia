import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "../imageListActions";
import * as types from "../types";
import {
  imagePayload1, imagePayload2, fullState0,
} from "../../__fixtures__/imageList.fixtures";


export const mockStore = configureMockStore([thunk]);

describe("part actions", () => {

  it("should add an image to the list", () => {
    const expectedActions = [{
      type: types.ADD_IMAGE,
      payload: { ...imagePayload1, imageId: imagePayload1.filename }
    }];

    const store = mockStore({
      entities: {
        images: {
          byImageId: {},
          allImageIds: [],
        },
      }
    });

    const partId = store.dispatch(actions.addImage(imagePayload1));
    expect(partId).toEqual(imagePayload1.filename);
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should add an image with existing imageId to the list", () => {
    const expectedActions = [{
      type: types.ADD_IMAGE,
      payload: imagePayload2
    }];

    const store = mockStore({
      entities: {
        images: {
          byImageId: {},
          allImageIds: [],
        },
      }
    });

    const partId = store.dispatch(actions.addImage(imagePayload2));
    expect(partId).toEqual(imagePayload2.imageId);
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should clear the image list", () => {
    const expectedActions = [{
      type: types.CLEAR_IMAGELIST,
    }];

    const store = mockStore({
      entities: {
        images: {
          byImageId: {},
          allImageIds: [],
        },
      }
    });

    store.dispatch(actions.clearImageList());
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should remove an image from the image list", () => {
    const expectedActions = [{
      type: types.REMOVE_IMAGE,
      payload: "grummelschnubbel.png"
    }];

    const store = mockStore(fullState0);

    store.dispatch(actions.removeImage("grummelschnubbel.png"));
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should do nothing when image to remove is not in image list", () => {

    const store = mockStore(fullState0);

    store.dispatch(actions.removeImage("nonexisting.png"));
    const acts = store.getActions();
    expect(acts).toEqual([]);
  });



});