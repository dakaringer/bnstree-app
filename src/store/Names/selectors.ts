import { RootState } from '@store'

export const getNames = (state: RootState) => state.names.data
