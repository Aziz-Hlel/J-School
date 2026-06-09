import { Badge } from '@/components/ui/badge';
import type { Gender } from '@repo/contracts/types/enums/enums';
import type { TableRowType } from '../../../core/types';
import { GENDER_VARIANTS } from './gender-variants';

export type GenderType = TableRowType['gender'];

const GenderComponent = ({ value }: { value: Gender }) => {
  const variant = GENDER_VARIANTS[value];

  if (!variant) {
    return null; // or a fallback badge
  }

  const Icon = variant.Icon;
  const textMapping = value;
  return (
    <div className='flex items-center gap-2'>
      <Badge className={variant.className} variant='outline'>
        <Icon className='h-4 w-4' />
        <span>{textMapping}</span>
      </Badge>
    </div>
  );
};

export default GenderComponent;
