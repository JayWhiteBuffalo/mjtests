import {RemoveButton} from '@/feature/shared/component/Form'
import React, { useState } from 'react';

function ComponentToRemove({ id, onRemove, onChange, children }) {
    const [isVisible, setIsVisible] = useState(true);

    const handleRemoveClick = () => {
        setIsVisible(false); // Toggle visibility state locally
        onRemove(id); // Notify parent component to remove this component
        onChange(); // Notify parent component about a change (optional)
        console.log("Hand Remove Click Fired")
    };

    return (
        <>
            {isVisible && (
                <div className='flex w-full'>
                    {children}
                    <RemoveButton onClick={handleRemoveClick}/>
                </div>
            )}
        </>
    );
}

export default ComponentToRemove;