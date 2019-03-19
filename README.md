# react-waveform-playlist
A port of Waveform Playlist to React.

Current Component Structure is:

```
App
  HeaderContainer
    Header

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
