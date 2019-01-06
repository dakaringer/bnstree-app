import { RootState } from '@src/store/rootReducer'

export const getNames = (state: RootState) => state.names.data
