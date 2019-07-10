import reducer from "../partReducer";
import { initialState } from "../partReducer";

import * as types from "../../actions/types";
import { partPayload0, partPayload1, partState0, partState1, partPayload0WithoutId } from "../../__fixtures__/part.fixtures";

describe("part reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("should create a new part", () => {
    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_PART,
      payload: partPayload0
    });

    expect(reducer0).toEqual(partState0);
  });

  it("should handle a complete part update", () => {

    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_PART,
      payload: partPayload0
    });

    expect(reducer0).toEqual(partState0);

    const reducer1 = reducer(reducer0, {
      type: types.UPDATE_A_PART,
      payload: {
        ...partPayload1,
      }
    });

    expect(reducer1).toEqual(partState1);
  });

  it("should handle a partial part update", () => {

    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_PART,
      payload: partPayload0
    });

    expect(reducer0).toEqual(partState0);

    const reducer1 = reducer(reducer0, {
      type: types.UPDATE_A_PART,
      payload: {
        partId: "part-1",
        imageId: "image1.png",
      }
    });

    expect(reducer1).toEqual({
      byPartId: {
        "part-1": {
          ...partPayload0,
          imageId: "image1.png",
        }
      },
      allPartIds: ["part-1"],
    });
  });

  it("should not update a part if invalid partID is used", () => {

    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_PART,
      payload: partPayload0
    });

    expect(reducer0).toEqual(partState0);

    const reducer1 = reducer(reducer0, {
      type: types.UPDATE_A_PART,
      payload: {
        ...partPayload0WithoutId, // no partId
      }
    });
    expect(reducer1).toEqual(partState0);

    const reducer2 = reducer(reducer0, {
      type: types.UPDATE_A_PART,
      payload: {
        ...partPayload1,
        partId: "part-99", // not existing partId
      }
    });
    expect(reducer2).toEqual(partState0);

    const reducer3 = reducer(reducer0, {
      type: types.UPDATE_A_PART,
      payload: {
        ...partPayload1,
        partId: "part-0", // not existing partId
      }
    });
    expect(reducer3).toEqual(partState0);

  });

  it("should handle DELETE_A_PART", () => {

    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_PART,
      payload: partPayload0
    });

    expect(reducer0).toEqual(partState0);

    const reducer1 = reducer(reducer0, {
      type: types.DELETE_A_PART,
      payload: "part-1",
    });

    expect(reducer1).toEqual({
      ...initialState,
    });
  });


  it("should not delete a part for invalid partId", () => {

    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_PART,
      payload: partPayload0
    });

    expect(reducer0).toEqual(partState0);

    const reducer1 = reducer(reducer0, {
      type: types.DELETE_A_PART,
    });
    expect(reducer1).toEqual(partState0);

    const reducer2 = reducer(reducer0, {
      type: types.DELETE_A_PART,
      payload: 99
    });
    expect(reducer2).toEqual(partState0);

    const reducer3 = reducer(reducer0, {
      type: types.DELETE_A_PART,
      payload: -1
    });
    expect(reducer3).toEqual(partState0);
  });

  it("should handle CLEAR_PART", () => {
    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_PART,
      payload: partPayload0
    });

    expect(reducer0).toEqual(partState0);

    const reducer1 = reducer(reducer0, {
      type: types.CLEAR_PARTS,
    });

    expect(reducer1).toEqual({
      ...initialState,
    });

  });


});