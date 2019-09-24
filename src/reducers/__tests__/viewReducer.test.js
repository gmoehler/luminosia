import reducer from "../viewReducer";
import { initialState } from "../viewReducer";

describe("view reducer", () => {
  it("should return the initial state", () =>
    expect(reducer(undefined, {})).toEqual(initialState));

});