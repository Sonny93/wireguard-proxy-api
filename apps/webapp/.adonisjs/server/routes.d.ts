import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'configs.store': { paramsTuple?: []; params?: {} }
    'login': { paramsTuple?: []; params?: {} }
    'login.store': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'login': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'login': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'configs.store': { paramsTuple?: []; params?: {} }
    'login.store': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}