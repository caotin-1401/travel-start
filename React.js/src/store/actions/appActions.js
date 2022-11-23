import actionTypes from './actionTypes';

export const appStartUpComplete = () => ({
    type: actionTypes.APP_START_UP_COMPLETE
}); // dùng kiểu này khi redux không truyền data

export const setContentOfConfirmModal = (contentOfConfirmModal) => ({
    type: actionTypes.SET_CONTENT_OF_CONFIRM_MODAL,
    contentOfConfirmModal: contentOfConfirmModal
}); // dùng kiểu nay khi truyền data

export const changeLanguageApp = (language) => ({
    type: actionTypes.CHANGE_LANGUAGE,
    language
})