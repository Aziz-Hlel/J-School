import BreadcrumbHeader from '@/pages/Header';

const Assignments = () => {
  return (
    <div>
      <BreadcrumbHeader breadcrumbs={[{ title: 'Assignments', href: '/assignments' }]} />
      <div className='mx-auto w-full'></div>
    </div>
  );
};
export default Assignments;
