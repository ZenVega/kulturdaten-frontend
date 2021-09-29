import { NextPage } from 'next';

import { routes, useLanguage, useLocale } from '../../../lib/routing';
import { useUser } from '../../../components/user/useUser';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import { useT } from '../../../lib/i18n';
import { useOrganizer, useOrganizerId } from '../../../lib/useOrganizer';
import { getTranslation } from '../../../lib/translations';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { ContentContainer, ContentWrapper } from '../../../components/wrappers/ContentWrappers';
import { DashbaordGreeting } from '../../../components/Dasboard';
import { useRandomInt } from '../../../lib/random';

const greetings: {
  [key: string]: string[];
} = {
  initial: ['greetings.welcome'],
  default: ['greetings.hey', 'greetings.hello', 'greetings.heyhey'],
};

const DashboardPage: NextPage = () => {
  useUser();
  const locale = useLocale();
  const t = useT();
  const language = useLanguage();
  const organizerId = useOrganizerId();
  const organizer = useOrganizer();
  const router = useRouter();
  const currentTranslation = getTranslation(language, organizer?.data?.relations?.translations);

  const userHasNoOrganizer = useMemo(() => organizerId === 'default', [organizerId]);

  const selectedGreetings = useMemo(
    () => (userHasNoOrganizer ? greetings.initial : greetings.default),
    [userHasNoOrganizer]
  );

  const randomGreetingsIndex = useRandomInt(0, selectedGreetings.length);

  useEffect(() => {
    if (organizerId !== 'default' && router?.query?.organizer !== organizerId) {
      router.replace(routes.dashboard({ locale, query: { organizer: organizerId } }));
    }
  }, [locale, organizerId, router]);

  return (
    <AppWrapper>
      <ContentWrapper>
        <ContentContainer>
          <DashbaordGreeting>{t(selectedGreetings[randomGreetingsIndex])}</DashbaordGreeting>
          <div>hello</div>
        </ContentContainer>
      </ContentWrapper>
    </AppWrapper>
  );
};

export default DashboardPage;
