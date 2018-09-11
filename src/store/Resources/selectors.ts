import { RootState } from '@src/store/rootReducer'

export const getResource = (state: RootState) => state.resources.data
