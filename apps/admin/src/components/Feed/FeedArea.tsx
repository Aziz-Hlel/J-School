import { useInfiniteQuery } from '@tanstack/react-query';
import FeedCard from './FeedCard';

const FeedArea = () => {
  const feedData = [
    {
      id: 1,
      author: {
        name: 'School of Excellence',
        initials: 'SE',
        avatarUrl: '/images/avatar.png',
      },
      createdAt: '24 Nov 2025 • 10:30 AM',
      title: 'Happy Birthday',
      content: 'Happy Birthday to all students born in November! May your day be filled with joy and success.',
      images: [
        'https://images.unsplash.com/photo-1573782175368-f64dd9a0b5d8?w=800&q=80',
        'https://images.unsplash.com/photo-1620641788421-7a1c858b0c20?w=800&q=80',
        'https://images.unsplash.com/photo-1528747028452-c4a31df9e24d?w=800&q=80',
        'https://images.unsplash.com/photo-1580587771925-78d918b2ea5e?w=800&q=80',
        'https://images.unsplash.com/photo-1567401893414-09b4b0435604?w=800&q=80',
      ],
      likes: 45,
      loves: 12,
    },
    {
      id: 2,
      author: {
        name: 'Science Club',
        initials: 'SC',
      },
      createdAt: '23 Nov 2025 • 2:15 PM',
      title: 'Science Fair',
      content: 'Our students participating in the National Science Fair. Proud moment!',
      images: ['https://images.unsplash.com/photo-1694876873094-4e7c9d0b0b38?w=800&q=80'],
      likes: 34,
      loves: 8,
    },
    {
      id: 3,
      author: {
        name: 'Sports Department',
        initials: 'SD',
      },
      createdAt: '22 Nov 2025 • 4:00 PM',
      title: 'Congratulations',
      content: 'Congratulations to our football team for winning the district championship!',
      likes: 67,
      loves: 18,
    },
    {
      id: 4,
      author: {
        name: 'Music Society',
        initials: 'MS',
      },
      createdAt: '21 Nov 2025 • 11:00 AM',
      title: 'Annual Music Concert',
      content: "Annual Music Concert tickets are now available for purchase. Don't miss it!",
      images: ['https://images.unsplash.com/photo-1506157786151-b84915b07b44?w=800&q=80'],
      likes: 29,
      loves: 7,
    },
    {
      id: 5,
      author: {
        name: 'Library Team',
        initials: 'LT',
      },
      createdAt: '20 Nov 2025 • 3:30 PM',
      title: 'New Arrivals in the Library',
      content: 'New arrivals in the library! Check out the latest collection of fiction and non-fiction books.',
      images: [
        'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80',
        'https://images.unsplash.com/photo-1581633762216-a7b865b1a48b?w=800&q=80',
        'https://images.unsplash.com/photo-1558769132-cb1bb8ac3603?w=800&q=80',
      ],
      likes: 42,
      loves: 9,
    },
    {
      id: 6,
      author: {
        name: "Principal's Desk",
        initials: 'PD',
      },
      createdAt: '19 Nov 2025 • 9:00 AM',
      title: "Principal's Message",
      content: 'A message to all parents regarding the upcoming Parent-Teacher Conference.',
      likes: 89,
      loves: 25,
    },
    {
      id: 7,
      author: {
        name: 'Mathematics Department',
        initials: 'MD',
      },
      createdAt: '18 Nov 2025 • 1:00 PM',
      title: 'Weekly Mathematics Challenge Winners',
      content:
        'Weekly Mathematics challenge winners announced! Congratulations to the following students:\n1. John Doe (Grade 10) - 15/15\n2. Jane Smith (Grade 9) - 14/15\n3. Alex Johnson (Grade 10) - 14/15',
      likes: 55,
      loves: 14,
    },
  ];

  //   const { data, isLoading } = useInfiniteQuery({
  //     queryKey: ['posts'],
  //     initialPageParam: null,
  //     queryFn: async () =>
  //   });

  const posts = [];
  return (
    <div className='mx-auto flex w-full flex-col items-center gap-6'>
      {feedData.map((post) => (
        <FeedCard key={post.id} {...post} />
      ))}
      <footer />
    </div>
  );
};

export default FeedArea;
