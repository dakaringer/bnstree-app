export enum sagaActionTypes {
	ID_TOKEN_LOGIN = '[Saga] User/ID_TOKEN_LOGIN',
	LOGOUT = '[Saga] User/LOGOUT',
	UPDATE_PREFERENCES = '[Sage] User/UPDATE_PREFERENCES'
}

export enum reduxActionTypes {
	SET_DATA = '[Redux] User/SET_DATA',
	CLEAR_DATA = '[Redux] User/CLEAR_DATA',
	SET_PREFERENCES = '[Redux] User/SET_PREFERENCES',
	SET_LOGOUT_MESSAGE = '[Redux] User/SET_LOGOUT_MESSAGE'
}
