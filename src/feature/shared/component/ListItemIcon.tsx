import Image from 'next/image';
import icon from '@/public/icon.png'

export const ListItemIcon = ({children}) => {
    return(
        <>
        <div className='flex gap-1'>
            <div className='m-w-24 m-h-24 border-2 border-black'>
                <Image
                src={icon}
                width={72}
                height={72} 
                />
            </div>
        {children}
        </div>
</>
    )

}