import { useState, useEffect } from 'react';

const breakpoints = {
  mobile: 800,
  tablet: 975,
  desktop: 1024,
  largeDesktop: 1440,
};

const getDeviceConfig = (width) => {
  if (width < breakpoints.mobile) {
    return 'mobile';
  } else if (width < breakpoints.tablet) {
    return 'tablet';
  } else if (width < breakpoints.desktop) {
    return 'desktop';
  } else {
    return 'largeDesktop';
  }
};

const useViewport = () => {
  const [viewport, setViewport] = useState(getDeviceConfig(window.innerWidth));

  useEffect(() => {
    const handleWindowResize = () => {
      setViewport(getDeviceConfig(window.innerWidth));
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return { viewport };
};

export default useViewport;
