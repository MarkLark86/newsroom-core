import { gettext, notify } from 'utils';
import server from 'server';


export const SELECT_COMPANY = 'SELECT_COMPANY';
export function selectCompany(id) {
    return function (dispatch) {
        dispatch(select(id));
        dispatch(fetchCompanyUsers(id));
    };
}

function select(id) {
    return {type: SELECT_COMPANY, id};
}

export const EDIT_COMPANY = 'EDIT_COMPANY';
export function editCompany(event) {
    return {type: EDIT_COMPANY, event};
}

export const NEW_COMPANY = 'NEW_COMPANY';
export function newCompany(data) {
    return {type: NEW_COMPANY, data};
}

export const CANCEL_EDIT = 'CANCEL_EDIT';
export function cancelEdit(event) {
    return {type: CANCEL_EDIT, event};
}

export const SET_QUERY = 'SET_QUERY';
export function setQuery(query) {
    return {type: SET_QUERY, query};
}

export const QUERY_COMPANIES = 'QUERY_COMPANIES';
export function queryCompanies() {
    return {type: QUERY_COMPANIES};
}

export const GET_COMPANIES = 'GET_COMPANIES';
export function getCompanies(data) {
    return {type: GET_COMPANIES, data};
}

export const GET_COMPANY_USERS = 'GET_COMPANY_USERS';
export function getCompanyUsers(data) {
    return {type: GET_COMPANY_USERS, data};
}

export const GET_PRODUCTS = 'GET_PRODUCTS';
export function getProducts(data) {
    return {type: GET_PRODUCTS, data};
}

export const SET_ERROR = 'SET_ERROR';
export function setError(errors) {
    return {type: SET_ERROR, errors};
}


function errorHandler(error, dispatch) {
    console.error('error', error);

    if (error.response.status !== 400) {
        notify.error(error.response.statusText);
        return;
    }
    error.response.json().then(function(data) {
        dispatch(setError(data));
    });
}

/**
 * Fetches companies
 *
 */
export function fetchCompanies() {
    return function (dispatch, getState) {
        dispatch(queryCompanies());
        const query = getState().query || '';

        return server.get(`/companies/search?q=${query}`)
            .then((data) => {
                dispatch(getCompanies(data));
            })
            .catch((error) => errorHandler(error, dispatch));
    };
}

/**
 * Fetches users of a company
 *
 * @param {String} companyId
 */
export function fetchCompanyUsers(companyId) {
    return function (dispatch, getState) {
        if (!getState().companiesById[companyId].name) {
            return;
        }

        return server.get(`/companies/${companyId}/users`)
            .then((data) => {
                return dispatch(getCompanyUsers(data));
            })
            .catch((error) => errorHandler(error, dispatch));
    };
}


/**
 * Creates new company
 *
 */
export function postCompany() {
    return function (dispatch, getState) {

        const company = getState().companyToEdit;
        const url = `/company/${company._id ? company._id : 'new'}`;

        return server.post(url, company)
            .then(function() {
                notify.success(gettext((company._id ? 'Company updated' : 'Company created') + 'successfully'));
                dispatch(fetchCompanies());
            })
            .catch((error) => errorHandler(error, dispatch));

    };
}


/**
 * Deletes a company
 *
 */
export function deleteCompany() {
    return function (dispatch, getState) {

        const company = getState().companyToEdit;
        const url = `/companies/${company._id}`;

        return server.del(url)
            .then(() => {
                notify.success(gettext('Company deleted successfully'));
                dispatch(fetchCompanies());
            })
            .catch((error) => errorHandler(error, dispatch));
    };
}

export const INIT_VIEW_DATA = 'INIT_VIEW_DATA';
export function initViewData(data) {
    return function (dispatch) {
        dispatch(getCompanies(data.companies));
        dispatch(getProducts(data.products));
        return {type: INIT_VIEW_DATA, data};
    };
}

export const UPDATE_COMPANY_SERVICES = 'UPDATE_COMPANY_SERVICES';
export function updateCompanyServices(company, services) {
    return {type: UPDATE_COMPANY_SERVICES, company, services};
}

export function saveServices(services) {
    return function (dispatch, getState) {
        const company = getState().companyToEdit;
        return server.post(`/companies/${company._id}/services`, {services})
            .then(() => dispatch(updateCompanyServices(company, services)))
            .catch((error) => errorHandler(error, dispatch));
    };
}
