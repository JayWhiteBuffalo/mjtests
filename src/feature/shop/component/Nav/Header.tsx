'use client'
import Link from 'next/link'
import { Image } from '@nextui-org/react'
import icon from '../../../../../app/icon.png'
import { siteName, Logo } from '@/feature/shared/component/Site'
import { AvatarDropdown } from '@/feature/admin/component/Navbar'
import MobileNav from '@/feature/shop/component/Nav/MobileNav'
import { useEffect, useState } from 'react'
import UserDto from '@/data/UserDto'
import './Header.css'

export const Header = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/users')
                const data = await response.json()
                setUser(data)
            } catch (error) {
                console.error('Failed to fetch user:', error)
                setUser(null)
            }
        }

        fetchUser()
    }, [])


    return(
        <div className='flex justify-around items-center bg-lime-300 gap-4 shadow-lg'>
            <MobileNav user={user} />
        </div>
    )
}
