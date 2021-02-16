export const getSearchItems = (state) => {
  if (state.results !== null) {
    return state.results.items
  } else {
    return []
  }
}
export const getHelpers = (state) => {
  if (state.results !== null) {
    return state.results.helppers
  } else {
    return []
  }
}

export const getQuery = (state) => {
  return state.q
}
export const getLoadState = (state) => {
  return state.loaded
}
