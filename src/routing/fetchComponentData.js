/**
 * Returns the route component's fetchData property if it exists. If the
 * given component is a WrappedComponent, this method will unwrap
 * to the base component to search for fetchData.
 *
 * @param {Object} component - A React component
 */
const getFetchData = (component = {}) => {
  return component.WrappedComponent ?
    getFetchData(component.WrappedComponent) :
    component.fetchData;
};

/**
 * 1. Find components with a fetchData method
 * 2. Extract the fetchData methods
 * 3. Run fetchData methods
 */
const executeFetchDatas = (components, getState, dispatch, location, params) => {
  return components
    .filter(component => getFetchData(component))
    .map(component => getFetchData(component).bind(component))
    .map(fetchData => fetchData(getState, dispatch, location, params));
};

export default (components, getState, dispatch, location, params) => {
  return Promise.all(executeFetchDatas(components, getState, dispatch, location, params));
};

