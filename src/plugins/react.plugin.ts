import { Plugin } from './registry';

export const reactPlugin: Plugin = {
  name: 'ReactPlugin',
  init: async () => {
    console.log('[REACT_PLUGIN] Initializing React substrate...');
  },
  start: async () => {
    console.log('[REACT_PLUGIN] React substrate active.');
  }
};
