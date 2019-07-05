import reducer from "../channelPartReducer";
import { initialState } from "../channelPartReducer";

import * as types from "../../actions/types";
import { partPayload0, partPayload1, partState0, partState1 } from "../../__fixtures__/part.fixtures";

describe("channel reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("should handle ADD_PART", () => {
    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_PART,
      payload: partPayload0
    });

    expect(reducer0).toEqual(partState0);
  });

  it("should handle UPDATE_PART", () => {

    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_PART,
      payload: partPayload0
    });

    expect(reducer0).toEqual(partState0);

    const reducer1 = reducer(reducer0, {
      type: types.UPDATE_PART,
      payload: {
        ...partPayload1,
        partId: 0,
      }
    });

    expect(reducer1).toEqual(partState1);
  });

  it("should not update a part if invalid partID is used", () => {

    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_PART,
      payload: partPayload0
    });

    expect(reducer0).toEqual(partState0);

    const reducer1 = reducer(reducer0, {
      type: types.UPDATE_PART,
      payload: {
        ...partPayload1, // no partId
      }
    });
    expect(reducer1).toEqual(partState0);

    const reducer2 = reducer(reducer0, {
      type: types.UPDATE_PART,
      payload: {
        ...partPayload1,
        partId: 99, // not existing partId
      }
    });
    expect(reducer2).toEqual(partState0);

    const reducer3 = reducer(reducer0, {
      type: types.UPDATE_PART,
      payload: {
        ...partPayload1,
        partId: -1, // not existing partId
      }
    });
    expect(reducer3).toEqual(partState0);

  });

  it("should handle DELETE_PART", () => {

    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_PART,
      payload: partPayload0
    });

    expect(reducer0).toEqual(partState0);

    const reducer1 = reducer(reducer0, {
      type: types.DELETE_PART,
      payload: 0,
    });

    expect(reducer1).toEqual({
      ...initialState,
      lastPartId: 0,
    });
  });


  it("should not delete a part for invalid partId", () => {

    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_PART,
      payload: partPayload0
    });

    expect(reducer0).toEqual(partState0);

    const reducer1 = reducer(reducer0, {
      type: types.DELETE_PART,
    });
    expect(reducer1).toEqual(partState0);

    const reducer2 = reducer(reducer0, {
      type: types.DELETE_PART,
      partId: 99
    });
    expect(reducer2).toEqual(partState0);

    const reducer3 = reducer(reducer0, {
      type: types.DELETE_PART,
      partId: -1
    });
    expect(reducer3).toEqual(partState0);
  });

  it("should handle CLEAR_PART", () => {
    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_PART,
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