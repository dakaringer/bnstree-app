import { RootState } from '@store/rootReducer'

export const getResource = (state: RootState) => state.resources.data
