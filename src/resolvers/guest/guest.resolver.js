import Query from './guest.query';
import Mutation from './guest.mutation';

export const GuestInput = [
  "id",
  "letter",
  "isProtected",
  "rol",
  "email",
  "firstName",
  "status",
]

export default {Query, Mutation};