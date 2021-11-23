import { Layouts } from '../components/layouts/AppLayout';
import { Route } from '../lib/routing';

import { Locale } from './locales';

/**
 * All routes present in the app
 */
export enum Routes {
  index = 'index',
  dashboard = 'dashboard',
  team = 'team',
  login = 'login',
  register = 'register',
  userProfile = 'userProfile',
  userSettings = 'userSettings',
  userNotifications = 'userNotifications',
  developer = 'developer',
  organizer = 'organizer',
  createOrganizer = 'createOrganizer',
  offer = 'offer',
  createOffer = 'createOffer',
  location = 'location',
  createLocation = 'createLocation',
  imprint = 'imprint',
  admin = 'admin',
}

/**
 * Functions for all valid routes returning relative paths
 */
export const routes: { [key in Routes]: Route } = {
  index: ({ locale }) => `/${localizedRoutes[Routes.index][locale]}`,
  dashboard: ({ query, locale }) =>
    `/${query?.organizer}/${localizedRoutes[Routes.dashboard][locale]}/`,
  team: ({ query, locale }) => `/${query?.organizer}/${localizedRoutes[Routes.team][locale]}/`,
  userProfile: ({ locale }) => `/${localizedRoutes[Routes.userProfile][locale]}/`,
  userSettings: ({ locale }) => `/${localizedRoutes[Routes.userSettings][locale]}/`,
  developer: ({ locale }) => `/${localizedRoutes[Routes.developer][locale]}/`,
  userNotifications: ({ locale }) => `/${localizedRoutes[Routes.userNotifications][locale]}/`,
  login: ({ locale }) => `/${localizedRoutes[Routes.login][locale]}/`,
  register: ({ locale }) => `/${localizedRoutes[Routes.register][locale]}/`,
  organizer: ({ query, locale }) =>
    `/${
      query?.organizer
        ? `${query?.organizer}/${localizedRoutes[Routes.organizer][locale]}/${
            query?.sub ? `${query.sub}/` : ''
          }`
        : ''
    }`,
  createOrganizer: ({ locale }) => `/${localizedRoutes[Routes.createOrganizer][locale]}/`,
  offer: ({ query, locale }) =>
    `/${query.organizer}/${localizedRoutes[Routes.offer][locale]}/${
      query?.id ? `${query?.id}/${query?.sub ? `${query.sub}/` : ''}` : ''
    }`,
  createOffer: ({ query, locale }) =>
    `/${query.organizer}/${localizedRoutes[Routes.createOffer][locale]}/`,
  location: ({ query, locale }) =>
    `/${query.organizer}/${localizedRoutes[Routes.location][locale]}/${
      query?.id ? `${query?.id}/${query?.sub ? `${query.sub}/` : ''}` : ''
    }`,
  createLocation: ({ query, locale }) =>
    `/${query.organizer}/${localizedRoutes[Routes.createLocation][locale]}/`,
  imprint: ({ locale }) => `/${localizedRoutes[Routes.imprint][locale]}/`,
  admin: ({ locale }) => `/${localizedRoutes[Routes.admin][locale]}/organizers/`,
};

export const internalRoutes = [
  Routes.dashboard,
  Routes.team,
  Routes.userProfile,
  Routes.userNotifications,
  Routes.userSettings,
  Routes.developer,
  Routes.organizer,
  Routes.offer,
  Routes.location,
  Routes.createLocation,
  Routes.createOffer,
  Routes.createOrganizer,
  Routes.admin,
];

/**
 * Localized parts for all routes paths
 */
const localizedRoutes: { [key in Routes]: { [key in Locale]: string } } = {
  index: {
    'de-DE': '',
    'en-DE': '',
  },
  dashboard: {
    'de-DE': 'dashboard',
    'en-DE': 'dashboard',
  },
  team: {
    'de-DE': 'team',
    'en-DE': 'team',
  },
  userProfile: {
    'de-DE': 'user/profile',
    'en-DE': 'user/profile',
  },
  userSettings: {
    'de-DE': 'user/settings',
    'en-DE': 'user/settings',
  },
  developer: {
    'de-DE': 'user/developer',
    'en-DE': 'user/developer',
  },
  userNotifications: {
    'de-DE': 'user/notifications',
    'en-DE': 'user/notifications',
  },
  login: {
    'de-DE': 'auth/login',
    'en-DE': 'auth/login',
  },
  register: {
    'de-DE': 'auth/register',
    'en-DE': 'auth/register',
  },
  organizer: {
    'de-DE': 'profile',
    'en-DE': 'profile',
  },
  createOrganizer: {
    'de-DE': 'create-organizer',
    'en-DE': 'create-organizer',
  },
  offer: {
    'de-DE': 'offer',
    'en-DE': 'offer',
  },
  createOffer: {
    'de-DE': 'offer/create',
    'en-DE': 'offer/create',
  },
  location: {
    'de-DE': 'location',
    'en-DE': 'location',
  },
  createLocation: {
    'de-DE': 'location/create',
    'en-DE': 'location/create',
  },
  imprint: {
    'de-DE': 'impressum',
    'en-DE': 'imprint',
  },
  admin: {
    'de-DE': 'admin',
    'en-DE': 'admin',
  },
};

export const routesLayouts: { [key in Routes]: Layouts } = {
  index: Layouts.loggedOut,
  createLocation: Layouts.loggedIn,
  createOffer: Layouts.loggedIn,
  createOrganizer: Layouts.loggedIn,
  dashboard: Layouts.loggedIn,
  imprint: undefined,
  location: Layouts.loggedIn,
  login: Layouts.loggedOut,
  offer: Layouts.loggedIn,
  organizer: Layouts.loggedIn,
  register: Layouts.loggedOut,
  team: Layouts.loggedIn,
  userNotifications: Layouts.loggedInMeta,
  userProfile: Layouts.loggedInMeta,
  userSettings: Layouts.loggedInMeta,
  developer: Layouts.loggedInMeta,
  admin: Layouts.loggedInMeta,
};
