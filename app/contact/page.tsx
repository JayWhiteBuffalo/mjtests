import clsx from 'clsx';
import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { NavBar } from '@/feature/shared/component/NavBar';
import { Header } from '@/feature/shop/component/Nav/Header';
import UserDto from '@/data/UserDto';
import { stateData } from '@/util/StateData';
import Image from 'next/image';
import icon from '@/public/icon.png'
import './contact.css'

export const Card = ({ children }) => (
  <section
    className={clsx(
      'rounded-xl bg-slate-200 border-gray-500 border',
      'w-1/2 h-fit p-6 flex flex-col items-stretch justify-evenly',
    )}
  >
{children}
  </section>
);

const Page = async () => {

  return (
      <main className="contact-main">
        <div className="my-8">
          <span className="text-xl font-bold">
            Are you a MRB (Marijuana-Related Business) looking to post your products on our website?
          </span>
        </div>
        <div className="my-8">
          <span className="text-xl font-bold">
            Please select a state/province/country to continue!
          </span>
        </div>
        <div className="flex gap-12 flex-row flex-wrap items-center justify-center">
          <Card>
            <div className='contact-card'>
              <h1>
                     Are you a patient/consumer reporting a problem with:
              </h1>
              <ul>
                <li>
                  <Image
                    src={icon}
                    width={30}
                    height={30}
                    />
                  an inaccurately posted product?
                </li>
                <li>
                  <Image
                    src={icon}
                    width={30}
                    height={30}
                    />
                  an inaccurately working feature of our website?
                </li>
                <li>
                  <Image
                    src={icon}
                    width={30}
                    height={30}
                    />
                  a dispensary closing temporarily or permanently but their products are still shown on our website?
                </li>
                <li>
                  <Image
                    src={icon}
                    width={30}
                    height={30}
                    />
                  Anything other than what is listed?
                </li>
              </ul>
              <h3><strong>Then please email us at: customerhelp.lmjtm@gmail.com</strong></h3>
            </div>
          </Card>
          <Card>
            <div className='contact-card'>
              <h1> Are you a dispensary that needs to contact us regarding: </h1>
              <ul>
                <li> 
                <Image
                    src={icon}
                    width={30}
                    height={30}
                    />
                    setting an appointment for an onboarding specialist to visit your dispensary and help you with the process of starting your 1-month free trail?</li>
                <li> 
                <Image
                    src={icon}
                    width={30}
                    height={30}
                    />
                    an inaccurately working feature of our website?</li>
                <li> 
                <Image
                    src={icon}
                    width={30}
                    height={30}
                    />
                    suggestions for new features?</li>
                <li>
                <Image
                    src={icon}
                    width={30}
                    height={30}
                    />
                     a change to your business information (location, phone number, license number, etc)?</li>
                <li>
                <Image
                    src={icon}
                    width={30}
                    height={30}
                    />
                     Anything other than what is listed?</li>
              </ul>
              <h3><strong>Then please email us at: customerhelp.lmjtm@gmail.com</strong></h3>
            </div>
          </Card>
          <Card>
            <div className='contact-card'>
              <h1> Are you a grower/processor that needs to contact us regarding: </h1>
              <ul>
                <li> 
                <Image
                    src={icon}
                    width={30}
                    height={30}
                    />
                    an inaccurately working feature of our website?</li>
                <li>
                <Image
                    src={icon}
                    width={30}
                    height={30}
                    />
                     suggestions for new features?</li>
                <li>
                <Image
                    src={icon}
                    width={30}
                    height={30}
                    />
                     A change to our business information (location, phone number, license number, etc)?</li>
                <li>
                <Image
                    src={icon}
                    width={30}
                    height={30}
                    />
                     Anything other than what is listed?</li>
              </ul>
              <h3><strong>Then please email us at: customerhelp.lmjtm@gmail.com</strong></h3>
            </div>
          </Card>
        </div>
      </main>
  );
};

export default Page;
