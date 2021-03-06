import Query from './guest.query';
import Mutation from './guest.mutation';
import {getUserFields} from '../users/user.resolver'

export const GuestInput = [
  "id",
  "letter",
  "isProtected",
  "rol",
  "email",
  "firstName",
  "status",
]

export const getGuestInputs = () =>`
    ${GuestInput.join(' ')}
    owner {
      ${getUserFields()}
    }
`
export const GUEST_NOT_SEND = 'GUEST_NOT_SEND'

export default {Query, Mutation};