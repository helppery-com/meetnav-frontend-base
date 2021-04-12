import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { storex } from '~/store'

export const namespaced = true

// Module state
export const state = () => ({
  state1: 'myvalue'
})

// Computed state
export const getters = getterTree(state, {
  getter1: (state) => (state + '1').length
})

// Change state
export const mutations = mutationTree(state, {
  muttation1 (state, newValue) {
    state.myvalue = newValue
  }
})

// Module logic
export const actions = actionTree(
  { state, getters, mutations },
  {
    async action1 ({ state, getters, mutations }) {
      // Doing somehting cool here with state.myvalue
      if (state.myvalue && getters.getter1 !== 0) {
        // Access mutations and other modules through storex
        storex.example.muttation1('dummy')
      }
    }
  }
)
