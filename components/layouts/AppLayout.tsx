import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { useBodyLock } from '../../lib/BodyLock';

import { Breakpoint, useBreakpointOrWider, WindowContext } from '../../lib/WindowService';
import { mq, overlayStyles } from '../globals/Constants';
import { NavigationProps, useNavigationOverlayVisible } from '../navigation';
import { NavigationContext } from '../navigation/NavigationContext';
import { OrganizerBand, OrganizerBandLayout } from '../navigation/OrganizerBand';

const StyledAppLayout = styled.div``;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  position: relative;

  ${mq(Breakpoint.mid)} {
    margin-left: var(--organizer-band-width);
    width: calc(100% - var(--organizer-band-width));
    grid-template-columns: repeat(3, 5.5625rem) repeat(11, 1fr);
  }

  @media screen and (min-width: 67.1875rem) {
    grid-template-columns: repeat(11, 1fr);
  }

  ${mq(Breakpoint.ultra)} {
    grid-template-columns: repeat(3, 9.125rem) repeat(8, 1fr);
  }
`;

const OrganizerSlot = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: var(--organizer-band-width);
  height: var(--app-height);
  background: var(--grey-200);
  z-index: 1002;
  box-shadow: inset -1.75rem 0 0.75rem -2rem var(--black-o25);
  overflow-x: hidden;
  overflow-y: auto;
`;

const HeaderSlot = styled.div<{ locked: boolean }>`
  position: fixed;
  width: 100%;
  z-index: 1001;
  box-shadow: 0 -0.125rem 0.625rem -0.125rem rgba(0, 0, 0, 0.25);
  max-width: 100%;
  overflow-y: hidden;
  overflow-x: auto;
  bottom: 0;
  left: 0;
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--white);

  ${mq(Breakpoint.mid)} {
    width: calc(100% - var(--organizer-band-width));
    left: var(--organizer-band-width);
    padding-bottom: 0;
    box-shadow: 0 0.125rem 0.625rem -0.125rem rgba(0, 0, 0, 0.25);
    top: 0;
    bottom: auto;
  }
`;

const HeaderSlotSecondary = styled.div`
  background: var(--grey-200);
  box-shadow: inset 0 -1.75rem 0.75rem -2rem var(--black-o25);
`;

const MenuSlot = styled.div<{ expanded?: boolean }>`
  position: fixed;
  top: 3rem;
  left: 0;
  z-index: 1000;
  overflow: hidden;
  width: 100%;

  filter: grayscale(1);
  transform: filter 0.1s;

  &:hover {
    filter: grayscale(0);
  }

  ${mq(Breakpoint.mid)} {
    top: 3.75rem;
    border-right: 1px solid var(--grey-400);
    grid-row: 1;
    height: calc(var(--app-height) - 3.75rem);
    min-height: calc(var(--app-height) - 3.75rem);
    overflow-y: auto;
    left: var(--organizer-band-width);

    width: 16.6875rem;

    transition: width 0.083333s, filter 0.2s;

    @media screen and (min-width: 67.1875rem) {
      width: calc(calc(100% - var(--organizer-band-width)) / 11 * 3);
    }

    ${mq(Breakpoint.ultra)} {
      width: 27.375rem;
    }
  }

  ${({ expanded }) =>
    expanded
      ? css`
          filter: grayscale(0);

          ${mq(Breakpoint.mid)} {
            width: calc(100% - var(--organizer-band-width));
            border-right: none;
          }

          ${mq(Breakpoint.widish)} {
            border-right: 1px solid var(--grey-400);
            width: calc((100% - var(--organizer-band-width)) / 11 * 10);
          }

          ${mq(Breakpoint.ultra)} {
            width: calc((100% - var(--organizer-band-width)) / 11 * 9);
          }
        `
      : ''}
`;

const ContentSlot = styled.div<{ locked: boolean; hasSidebar: boolean }>`
  position: relative;
  grid-column: 1 / -1;
  min-height: calc(var(--app-height) - var(--header-height));
  margin-bottom: calc(var(--header-height) + env(safe-area-inset-bottom));

  ${mq(Breakpoint.mid)} {
    min-height: var(--app-height);
    margin-top: var(--header-height);
    margin-bottom: 0;
    grid-column: ${({ hasSidebar }) => (hasSidebar ? '4 / -1' : '1/-1')};
    grid-row: 1;
  }
`;

const StyledMainMenuOverlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 999;
  cursor: pointer;
  top: 0;
  left: 0;

  ${overlayStyles}
`;

interface AppLayoutProps {
  header: { main: React.ReactElement<NavigationProps>; secondary: React.ReactElement };
  content: React.ReactNode;
  sidebar?: React.ReactElement;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  header,
  sidebar,
  content,
}: AppLayoutProps) => {
  const headerMain = header?.main;
  const headerSecondary = header?.secondary;
  const { menuExpanded, setMenuExpanded, overlayOpen } = useContext(NavigationContext);
  const { rendered } = useContext(WindowContext);
  const contentSlotRef = useRef<HTMLDivElement>();
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const isMainMenuOverlayVisible = useNavigationOverlayVisible();
  const enableMenuExpanded = useMemo(() => typeof sidebar !== 'undefined', [sidebar]);
  const bodyLockConditions = useMemo(
    () => [menuExpanded && enableMenuExpanded, overlayOpen],
    [enableMenuExpanded, menuExpanded, overlayOpen]
  );
  const { bodyLock, locked } = useBodyLock(bodyLockConditions);

  const hasSidebar = useMemo(() => typeof sidebar !== 'undefined', [sidebar]);

  useEffect(() => {
    if (!isMidOrWider) {
      setMenuExpanded(false);
    }
  }, [isMidOrWider, setMenuExpanded]);

  // Add "inert" attribute to elements behind MainMenuOverlay.
  // Inert is a new web standard which marks elements as not interactive while keeping them visible.
  // Think of "visiblity: hidden" but still visible.
  // Used for preventing not/partially visible elements from being focusable via tabbing.
  useEffect(() => {
    if (enableMenuExpanded && isMainMenuOverlayVisible) {
      contentSlotRef.current?.setAttribute('inert', '');
    } else {
      contentSlotRef.current?.removeAttribute('inert');
    }
  }, [isMainMenuOverlayVisible, enableMenuExpanded]);

  const renderedContentSlot = (
    <ContentSlot ref={contentSlotRef} locked={locked} hasSidebar={hasSidebar}>
      {content}
    </ContentSlot>
  );

  useEffect(() => {
    if (document) {
      document.getElementById('__next').setAttribute('role', 'application');
    }
  }, []);

  return (
    <StyledAppLayout>
      {bodyLock}

      {headerMain && (
        <HeaderSlot locked={locked} role="navigation">
          {headerMain}
        </HeaderSlot>
      )}
      {headerSecondary && (
        <HeaderSlotSecondary role="navigation">{headerSecondary}</HeaderSlotSecondary>
      )}
      {isMidOrWider && (
        <OrganizerSlot>
          <OrganizerBand layout={OrganizerBandLayout.narrow} />
        </OrganizerSlot>
      )}
      {isMidOrWider && sidebar && (
        <MenuSlot expanded={menuExpanded} role="navigation">
          {sidebar}
        </MenuSlot>
      )}
      <Container role="main">{rendered && renderedContentSlot}</Container>
      {enableMenuExpanded && isMainMenuOverlayVisible && (
        <StyledMainMenuOverlay
          onClick={() => {
            setMenuExpanded(false);
          }}
        />
      )}
    </StyledAppLayout>
  );
};
