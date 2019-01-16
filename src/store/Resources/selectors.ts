import { RootState } from '@store'

export const getResource = (state: RootState) => state.resources.data
