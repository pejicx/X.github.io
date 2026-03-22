import { guardianApi } from './guardian';
import { memoryApi } from './memory';
import { securityApi } from './security';
import { substrateApi } from './substrate';
import { neural } from './neural';
import { originApi } from './origin';
import { neurosymbolicApi } from './neurosymbolic';
import { workforceApi } from './workforce';
import { multidimensionalApi } from './multidimensional';
import { silentApi } from './silent';
import { xeaApi } from './xea';
import { agiApi } from './agi';
import { ganApi } from './gan';

export const api = {
  guardian: guardianApi,
  memory: memoryApi,
  security: securityApi,
  substrate: substrateApi,
  neural,
  origin: originApi,
  neurosymbolic: neurosymbolicApi,
  workforce: workforceApi,
  multidimensional: multidimensionalApi,
  silent: silentApi,
  xea: xeaApi,
  agi: agiApi,
  gan: ganApi
};
