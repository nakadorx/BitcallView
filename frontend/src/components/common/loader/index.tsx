import Spinner from '../spinner'

export default function Loader() {
  return (
    <div className='flex items-center justify-center h-screen float-animation w-full relative bottom-[5rem] '>
      <Spinner />
    </div>
  )
}
