import { useContext, useEffect } from 'react';
import getConfig from 'next/config';
import { defaultOrganizerId, NavigationContext } from '../components/navigation/NavigationContext';
import { useCategories } from '../config/categories';
import { OrganizerShow } from './api/routes/organizer/show';
import { Organizer } from './api/types/organizer';
import { useEntry } from './categories';
import { getCookie, setCookie } from './cookies';
import { routes, useLocale } from './routing';
import { useAdminMode } from '../components/Admin/AdminContext';
import { useUser } from '../components/user/useUser';

const publicRuntimeConfig = getConfig ? getConfig()?.publicRuntimeConfig : undefined;
const activeOrganizerCookieName =
  (publicRuntimeConfig?.activeOrganizerCookieName as string) || 'ACTIVE_ORGANIZER_ID';

export const useOrganizerId = (): string => {
  const { activeOrganizerId, setActiveOrganizerId } = useContext(NavigationContext);
  const locale = useLocale();
  const { adminModeActive, activeOrganizerId: adminActiveOrganizerId } = useAdminMode();

  useEffect(() => {
    const organizerIdFromCookie = getCookie(activeOrganizerCookieName)?.value;

    if (organizerIdFromCookie && activeOrganizerId === defaultOrganizerId) {
      setActiveOrganizerId(organizerIdFromCookie);
    }
  }, [activeOrganizerId, locale, setActiveOrganizerId]);

  return adminModeActive ? adminActiveOrganizerId : activeOrganizerId;
};

export const useSetOrganizerId = (): ((organizerId: string) => void) => {
  const locale = useLocale();
  const { setActiveOrganizerId } = useContext(NavigationContext);

  return (organizerId): void => {
    setCookie({
      'name': activeOrganizerCookieName,
      'value': organizerId,
      'path': routes.index({ locale }),
      'max-age': 1209600,
    });

    console.log('set', { organizerId });

    setActiveOrganizerId(organizerId);
  };
};

export const useOrganizer = (): Organizer => {
  const organizerId = useOrganizerId();
  const categories = useCategories();
  const { entry } = useEntry<Organizer, OrganizerShow>(categories?.organizer, {
    organizer: organizerId,
  });

  return entry;
};

export const useHandleActiveOrganizer = () => {
  const { user } = useUser();
  const activeOrganizerId = useOrganizerId();
  const setActiveOrganizerId = useSetOrganizerId();

  useEffect(() => {
    const userOrganizerIds = user?.relations?.organizers?.map(
      (role) => role.relations?.organizer?.id
    );

    if (
      activeOrganizerId &&
      userOrganizerIds?.length > 0 &&
      !userOrganizerIds.includes(activeOrganizerId)
    ) {
      console.log({ set: userOrganizerIds[0] });
      setActiveOrganizerId(userOrganizerIds[0]);
    } else if (userOrganizerIds?.length === 0 && activeOrganizerId !== defaultOrganizerId) {
      console.log({ set: defaultOrganizerId });
      setActiveOrganizerId(defaultOrganizerId);
    }
  }, [activeOrganizerId, setActiveOrganizerId, user?.relations?.organizers]);
};
