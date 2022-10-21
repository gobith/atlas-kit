import type { Session } from '../domain/session';

import { Province } from '../domain/domain';

export const createProvince = (point: { x: number; y: number }, session: Session) : Province => {

    return new Province()
};
