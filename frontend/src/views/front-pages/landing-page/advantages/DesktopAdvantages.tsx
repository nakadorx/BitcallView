import React, { useRef, useState, useEffect } from 'react'
import { Box, Container, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material'
const DesktopAdvantages = ({ data }) => {
  // Constants
  const EXTRA_TOP_SPACE = 20
  const NAV_HEIGHT = 80 + EXTRA_TOP_SPACE
  const theme = useTheme()

  const containerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [videoOpacity, setVideoOpacity] = useState(1)
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 })
  const itemRefs = useRef([])

  // Returns the height of one section (viewport height minus the nav).
  const getStickyHeight = () => window.innerHeight - NAV_HEIGHT

  // Fade out the video when activeIndex changes.
  useEffect(() => {
    setVideoOpacity(1)
  }, [activeIndex])

  // Update indicator style based on the active item.
  useEffect(() => {
    const currentItem = itemRefs.current[activeIndex]
    if (currentItem) {
      setIndicatorStyle({
        top: currentItem.offsetTop,
        height: currentItem.offsetHeight
      })
    }
  }, [activeIndex])

  // Click handler: update active index.
  const handleClick = index => {
    setActiveIndex(index)
  }

  return (
    <Box ref={containerRef} sx={{ position: 'relative' }}>
      <Box sx={{ position: 'relative', height: 'auto' }}>
        <Container sx={{ height: 'auto' }}>
          <Grid container>
            {/* Left Column with moving indicator */}
            <Grid
              item
              xs={5}
              sx={{
                p: 3,
                position: 'relative'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: -6,
                  width: 6,
                  bgcolor: 'primary.main',
                  top: indicatorStyle.top,
                  height: indicatorStyle.height,
                  borderRadius: 3,
                  transition: 'top 0.3s ease-out, height 0.3s ease-out'
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3
                }}
              >
                {data.map((item, index) => (
                  <Box
                    key={index}
                    ref={el => {
                      if (el) itemRefs.current[index] = el
                    }}
                    onClick={() => handleClick(index)}
                    sx={{
                      cursor: 'pointer',
                      px: 2,
                      py: 2,
                      transition: 'background-color 0.3s ease, transform 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        transform: 'scale(1.02)'
                      },
                      backgroundColor:
                        activeIndex === index && theme.palette.mode === 'light'
                          ? 'rgba(232,245,238,0.8)'
                          : activeIndex === index && theme.palette.mode === 'dark'
                            ? 'action.hover'
                            : 'transparent',
                      borderRadius: 'var(--btn-border-radius)'
                    }}
                  >
                    <Typography
                      variant='subtitle1'
                      sx={{
                        fontSize: activeIndex === index ? '1.39rem' : '1.2rem',
                        color: activeIndex === index ? 'primary.main' : 'text.primary',
                        fontFamily: 'Coolvetica',
                        transition: 'font-size 0.3s ease'
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant='body1'
                      sx={{
                        pl: 0.5,
                        lineHeight: 1.3,
                        fontFamily: 'Roboto',
                        fontSize: activeIndex === index ? '1.15rem' : '0.98rem'
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Right Column: Responsive Video Display */}
            <Grid
              item
              xs={7}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  backgroundColor: 'transparent', // Changed from 'black' to 'transparent' or use a matching color.
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box
                  component='video'
                  key={activeIndex} // Forces re-mount on activeIndex change.
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload='auto'
                  poster={data[activeIndex].poster} // Optional: specify a poster image.
                  onCanPlay={() => setVideoOpacity(1)}
                  sx={{
                    width: '100%',
                    height: 'auto', // Fill the container.
                    objectFit: 'cover',
                    opacity: videoOpacity,
                    transition: 'opacity 0.5s ease-in-out'
                  }}
                >
                  <source src={data[activeIndex].video} type='video/mp4' />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default DesktopAdvantages
