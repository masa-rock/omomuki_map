import React, { createContext, useMemo } from 'react';
import useMedia from 'use-media';

const mediaQueries = {
  mobile: '(max-width: 449px)',
  tablet: '(min-width: 450px) and (max-width: 959px)',
  pc: '(min-width: 960px)'
}

export const MediaQueryContext = createContext({
  isMobileSite: false,
  isTabletSite: false,
  isPcSite: true
})

export const MediaQueryProvider = ({children}) => {
  const isMobileSite = useMedia(mediaQueries.mobile)
  const isTabletSite = useMedia(mediaQueries.tablet)
  const isPcSite = useMedia(mediaQueries.pc)
  const value = useMemo(() =>({ isMobileSite, isTabletSite, isPcSite }),[
    isMobileSite,
    isTabletSite,
    isPcSite
  ])

  return(
    <MediaQueryContext.Provider value={value}>
      {children}
    </MediaQueryContext.Provider>
  )
}
