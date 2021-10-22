import { ParsedUrlQuery } from 'node:querystring';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { EntryFormHook } from '.';
import { Categories } from '../../../../config/categories';
import { defaultLanguage, Language } from '../../../../config/locale';
import { ApiCall, useApiCall } from '../../../../lib/api';
import { CategoryEntry, Translation } from '../../../../lib/api/types/general';
import { Category, useEntry, useMutateList } from '../../../../lib/categories';
import { useT } from '../../../../lib/i18n';
import { getTranslation } from '../../../../lib/translations';
import { useOrganizerId } from '../../../../lib/useOrganizer';
import { EntryFormHead } from '../../../EntryForm/EntryFormHead';
import { Input, InputType } from '../../../input';
import { useUser } from '../../../user/useUser';
import { FormGrid, FormItem, FormItemWidth } from '../formComponents';

interface SetNameProps {
  label: string;
  ariaLabel?: string;
  onSubmit: (e?: FormEvent) => Promise<void>;
  pristine: boolean;
  setPristine: (pristine: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  name: string;
  required?: boolean;
  valid?: boolean;
  hint?: boolean;
}

const Name: React.FC<SetNameProps> = ({
  label,
  ariaLabel,
  onSubmit,
  pristine,
  setPristine,
  setValue,
  name,
  value,
  required,
  hint,
}: SetNameProps) => {
  // set initial value
  useEffect(() => {
    if (pristine) {
      setValue(name);
    }
  }, [pristine, name, setValue]);

  return (
    <form onSubmit={onSubmit}>
      <Input
        label={label}
        ariaLabel={ariaLabel}
        type={InputType.text}
        value={value || ''}
        onChange={(e) => {
          setPristine(false);
          setValue(e.target.value);
        }}
        required={required}
        hint={hint}
      />
    </form>
  );
};

export const useName = <
  EntryType extends CategoryEntry,
  EntryShowCallType extends ApiCall,
  TranslationType extends Translation
>(props: {
  category: Category;
  query: ParsedUrlQuery;
  language: Language;
  label: string;
  ariaLabel?: string;
  loaded: boolean;
  showHint: boolean;
}): {
  form: React.ReactElement;
  onSubmit: (e?: FormEvent) => Promise<void>;
  pristine: boolean;
  reset: () => void;
  valid: boolean;
  value: string;
} => {
  const { category, query, language, label, ariaLabel, loaded, showHint } = props;

  const { entry, mutate } = useEntry<EntryType, EntryShowCallType>(category, query);
  const organizerId = useOrganizerId();
  const mutateList = useMutateList(
    category,
    category.name === Categories.location
      ? [['organizer', organizerId]]
      : category.name === Categories.offer
      ? [['organizers', organizerId]]
      : undefined
  );
  const call = useApiCall();
  const entryTranslation = getTranslation<TranslationType>(
    language,
    entry?.data?.relations?.translations as TranslationType[],
    false
  );
  const name = useMemo(() => entryTranslation?.attributes?.name, [
    entryTranslation?.attributes?.name,
  ]);
  const [value, setValue] = useState(name || '');
  const [pristine, setPristine] = useState(true);
  const { mutateUserInfo } = useUser();

  useEffect(() => {
    if (pristine && name !== value) {
      setValue(name);
    }
  }, [pristine, name, value]);

  const required = useMemo(() => language === defaultLanguage, [language]);

  const valid = useMemo(() => required !== true || (value && value.length > 0), [required, value]);

  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (valid && !pristine) {
      try {
        const resp = await call(category.api.update.factory, {
          entry: {
            relations: {
              translations: [
                {
                  attributes: {
                    name: value,
                    language,
                  },
                },
              ],
            },
          },
          id: entry?.data?.id,
        });

        if (resp.status === 200) {
          mutate();
          mutateList();
          mutateUserInfo();
          setTimeout(() => setPristine(true), 500);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const hint = useMemo(() => showHint && loaded && (!value || value?.length < 1), [
    showHint,
    loaded,
    value,
  ]);

  return {
    form: (
      <Name
        {...{
          pristine,
          setPristine,
          value,
          setValue,
          label,
          ariaLabel,
          onSubmit,
          name,
          required,
          valid,
          hint,
        }}
      />
    ),
    onSubmit,
    pristine,
    reset: () => {
      setValue(name);
      setPristine(true);
    },
    valid,
    value,
  };
};

export const useNameForm: EntryFormHook = (
  { category, query },
  loaded,
  showHint,
  title?: string,
  tooltip?: string
) => {
  const t = useT();

  const {
    form: setNameGerman,
    onSubmit: onSubmitGerman,
    pristine: pristineGerman,
    reset: resetGerman,
    valid: validGerman,
    value: valueGerman,
  } = useName({
    category,
    query,
    language: Language.de,
    label: t('forms.labelGerman') as string,
    ariaLabel: title
      ? `${title} ${t('forms.labelGerman')}`
      : `${t('forms.name')} ${t('forms.labelGerman')}`,
    loaded,
    showHint,
  });

  const {
    form: setNameEnglish,
    onSubmit: onSubmitEnglish,
    pristine: pristineEnglish,
    reset: resetEnglish,
    valid: validEnglish,
    value: valueEnglish,
  } = useName({
    category,
    query,
    language: Language.en,
    label: t('forms.labelEnglish') as string,
    ariaLabel: title
      ? `${title} ${t('forms.labelEnglish')}`
      : `${t('forms.name')} ${t('forms.labelEnglish')}`,
    loaded,
    showHint,
  });

  const pristine = useMemo(() => Boolean(pristineGerman && pristineEnglish), [
    pristineEnglish,
    pristineGerman,
  ]);

  const valid = useMemo(() => !loaded || Boolean(validGerman && validEnglish), [
    loaded,
    validEnglish,
    validGerman,
  ]);

  const hint = useMemo(
    () =>
      showHint &&
      loaded &&
      (typeof valueEnglish === 'undefined' ||
        typeof valueGerman === 'undefined' ||
        valueEnglish?.length < 1 ||
        valueGerman?.length < 1),
    [showHint, loaded, valueEnglish, valueGerman]
  );

  return {
    renderedForm: (
      <div>
        <EntryFormHead
          title={title || `${t('forms.name') as string}`}
          valid={valid}
          hint={hint}
          tooltip={tooltip}
        />
        <FormGrid>
          <FormItem width={FormItemWidth.half}>{setNameGerman}</FormItem>
          <FormItem width={FormItemWidth.half}>{setNameEnglish}</FormItem>
        </FormGrid>
      </div>
    ),
    submit: async () => {
      onSubmitEnglish();
      onSubmitGerman();
    },
    pristine,
    reset: () => {
      resetGerman();
      resetEnglish();
    },
    valid,
    hint,
  };
};
