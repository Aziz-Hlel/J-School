import { useNavigate } from 'react-router';
import z from 'zod';

const useGetParam = (params: { param: string; fallBackRoute: string }) => {
  const parser = z.uuid();
  const validatedParam = parser.safeParse(params.param);
  const navigate = useNavigate();
  if (!validatedParam.success) navigate(params.fallBackRoute);

  return validatedParam.data;
};

export default useGetParam;
