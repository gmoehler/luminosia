import React from "react";
import { render } from "@testing-library/react";
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

    const {container} = render(
      <AnimationPane { ...props } />
    );

    expect(container).toMatchSnapshot();
  });

  test("Channel component", () => {

    const props = {
      channelId: imageChannel1.channelId,
      selection: {
        from: 0,
        to: 22
      }
    };

    const container = render(
      <Channel { ...props } />
    );

    expect(container).toMatchSnapshot();
  });


});