import React, { useRef, useState, useEffect } from 'react'
import { Box, Container, Typography } from '@mui/material'

const MobileAdvantages = ({ data }) => {
  const NAV_HEIGHT = 80

  const [activeIndex, setActiveIndex] = useState(0)
  const [videoOpacity, setVideoOpacity] = useState(1)
  const carouselRef = useRef(null)
  const videoRefs = useRef([])

  // Fade-in effect for video when active slide changes.
  useEffect(() => {
    setVideoOpacity(0)
    const timer = setTimeout(() => setVideoOpacity(1), 50)
    return () => clearTimeout(timer)
  }, [activeIndex])

  // Horizontal scroll for active video.
  useEffect(() => {
    if (!carouselRef.current) return
    const container = carouselRef.current
    const children = container.children
    if (!children || !children[activeIndex]) return

    const activeChild = children[activeIndex]
    const containerWidth = container.offsetWidth
    // Scroll so that the active video is aligned.
    let targetScroll = activeChild.offsetLeft
    if (activeIndex === data.length - 1 && activeIndex > 0) {
      targetScroll = activeChild.offsetLeft - (containerWidth - activeChild.offsetWidth)
    }
    container.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }, [activeIndex, data.length])

  // Control video playback: play only the active video, pause others.
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === activeIndex) {
          video.play().catch(err => console.error(err))
        } else {
          video.pause()
        }
      }
    })
  }, [activeIndex])

  // Handle text click to change active index and scroll page.
  const handleTextClick = index => {
    setActiveIndex(index)
    if (carouselRef.current) {
      // Calculate target position minus an extra offset to account for the sticky navbar.
      const offset = NAV_HEIGHT + 20
      const elementPosition = carouselRef.current.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' })
    }
  }

  return (
    <Box sx={{ backgroundColor: 'background.paper', mb: 4 }}>
      <Box
        ref={carouselRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          gap: 2,
          p: 2
        }}
      >
        {data.map((item, index) => (
          <Box
            key={index}
            onClick={() => setActiveIndex(index)}
            sx={{
              flex: '0 0 80%',
              scrollSnapAlign: 'start',
              cursor: 'pointer'
            }}
          >
            <Box
              component='video'
              ref={el => (videoRefs.current[index] = el)}
              src={item.video}
              loop
              muted
              playsInline
              preload='auto'
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '50vh',
                borderRadius: 2,
                objectFit: 'contain',
                opacity: activeIndex === index ? videoOpacity : 0.5,
                transition: 'opacity 0.5s ease-in'
              }}
            />
          </Box>
        ))}
      </Box>

      <Container>
        {data.map((item, index) => (
          <Box key={index} sx={{ mt: 3, p: 1, cursor: 'pointer' }} onClick={() => handleTextClick(index)}>
            <Typography
              variant='subtitle1'
              sx={{
                fontSize: activeIndex === index ? '1rem' : '0.9rem',
                color: 'secondary.main',
                fontFamily: 'Coolvetica'
              }}
            >
              {item.title}
            </Typography>
            <Typography variant='body2' sx={{ mt: 1, fontSize: '0.8rem' }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Container>
    </Box>
  )
}

export default MobileAdvantages
