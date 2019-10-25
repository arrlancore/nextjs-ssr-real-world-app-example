import { useState, useEffect, useReducer } from 'react'
import axios from 'axios'
import Router from 'next/router'
import config from '../config'
import { toast } from 'react-toastify'
import { getToken, handleLogout } from './userAuth'
import { useAuth } from './context'

const dataFetchReducer = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      }
    case 'FETCH_SUCCESS':
      const pages = reset => { // eslint-disable-line
        const startPage = { [action.pageNumber]: action.payload }
        if (!action.pageNumber) return {}
        if (reset) return startPage
        return state.pages ? { ...state.pages, [action.pageNumber]: action.payload } : startPage
      }
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
        requestConfig: action.configs,
        pages: pages(action.reset)
      }
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: action.error
      }
    default:
      throw new Error()
  }
}

/**
 * react hook that handle api request to the backend service and return response as state
 * @param {object} initialRequestConfig
 * @param {object} initialData
 */
export const useApi = (initialRequestConfig, initialData = {}) => {
  const initialRequest = initialRequestConfig || {}
  const [{ method, path, pathOption, params, data, secure }, setRequest] = useState(initialRequest)
  const isValid = path
  const url = `${config.mainApiEndpoint}${path}`
  const [, setAuth] = useAuth()
  let headers = {}
  if (secure === true) {
    const token = getToken()
    headers = {
      Authorization: `Token ${token}`
    }
  }
  if (secure === 'optional') {
    const token = getToken()
    if (token) {
      headers = {
        Authorization: `Token ${token}`
      }
    }
  }
  const requestConfig = {
    method: method || 'get',
    url,
    headers,
    params,
    data
  }
  const configs = { params, method, path, pathOption, secure }
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: null,
    requestConfig: configs,
    ...initialData
  })
  useEffect(() => {
    let didCancel = false
    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' })
      try {
        const result = await axios.request(requestConfig)
        console.log('Response from useApi')

        if (!didCancel) {
          const pageNumber = params ? params.pageNumber : null
          dispatch({
            type: 'FETCH_SUCCESS',
            payload: result.data,
            pageNumber,
            configs,
            reset: params && params.reset
          })
        }
      } catch (error) {
        const message = errorHandler(error.response)
        if (error.response.status === 401) {
          setAuth({})
          handleLogout({})
        }
        error.response.status !== 422 && toast.error(message || error.message)
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE', error: message || error.message })
        }
      }
    }
    isValid && fetchData()
    return () => {
      didCancel = true
    }
  }, [path, method, params, data]) // eslint-disable-line
  return [state, setRequest]
}
/**
 * a handler for request data to backend service on server side rendering
 * @param {object} requestConfigInit
 */
export const serverApiRequest = async requestConfigInit => {
  const { method, path, pathOption, params, data, secure } = requestConfigInit
  let headers = {}
  if (secure && secure !== 'optional') {
    headers = {
      Authorization: `Token ${secure}`
    }
  }
  let result = []
  if (!path) return result
  const url = `${config.mainApiEndpoint}${path}`
  const requestConfig = {
    method: method || 'get',
    url,
    headers,
    params,
    secure,
    data,
    pathOption
  }
  const response = await axios.request(requestConfig)
  console.info('Response from serverApiRequest')
  response.status === 401 && process.browser && Router.push('/login')
  result = { data: response.data }
  return result
}

function errorHandler(error) {
  if (error.status === 422) {
    if (error.data && error.data.errors) {
      const errors = error.data.errors
      const typeObject = Object.keys(errors).length
      return Object.keys(errors)
        .map(key => `${key} ${errors[key]}`)
        .join(typeObject > 1 ? ', ' : '')
    }
    return (
      // TODO: check if this return ever reached then fix the replace with regEx
      error.data &&
      JSON.stringify(error.data.errors)
        .replace('{', '')
        .replace('}', '')
        .replace('[', '')
        .replace(']', '')
    )
  } else {
    const message = error.data && error.data.errors && error.data.errors.body && error.data.errors.body.toString()
    return message
  }
}
