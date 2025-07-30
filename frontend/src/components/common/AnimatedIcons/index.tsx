import React from 'react'
import Image from 'next/image'

type AnimatedIconProps = {
  src: string
  alt: string
  width: number
  height: number
  title?: string
  className?: string
  priority?: boolean
  sizes?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  useNativeImg?: boolean
  onLoad?: () => void
  onError?: () => void
  quality?: number
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  responsive?: boolean // Allow responsive behavior
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  src,
  alt,
  width,
  height,
  title,
  className = '',
  priority = false,
  sizes,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  quality = 75,
  objectFit = 'contain',
  responsive = false
}) => {
  const getObjectFitClass = () => {
    switch (objectFit) {
      case 'cover':
        return 'object-cover'
      case 'fill':
        return 'object-fill'
      case 'none':
        return 'object-none'
      case 'scale-down':
        return 'object-scale-down'
      default:
        return 'object-contain'
    }
  }

  // Only add responsive classes if explicitly requested
  const responsiveClasses = responsive ? 'w-auto h-auto' : ''
  const combinedClassName = `${responsiveClasses} ${getObjectFitClass()} ${className}`.trim()

  return (
    <Image
      src={src}
      alt={alt}
      title={title}
      width={width}
      height={height}
      className={combinedClassName}
      priority={priority}
      sizes={sizes}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      quality={quality}
      onLoad={onLoad}
      onError={onError}
      unoptimized={false}
    />
  )
}

export default AnimatedIcon
