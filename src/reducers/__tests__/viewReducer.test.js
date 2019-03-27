import reducer from "../viewReducer";
import { initialState } from "../viewReducer";
import * as types from "../../actions/types";
import { part, part2 } from "../../__fixtures__/channel.fixtures";
import { marker1 } from "../../__fixtures__/view.fixtures";

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
      byMarkerId: {
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

    const reducer3 = reducer(reducer1,  {
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

    const reducer1 = reducer(reducer(undefined, {}), {
      type: types.SET_MARKER,
      payload: marker1
    });

    expect(reducer1).toEqual(expectedState1);
  });

});