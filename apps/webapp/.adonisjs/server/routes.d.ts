import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'api.proxies.index': { paramsTuple?: []; params?: {} }
    'api.proxies.pick': { paramsTuple?: []; params?: {} }
    'api.proxies.test': { paramsTuple: [ParamValue]; params: {'configName': ParamValue} }
    'configs.store': { paramsTuple?: []; params?: {} }
    'configs.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'proxies.all.start': { paramsTuple?: []; params?: {} }
    'proxies.all.stop': { paramsTuple?: []; params?: {} }
    'proxies.all.restart': { paramsTuple?: []; params?: {} }
    'proxies.all.test': { paramsTuple?: []; params?: {} }
    'proxies.start': { paramsTuple: [ParamValue]; params: {'configId': ParamValue} }
    'proxies.stop': { paramsTuple: [ParamValue]; params: {'configId': ParamValue} }
    'proxies.test': { paramsTuple: [ParamValue]; params: {'configId': ParamValue} }
    'proxies.restart': { paramsTuple: [ParamValue]; params: {'configId': ParamValue} }
    'login': { paramsTuple?: []; params?: {} }
    'login.store': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'proxy.initializing': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'api.proxies.index': { paramsTuple?: []; params?: {} }
    'api.proxies.pick': { paramsTuple?: []; params?: {} }
    'api.proxies.test': { paramsTuple: [ParamValue]; params: {'configName': ParamValue} }
    'login': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'proxy.initializing': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'api.proxies.index': { paramsTuple?: []; params?: {} }
    'api.proxies.pick': { paramsTuple?: []; params?: {} }
    'api.proxies.test': { paramsTuple: [ParamValue]; params: {'configName': ParamValue} }
    'login': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'proxy.initializing': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'configs.store': { paramsTuple?: []; params?: {} }
    'proxies.all.start': { paramsTuple?: []; params?: {} }
    'proxies.all.stop': { paramsTuple?: []; params?: {} }
    'proxies.all.restart': { paramsTuple?: []; params?: {} }
    'proxies.all.test': { paramsTuple?: []; params?: {} }
    'proxies.start': { paramsTuple: [ParamValue]; params: {'configId': ParamValue} }
    'proxies.stop': { paramsTuple: [ParamValue]; params: {'configId': ParamValue} }
    'proxies.test': { paramsTuple: [ParamValue]; params: {'configId': ParamValue} }
    'proxies.restart': { paramsTuple: [ParamValue]; params: {'configId': ParamValue} }
    'login.store': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'configs.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}