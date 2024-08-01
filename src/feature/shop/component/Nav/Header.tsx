'use client'
import Link from 'next/link'
import "./Header.css";
import {Image} from '@nextui-org/react'
import icon from '../../../../../app/icon.png'
import { siteName } from '@/feature/shared/component/Site';
import { Logo } from '@/feature/shared/component/Site';
import {AvatarDropdown} from '@/feature/admin/component/Navbar'
import MobileNav from '@/feature/shop/component/Nav/MobileNav'


export const Header = ({user}) => {

    return(
        <>
            <div className='flex justify-around items-center bg-lime-300 gap-4 shadow-lg'>
                <MobileNav user={user}/>
            </div>
        </>
    )
}