import React from "react";
import renderer from "react-test-renderer";
import AnimationPane from "../AnimationPane.js";
import Channel from "../AudioChannel";
import { imageChannel1, imageChannel2 } from "../../__fixtures__/entity.fixtures";

describe("simple component tests", () => {
  test("AnimationPane component", () => {

    const props = {
      sampleRate: 1000,
      resolution: 100,
      activeChannels: [
        imageChannel1.channelId, imageChannel2.channelId],
    };

    const component = renderer.create(
      <AnimationPane { ...props } />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("Channel component", () => {

    const props = {
      channelId: imageChannel1.channelId,
      selection: {
        from: 0,
        to: 22
      }
    };

    const component = renderer.create(
      <Channel { ...props } />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });


});