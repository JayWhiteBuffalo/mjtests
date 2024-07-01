import Link from 'next/link'
import "./Header.css";
import {Image} from '@nextui-org/react'

export const Header = () => {

    return(
        <>
        <section className=' h-16'>
            <div className='flex justify-around items-center bg-slate-300 gap-4 p-8 '>
                <div className='logo'>
                <Image
                    src="../public/icon.png"
                    // width={50}
                    // height={50}
                    alt="Picture of the Logo"
                />
                </div>
                <div>
                    <h1>MJTests</h1>
                </div>
                <div>
                    <a href={"/"}>
                        Contact
                    </a>
                </div>
                <div>
                    <a href='/'>
                        <button>Subscriber Login</button>
                    </a>
                </div>
            </div>
        </section>
        </>
    )
}