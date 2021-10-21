import Link from 'next/link';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { ArrowRight, ArrowUpRight } from 'react-feather';
import { mq } from '../globals/Constants';
import { Breakpoint } from '../../lib/WindowService';
import { StandardLink, StandardLinkInternal, StandardLinkType } from '../../lib/generalTypes';

const StyledDashboardTileLink = styled.a<{ disabled?: boolean }>`
  color: inherit;
  text-decoration: none;
  display: flex;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  column-gap: 0.625rem;
  border-top: 1px solid var(--grey-400);
  padding: 0.75rem 1.125rem;
  display: flex;
  justify-content: flex-end;
  transition: background var(--transition-duration-fast);

  &:hover {
    background: var(--grey-200);
  }

  ${mq(Breakpoint.mid)} {
    column-gap: 0.75rem;
    padding: 1.125rem 1.5rem;
    font-size: var(--font-size-400);
    line-height: var(--line-height-400);
  }

  svg {
    display: inline-block;
    padding: 0;
    flex-shrink: 0;
    width: 1.125rem;
    height: 1.125rem;
    padding: 0.1875rem 0;
    color: inherit;

    ${mq(Breakpoint.mid)} {
      padding: 0;
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.3;
    `}
`;

interface InternalDashboardTileLinkProps extends StandardLinkInternal {
  disabled?: boolean;
}

const InternalDashboardTileLink: React.FC<InternalDashboardTileLinkProps> = ({
  title,
  href,
  disabled,
}: InternalDashboardTileLinkProps) => {
  return (
    <Link href={href} passHref>
      <StyledDashboardTileLink title={title} disabled={disabled}>
        <span>{title}</span>
        <ArrowRight />
      </StyledDashboardTileLink>
    </Link>
  );
};

interface DashboardTileLinkProps extends StandardLink {
  disabled?: boolean;
}

export const DashboardTileLink: React.FC<DashboardTileLinkProps> = (
  props: DashboardTileLinkProps
) => {
  const { type = StandardLinkType.internal } = props;

  switch (type) {
    case StandardLinkType.internal: {
      return <InternalDashboardTileLink {...props} />;
    }

    case StandardLinkType.external: {
      const { title, href } = props;
      return (
        <StyledDashboardTileLink href={href} rel="noopener noreferrer" target="_blank">
          <span>{title}</span>
          <ArrowUpRight />
        </StyledDashboardTileLink>
      );
    }

    default: {
      throw new Error(`DashboardTileLink type "${type}" is not valid`);
    }
  }
};
