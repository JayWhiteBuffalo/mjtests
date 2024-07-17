

const Page = async ({vendor}) => {
  
  return (
    <>
    <main className='w-full max-h-screen flex flex-col gap-4'>
        <header className='w-full flex justify-center items-center'>
            <h1 className='border-1 border-black w-5/6  p-4 text-center'>Dispensaries Name Here</h1>
        </header>
        <div className='flex justify-center items-center'>
            <div className='w-5/6 h-48 bg-slate-300'>
            </div>
        </div>
        <div className='flex items-center justify-center'>
        <section className='grid grid-cols-3 w-5/6 gap-6 '>
            <div className='col-span-1 flex flex-col gap-3'>
                <div className='w-full h-48 bg-slate-400'>
                    <div>

                    </div>
                </div>
                <div className='flex flex-col gap-4 justify-center items-center'>
                    <span>Stars</span>
                    <span> reviews</span>
                </div>
            </div>
            <div className='col-span-2 '>
                <div className='w-full flex flex-col gap-2'>
                    <span>Address: </span>
                    <span> Phone #:</span>
                    <span> E-mail: </span>
                    <div className='flex flex-wrap gap-1'>
                    <span> Flags/Tags </span>
                    <span> Flags/Tags </span>
                    <span> Flags/Tags </span>
                    <span> Flags/Tags </span>
                    <span> Flags/Tags </span>
                    </div>
                </div>
            <div>
                <div className='flex justify-evenly'>
                    <span> Open Hours </span>
                    <button>Directions</button>
                </div>
                <div className='grid grid-flow-row gap-3'>
                    <div className='flex justify-evenly'>
                    <span>Mon: ##:## - ##:##</span>
                    <span>Mon: ##:## - ##:##</span>
                    </div>
                    <div className='flex justify-evenly'>
                    <span>Mon: ##:## - ##:##</span>
                    <span>Mon: ##:## - ##:##</span>
                    </div>
                    <div className='flex justify-evenly'>
                    <span>Mon: ##:## - ##:##</span>
                    <span>Mon: ##:## - ##:##</span>
                    </div>
                    <div className='flex justify-center'>
                    <span>Mon: ##:## - ##:##</span>
                    </div>
                </div>
            </div>
            </div>
        </section>
        </div>
        <section>
            <div className='w-full flex justify-center items-center'>
                <h2 className='border-1 border-black w-5/6  p-4 text-center'>Current Menu</h2>
            </div>
            <div className='w-full flex justify-center items-center'>
                <h3 className='w-5/6  p-4 text-center'> Search found # results, showing # on this page</h3>
            </div>
            <div>
                <span> Product Cards Here </span>
            </div>
        </section>


    </main>
    </>
  )

}

export default Page;