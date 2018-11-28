import { SELECT, SET_ZOOM, ZOOM_IN } from './types';

// load audio async action


export const select = (selectInfo) => ({
  type: SELECT,
  payload: selectInfo
});
