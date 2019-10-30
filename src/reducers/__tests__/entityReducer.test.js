import reducer, { entityExists } from "../entityReducer";
import * as types from "../../actions/types";

import { initialState as imageListInitialState } from "../imageListReducer";
import { initialState as partInitialState } from "../partReducer";
import { initialState as markerInitialState } from "../markerReducer";
import { initialState as channelInitialState } from "../channelReducer";
import { imageListState0, imagePayload0 } from "../../__fixtures__/imageList.fixtures";


const emptyEntities = {
  images: imageListInitialState,
  parts: partInitialState,
  markers: markerInitialState,
  channels: channelInitialState,
  selectedEntityIds: [],
  entityIdsToCopy: [],
};

const entitiesWithSelection = {
  ...emptyEntities,
  selectedEntityIds: ["ent-1"]
};

const entitiesWithImage = {
  ...emptyEntities,
  images: imageListState0,
};

const fullStateEmpty = {
  entities: emptyEntities
};

const fullStateWithImage = {
  entities: entitiesWithImage
};

describe("entity reducer", () => {

  it("should select an entity", () => {

    const reducer1 = reducer(reducer(emptyEntities, {}), {
      type: types.SELECT_ENTITY,
      payload: "ent-1",
    });

    expect(reducer1).toEqual(entitiesWithSelection);
  });

  it("should deselect an entity", () => {

    const reducer1 = reducer(reducer(entitiesWithSelection, {}), {
      type: types.DESELECT_ENTITY,
      payload: "ent-1",
    });

    expect(reducer1).toEqual(emptyEntities);
  });

  it("should deselect all images", () => {

    const reducer1 = reducer(reducer(entitiesWithSelection, {}), {
      type: types.CLEAR_ENTITY_SELECTION
    });

    expect(reducer1).toEqual(emptyEntities);
  });
});

describe("selector functions", () => {
  it("should detect that an entity exists", () => {
    expect(entityExists(fullStateWithImage, imagePayload0.imageId)).toBeTruthy();
  });

  it("should detect that an entity does not exist", () => {
    expect(entityExists(fullStateEmpty, imagePayload0.imageId)).toBeFalsy();
  });

});
