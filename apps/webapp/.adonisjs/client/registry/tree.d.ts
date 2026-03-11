/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  api: {
    proxies: {
      index: typeof routes['api.proxies.index']
      pick: typeof routes['api.proxies.pick']
      test: typeof routes['api.proxies.test']
    }
  }
  configs: {
    store: typeof routes['configs.store']
    destroy: typeof routes['configs.destroy']
  }
  proxies: {
    all: {
      start: typeof routes['proxies.all.start']
      stop: typeof routes['proxies.all.stop']
      restart: typeof routes['proxies.all.restart']
      test: typeof routes['proxies.all.test']
    }
    start: typeof routes['proxies.start']
    stop: typeof routes['proxies.stop']
    test: typeof routes['proxies.test']
    restart: typeof routes['proxies.restart']
  }
  login: typeof routes['login'] & {
    store: typeof routes['login.store']
  }
  logout: typeof routes['logout']
  home: typeof routes['home']
  proxy: {
    initializing: typeof routes['proxy.initializing']
  }
}
