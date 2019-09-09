
export const markerPayload1 = {
  partId: "part-2",
  pos: 22.34,
  minPos: 20.0,
  type: "left",
  selected: true
};

export const markerPayload0 = {
  ...markerPayload1,
  markerId: "part-2--left",
};

export const markerState0 = {
  byMarkerId: {
    "part-2--left": markerPayload0,
  },
  allMarkerIds: ["part-2--left"],
};

export const fullMarkerState0 = {
  entities: {
    markers: markerState0
  }
};
