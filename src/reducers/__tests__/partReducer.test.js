import { cloneDeep } from "lodash";
import reducer, { partExists, getChannelId, getPart, getParts, closestSnapDiff } from "../partReducer";
import { initialState } from "../partReducer";

import * as types from "../../actions/types";
import { normalizedPart1, partState1, partState2, part1, entityState1 } from "../../__fixtures__/entity.fixtures";

describe("part reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("should create a new part", () => {
    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_PART,
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
      type: types.DELETE_PART,
      payload: {
        partId: "part-2",
        channelId: "channel-1",
      }
    });

    expect(reducer0).toEqual(partState1);
  });

  it("should move part", () => {
    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.MOVE_PART,
      payload: {
        partId: "part-1",
        incr: 0.5,
      }
    });

    const expectedState = cloneDeep(partState2);
    expectedState.byPartId[part1.partId].offset += 0.5;
    expectedState.byPartId[part1.partId].actOffset =
      expectedState.byPartId[part1.partId].offset;
    expectedState.byPartId[part1.partId].actRightBound = null;

    expect(reducer0).toEqual(expectedState);
  });


  it("should move part with snap - 1", () => {

    const snapPositions = [2];
    const snapDist = 0.2;

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.MOVE_PART,
      payload: {
        partId: "part-1",
        incr: 0.9,
        snapPositions,
        snapDist,
      }
    });

    const expectedState = cloneDeep(partState2);
    const expPart1 = expectedState.byPartId[part1.partId];
    expPart1.actOffset = expPart1.offset + 0.9;
    expPart1.offset = snapPositions[0]; //snap
    expPart1.actRightBound = null;

    expect(reducer0).toEqual(expectedState);
  });

  it("should move part with snap - 2", () => {

    const snapPositions = [2];
    const snapDist = 0.2;

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.MOVE_PART,
      payload: {
        partId: "part-1",
        incr: 1.1,
        snapPositions,
        snapDist,
      }
    });

    const expectedState = cloneDeep(partState2);
    const expPart1 = expectedState.byPartId[part1.partId];
    expPart1.actOffset = expPart1.offset + 1.1;
    expPart1.offset = snapPositions[0]; //snap
    expPart1.actRightBound = null;

    expect(reducer0).toEqual(expectedState);
  });

  it("should move part with snap - 3", () => {

    const snapPositions = [0.5];
    const snapDist = 0.2;

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.MOVE_PART,
      payload: {
        partId: "part-1",
        incr: -0.4,
        snapPositions,
        snapDist,
      }
    });

    const expectedState = cloneDeep(partState2);
    const expPart1 = expectedState.byPartId[part1.partId];
    expPart1.actOffset = expPart1.offset - 0.4;
    expPart1.offset = snapPositions[0]; //snap
    expPart1.actRightBound = null;

    expect(reducer0).toEqual(expectedState);
  });

  it("should not move part left to 0", () => {

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.MOVE_PART,
      payload: {
        partId: "part-1",
        incr: -0.5,
      }
    });

    const expectedState = cloneDeep(partState2);
    expectedState.byPartId[part1.partId].offset -= 0.5;
    expectedState.byPartId[part1.partId].actOffset =
      expectedState.byPartId[part1.partId].offset;
    expectedState.byPartId[part1.partId].actRightBound = null;

    expect(reducer0).toEqual(expectedState);
  });

  it("should move part to a position close to 0", () => {

    const snapPositions = [0.1];
    const snapDist = 0.2;

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.MOVE_PART,
      payload: {
        partId: "part-1",
        incr: -1.1,
        snapPositions,
        snapDist,
      }
    });

    const expectedState = cloneDeep(partState2);
    const expPart1 = expectedState.byPartId[part1.partId];
    expPart1.actOffset = 0;
    expPart1.offset = -1 + 1.1; //snap
    expPart1.actRightBound = null;

    expect(reducer0).toEqual(expectedState);
  });

  it("should move parts with snap - 1", () => {

    const snapPositions = [2];
    const snapDist = 0.2;

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.MOVE_PARTS,
      payload: {
        partIds: ["part-1"],
        incr: 0.9,
        snapPositions,
        snapDist,
      }
    });

    const expectedState = cloneDeep(partState2);
    const expPart1 = expectedState.byPartId[part1.partId];
    expPart1.actOffset = expPart1.offset + 0.9;
    expPart1.offset = snapPositions[0]; //snap

    expect(reducer0).toEqual(expectedState);
  });

  it("should move parts with snap - 2", () => {

    const snapPositions = [2];
    const snapDist = 0.2;

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.MOVE_PARTS,
      payload: {
        partIds: ["part-1"],
        incr: 1.1,
        snapPositions,
        snapDist,
      }
    });

    const expectedState = cloneDeep(partState2);
    const expPart1 = expectedState.byPartId[part1.partId];
    expPart1.actOffset = expPart1.offset + 1.1;
    expPart1.offset = snapPositions[0]; //snap

    expect(reducer0).toEqual(expectedState);
  });

  it("should move parts with snap - 3", () => {

    const snapPositions = [0.5];
    const snapDist = 0.2;

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.MOVE_PARTS,
      payload: {
        partIds: ["part-1"],
        incr: -0.4,
        snapPositions,
        snapDist,
      }
    });

    const expectedState = cloneDeep(partState2);
    const expPart1 = expectedState.byPartId[part1.partId];
    expPart1.actOffset = expPart1.offset - 0.4;
    expPart1.offset = snapPositions[0]; //snap

    expect(reducer0).toEqual(expectedState);
  });

  it("should not move parts left to 0", () => {

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.MOVE_PARTS,
      payload: {
        partIds: ["part-1"],
        incr: -0.5,
      }
    });

    const expectedState = cloneDeep(partState2);
    expectedState.byPartId[part1.partId].offset -= 0.5;
    expectedState.byPartId[part1.partId].actOffset =
      expectedState.byPartId[part1.partId].offset;

    expect(reducer0).toEqual(expectedState);
  });

  it("should move parts to a position close to 0", () => {

    const snapPositions = [0.1];
    const snapDist = 0.2;

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.MOVE_PARTS,
      payload: {
        partIds: ["part-1"],
        incr: -0.9,
        snapPositions,
        snapDist,
      }
    });

    const expectedState = cloneDeep(partState2);
    const expPart1 = expectedState.byPartId[part1.partId];
    expPart1.actOffset = 0;
    expPart1.offset = 1 - 0.9; //snap
    expPart1.actOffset = expPart1.offset;

    expect(reducer0).toEqual(expectedState);
  });

  it("should resize the left boundary of a part", () => {

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.RESIZE_PART,
      payload: {
        partId: "part-1",
        bound: "left",
        incr: 0.5,
        snapDist: 0.2,
        minDuration: 0.1
      }
    });

    const expectedState = cloneDeep(partState2);
    expectedState.byPartId[part1.partId].offset += 0.5;
    expectedState.byPartId[part1.partId].duration -= 0.5;
    expectedState.byPartId[part1.partId].actOffset =
      expectedState.byPartId[part1.partId].offset;
    expectedState.byPartId[part1.partId].actRightBound = null;

    expect(reducer0).toEqual(expectedState);
  });

  it("should not resize the left boundary more than right bound", () => {

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.RESIZE_PART,
      payload: {
        partId: "part-1",
        bound: "left",
        incr: 1.5,
        snapDist: 0.2,
        minDuration: 0.1
      }
    });

    const expectedState = cloneDeep(partState2);
    const expPart1 = expectedState.byPartId[part1.partId];
    expPart1.duration = 2 - 1.9; // calc because of rounding error
    expPart1.offset = 1.9;
    expPart1.actOffset = 1.9;
    expPart1.actRightBound = null;

    expect(reducer0).toEqual(expectedState);
  });

  it("should not resize the left boundary lower than 0", () => {

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.RESIZE_PART,
      payload: {
        partId: "part-1",
        bound: "left",
        incr: -1.5,
        snapDist: 0.2,
        minDuration: 0.1
      }
    });

    const expectedState = cloneDeep(partState2);
    const expPart1 = expectedState.byPartId[part1.partId];
    expPart1.offset = 0;
    expPart1.actOffset = expPart1.offset;
    expPart1.duration = 2.0;
    expPart1.actRightBound = null;

    expect(reducer0).toEqual(expectedState);
  });


  it("should resize the right boundary of a part", () => {

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.RESIZE_PART,
      payload: {
        partId: "part-1",
        bound: "right",
        incr: 0.5,
        snapDist: 0.2,
        minDuration: 0.1
      }
    });

    const expectedState = cloneDeep(partState2);
    expectedState.byPartId[part1.partId].duration += 0.5;
    expectedState.byPartId[part1.partId].actOffset = null;
    expectedState.byPartId[part1.partId].actRightBound =
      expectedState.byPartId[part1.partId].offset + expectedState.byPartId[part1.partId].duration;

    expect(reducer0).toEqual(expectedState);
  });

  it("should not resize the right boundary to the left of the left bound", () => {

    const reducer0 = reducer(reducer(partState2, {}), {
      type: types.RESIZE_PART,
      payload: {
        partId: "part-1",
        bound: "right",
        incr: -1.5,
        snapDist: 0.2,
        minDuration: 0.1
      }
    });

    const expectedState = cloneDeep(partState2);
    expectedState.byPartId[part1.partId].actOffset = null;
    expectedState.byPartId[part1.partId].duration = 2 - 1.9; // calc because of round error
    expectedState.byPartId[part1.partId].actRightBound = expectedState.byPartId[part1.partId].offset + expectedState.byPartId[part1.partId].duration;

    expect(reducer0).toEqual(expectedState);
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

describe("helper functions", () => {

  it("find closest value", () => {
    const a = [5, 6, 7, 8, 9];
    expect(closestSnapDiff(6.8, a)).toEqual({
      idx: 2,
      diff: 7 - 6.8,
    });
    const b = [3.75, 5.2];
    expect(closestSnapDiff(1.75, b)).toEqual({
      idx: 0,
      diff: 3.75 - 1.75,
    });
  });

  it("find closest value with empty array", () => {
    const a = [];
    expect(closestSnapDiff(6.8, a)).toEqual({
      idx: null,
      diff: null
    });
  });
});