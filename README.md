# Luminosia Studio

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


Current Component Structure is:

```
App
  HeaderContainer
    Header

 *ChannelGroupContainer
    time2pixels
      TimeScale
    ChannelGroup
      withEventHandler
        withPlay
          time2pixels
           *ChannelContainer
            Channel
              ImageChannel
              AudioChannel
             *ChannelMarkersContainer
                ChannelMarkers

  ImageListContainer
    ImageList

  ChannelSelectorGroupContainer
    ChannelSelectorGroup
      ChannelSelector
    
  AnimationPaneContainer
    withPlay
      AnimationPane
      

```

Issues:
- not possible to load same waveform twice
- selection stays when channel is deleted
- right marker is 2px too lefty

Usability:
- make zoom stay at position
- dont scroll for play when start is in view
- fix selection behaviour_
  . single click drag for selection
- weaker marker colors for small zoom level
- snap to other objects
- group/ungroup of parts
- drag and dop images out of list
- markers in timeline
- channel names
- show image names with tooltip

Tech depts:
- make ImageChannel pure component (parts) with Part component
  -> only read partIds in channel
- ChannelMarkersContainer required?

performance:
- evaluate playing
- optimize marker add

next gen:
- parameter input
- concept for gyro

---


lessons learned:
- generate ids in actions: can be returned, impure logic
- check conditions in actions (e.g. for adding)
    . reducers always work
    . compound actions know wether action was successful (?)