


// export const getRoute = async () => [
//     {
//       Icon: HiHome,
//       name: 'Sign-in',
//       segment: 'sign-in',
//     },
//   ]

import {Button, Divider, Input, LinkIcon} from '@nextui-org/react'
import Link from 'next/link'

const Page = async () => {

    return(
<>
<Divider orientation="horizontal" />
    <main className='flex justify-center'>
        <section className='flex gap-8 justify-center items-center w-3/4 p-8'>
            <div className='flex-1 flex-col gap-8 justify-center items-center'>
                <div>
                    <h1>
                        Log In
                    </h1>
                </div>
                <div>
                    <form className='flex flex-col gap-4'>
                        <div>
                            <Input type='email' isRequired label="Email" className="max-w-xs"/>
                        </div>
                        <div>
                            <Input type='password' isRequired label="Password" className="max-w-xs"/>
                        </div>
                        <div>
                            <Button  className="max-w-xs">Log In</Button>
                        </div>
                    </form>
                </div>
                <div>
                    {/* <BlueLink>Forgot Password?</BlueLink> */}
                </div>
            </div>
            <Divider orientation="vertical" />
            <div className='flex-1'>
                <p>Don't have an account with us? Join the largest Distributor and Producer network in Oklahoma by clicking below!</p>
                <Link href="business">
                    <Button>Sign Up</Button>
                </Link>
            </div>
        </section>
    </main>

</>
    )
}

export default Page;