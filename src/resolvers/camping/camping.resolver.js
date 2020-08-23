import Query from './camping.query';
import Mutation from './camping.mutations'
import {getUserFields} from '../users/user.resolver';
import {getTurnoInput} from '../turno/turno.resolver';
import { getGuestInputs } from '../guest/guest.resolver';
import Camping from '../../models/camping.model';

export const CampingTypes =[
  "id",
  // "patreonEmail",
  "firstName",
];

export const getCampingInput = () => `
  ${CampingTypes.join(' ')}
  owner { ${getUserFields()} }
  turno { ${getTurnoInput()} }
  patreon { ${getUserFields()} }
  guest { ${getGuestInputs()} }
`;

export default {Query, Mutation}
