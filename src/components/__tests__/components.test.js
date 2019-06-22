import React from "react";
import renderer from "react-test-renderer";
import AnimationPane from "../AnimationPane.js";
import Channel from "../Channel";

describe("simple component tests", () => {
  test("AnimationPane component", () => {

    const props = {
      sampleRate: 1000,
      resolution: 100,
      activeChannels: [1, 2],
    };

    const component = renderer.create(
      <AnimationPane { ...props } />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("Channel component", () => {

    const props = {
      channelId: 1,
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