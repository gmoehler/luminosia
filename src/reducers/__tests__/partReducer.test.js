import { cloneDeep } from "lodash";
import reducer, { partExists, getChannelId, getPart, getParts } from "../partReducer";
import { initialState } from "../partReducer";

import * as types from "../../actions/types";
import { normalizedPart1, partState1, partState2, part1, entityState1 } from "../../__fixtures__/entity.fixtures";

describe("part reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("should create a new part", () => {
    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_PART,
      payload: normalizedPart1
    });

    expect(reducer0).toEqual(partState1);
  });

  it("should handle CLEAR_PART", () => {
    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.CLEAR_PARTS,
    });

    expect(reducer0).toEqual({
      ...initialState,
    });
  });

  it("should delete a part", () => {

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.DELETE_A_PART,
      payload: {
        partId: "part-2",
        channelId: "channel-1",
      }
    });

    expect(reducer0).toEqual(partState1);
  });

  it("should move part", () => {
    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.MOVE_A_PART,
      payload: {
        partId: "part-1",
        incr: 0.5,
      }
    });

    const expectedState = cloneDeep(partState2);
    expectedState.byPartId[part1.partId].offset += 0.5;

    expect(reducer0).toEqual(expectedState);
  });

  it("should not move part left to 0", () => {

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.MOVE_A_PART,
      payload: {
        partId: "part-1",
        incr: -0.5,
      }
    });

    const expectedState = cloneDeep(partState2);
    expectedState.byPartId[part1.partId].offset -= 0.5;

    expect(reducer0).toEqual(expectedState);
  });

  it("should resize the left boundary of a part", () => {

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.RESIZE_A_PART,
      payload: {
        partId: "part-1",
        bound: "left",
        incr: 0.5,
      }
    });

    const expectedState = cloneDeep(partState2);
    expectedState.byPartId[part1.partId].offset += 0.5;
    expectedState.byPartId[part1.partId].duration -= 0.5;

    expect(reducer0).toEqual(expectedState);
  });

  it("should not resize the left boundary more than right bound", () => {

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.RESIZE_A_PART,
      payload: {
        partId: "part-1",
        bound: "left",
        incr: 1.5,
      }
    });

    expect(reducer0).toEqual(partState2);
  });

  it("should not resize the left boundary lower than 0", () => {

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.RESIZE_A_PART,
      payload: {
        partId: "part-1",
        bound: "left",
        incr: -1.5,
      }
    });

    const expectedState = cloneDeep(partState2);
    expectedState.byPartId[part1.partId].offset = 0;
    expectedState.byPartId[part1.partId].duration = 2.0;

    expect(reducer0).toEqual(expectedState);
  });


  it("should resize the right boundary of a part", () => {

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.RESIZE_A_PART,
      payload: {
        partId: "part-1",
        bound: "right",
        incr: 0.5,
      }
    });

    const expectedState = cloneDeep(partState2);
    expectedState.byPartId[part1.partId].duration += 0.5;

    expect(reducer0).toEqual(expectedState);
  });

  it("should not resize the right boundary to the left of the left bound", () => {

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.RESIZE_A_PART,
      payload: {
        partId: "part-1",
        bound: "right",
        incr: -1.5,
      }
    });
    expect(reducer0).toEqual(partState2);
  });

});

describe("selector functions", () => {

  it("should show that a part exists", () => {

    expect(partExists(entityState1, part1.partId)).toBeTruthy();
  });

  it("should show that a part does not exists", () => {

    expect(partExists(entityState1, "part-99")).toBeFalsy();
  });

  it("should return the channel id of a part", () => {

    expect(getChannelId(entityState1, part1.partId)).toEqual(part1.channelId);
  });

  it("should return null as channel id of non existing part", () => {

    expect(getChannelId(entityState1, "part-99")).toBeNull();
  });

  it("should return the part", () => {
    expect(getPart(entityState1, part1.partId)).toEqual(part1);
  });

  it("should return the part", () => {
    expect(getParts(entityState1, [part1.partId])).toEqual([part1]);
  });

});