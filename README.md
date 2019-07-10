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
    
  AnimationPaneContainer
    withPlay
      AnimationPane
      

```

Todos:
- weaker marker colors
- Redux: Make parts a first level state
- snap to other objects
- generate multiple copies of a part
- group/ungroup of parts
- drag and dop images out of list
- markers in timeline

performance:
- evaluate playing
- optimize marker add

next gen:
- parameter input

---

lessons learned:
- generate ids in actions: can be returned, impure logic
- check conditions in actions (e.g. for adding)
    . reducers always work
    . compound actions know wether action was successful (?)