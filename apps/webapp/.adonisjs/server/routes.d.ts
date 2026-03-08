import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'api.proxies.index': { paramsTuple?: []; params?: {} }
    'proxy.initializing': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'configs.store': { paramsTuple?: []; params?: {} }
    'proxies.start': { paramsTuple?: []; params?: {} }
    'proxies.stop': { paramsTuple?: []; params?: {} }
    'proxies.test': { paramsTuple?: []; params?: {} }
    'proxies.restart': { paramsTuple?: []; params?: {} }
    'proxies.startAll': { paramsTuple?: []; params?: {} }
    'proxies.stopAll': { paramsTuple?: []; params?: {} }
    'proxies.restartAll': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
    'login': { paramsTuple?: []; params?: {} }
    'login.store': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'api.proxies.index': { paramsTuple?: []; params?: {} }
    'proxy.initializing': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'login': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'api.proxies.index': { paramsTuple?: []; params?: {} }
    'proxy.initializing': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'login': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'configs.store': { paramsTuple?: []; params?: {} }
    'proxies.start': { paramsTuple?: []; params?: {} }
    'proxies.stop': { paramsTuple?: []; params?: {} }
    'proxies.test': { paramsTuple?: []; params?: {} }
    'proxies.restart': { paramsTuple?: []; params?: {} }
    'proxies.startAll': { paramsTuple?: []; params?: {} }
    'proxies.stopAll': { paramsTuple?: []; params?: {} }
    'proxies.restartAll': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
    'login.store': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}