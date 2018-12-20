# react-waveform-playlist
A port of Waveform Playlist to React.

Current Component Structure is:

```
App
  ChannelControlContainer
    ChannelControl

  ChannelGroupContainer
    ChannelGroup
     withPlay
      Channel
     withPlay
      ImageChannel
```

Todos:
- only load img once initially
- HOC for time to px conversion
