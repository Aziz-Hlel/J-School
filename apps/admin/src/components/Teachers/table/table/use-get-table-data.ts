import { useCurrentSchoolId } from '@/context/SchoolContext';
import type { Pageable } from '@repo/contracts/schemas/page/Pageable';
import { useQuery } from '@tanstack/react-query';
import { MODULE_NAME_PLURAL } from '../core/core';
import { operations } from '../core/services';
import type { TableRowType } from '../core/types';
import useQueryParams from './use-query-params';

const blankPagination: Pageable = {
  size: 0,
  number: 0,
  totalElements: 0,
  totalPages: 0,
  offset: 0,
  pageSize: 0,
};

const useGetTableData = () => {
  const { queryParams } = useQueryParams();
  const adjustedQueryParams = {
    ...queryParams,
    page: queryParams.page,
    gender: queryParams.gender.length > 0 ? queryParams.gender.join(',') : '',
  };
  const schoolId = useCurrentSchoolId();
  const { data, isFetching } = useQuery({
    queryKey: [MODULE_NAME_PLURAL, { ...queryParams }],
    queryFn: async () => await operations.getPage.fn(schoolId, adjustedQueryParams),
    placeholderData: (previousData) => previousData,
  });

  const tableData: TableRowType[] = data?.data ?? [];
  const pagination = data?.pagination ?? blankPagination;

  return { tableData, pagination, isLoading: isFetching };
};

export default useGetTableData;
