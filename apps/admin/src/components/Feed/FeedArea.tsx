import { feedService } from '@/api/service/feedService';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import type { Cursor } from '@repo/contracts/schemas/cursor/cursorResponse';
import type { FeedResponse } from '@repo/contracts/schemas/Feed/response';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import FeedCard from './FeedCard';

const FeedArea = () => {
  const schoolId = useCurrentSchoolId();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<
    Cursor<FeedResponse>,
    Error,
    { pages: Cursor<FeedResponse>[]; pageParams: (string | null)[] },
    string[],
    string | null
  >({
    queryKey: ['feed'],
    initialPageParam: null,

    queryFn: ({ pageParam }) =>
      feedService.getCursor({
        schoolId,
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
    <div className='mx-auto flex w-full flex-col items-center gap-6'>
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

export default FeedArea;
