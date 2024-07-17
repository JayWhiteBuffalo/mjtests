import Link from 'next/link'
import "./Header.css";
import {Image} from '@nextui-org/react'
import icon from '../../../../../app/icon.png'
import { siteName } from '@/feature/shared/component/Site';
import { Logo } from '@/feature/shared/component/Site';
import {AvatarDropdown} from '@/feature/admin/component/Navbar'

export const Header = ({user}) => {
 console.log(user)


    return(
        <>
        <section className=' h-28  shadow-lg'>
            <div className='flex justify-around items-center bg-lime-300 gap-4 p-6 shadow-lg'>
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
                        <a href={"/contact"}>
                            Contact
                        </a>
                    </div>
                    <div>
                        <Link href="/location">Pick a State</Link>
                    </div>
                    <div>
                        {user.loggedIn ? (
                            <div className='flex gap-4'>                               
                             <AvatarDropdown user={user}/>
                             <span>{user.name}</span>
                            </div>
                        ) : (                
                            <a href='/auth'>
                                <button className='px-6 py-2 border-1 border-black rounded-xl'>Login</button>
                            </a>)
                    }

                    </div>
                </div>
            </div>
        </section>
        </>
    )
}