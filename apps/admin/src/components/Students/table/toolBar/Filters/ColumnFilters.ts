import type { TableRowType } from '@/components/Students/core/types';
import { Gender, StudentStatus } from '@repo/contracts/types/enums/enums';

export type ColumnFilter<T extends keyof TableRowType> = {
  columnId: T;
  title: string;
  options: {
    label: string;
    value: TableRowType[T];
    icon?: React.ComponentType<{ className?: string }>;
  }[];
};

const statusFilterData: ColumnFilter<'status'> = {
  columnId: 'status',
  title: 'Status',
  options: Object.values(StudentStatus).map((key) => ({
    label: key,
    value: key,
  })),
};

const genderFilterData: ColumnFilter<'gender'> = {
  columnId: 'gender',
  title: 'Gender',
  options: Object.values(Gender).map((key) => ({
    label: key,
    value: key,
  })),
};

const tableFilters = [statusFilterData, genderFilterData];

export default tableFilters;
