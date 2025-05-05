import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import notebooksReducer from "./notebooks";
import tagsReducer from "./tags";
import notesReducer from "./notes";
import filtersReducer from "./noteFilters";

const rootReducer = combineReducers({
  session: sessionReducer,
  notebooks: notebooksReducer,
  tags: tagsReducer,
  notes: notesReducer,
  filters: filtersReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
