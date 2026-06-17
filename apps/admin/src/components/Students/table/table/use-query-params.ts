import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { queryParamsSchema } from '../core/types';

const useQueryParams = () => {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);
  const parsedQueryParams = useMemo(() => queryParamsSchema.parse(params), [params]);

  return {
    queryParams: parsedQueryParams,
  };
};

export default useQueryParams;
