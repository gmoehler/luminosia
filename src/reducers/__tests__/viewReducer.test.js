import reducer from "../viewReducer";
import { initialState } from "../viewReducer";
import * as types from "../../actions/types";

describe("view reducer", () => {
  it("should return the initial state", () =>
    expect(reducer(undefined, {})).toEqual(initialState));


  it("should set the load progress correctly", () => {
    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.INIT_LOAD_PROGRESS,
      payload: 50
    });

    expect(reducer0).toEqual({
      ...initialState,
      loadProgress: {
        base: 50,
        progress: 0,
      }
    });

    const reducer1 = reducer(reducer0, {
      type: types.SET_LOAD_PROGRESS,
      payload: 20
    });

    expect(reducer1).toEqual({
      ...initialState,
      loadProgress: {
        base: 50,
        progress: 20,
      }
    });
  });

  it("should increment the load progress correctly", () => {
    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.INIT_LOAD_PROGRESS,
      payload: 50
    });

    const reducer1 = reducer(reducer0, {
      type: types.SET_LOAD_PROGRESS,
      payload: 20
    });
    const reducer2 = reducer(reducer1, {
      type: types.INCR_LOAD_PROGRESS,
      payload: 20
    });


    expect(reducer2).toEqual({
      ...initialState,
      loadProgress: {
        base: 50,
        progress: 40,
      }
    });
  });

});