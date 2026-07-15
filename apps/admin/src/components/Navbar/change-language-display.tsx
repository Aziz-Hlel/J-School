import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTranslation } from 'react-i18next';

const usSvg = 'https://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg';
const frSvg = 'https://purecatamphetamine.github.io/country-flag-icons/3x2/FR.svg';

const ChangeLanguageSisplay = () => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language || 'en';
  const isFrench = currentLanguage.startsWith('fr');

  const languages = [
    { code: 'en', label: 'English', flag: usSvg, alt: 'United States' },
    { code: 'fr', label: 'Français', flag: frSvg, alt: 'France' },
  ];

  const currentLangObj = isFrench ? languages[1] : languages[0];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='hover:bg-accent hover:text-accent-foreground flex h-9 items-center gap-2 rounded-md px-2'
        >
          <Avatar className='h-5 w-5 rounded-sm'>
            <AvatarImage src={currentLangObj.flag} alt={currentLangObj.alt} className='object-cover' />
            <AvatarFallback className='rounded-sm text-[10px]'>{currentLangObj.code.toUpperCase()}</AvatarFallback>
          </Avatar>
          {/* <span className='text-sm font-medium uppercase'>{currentLangObj.code}</span> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-40 p-1' align='end'>
        <div className='flex flex-col gap-1'>
          {languages.map((lang) => {
            const isSelected = (lang.code === 'fr' && isFrench) || (lang.code === 'en' && !isFrench);
            return (
              <Button
                key={lang.code}
                variant={isSelected ? 'secondary' : 'ghost'}
                size='sm'
                className='flex h-8 w-full items-center justify-start gap-2 px-2 py-1.5 font-normal'
                onClick={() => handleLanguageChange(lang.code)}
              >
                <Avatar className='h-4 w-4 rounded-sm'>
                  <AvatarImage src={lang.flag} alt={lang.alt} className='object-cover' />
                  <AvatarFallback className='rounded-sm text-[8px]'>{lang.code.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className='flex-1 text-left text-sm'>{lang.label}</span>
                {isSelected && <span className='bg-primary h-1.5 w-1.5 rounded-full' />}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ChangeLanguageSisplay;
