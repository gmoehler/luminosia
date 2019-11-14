import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "../entityActions";
import * as types from "../types";
import {
  part1, part2, entityState1, imageChannel1, normalizedPart2, normalizedPart1,
} from "../../__fixtures__/entity.fixtures";


export const mockStore = configureMockStore([thunk]);

describe("part actions", () => {

  it("should add parts to the copy clipboard", () => {
    const partlIds = [part1.partId, part2.partId];

    const expectedActions = [{
      type: types.COPY_ENTITIES,
      payload: partlIds,
    }];

    const stateWithSelection = {
      ...entityState1,
    };
    stateWithSelection.entities.selectedEntityIds = partlIds;

    const store = mockStore(stateWithSelection);

    store.dispatch(actions.copyParts(partlIds));
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should paste parts to a channel", () => {
    const partlIds = [part1.partId, part2.partId];

    const expectedActions = [{
      type: types.ADD_PART,
      payload: normalizedPart1,
    }, {
      type: "CLEAR_ENTITY_SELECTION",
    }, {
      type: types.ADD_PART,
      payload: normalizedPart2,
    }, {
      type: "CLEAR_ENTITY_SELECTION",
    }];

    const stateWithPartsToCopy = {
      ...entityState1,
      view: {
        resolution: 80,
        selectedImageChannelId: imageChannel1.channelId,
        partsToCopy: null,
        uploadLog: null,
        loadShowStatus: null,
        message: null,
      }
    };
    stateWithPartsToCopy.entities.entityIdsToCopy = partlIds;

    const store = mockStore(stateWithPartsToCopy);

    store.dispatch(actions.pasteParts(partlIds));
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

});