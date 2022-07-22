import * as pkgConf from 'pkg-conf';

const {
  clickDelay: gClickDelay,
  typeDelay: gTypeDelay,
  timeout: gTimeout,
  pollTime: gPollTime
} = pkgConf.sync('grease');
export const clickDelay: number = gClickDelay as number || 40;
export const typeDelay: number = gTypeDelay as number || 40;
export const timeout: number = gTimeout as number || 30 * 1000;
export const pollTime: number = gPollTime as number || 200;
