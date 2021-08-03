import { Language } from '../../../config/locale';
import { Address } from './address';
import { CategoryEntry, DefaultAttributes, Translation } from './general';
import { Organizer } from './organizer';

export type LocationTranslation = {
  type: 'locationtranslation';
  attributes: {
    language: Language;
    name?: string;
    description?: string;
  };
} & Translation;

export type Location = {
  data: {
    id?: string;
    type?: 'location';
    attributes?: DefaultAttributes;
    relations?: {
      translations: LocationTranslation[];
      organizer?: Organizer;
      address?: Address;
    };
  };
  meta?: {
    publishable:
      | boolean
      | {
          [key: string]: string[];
        };
  };
} & CategoryEntry;

export type CreateLocation = {
  relations?: {
    links?: string[];
    translations?: LocationTranslation[];
    address?: Address;
  };
};
