import styled from '@emotion/styled';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { contentGrid, mq } from '../../../../components/globals/Constants';
import { Tabs } from '../../../../components/navigation/tabs';
import { TitleBar } from '../../../../components/navigation/TitleBar';
import { AppWrapper } from '../../../../components/wrappers/AppWrapper';
import { Categories, useCategories } from '../../../../config/categories';
import { getApiUrlString, useApiCall } from '../../../../lib/api';
import { useLocale } from '../../../../lib/routing';
import { Breakpoint } from '../../../../lib/WindowService';

const EntryTitle = styled.h2`
  font-size: var(--font-size-700);
  line-height: var(--line-height-700);
  font-weight: 700;
`;
const EntryDescription = styled.div`
  padding-top: 1.5rem;
  font-size: var(--font-size-600);
  line-height: var(--line-height-600);

  ${mq(Breakpoint.wide)} {
    padding-top: 2.25rem;
  }
`;
const EntryHead = styled.div`
  grid-column: 1 / -1;
  padding: 3.75rem 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 6.75rem 0;
    grid-column: 2 / span 4;
  }
`;
const EntryContent = styled.div`
  grid-column: 1 / -1;
  padding: 0 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 0;
    grid-column: 2 / -2;
  }
`;
const EntryContainer = styled.div`
  ${contentGrid(4)}
  ${mq(Breakpoint.mid)} {
    ${contentGrid(11)}
  }

  ${mq(Breakpoint.wide)} {
    ${contentGrid(10)}
  }
`;

const EntryIndexPage: NextPage = () => {
  const router = useRouter();
  const categories = useCategories();
  const call = useApiCall();
  const locale = useLocale();

  const category = router?.query?.category as Categories;
  const entryId = router?.query?.entry as string;

  const categoryStructure = categories[category];
  const apiCallFactory = categoryStructure?.api.show.factory;
  const apiCallRoute = categoryStructure?.api.show.route;

  const { data } = useSWR(
    apiCallRoute ? getApiUrlString(apiCallRoute, { id: entryId }) : undefined,
    () => (categoryStructure ? call(apiCallFactory, { id: entryId }) : undefined)
  );

  const title = (data?.body as any)?.data?.attributes?.name;

  const tabLinks = [
    { title: 'Übersicht', path: '' },
    { title: 'Informationen', path: 'info/' },
    { title: 'Zugriffsrechte', path: 'rights/' },
    { title: 'Export', path: 'export/' },
  ].map(({ title, path }) => {
    const href = `${categoryStructure?.routes.list({ locale, query: router.query })}${path}`;

    return {
      title,
      href,
      isActive: router.asPath === href,
    };
  });

  return (
    <AppWrapper titleBar={<TitleBar title={title} />}>
      <Tabs links={tabLinks} />
      <EntryContainer>
        <EntryHead>
          <EntryTitle>{title}</EntryTitle>
          <EntryDescription>
            Placeholder: Erat elit mauris rhoncus purus ac in risus. Felis, orci leo viverra enim,
            nunc, dolor amet, risus orci. Consectetur lacus libero.
          </EntryDescription>
        </EntryHead>
        <EntryContent>
          <div>Data:</div>
          <pre>{JSON.stringify(data?.body, null, 2)}</pre>
        </EntryContent>
      </EntryContainer>
    </AppWrapper>
  );
};

export default EntryIndexPage;
