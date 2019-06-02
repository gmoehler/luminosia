# Luminosia Studio

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


Current Component Structure is:

```
App
  HeaderContainer
    Header

  ChannelGroupContainer
    time2pixels
      TimeScale
    ChannelGroup
      withEventHandler
        withPlay
          time2pixels
            Channel
      withEventHandler
        withPlay
          time2pixels
            ImageChannel

  ImageListContainer
    ImageList

  ChannelSelectorContainer
    ChannelSelector

```
