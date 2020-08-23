import Query from './user.queries';
import Mutation from './user.mutations'

export const UserFields = [
  "id",
  "rol",
  "email",
  "firstName",
  "lastName",
  "phone",
  "Country",
  "City",
  "birth",
  "profilePhoto",
];
export const getUserFields = () => UserFields.join(' ');

export const ALREADY_REGISTER = 'ALREADY_REGISTER';
export const NO_PERMISSIONS_DELETE = 'NO_PERMISSIONS_DELETE';
export const DELETED_BUT_NOT_GUEST_UPDATED = 'DELETED_BUT_NOT_GUEST_UPDATED';
export const GUEST_UPDATE_ERROR = 'GUEST_UPDATE_ERROR';
export const USER_OR_PASSWORD_PROBLEM = 'USER_OR_PASSWORD_PROBLEM';
export const SUCCESS_DELETED = 'SUCCESS_DELETED';

export default {Query, Mutation}
