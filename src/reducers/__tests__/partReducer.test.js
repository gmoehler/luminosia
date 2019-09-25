import reducer, { doesPartExist, getChannelId, getPart, getParts } from "../partReducer";
import { initialState } from "../partReducer";

import * as types from "../../actions/types";
import {
  partState0, fullPartState0, normalizedPartPayload0, partPayload0
} from "../../__fixtures__/part.fixtures";

describe("part reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("should create a new part", () => {
    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_PART,
      payload: normalizedPartPayload0
    });

    expect(reducer0).toEqual(partState0);
  });

  it("should handle CLEAR_PART", () => {
    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_PART,
      payload: normalizedPartPayload0
    });

    expect(reducer0).toEqual(partState0);

    const reducer1 = reducer(reducer0, {
      type: types.CLEAR_PARTS,
    });

    expect(reducer1).toEqual({
      ...initialState,
    });
  });

  it("should move part", () => {

    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_PART,
      payload: normalizedPartPayload0
    });
    expect(reducer0).toEqual(partState0);

    const reducer1 = reducer(reducer0, {
      type: types.MOVE_A_PART,
      payload: {
        partId: "part-1",
        incr: 0.5,
      }
    });
    expect(reducer1).toEqual({
      byPartId: {
        "part-1": {
          partId: "part-1",
          imageId: "image1.png",
          channelId: "channel-1",
          offset: 0.5,
          duration: 1,
        }
      },
      allPartIds: ["part-1"],
    });
  });

  it("should not move part left to 0", () => {

    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_PART,
      payload: normalizedPartPayload0
    });
    expect(reducer0).toEqual(partState0);

    const reducer1 = reducer(reducer0, {
      type: types.MOVE_A_PART,
      payload: {
        partId: "part-1",
        incr: -0.5,
      }
    });
    expect(reducer1).toEqual({
      byPartId: {
        "part-1": {
          partId: "part-1",
          imageId: "image1.png",
          channelId: "channel-1",
          offset: 0,
          duration: 1,
        }
      },
      allPartIds: ["part-1"],
    });
  });

  it("should resize the left boundary of a part", () => {

    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_PART,
      payload: normalizedPartPayload0
    });
    expect(reducer0).toEqual(partState0);

    const reducer1 = reducer(reducer0, {
      type: types.RESIZE_A_PART,
      payload: {
        partId: "part-1",
        bound: "left",
        incr: 0.5,
      }
    });
    expect(reducer1).toEqual({
      byPartId: {
        "part-1": {
          partId: "part-1",
          imageId: "image1.png",
          channelId: "channel-1",
          offset: 0.5,
          duration: 0.5,
        }
      },
      allPartIds: ["part-1"],
    });
  });

  it("should not resize the left boundary more than right bound", () => {

    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_PART,
      payload: normalizedPartPayload0
    });
    expect(reducer0).toEqual(partState0);

    const reducer1 = reducer(reducer0, {
      type: types.RESIZE_A_PART,
      payload: {
        partId: "part-1",
        bound: "left",
        incr: 1.5,
      }
    });
    expect(reducer1).toEqual({
      byPartId: {
        "part-1": {
          partId: "part-1",
          imageId: "image1.png",
          channelId: "channel-1",
          offset: 0,
          duration: 1,
        }
      },
      allPartIds: ["part-1"],
    });
  });

  it("should not resize the left boundary lower than 0", () => {

    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_PART,
      payload: normalizedPartPayload0
    });
    expect(reducer0).toEqual(partState0);

    const reducer1 = reducer(reducer0, {
      type: types.RESIZE_A_PART,
      payload: {
        partId: "part-1",
        bound: "left",
        incr: -0.5,
      }
    });
    expect(reducer1).toEqual({
      byPartId: {
        "part-1": {
          partId: "part-1",
          imageId: "image1.png",
          channelId: "channel-1",
          offset: 0,
          duration: 1,
        }
      },
      allPartIds: ["part-1"],
    });
  });


  it("should resize the right boundary of a part", () => {

    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_PART,
      payload: normalizedPartPayload0
    });
    expect(reducer0).toEqual(partState0);

    const reducer1 = reducer(reducer0, {
      type: types.RESIZE_A_PART,
      payload: {
        partId: "part-1",
        bound: "right",
        incr: 0.5,
      }
    });
    expect(reducer1).toEqual({
      byPartId: {
        "part-1": {
          partId: "part-1",
          imageId: "image1.png",
          channelId: "channel-1",
          offset: 0,
          duration: 1.5,
        }
      },
      allPartIds: ["part-1"],
    });
  });

  it("should resize the right boundary to the left of the left bound", () => {

    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_PART,
      payload: normalizedPartPayload0
    });
    expect(reducer0).toEqual(partState0);

    const reducer1 = reducer(reducer0, {
      type: types.RESIZE_A_PART,
      payload: {
        partId: "part-1",
        bound: "right",
        incr: -1.5,
      }
    });
    expect(reducer1).toEqual({
      byPartId: {
        "part-1": {
          partId: "part-1",
          imageId: "image1.png",
          channelId: "channel-1",
          offset: 0,
          duration: 1,
        }
      },
      allPartIds: ["part-1"],
    });
  });


  it("should delete a part", () => {

    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_PART,
      payload: normalizedPartPayload0
    });

    expect(reducer0).toEqual(partState0);

    const reducer1 = reducer(reducer0, {
      type: types.DELETE_A_PART,
      payload: {
        partId: "part-1",
        channelId: "channel-1",
      }
    });

    expect(reducer1).toEqual({
      ...initialState,
    });
  });

});

describe("selector functions", () => {

  it("should show that a part exists", () => {

    expect(doesPartExist(fullPartState0, "part-1")).toBeTruthy();
  });

  it("should show that a part does not exists", () => {

    expect(doesPartExist(fullPartState0, "part-99")).toBeFalsy();
  });

  it("should return the channel id of a part", () => {

    expect(getChannelId(fullPartState0, "part-1")).toEqual("channel-1");
  });

  it("should return null as channel id of non existing part", () => {

    expect(getChannelId(fullPartState0, "part-99")).toBeNull();
  });

  it("should return the part", () => {
    expect(getPart(fullPartState0, "part-1")).toEqual(partPayload0);
  });

  it("should return the part", () => {
    expect(getParts(fullPartState0, ["part-1"])).toEqual([partPayload0]);
  });

});