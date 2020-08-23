import Query from './turno.query';
import Mutation from './turno.mutations';
export const TurnoInput =[
  "id",
  "kind",
  "name",
  "description",
  "nightPrice",
];

export const getTurnoInput = () => `
  ${TurnoInput.join(' ')}
`;
export default {Query, Mutation};
