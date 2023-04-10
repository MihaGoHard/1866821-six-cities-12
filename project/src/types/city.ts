import { Location } from './location';

export type City = {
  name: string;
  location: Location;
}

export type CitiesMap = {
  [key: string]: City;
}
