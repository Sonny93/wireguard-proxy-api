/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'api.proxies.index': {
    methods: ["GET","HEAD"],
    pattern: '/proxies',
    tokens: [{"old":"/proxies","type":0,"val":"proxies","end":""}],
    types: placeholder as Registry['api.proxies.index']['types'],
  },
  'api.proxies.pick': {
    methods: ["GET","HEAD"],
    pattern: '/proxies/pick',
    tokens: [{"old":"/proxies/pick","type":0,"val":"proxies","end":""},{"old":"/proxies/pick","type":0,"val":"pick","end":""}],
    types: placeholder as Registry['api.proxies.pick']['types'],
  },
  'api.proxies.test': {
    methods: ["GET","HEAD"],
    pattern: '/proxies/:configName/test',
    tokens: [{"old":"/proxies/:configName/test","type":0,"val":"proxies","end":""},{"old":"/proxies/:configName/test","type":1,"val":"configName","end":""},{"old":"/proxies/:configName/test","type":0,"val":"test","end":""}],
    types: placeholder as Registry['api.proxies.test']['types'],
  },
  'configs.store': {
    methods: ["POST"],
    pattern: '/configs',
    tokens: [{"old":"/configs","type":0,"val":"configs","end":""}],
    types: placeholder as Registry['configs.store']['types'],
  },
  'configs.destroy': {
    methods: ["DELETE"],
    pattern: '/configs/:id',
    tokens: [{"old":"/configs/:id","type":0,"val":"configs","end":""},{"old":"/configs/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['configs.destroy']['types'],
  },
  'proxies.start': {
    methods: ["POST"],
    pattern: '/proxies/start',
    tokens: [{"old":"/proxies/start","type":0,"val":"proxies","end":""},{"old":"/proxies/start","type":0,"val":"start","end":""}],
    types: placeholder as Registry['proxies.start']['types'],
  },
  'proxies.stop': {
    methods: ["POST"],
    pattern: '/proxies/stop',
    tokens: [{"old":"/proxies/stop","type":0,"val":"proxies","end":""},{"old":"/proxies/stop","type":0,"val":"stop","end":""}],
    types: placeholder as Registry['proxies.stop']['types'],
  },
  'proxies.test': {
    methods: ["POST"],
    pattern: '/proxies/test',
    tokens: [{"old":"/proxies/test","type":0,"val":"proxies","end":""},{"old":"/proxies/test","type":0,"val":"test","end":""}],
    types: placeholder as Registry['proxies.test']['types'],
  },
  'proxies.restart': {
    methods: ["POST"],
    pattern: '/proxies/restart',
    tokens: [{"old":"/proxies/restart","type":0,"val":"proxies","end":""},{"old":"/proxies/restart","type":0,"val":"restart","end":""}],
    types: placeholder as Registry['proxies.restart']['types'],
  },
  'proxies.startAll': {
    methods: ["POST"],
    pattern: '/proxies/start-all',
    tokens: [{"old":"/proxies/start-all","type":0,"val":"proxies","end":""},{"old":"/proxies/start-all","type":0,"val":"start-all","end":""}],
    types: placeholder as Registry['proxies.startAll']['types'],
  },
  'proxies.stopAll': {
    methods: ["POST"],
    pattern: '/proxies/stop-all',
    tokens: [{"old":"/proxies/stop-all","type":0,"val":"proxies","end":""},{"old":"/proxies/stop-all","type":0,"val":"stop-all","end":""}],
    types: placeholder as Registry['proxies.stopAll']['types'],
  },
  'proxies.restartAll': {
    methods: ["POST"],
    pattern: '/proxies/restart-all',
    tokens: [{"old":"/proxies/restart-all","type":0,"val":"proxies","end":""},{"old":"/proxies/restart-all","type":0,"val":"restart-all","end":""}],
    types: placeholder as Registry['proxies.restartAll']['types'],
  },
  'login': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['login']['types'],
  },
  'login.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['login.store']['types'],
  },
  'logout': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['logout']['types'],
  },
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'proxy.initializing': {
    methods: ["GET","HEAD"],
    pattern: '/proxy/initializing',
    tokens: [{"old":"/proxy/initializing","type":0,"val":"proxy","end":""},{"old":"/proxy/initializing","type":0,"val":"initializing","end":""}],
    types: placeholder as Registry['proxy.initializing']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
