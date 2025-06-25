export const containerBGSX = (backgroundImage: string, backGroudnIsAnimatedOnMobile: boolean) => {
  return {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pt: { xs: '1.2rem', sm: '2rem' },
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: '110%',
    // backgroundPosition: `center ${scrollY * 0.9}px`,
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'scroll',
    // transform: `translateZ(0) translateY(${scrollY * 0.3}px)`,
    animation: {
      xs: backGroudnIsAnimatedOnMobile ? 'heroBackgroundFloat 20s ease-in-out infinite' : 'none',
      md: 'heroBackgroundFloat 20s ease-in-out infinite'
    },
    transition: 'transform 0.1s ease-out',
    '@keyframes heroBackgroundFloat': {
      '0%, 100%': {
        backgroundSize: '110%',
        backgroundPosition: 'center center'
      },
      '25%': {
        backgroundSize: '115%',
        backgroundPosition: 'left center'
      },
      '50%': {
        backgroundSize: '112%',
        backgroundPosition: 'center top'
      },
      '75%': {
        backgroundSize: '118%',
        backgroundPosition: 'right center'
      }
    }
  }
}
