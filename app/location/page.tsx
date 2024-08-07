import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import { stateData } from '@/util/StateData';

export const Card = ({ i }) => (
  <section
    className={clsx(
      'rounded-xl bg-slate-200 border-gray-500 border',
      'w-64 h-64 p-6 flex flex-col items-stretch justify-evenly',
    )}
  >
    <Link href="/">
      <div className='w-full flex justify-center items-center'>
        <Image
          width={250}
          height={250}
          src={stateData[i].image}
          alt="State Flag"
        />
      </div>
      <div className='w-full text-center'>
        <h2 className='p-4'>{stateData[i].state}</h2>
      </div>
    </Link>
  </section>
);

const Page = async () => {
  return (
    <main className="flex flex-col items-center h-screen bg-slate-100">
      <div className="my-8 px-8">
        <span className="text-xl font-bold">
          Are you a MRB (Marijuana-Related Business) looking to post your products on our website?
        </span>
      </div>
      <div className="my-8 px-8">
        <span className="text-xl font-bold">
          Please select a state/province/country to continue!
        </span>
      </div>
      <div className="flex gap-12 flex-row flex-wrap">
        {stateData.map((item, i) => (
          <Card key={i} i={i} />
        ))}
      </div>
    </main>
  );
};

export default Page;
