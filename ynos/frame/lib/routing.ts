import _ = require('lodash')
import * as littleRouter from 'little-router'
import {State} from "../astate";

const DEFAULT = '/';

const location = (state: State): string => {
  return _.last(state.routing.locations) || DEFAULT
};

const match = (routes: Array<any>, path: string): any => {
  return littleRouter.match({ routes, path }).route
};

export default {
  location: location,
  match: match
}
