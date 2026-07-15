import { useLocalStorage, usePreferredLanguage } from '@uidotdev/usehooks';
import type React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const InitLanguage = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();
  const browserPreferredlanguage = usePreferredLanguage();
  const [preferredLanguage] = useLocalStorage('language', null);

  useEffect(() => {
    if (preferredLanguage) {
      i18n.changeLanguage(preferredLanguage);
      return;
    }
    if (i18n.languages.includes(browserPreferredlanguage)) {
      i18n.changeLanguage(browserPreferredlanguage);
    }
  });

  return children;
};

export default InitLanguage;
