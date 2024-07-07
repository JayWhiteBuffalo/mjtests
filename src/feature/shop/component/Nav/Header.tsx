import Link from 'next/link'
import "./Header.css";
import {Image} from '@nextui-org/react'
import icon from '../../../../../app/icon.png'
import { siteName } from '@/feature/shared/component/Site';
import { Logo } from '@/feature/shared/component/Site';

export const Header = () => {

    return(
        <>
        <section className='mb-10 h-28  shadow-lg'>
            <div className='flex justify-around items-center bg-lime-100 gap-4 p-6 shadow-lg'>
                <div className='logo'>
                <Link href="/" className="flex flex-row self-start items-center mr-4">
                    <Logo width={60} height={60} className="mr-1" />
                    <div className="text-2xl text-gray-800 font-semibold dark:text-gray-white">
                        {siteName}
                    </div>
                </Link>
                </div>
                <div className='w-1/2 flex gap-24 justify-end items-center p-4 text-xl leading-loose'>
                    <div>
                        <a href={"/"}>
                            Contact
                        </a>
                    </div>
                    <div>
                        <a href='/auth'>
                            <button>Subscriber Login</button>
                        </a>
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}