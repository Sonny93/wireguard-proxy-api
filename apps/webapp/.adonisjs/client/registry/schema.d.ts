/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'api.proxies.index': {
    methods: ["GET","HEAD"]
    pattern: '/proxies'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/api/proxy/get_proxies_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/api/proxy/get_proxies_controller').default['render']>>>
    }
  }
  'api.proxies.pick': {
    methods: ["GET","HEAD"]
    pattern: '/proxies/pick'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/api/proxy/pick_proxy_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/api/proxy/pick_proxy_controller').default['handle']>>>
    }
  }
  'api.proxies.test': {
    methods: ["GET","HEAD"]
    pattern: '/proxies/:configName/test'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { configName: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/api/proxy/test_proxy_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/api/proxy/test_proxy_controller').default['handle']>>>
    }
  }
  'configs.store': {
    methods: ["POST"]
    pattern: '/configs'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/config').uploadConfigValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/config').uploadConfigValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/config/upload_config_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/config/upload_config_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'configs.destroy': {
    methods: ["DELETE"]
    pattern: '/configs/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/config').deleteConfigValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/config').deleteConfigValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/config/delete_config_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/config/delete_config_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'proxies.all.start': {
    methods: ["POST"]
    pattern: '/proxies/all/start'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/proxy/all/start_all_proxies_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/proxy/all/start_all_proxies_controller').default['execute']>>>
    }
  }
  'proxies.all.stop': {
    methods: ["POST"]
    pattern: '/proxies/all/stop'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/proxy/all/stop_all_proxies_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/proxy/all/stop_all_proxies_controller').default['execute']>>>
    }
  }
  'proxies.all.restart': {
    methods: ["POST"]
    pattern: '/proxies/all/restart'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/proxy/all/restart_all_proxies_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/proxy/all/restart_all_proxies_controller').default['execute']>>>
    }
  }
  'proxies.all.test': {
    methods: ["POST"]
    pattern: '/proxies/all/test'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/proxy/all/test_all_proxies_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/proxy/all/test_all_proxies_controller').default['execute']>>>
    }
  }
  'proxies.start': {
    methods: ["POST"]
    pattern: '/proxies/:configId/start'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/proxy').actionProxyValidator)>>
      paramsTuple: [ParamValue]
      params: { configId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/proxy').actionProxyValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/proxy/start_proxy_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/proxy/start_proxy_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'proxies.stop': {
    methods: ["POST"]
    pattern: '/proxies/:configId/stop'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/proxy').actionProxyValidator)>>
      paramsTuple: [ParamValue]
      params: { configId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/proxy').actionProxyValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/proxy/stop_proxy_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/proxy/stop_proxy_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'proxies.test': {
    methods: ["POST"]
    pattern: '/proxies/:configId/test'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/proxy').actionProxyValidator)>>
      paramsTuple: [ParamValue]
      params: { configId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/proxy').actionProxyValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/proxy/test_proxy_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/proxy/test_proxy_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'proxies.restart': {
    methods: ["POST"]
    pattern: '/proxies/:configId/restart'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/proxy').actionProxyValidator)>>
      paramsTuple: [ParamValue]
      params: { configId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/proxy').actionProxyValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/proxy/restart_proxy_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/proxy/restart_proxy_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'login': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sessions_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sessions_controller').default['create']>>>
    }
  }
  'login.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/login').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/login').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sessions_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sessions_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'logout': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sessions_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sessions_controller').default['destroy']>>>
    }
  }
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/config/show_configs_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/config/show_configs_controller').default['render']>>>
    }
  }
  'proxy.initializing': {
    methods: ["GET","HEAD"]
    pattern: '/proxy/initializing'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/proxy/initializing_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/proxy/initializing_controller').default['render']>>>
    }
  }
}
