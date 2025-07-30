import ScrollToTop from '@core/components/scroll-to-top'

export const ScrollUp = () => (
  <ScrollToTop className='fixed'>
    <button
      className='
        w-12 h-12
        bg-primary hover:bg-primary-dark
        text-white
        rounded-full
        shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        hover:scale-110 hover:-translate-y-1
        float-animation
        z-50
        border-2 border-transparent hover:border-white/30
        backdrop-blur-sm
        active:scale-95
        pulse-glow
        group
        relative
        bottom-[4rem]
        right-[.2rem]
        overflow-hidden
      '
      aria-label='Scroll to top'
      title='Scroll to top'
    >
      {/* Background gradient effect */}
      <div className='absolute inset-0 bg-gradient-to-r from-primary to-primary-dark rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

      {/* Icon with hover effect */}
      <i className='ri-arrow-up-line text-xl relative z-10 group-hover:scale-110 transition-transform duration-200' />
    </button>
  </ScrollToTop>
)
