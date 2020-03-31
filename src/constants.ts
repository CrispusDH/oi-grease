import * as pkgConf from 'pkg-conf';

const { clickDelay: gClickDelay, typeDelay: gTypeDelay, timeout: gTimeout, pollTime: gPollTime } = pkgConf.sync('grease');
export const clickDelay = gClickDelay || 40;
export const typeDelay = gTypeDelay || 40;
export const timeout = gTimeout || 30 * 1000;
export const pollTime = gPollTime || 200;
