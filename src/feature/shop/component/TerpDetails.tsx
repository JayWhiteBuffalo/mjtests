import React, { useState } from 'react';
import { TerpItem } from '@/feature/shop/component/ProductList';
import clsx from 'clsx'

const TerpsDetails = ({ terpEntries, viewport }) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (

        <>
            {terpEntries.length && showMore ? (
                <div className='flex flex-col items-start px-2'>
                    <button onClick={toggleShowMore} className=" py-1 ">
                        {showMore ? 'Show Less' : 'More Terps'}
                    </button>
                    <ul className={clsx(
                        {
                          'py-1 border-gray-400 border-t grid grid-cols-2 col-auto gap-4 items-start mt-2': viewport === 'mobile',
                          'tablet-class': viewport === 'tablet',
                          'py-1 border-gray-400 border-t grid grid-cols-6 col-auto gap-4 items-start mt-2': viewport === 'desktop',
                        }
                      
                    )}>
                        {terpEntries.map(([terpName, value]) => (
                        <TerpItem key={terpName} terpName={terpName} value={value} />
                        ))}
                    </ul>
                </div>
            ) : (
                <div className='flex flex-col items-start px-2'>
                                    {terpEntries.length > 6 && (
                  <button onClick={toggleShowMore} className=" py-1  ">
                    {showMore ? 'Show Less' : 'More Terps'}
                  </button>
                )}
                                    <ul className={clsx(
                        {
                          'py-1 border-gray-400 border-t grid grid-cols-2 col-auto gap-4 items-start mt-2': viewport === 'mobile',
                          'tablet-class': viewport === 'tablet',
                          '"py-1 border-gray-400 border-t grid grid-cols-6 col-auto gap-4 items-start mt-2"': viewport !== 'mobile',
                        }
                      
                    )}>
                  {terpEntries.slice(0, 6).map(([terpName, value]) => (
                    <TerpItem key={terpName} terpName={terpName} value={value} />
                  ))}
                </ul>
              </div>
            )}
        </>
  );
};

export default TerpsDetails;
