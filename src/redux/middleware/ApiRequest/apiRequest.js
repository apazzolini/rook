/**
 * Redux middleware for dispatching actions that have a promise payload that
 * execute an async action against the API server. This middleware handles
 * actions that adhere to the following format:
 *
 * {
 *   type: requestType
 *   apiRequest: (api) => Promise
 * }
 *
 * This middleware should come after thunk handling middlewares.
 */
export default function (api) {
  return ({ getState, dispatch }) => next => action => {
    // We only handle actions that have a `apiRequest` field.
    const { apiRequest, type, ...rest } = action;
    if (!apiRequest) {
      return next(action);
    }

    // Generate the convention-based dispatch types
    const REQUEST = type;
    const OK = `${type}Ok`;
    const FAIL = `${type}Fail`;

    // Immediately dispatch the REQUEST action.
    next({ ...rest, type: REQUEST });

    // Execute the API request and dispatch the OK or FAIL action type
    return apiRequest(api).then(
      (result) => {
        if (result.error) {
          return next({ ...rest, error: result.error, type: FAIL });
        }

        return next({ ...rest, result, type: OK });
      },
      (error) => {
        return next({ ...rest, error, type: FAIL });
      }
    );
  };
}

