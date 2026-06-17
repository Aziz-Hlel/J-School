import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { FeedResponse } from '@repo/contracts/schemas/Feed/response';
import dayjs from 'dayjs';
import { Heart, MoreVertical, SquarePen, ThumbsUp, Trash2 } from 'lucide-react';
import { useSelectedRow } from './context/selected-row-provider';

const FeedCard = (params: FeedResponse) => {
  const {
    createdAt,
    title,
    description,
    media = [],
    reactions = { likesCount: 0, heartsCount: 0, userReaction: null },
  } = params;
  const images = media.filter((m) => m.type === 'IMAGE').map((m) => m.url);
  const displayImages = images.slice(0, 4);
  const extraImagesCount = images.length > 4 ? images.length - 3 : 0;
  const { handleDialogStateChange } = useSelectedRow();

  return (
    <Card className='w-full max-w-2xl overflow-hidden rounded-xl'>
      <CardHeader className='flex flex-row items-start justify-between space-y-0 p-4'>
        <div className='flex items-center gap-3'>
          <Avatar className='h-10 w-10 border'>
            <AvatarImage alt={'System'} />
            <AvatarFallback className='text-sm font-medium'>Sys</AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-semibold'>System</span>
            </div>
            <div className='text-muted-foreground flex items-center text-xs'>
              <span>{dayjs(createdAt).format('DD MMM YYYY [at] HH:mm')}</span>
              <span className='bg-muted-foreground/50 mx-1.5 inline-block h-0.5 w-0.5 rounded-full'></span>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='text-muted-foreground h-8 w-8'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-36'>
              <DropdownMenuItem
                onClick={() => {
                  handleDialogStateChange({ openDialog: 'edit', selectedRow: params });
                }}
              >
                <SquarePen className='mr-2 h-4 w-4 text-green-600' />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleDialogStateChange({ openDialog: 'delete', selectedRow: params });
                }}
                className='text-destructive focus:text-destructive'
              >
                <Trash2 className='mr-2 h-4 w-4 text-red-600' />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className='p-0'>
        <div className='px-4 pb-3'>
          <p className='text-md leading-relaxed font-bold whitespace-pre-wrap'>{title}</p>

          <p className='text-sm leading-relaxed whitespace-pre-wrap'>{description}</p>
        </div>

        {images.length > 0 && (
          <div className='px-4 pb-4'>
            <div
              className={`grid gap-1.5 overflow-hidden rounded-xl ${
                images.length === 1
                  ? 'grid-cols-1'
                  : images.length === 2
                    ? 'grid-cols-2'
                    : images.length === 3
                      ? 'grid-cols-2'
                      : 'grid-cols-2'
              }`}
            >
              {displayImages.map((img, idx) => (
                <div key={idx} className='bg-muted relative aspect-video sm:aspect-4/3'>
                  <img src={img} alt={`Attachment ${idx + 1}`} className='h-full w-full object-cover' />
                  {idx === 3 && extraImagesCount > 0 && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px]'>
                      <span className='text-2xl font-medium text-white'>+{extraImagesCount}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='text-muted-foreground flex items-center justify-end px-4 py-2 text-xs'>
          <span>{reactions.likesCount} Aime</span>
          <span className='mx-2'>·</span>
          <span>{reactions.heartsCount} Adore</span>
        </div>
      </CardContent>

      <CardFooter className='flex items-center justify-center gap-1 border-t p-2'>
        <Button variant='ghost' className='text-muted-foreground h-10 flex-1'>
          <ThumbsUp className='mr-2 h-4 w-4' />
          J'aime
        </Button>
        <Button variant='ghost' className='text-muted-foreground h-10 flex-1'>
          <Heart className='mr-2 h-4 w-4' />
          J'adore
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeedCard;
