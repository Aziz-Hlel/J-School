import { v5 as uuidv5 } from 'uuid';

const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
console.log(uuidv5('director2', NAMESPACE));

export const genUuid = (name: string) => {
  return uuidv5(name, NAMESPACE);
};
