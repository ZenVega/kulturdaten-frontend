import styled from '@emotion/styled';
import { contentGrid, mq } from '../../globals/Constants';
import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { Breakpoint } from '../../../lib/WindowService';
import { Organizer } from '../../../lib/api/types/organizer';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { useLanguage } from '../../../lib/routing';
import { getTranslation } from '../../../lib/translations';
import { useT } from '../../../lib/i18n';
import MD from 'markdown-to-jsx';

const EntryContainer = styled.div`
  ${contentGrid(4)}
  padding: 2.75rem 0;

  ${mq(Breakpoint.mid)} {
    ${contentGrid(16)}
    column-gap: 0.75rem;
  }
`;

const EntryMainCard = styled.div`
  position: relative;
  overflow: hidden;
  grid-column: 1/-1;
  margin: 0 0.75rem;
  padding-bottom: 0.75rem;

  background-color: var(--white);
  border: 1px solid var(--grey-400);
  border-radius: 0.75rem;

  ${contentGrid(3)}

  ${mq(Breakpoint.mid)} {
    margin-top: 0.75rem;
    margin: 0;
    grid-column: 3 / 15;
    column-gap: 0.75rem;
  }
`;

const EntryHead = styled.div`
  grid-row: 1 / 2;
  grid-column: 1 / 3;
  padding: 1rem 1.5rem;
  margin-bottom: 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding-bottom: 0.75rem;
  }
`;

const EntryTitle = styled.h2`
  font-size: var(--font-size-400);
  line-height: var(--line-height-600);
  font-weight: var(--font-weight-bold);

  ${mq(Breakpoint.mid)} {
    font-size: var(--font-size-600);
    line-height: var(--line-height-600);
  }
`;

const EntryDescription = styled.div`
  font-size: var(--font-size-200);
  line-height: var(--line-height-200);

  h1 {
    font-size: var(--font-size-600);
    line-height: var(--line-height-600);
    font-weight: 700;
  }

  h2 {
    font-size: var(--font-size-400);
    line-height: var(--line-height-400);
    font-weight: 700;
  }

  h3 {
    font-size: var(--font-size-300);
    line-height: var(--line-height-300);
    font-weight: 700;
  }

  strong {
    font-weight: 700;
  }

  em {
    font-style: italic;
  }

  u {
    text-decoration: underline;
  }

  ul,
  ol {
    list-style-position: inside;
    padding-bottom: var(--line-height-300);
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  li {
    padding-left: 1.5rem;
    font-size: var(--font-size-300);
    line-height: var(--line-height-300);

    p {
      display: inline;
    }
  }

  ${mq(Breakpoint.mid)} {
    font-size: var(--font-size-300);
    line-height: var(--line-height-300);
  }
`;

const EntryLogo = styled.div`
  overflow: hidden;
  margin-bottom: 1.75rem;
  grid-row: 1 / 3;
  grid-column: 3;

  img {
    display: block;
    width: 100%;
    min-width: 100%;
    border-top-right-radius: 0.75rem;
    border-bottom-left-radius: 0.75rem;
    border-left: 1px solid var(--grey-400);
    border-bottom: 1px solid var(--grey-400);
  }
`;

const EntryMetadata = styled.div`
  padding: 0.75rem 0;
  grid-row: 3;
  grid-column: 1 / 4;

  border-top: 1px solid var(--grey-400);
  border-bottom: 1px solid var(--grey-400);

  ${mq(Breakpoint.mid)} {
    ${contentGrid(3)}
    column-gap: 0.75rem;
    margin-bottom: 1.75rem;
  }
`;

const EntryCategorization = styled.ul`
  padding: 0 1.5rem;
  margin-bottom: 0.75rem;
  grid-row: 4;
  grid-column: 1 / 4;

  font-size: var(--font-size-200);
  line-height: var(--line-height-200);
  font-weight: var(--font-weight-bold);

  ${mq(Breakpoint.mid)} {
    font-size: var(--font-size-300);
    line-height: var(--line-height-300);
  }
`;

const EntryType = styled.li`
  display: inline-block;
  padding-right: 0.75rem;
  margin-right: 0.75rem;
  position: relative;
  &::after {
    content: '|';
    display: block;
    position: absolute;
    right: -2px;
    top: 0;
  }
`;

const EntrySubject = styled.li`
  display: inline-block;
`;

const EntryTags = styled.ul`
  padding: 0 1.5rem;
  grid-row: 5;
  grid-column: 1 / 4;

  font-size: var(--font-size-200);
  line-height: var(--line-height-200);

  ${mq(Breakpoint.mid)} {
    font-size: var(--font-size-300);
    line-height: var(--line-height-300);
  }
`;

const Tag = styled.li`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  margin: 0 0.75rem 0.75rem 0;
  border: 1px solid var(--grey-200);
  border-radius: 6px;
`;

const EntryContact = styled.div`
  grid-row: 6;
  grid-column: 1 / 4;
  padding: 0.75rem 1.5rem 0 1.5rem;
`;

const EntryMetadataKey = styled.dd`
  padding-bottom: 0.125rem;

  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-200);
  line-height: var(--line-height-200);

  ${mq(Breakpoint.mid)} {
    font-size: var(--font-size-300);
    line-height: var(--line-height-200);
  }
`;

const EntryMetadataValue = styled.dt`
  margin-bottom: 1rem;

  font-size: var(--font-size-200);
  line-height: var(--line-height-200);

  a {
    color: var(--black);
  }

  ${mq(Breakpoint.mid)} {
    font-size: var(--font-size-300);
    line-height: var(--line-height-300);
  }
`;

const EntryPhotos = styled.div`
  grid-row: 7;
  grid-column: 1 / 4;

  img {
    display: block;
    max-width: 100%;
    width: 100%;
  }

  figure {
    display: grid;
    grid-template-rows: 1fr auto;
    margin-bottom: 0.75rem;
    break-inside: avoid;
  }

  figure > img {
    grid-row: 1 / -1;
    grid-column: 1;
  }

  figcaption {
    grid-row: 2;
    grid-column: 1;
    color: var(--white);
    background-color: var(--black-o40);
    padding: 0.25rem 0.5rem;
    justify-self: end;

    font-size: var(--font-size-100);
    line-height: var(--line-height-100);
  }

  ${mq(Breakpoint.mid)} {
    column-count: 2;
    column-gap: 10px;
  }
`;

export const OrganizerPreviewPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const { entry } = useEntry<Organizer, OrganizerShow>(category, query);
  const language = useLanguage();
  const currentTranslation = getTranslation(language, entry?.data?.relations?.translations);
  const title = currentTranslation?.attributes?.name;
  const descriptionMarkdown = currentTranslation?.attributes?.description;
  const homepage = entry?.data?.attributes?.homepage;
  const email = entry?.data?.attributes?.email;
  const phone = entry?.data?.attributes?.phone;
  const hasContactInfo = homepage || email || phone;
  const t = useT();

  return (
    <EntryContainer>
      <EntryMainCard>
        <EntryHead>
          <EntryTitle>{title}</EntryTitle>
          <EntryDescription>
            {descriptionMarkdown ? <MD>{descriptionMarkdown}</MD> : ''}
          </EntryDescription>
        </EntryHead>
        <EntryLogo>
          <img src="http://via.placeholder.com/800x800" alt="" />
        </EntryLogo>
        <EntryMetadata>
          <EntryCategorization>
            <EntryType>Museum</EntryType>
            <EntrySubject>Kunstmuseum, Designmuseum</EntrySubject>
          </EntryCategorization>
          <EntryTags>
            <Tag>Ensembles für Zeitgenössische Musik</Tag>
            <Tag>Ensembles für Alte Musik</Tag>
            <Tag>Instrumentalensemble</Tag>
            <Tag>Gemischter Chor</Tag>
            <Tag>Frauenchor</Tag>
            <Tag>Männerchor</Tag>
            <Tag>Jugendchor</Tag>
            <Tag>Kinderchor</Tag>
          </EntryTags>
          {hasContactInfo && (
            <EntryContact>
              {homepage && (
                <EntryMetadataKey>{t('categories.organizer.form.website')}</EntryMetadataKey>
              )}
              {homepage && (
                <EntryMetadataValue>
                  <a target="_blank" rel="noreferrer" href={homepage}>
                    {homepage}
                  </a>
                </EntryMetadataValue>
              )}
              {email && <EntryMetadataKey>{t('categories.organizer.form.email')}</EntryMetadataKey>}
              {email && (
                <EntryMetadataValue>
                  <a target="_blank" rel="noreferrer" href={'mailto:' + email}>
                    {email}
                  </a>
                </EntryMetadataValue>
              )}
              {phone && <EntryMetadataKey>{t('categories.organizer.form.tel')}</EntryMetadataKey>}
              {phone && (
                <EntryMetadataValue>
                  <a href={'tel:' + phone}>{phone}</a>
                </EntryMetadataValue>
              )}
            </EntryContact>
          )}
        </EntryMetadata>
        <EntryPhotos>
          <figure>
            <img src="http://via.placeholder.com/600x800" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/250x300" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/264x500" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/600x400" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/400x250" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/650x800" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/690x500" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/600x500" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/800x800" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/600x400" alt="" />
            <figcaption>License info</figcaption>
          </figure>
          <figure>
            <img src="http://via.placeholder.com/1400x1800" alt="" />
            <figcaption>License info</figcaption>
          </figure>
        </EntryPhotos>
      </EntryMainCard>
    </EntryContainer>
  );
};
