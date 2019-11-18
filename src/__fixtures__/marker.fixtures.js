
export const markerPayload0 = {
  markerId: "part-2--left",
  partId: "part-2",
  pos: 22.34,
  type: "selected",
};

export const markerPayload1 = {
  markerId: "part-3--left",
  partId: "part-2",
  pos: 20.34,
  type: "selected",
};

export const markerState0 = {
  byMarkerId: {
    [markerPayload0.markerId]: markerPayload0,
  },
  allMarkerIds: [markerPayload0.markerId],
};

export const markerState1 = {
  byMarkerId: {
    [markerPayload0.markerId]: markerPayload0,
    [markerPayload1.markerId]: markerPayload1,
  },
  allMarkerIds: [markerPayload0.markerId, markerPayload1.markerId],
};


export const fullMarkerState0 = {
  entities: {
    markers: markerState0
  }
};

export const fullMarkerState1 = {
  entities: {
    markers: markerState1
  }
};
