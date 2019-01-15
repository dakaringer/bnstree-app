import { RootState } from '@store/rootReducer'

export const getNames = (state: RootState) => state.names.data
