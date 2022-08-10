import styled from '@emotion/styled';
import { ChangeEventHandler, useEffect, useMemo, useState } from 'react';
import { ComponentWithVariants } from '../../lib/generalTypes';
import { useT } from '../../lib/i18n';
import { useDebounce } from '../../lib/useDebounce';
import { inputStyles } from '../input';
import { Label, StyledLabel } from '../label';
import { Tooltip } from '../tooltip';
import { TooltipP } from '../tooltip/TooltipContent';
import { focusStyles } from '../globals/Constants';
import { countAlertCall, CountAlert, StyledCharacterCount } from '../RichTextEditor';


const StyledTextareaContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${StyledLabel} {
    padding-bottom: 0.75rem;
  }
`;

const StyledTextarea = styled.textarea<{ pristine?: boolean; valid?: boolean }>`
  display: block;
  ${(props) => inputStyles(props)}
  &::placeholder {
    opacity: 1;
  }
  ${focusStyles}
`;

const StyledTooltip = styled.div`
  margin-left: 0.5rem;
`;

export interface TextareaProps extends ComponentWithVariants {
  id: string;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: ChangeEventHandler<HTMLTextAreaElement>;
  label?: string;
  lang?: string;
  ariaLabel?: string;
  autoComplete?: string;
  autofocus?: boolean;
  name?: string;
  children?: React.ReactNode;
  rows?: number;
  cols?: number;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  tooltip?: string | React.ReactNode;
  required?: boolean;
  valid?: boolean;
  debounce?: boolean;
}

export const Textarea: React.FC<TextareaProps> = (props: TextareaProps) => {
  const [pristine, setPristine] = useState<boolean>(true);
  const t = useT();
  const [touched, setTouched] = useState(false);
  const [internalState, setInternalState] = useState(props?.value);
  const [count, setCount] = useState(0);
  const debouncer = useDebounce();

  useEffect(() => {
    if (
      !touched &&
      internalState === '' &&
      ((typeof props?.value === 'string' && props?.value?.length > 0) ||
        typeof props?.value === 'number')
    ) {
      setInternalState(props.value);
      setCount(props.value.length)
    }
  }, [touched, props?.value, internalState]);

  const countAlertValue = useMemo(() => countAlertCall(props.maxLength, count, t), [props.maxLength, count, t])


  return (
    <StyledTextareaContainer lang={props?.lang}>
      {props.label && (
        <Label htmlFor={props.id}>
          {props.label}
          {props.required ? ` ${t('forms.required')}` : ''}
          {props.tooltip && (
            <StyledTooltip>
              <Tooltip>
                {typeof props.tooltip === 'string' ? (
                  <TooltipP>{props.tooltip}</TooltipP>
                ) : (
                  props.tooltip
                )}
              </Tooltip>
            </StyledTooltip>
          )}
        </Label>
      )}
      <StyledTextarea
        {...props}
        value={props?.debounce ? internalState : props?.value || ''}
        valid={props.valid}
        pristine={pristine}
        onChange={async(e) => {
          setTouched(true);
          if (props?.debounce) {
            setInternalState(e.target.value);
            debouncer(() => {
              props?.onChange(e);
            });
          } else {
            props?.onChange(e);
          }
          setCount(e.target.value.length);
        }}
        onBlur={(e) => {
          if (props?.onBlur) {
            props.onBlur(e);
          }

          setPristine(false);
        }}
        aria-label={props?.ariaLabel}
      />
      {props.maxLength && 
      <StyledCharacterCount>
        {count} / {props.maxLength}
      </StyledCharacterCount>}
      <CountAlert aria-live="assertive" role="region">{countAlertValue}</CountAlert>
    </StyledTextareaContainer>
  );
};
