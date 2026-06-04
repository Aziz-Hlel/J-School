import { Button } from '@/components/ui/button';
import { createClassroomRequestSchema } from '@repo/contracts/schemas/classroom/createClassRequest';

const Homepage = () => {
  const data = createClassroomRequestSchema.parse({
    name: 'Classroom 1',
    description: 'Classroom 1 description',
    grade: 'KG',
  });
  return (
    <div className=' '>
      <div className='text-9xl'>Hompage {data.name}</div>
      <Button className=' '>Button</Button>
    </div>
  );
};

export default Homepage;
