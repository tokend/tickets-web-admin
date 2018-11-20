import store from '../store'
import { ServerCallBuilder } from './ServerCallBuilder'

const ScopedServerCallBuilder = ServerCallBuilder.makeScope()
  .registerResource('requests')
  .registerResource('request')
  .registerResource('atomic_swaps')
  .registerResource('atomic_swap_bids')

export default {
  _getRequests (resource, { state, requestor }) {
    const filters = {}
    if (state) filters.state = state
    if (requestor) filters.requestor = requestor

    return new ScopedServerCallBuilder()
      .request()[resource]()
      .sign()
      .get({
        order: 'desc',
        limit: store.getters.pageLimit,
        ...filters
      })
  },

  getBidRequests (opts) {
    return this._getRequests('atomic_swap_bids', opts)
  },

  getSwapRequests (opts) {
    return this._getRequests('atomic_swaps', opts)
  }
}

