import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@repo/contracts/types/enums/enums';
import type { TableRowType } from '../../../core/types';
import { STATUS_VARIANTS } from './roles-variants';

export type RoleType = TableRowType['roles'][number]['role'];

const RolesComponent = ({ value }: { value: UserRole }) => {
  const variant = STATUS_VARIANTS[value];

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

export default RolesComponent;
