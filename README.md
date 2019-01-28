# react-waveform-playlist
A port of Waveform Playlist to React.

Current Component Structure is:

```
App
  ChannelControlContainer
    ChannelControl

  ChannelGroupContainer
    ChannelGroup
      withEventHandler
        withPlay
          time2pixels
            Channel
      withEventHandler
        withPlay
          time2pixels
            ImageChannel
```

Todos:
- only load img once initially
- HOC for time to px conversion
