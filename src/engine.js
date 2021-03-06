/* global fetch, FormData */
import {
  createStore,
  applyMiddleware,
  compose
} from 'redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'localforage'
import PolymerRedux from 'polymer-redux'
import {
  ActionTypes,
  ActionCreators as ClientActionCreators,
  DataReducers,
  createSagaMiddleware,
  clientFactory,
  sagaFactory
} from 'vientos-client'
import * as AppActionCreators from './actionCreators'
import * as AppReducers from './reducers'
import * as util from './util'

const config = require('../config.json')
const persistConfig = {
  key: 'redux',
  blacklist: ['online', 'toast', 'loginProviders', 'boundingBox'],
  storage
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const reducer = persistCombineReducers(persistConfig, {
  loginProviders: DataReducers.loginProviders,
  projects: DataReducers.projects,
  categories: DataReducers.categories,
  people: DataReducers.people,
  places: DataReducers.places,
  states: DataReducers.states,
  municipalities: DataReducers.municipalities,
  person: DataReducers.person,
  myConversations: DataReducers.myConversations,
  notifications: DataReducers.notifications,
  session: DataReducers.session,
  intents: DataReducers.intents,
  reviews: DataReducers.reviews,
  matchings: DataReducers.matchings,
  filteredCategories: AppReducers.filteredCategories,
  filteredCollaborationTypes: AppReducers.filteredCollaborationTypes,
  searchTerm: AppReducers.searchTerm,
  personalFilter: AppReducers.personalFilter,
  mapView: AppReducers.mapView,
  language: AppReducers.language,
  labels: AppReducers.labels,
  online: AppReducers.online,
  toast: AppReducers.toast,
  history: AppReducers.history,
  resume: AppReducers.resume
})

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
)

persistStore(store)

const handleLatest = [
  ActionTypes.FETCH_PROJECTS_REQUESTED,
  ActionTypes.FETCH_PLACES_REQUESTED,
  ActionTypes.FETCH_STATES_REQUESTED,
  ActionTypes.FETCH_MUNICIPALITIES_REQUESTED,
  ActionTypes.FETCH_CATEGORIES_REQUESTED,
  ActionTypes.FETCH_REVIEWS_REQUESTED,
  ActionTypes.FETCH_MATCHINGS_REQUESTED,
  ActionTypes.FETCH_INTENTS_REQUESTED,
  ActionTypes.FETCH_PERSON_REQUESTED,
  ActionTypes.FETCH_PEOPLE_REQUESTED,
  ActionTypes.FETCH_MY_CONVERSATIONS_REQUESTED,
  ActionTypes.FETCH_NOTIFICATIONS_REQUESTED,
  ActionTypes.HELLO_REQUESTED,
  ActionTypes.BYE_REQUESTED,
  ActionTypes.SAVE_PERSON_REQUESTED,
  ActionTypes.SAVE_SUBSCRIPTION_REQUESTED
]

const handleEvery = [
  ActionTypes.FOLLOW_REQUESTED,
  ActionTypes.UNFOLLOW_REQUESTED,
  ActionTypes.FAVOR_REQUESTED,
  ActionTypes.UNFAVOR_REQUESTED,
  ActionTypes.MATCH_REQUESTED,
  ActionTypes.SAVE_INTENT_REQUESTED,
  ActionTypes.SAVE_PROJECT_REQUESTED,
  ActionTypes.SAVE_CONVERSATION_REQUESTED,
  ActionTypes.ADD_MESSAGE_REQUESTED,
  ActionTypes.ADD_REVIEW_REQUESTED,
  ActionTypes.SAVE_NOTIFICATION_REQUESTED,
  ActionTypes.SAVE_PLACE_REQUESTED
]

const client = clientFactory(config, fetch, FormData)
const saga = sagaFactory(client, handleLatest, handleEvery)
sagaMiddleware.run(saga)

const ReduxMixin = PolymerRedux(store)
const ActionCreators = Object.assign({}, ClientActionCreators, AppActionCreators)
const mintUrl = client.mintUrl
const channelUrl = client.channelUrl

export {
  ReduxMixin,
  ActionCreators,
  mintUrl,
  channelUrl,
  util,
  config
}
