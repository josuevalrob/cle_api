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
export const getUserFields = () => UserFields.join(' ')

export default {Query, Mutation}
