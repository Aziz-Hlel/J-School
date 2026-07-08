import { extraCurricularService } from '@/api/service/extracurricularsService';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import type { Cursor } from '@repo/contracts/schemas/cursor/cursorResponse';
import type { PostResponse } from '@repo/contracts/schemas/extraCurricular/post/postResponse';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import FeedCard from './FeedCard';

const ExtraCurricularFeed = () => {
  const schoolId = useCurrentSchoolId();

  const { extraCurricularId: id } = useParams();

  const extraCurricularId = id!;

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<
    Cursor<PostResponse>,
    Error,
    { pages: Cursor<PostResponse>[]; pageParams: (string | null)[] },
    string[],
    string | null
  >({
    queryKey: ['extra-curricular', extraCurricularId, 'feed'],
    initialPageParam: null,

    queryFn: ({ pageParam }) =>
      extraCurricularService.post.getCursor({
        schoolId,
        id: extraCurricularId,
        cursor: pageParam,
      }),

    getNextPageParam: (lastPage) => lastPage.meta.nextCursor,

    initialData: {
      pages: [],
      pageParams: [],
    },
  });

  const posts = data?.pages.flatMap((page) => page.items) ?? [];

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '300px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className='mx-auto flex w-full flex-col items-center gap-6 p-6'>
      {posts.map((post) => (
        <FeedCard key={post.id} {...post} />
      ))}

      {hasNextPage && (
        <div className='flex w-full items-center justify-center py-4'>
          {isFetchingNextPage ? <Loader2 className='text-primary h-8 w-8 animate-spin' /> : <div ref={loadMoreRef} />}
        </div>
      )}
    </div>
  );
};

export default ExtraCurricularFeed;
