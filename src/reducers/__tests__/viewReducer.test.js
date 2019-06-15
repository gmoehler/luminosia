import reducer from "../viewReducer";
import { initialState } from "../viewReducer";
import * as types from "../../actions/types";
import { part, part2 } from "../../__fixtures__/channel.fixtures";
import { marker1, marker2 } from "../../__fixtures__/view.fixtures";

describe("view reducer", () => {
  it("should return the initial state", () => 
    expect(reducer(undefined, {})).toEqual(initialState));

    
  it("should handle ADD_ELEMENT_TO_SEL for parts", () => {


    const expectedState1 = {
      ...initialState,
      selectedElementsById: {
        [part.partId]: part
      }
    };

    const expectedState2 = {
      ...initialState,
      selectedElementsById: {
        [part.partId]: part,
        [part2.partId]: part2
      }
    };

    const reducer1 = reducer(reducer(undefined, {}), {
      type: types.ADD_ELEMENT_TO_SEL,
      payload: part
    });

    const reducer2 = reducer(reducer1,  {
      type: types.ADD_ELEMENT_TO_SEL,
      payload: part2
    });

    expect(reducer1).toEqual(expectedState1);
    expect(reducer2).toEqual(expectedState2);
  });

  it("should handle REMOVE_ELEMENT_FROM_SEL for parts", () => {

    const expectedState2 = {
      ...initialState,
      selectedElementsById: {
        [part.partId]: part,
        [part2.partId]: part2
      }
    };

    const expectedState3 = {
      ...initialState,
      selectedElementsById: {
        [part.partId]: part
      }
    };

    const reducer1 = reducer(reducer(undefined, {}), {
      type: types.ADD_ELEMENT_TO_SEL,
      payload: part
    });

    const reducer2 = reducer(reducer1,  {
      type: types.ADD_ELEMENT_TO_SEL,
      payload: part2
    });

    const reducer3 = reducer(reducer1,  {
      type: types.REMOVE_ELEMENT_FROM_SEL,
      payload: part2
    });

    expect(reducer2).toEqual(expectedState2);
    expect(reducer3).toEqual(expectedState3);
  });

it("should handle CLEAR_SEL for parts", () => {

    const expectedState2 = {
      ...initialState,
      selectedElementsById: {
        [part.partId]: part,
        [part2.partId]: part2
      }
    };

    const expectedState3 = {
      ...initialState,
      selectedElementsById: { }
    };

    const reducer1 = reducer(reducer(undefined, {}), {
      type: types.ADD_ELEMENT_TO_SEL,
      payload: part
    });

    const reducer2 = reducer(reducer1,  {
      type: types.ADD_ELEMENT_TO_SEL,
      payload: part2
    });

    const reducer3 = reducer(reducer2,  {
      type: types.CLEAR_SEL
    });

    expect(reducer2).toEqual(expectedState2);
    expect(reducer3).toEqual(expectedState3);
  });
  
  it("should handle SET_MARKER", () => {

    const expectedState1 = {
      ...initialState,
      byMarkerId: {
        [marker1.markerId]: marker1,
      }
    };
    const expectedState2 = {
      ...initialState,
      byMarkerId: {
        [marker1.markerId]: marker1,
        [marker2.markerId]: marker2,
      }
    };


    const reducer1 = reducer(reducer(undefined, {}), {
      type: types.SET_MARKER,
      payload: marker1
    });
    const reducer2 = reducer(reducer1, {
      type: types.SET_MARKER,
      payload: marker2
    });


    expect(reducer1).toEqual(expectedState1);
    expect(reducer2).toEqual(expectedState2);
  });

  it("should handle SET_MARKER with undefined minPos", () => {

    const marker1b = {
      ...marker1,
      minPos: null,
    };

    const expectedState1 = {
      ...initialState,
      byMarkerId: {
        [marker1.markerId]: {
          ...marker1,
          minPos: 0
        }
      }
    };

    const reducer1 = reducer(reducer(undefined, {}), {
      type: types.SET_MARKER,
      payload: marker1b
    });

    expect(reducer1).toEqual(expectedState1);
  });

  it("should handle DELETE_MARKER", () => {

    const expectedState2 = {
      ...initialState,
      byMarkerId: {
        [marker1.markerId]: marker1,
        [marker2.markerId]: marker2,
      }
    };

    const expectedState3 = {
      ...initialState,
      byMarkerId: {
        [marker1.markerId]: marker1,
      }
    };


    const reducer1 = reducer(reducer(undefined, {}), {
      type: types.SET_MARKER,
      payload: marker1
    });
    const reducer2 = reducer(reducer1, {
      type: types.SET_MARKER,
      payload: marker2
    });
    const reducer3 = reducer(reducer2, {
      type: types.DELETE_MARKER,
      payload: marker2
    });

    expect(reducer2).toEqual(expectedState2);
    expect(reducer3).toEqual(expectedState3);
  });

  it("should handle UPDATE_MARKER", () => {

    const expectedState2 = {
      ...initialState,
      byMarkerId: {
        [marker1.markerId]: marker1,
        [marker2.markerId]: marker2,
      }
    };

    const expectedState3 = {
      ...initialState,
      byMarkerId: {
        [marker1.markerId]: {
          ...marker1,
          pos: 31.5,
          type: "newType"
        },
        [marker2.markerId]: marker2,
      }
    };

    const reducer1 = reducer(reducer(undefined, {}), {
      type: types.SET_MARKER,
      payload: marker1
    });
    const reducer2 = reducer(reducer1, {
      type: types.SET_MARKER,
      payload: marker2
    });
    const reducer3 = reducer(reducer2, {
      type: types.UPDATE_MARKER,
      payload: {
        markerId: marker1.markerId,
        incr: 10,
        type: "newType"
      }
    });

    const expectedState4 = {
      ...initialState,
      byMarkerId: {
        [marker1.markerId]: {
          ...marker1,
          pos: 40,
          type: "newType"
        },
        [marker2.markerId]: marker2,
      }
    };

    const reducer4 = reducer(reducer3, {
      type: types.UPDATE_MARKER,
      payload: {
        markerId: marker1.markerId,
        pos: 40,
        type: "newType"
      }
    });


    expect(reducer2).toEqual(expectedState2);
    expect(reducer3).toEqual(expectedState3);
    expect(reducer4).toEqual(expectedState4);
  });

  it("should handle UPDATE_MARKER with no prev marker", () => {

    const marker3 = {
      ...marker1,
    };

    delete marker3.pos;
    delete marker3.minPos;
    delete marker3.type;

    const expectedState1 = {
      ...initialState,
      byMarkerId: {
        [marker2.markerId]: marker2,
      }
    };

    const reducer1 = reducer(reducer(undefined, {}), {
      type: types.SET_MARKER,
      payload: marker2
    });
    const reducer3 = reducer(reducer1, {
      type: types.UPDATE_MARKER,
      payload: {
        ...marker3,
        incr: 10,
      }
    });

    expect(reducer1).toEqual(expectedState1);
    // no changes
    expect(reducer3).toEqual(expectedState1);
  });



});