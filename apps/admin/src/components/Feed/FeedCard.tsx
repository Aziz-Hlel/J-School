import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Heart, MoreVertical, Pin, ThumbsUp } from 'lucide-react';

interface FeedCardProps {
  author: {
    name: string;
    initials: string;
    avatarUrl?: string;
  };
  createdAt: string;
  content: string;
  images?: string[];
  likes?: number;
  loves?: number;
}

const FeedCard = ({ author, createdAt, content, images = [], likes = 0, loves = 0 }: FeedCardProps) => {
  const displayImages = images.slice(0, 4);
  const extraImagesCount = images.length > 4 ? images.length - 3 : 0;

  return (
    <Card className='w-full max-w-2xl overflow-hidden rounded-xl'>
      <CardHeader className='flex flex-row items-start justify-between space-y-0 p-4'>
        <div className='flex items-center gap-3'>
          <Avatar className='h-10 w-10 border'>
            <AvatarImage src={author.avatarUrl} alt={author.name} />
            <AvatarFallback className='text-sm font-medium'>{author.initials}</AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-semibold'>{author.name}</span>
            </div>
            <div className='text-muted-foreground flex items-center text-xs'>
              <span>{createdAt}</span>
              <span className='bg-muted-foreground/50 mx-1.5 inline-block h-0.5 w-0.5 rounded-full'></span>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' className='text-muted-foreground h-8 w-8'>
            <Pin className='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='icon' className='text-muted-foreground h-8 w-8'>
            <MoreVertical className='h-4 w-4' />
          </Button>
        </div>
      </CardHeader>

      <CardContent className='p-0'>
        <div className='px-4 pb-3'>
          <p className='text-md leading-relaxed whitespace-pre-wrap'>{content}</p>

          <p className='text-sm leading-relaxed whitespace-pre-wrap'>{content}</p>
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
                <div key={idx} className='bg-muted relative aspect-video sm:aspect-[4/3]'>
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
          <span>{likes} Aime</span>
          <span className='mx-2'>·</span>
          <span>{loves} Adore</span>
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
