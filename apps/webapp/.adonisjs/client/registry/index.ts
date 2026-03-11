/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'api.proxies.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/proxies',
    tokens: [{"old":"/api/proxies","type":0,"val":"api","end":""},{"old":"/api/proxies","type":0,"val":"proxies","end":""}],
    types: placeholder as Registry['api.proxies.index']['types'],
  },
  'api.proxies.pick': {
    methods: ["GET","HEAD"],
    pattern: '/api/proxies/pick',
    tokens: [{"old":"/api/proxies/pick","type":0,"val":"api","end":""},{"old":"/api/proxies/pick","type":0,"val":"proxies","end":""},{"old":"/api/proxies/pick","type":0,"val":"pick","end":""}],
    types: placeholder as Registry['api.proxies.pick']['types'],
  },
  'api.proxies.test': {
    methods: ["GET","HEAD"],
    pattern: '/api/proxies/:configName/test',
    tokens: [{"old":"/api/proxies/:configName/test","type":0,"val":"api","end":""},{"old":"/api/proxies/:configName/test","type":0,"val":"proxies","end":""},{"old":"/api/proxies/:configName/test","type":1,"val":"configName","end":""},{"old":"/api/proxies/:configName/test","type":0,"val":"test","end":""}],
    types: placeholder as Registry['api.proxies.test']['types'],
  },
  'configs.create': {
    methods: ["POST"],
    pattern: '/configs',
    tokens: [{"old":"/configs","type":0,"val":"configs","end":""}],
    types: placeholder as Registry['configs.create']['types'],
  },
  'configs.delete': {
    methods: ["DELETE"],
    pattern: '/configs/:configId',
    tokens: [{"old":"/configs/:configId","type":0,"val":"configs","end":""},{"old":"/configs/:configId","type":1,"val":"configId","end":""}],
    types: placeholder as Registry['configs.delete']['types'],
  },
  'proxies.all.start': {
    methods: ["POST"],
    pattern: '/proxies/all/start',
    tokens: [{"old":"/proxies/all/start","type":0,"val":"proxies","end":""},{"old":"/proxies/all/start","type":0,"val":"all","end":""},{"old":"/proxies/all/start","type":0,"val":"start","end":""}],
    types: placeholder as Registry['proxies.all.start']['types'],
  },
  'proxies.all.stop': {
    methods: ["POST"],
    pattern: '/proxies/all/stop',
    tokens: [{"old":"/proxies/all/stop","type":0,"val":"proxies","end":""},{"old":"/proxies/all/stop","type":0,"val":"all","end":""},{"old":"/proxies/all/stop","type":0,"val":"stop","end":""}],
    types: placeholder as Registry['proxies.all.stop']['types'],
  },
  'proxies.all.restart': {
    methods: ["POST"],
    pattern: '/proxies/all/restart',
    tokens: [{"old":"/proxies/all/restart","type":0,"val":"proxies","end":""},{"old":"/proxies/all/restart","type":0,"val":"all","end":""},{"old":"/proxies/all/restart","type":0,"val":"restart","end":""}],
    types: placeholder as Registry['proxies.all.restart']['types'],
  },
  'proxies.all.test': {
    methods: ["POST"],
    pattern: '/proxies/all/test',
    tokens: [{"old":"/proxies/all/test","type":0,"val":"proxies","end":""},{"old":"/proxies/all/test","type":0,"val":"all","end":""},{"old":"/proxies/all/test","type":0,"val":"test","end":""}],
    types: placeholder as Registry['proxies.all.test']['types'],
  },
  'proxies.start': {
    methods: ["POST"],
    pattern: '/proxies/:configId/start',
    tokens: [{"old":"/proxies/:configId/start","type":0,"val":"proxies","end":""},{"old":"/proxies/:configId/start","type":1,"val":"configId","end":""},{"old":"/proxies/:configId/start","type":0,"val":"start","end":""}],
    types: placeholder as Registry['proxies.start']['types'],
  },
  'proxies.stop': {
    methods: ["POST"],
    pattern: '/proxies/:configId/stop',
    tokens: [{"old":"/proxies/:configId/stop","type":0,"val":"proxies","end":""},{"old":"/proxies/:configId/stop","type":1,"val":"configId","end":""},{"old":"/proxies/:configId/stop","type":0,"val":"stop","end":""}],
    types: placeholder as Registry['proxies.stop']['types'],
  },
  'proxies.test': {
    methods: ["POST"],
    pattern: '/proxies/:configId/test',
    tokens: [{"old":"/proxies/:configId/test","type":0,"val":"proxies","end":""},{"old":"/proxies/:configId/test","type":1,"val":"configId","end":""},{"old":"/proxies/:configId/test","type":0,"val":"test","end":""}],
    types: placeholder as Registry['proxies.test']['types'],
  },
  'proxies.restart': {
    methods: ["POST"],
    pattern: '/proxies/:configId/restart',
    tokens: [{"old":"/proxies/:configId/restart","type":0,"val":"proxies","end":""},{"old":"/proxies/:configId/restart","type":1,"val":"configId","end":""},{"old":"/proxies/:configId/restart","type":0,"val":"restart","end":""}],
    types: placeholder as Registry['proxies.restart']['types'],
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
