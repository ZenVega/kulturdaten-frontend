import styled from '@emotion/styled';
import React, { Reducer, useEffect, useMemo, useReducer, useState } from 'react';
import { Breakpoint } from '../../lib/WindowService';
import { Button, ButtonSize, ButtonType } from '../button';
import { insetBorder, mq } from '../globals/Constants';
import { Input, InputType } from '../input';
import { Label } from '../label';

const StyledLinkList = styled.div``;

const StyledLinkListLabel = styled.div`
  padding: 0.75rem;
  box-shadow: ${insetBorder(false, false, true)};
`;

const StyledList = styled.ul`
  display: grid;
  grid-template-columns: auto;
`;

const StyledListItem = styled.li`
  display: flex;
  align-items: stretch;
  padding: 0.375rem 0.75rem;
  box-shadow: ${insetBorder(false, false, true)};
  flex-direction: column;

  ${mq(Breakpoint.mid)} {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
`;

const StyledLink = styled.div`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  padding: 0.375rem 0 0.375rem;
  word-break: break-all;
  flex-grow: 1;

  ${mq(Breakpoint.mid)} {
    padding: 0.375rem 0.75rem 0.375rem 0;
  }
`;

const StyledLinkButton = styled.div`
  padding: 0.375rem 0;
  margin-right: 0.75rem;

  :last-of-type {
    margin-right: 0;
  }
`;

const StyledLinkButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-self: flex-end;
`;

const StyledLinkListAddNew = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0.375rem 0.75rem;

  ${mq(Breakpoint.mid)} {
    justify-content: space-between;
    align-items: flex-end;
    flex-direction: row;
  }
`;

const StyledLinkListInput = styled.div`
  flex-grow: 1;
  padding-right: 0.75rem;
  padding: 0.375rem 0;
`;

const StyledLinkListInputButton = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  padding: 0.375rem 0;
  align-self: flex-end;

  ${mq(Breakpoint.mid)} {
    padding: 0.375rem 0 0.375rem 0.75rem;
  }
`;

enum LinksActions {
  add = 'add',
  update = 'update',
  delete = 'delete',
  init = 'init',
}

type LinksState = string[];

type LinksAction = {
  type: LinksActions;
  payload: {
    link?: {
      index?: number;
      value?: string;
    };
    links?: string[];
  };
};

const linksReducer: Reducer<LinksState, LinksAction> = (state, action) => {
  switch (action.type) {
    case LinksActions.add: {
      return [...state, action.payload.link.value];
    }

    case LinksActions.update: {
      const updatedState = [...state];
      updatedState[action.payload.link.index] = action.payload.link.value;
      return updatedState;
    }

    case LinksActions.delete: {
      return state
        .slice(0, action.payload.link.index)
        .concat(state.slice(action.payload.link.index + 1));
    }

    case LinksActions.init: {
      return action.payload.links;
    }

    default: {
      break;
    }
  }
};

interface LinkListProps {
  links?: {
    value: string;
  }[];
  label: string;
  onChange?: (
    updatedLinks: {
      value: string;
    }[]
  ) => void;
}

export const LinkList: React.FC<LinkListProps> = ({ links, label, onChange }: LinkListProps) => {
  const externalValue = useMemo(() => links, [links]);
  const [externalValueDefined, setExternalValueDefined] = useState<boolean>(false);

  const [linksState, dispatch] = useReducer(
    linksReducer,
    externalValue?.map(({ value }) => {
      return value;
    }) || []
  );

  const [inputState, setInputState] = useState<string>('');

  useEffect(() => {
    if (!externalValueDefined && externalValue && externalValue.length > 0) {
      setExternalValueDefined(true);
      dispatch({
        type: LinksActions.init,
        payload: {
          links: externalValue?.map((link) => link.value) || [],
        },
      });
    }
  }, [externalValue, linksState, externalValueDefined]);

  const callbackValue = useMemo(() => linksState.map((link) => ({ value: link })), [linksState]);

  useEffect(() => {
    if (onChange) {
      onChange(callbackValue);
    }
  }, [callbackValue, onChange]);

  return (
    <StyledLinkList>
      <StyledLinkListLabel>
        <Label>{label}</Label>
      </StyledLinkListLabel>
      <StyledList>
        {linksState.map((link, index) => (
          <StyledListItem key={index}>
            <StyledLink>
              <Input
                type={InputType.url}
                id={`ll-link-${index}`}
                value={link}
                onChange={(e) =>
                  dispatch({
                    type: LinksActions.update,
                    payload: { link: { index, value: e.target.value } },
                  })
                }
              />
            </StyledLink>
            <StyledLinkButtons>
              <StyledLinkButton>
                <Button
                  size={ButtonSize.default}
                  onClick={() =>
                    dispatch({ type: LinksActions.delete, payload: { link: { index } } })
                  }
                  icon="Trash2"
                >
                  löschen
                </Button>
              </StyledLinkButton>
            </StyledLinkButtons>
          </StyledListItem>
        ))}
      </StyledList>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (inputState.length > 0) {
            dispatch({
              type: LinksActions.add,
              payload: { link: { value: inputState } },
            });

            setInputState('');
          }
        }}
      >
        <StyledLinkListAddNew>
          <StyledLinkListInput>
            <Input
              type={InputType.url}
              id="ll-1"
              value={inputState}
              onChange={(e) => setInputState(e.target.value)}
              label="Neu hinzufügen"
            />
          </StyledLinkListInput>
          <StyledLinkListInputButton>
            <Button icon="Plus" type={ButtonType.submit} disabled={inputState.length < 1}>
              hinzufügen
            </Button>
          </StyledLinkListInputButton>
        </StyledLinkListAddNew>
      </form>
    </StyledLinkList>
  );
};
