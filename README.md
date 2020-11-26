# Luminosia Studio

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# Current Component Structure

```
App
  HeaderContainer
    Header

 *ChannelGroupContainer
    time2pixels
      TimeScale
    ChannelGroup
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

# Todos

## Issues:


## Usability improvements:
- make zoom stay at position
- dont scroll for play when start is in view
- weaker marker colors for small zoom level
- group/ungroup of parts
- drag and dop images out of list
- channel names
- show image names with tooltip
- snap to other parts

## Tech depts:
- make ImageChannel pure component (parts) with Part component
  -> only read partIds in channel
- ChannelMarkersContainer required?

## Performance:


## Next gen:
- parameter input
- concept for gyro

# Lessons learned
- generate ids in actions: can be returned, no impure logic
- check conditions in actions (e.g. for adding)
    . reducers always work
    . compound actions know wether action was successful (?)