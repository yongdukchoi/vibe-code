export default function Ball({ n, tone = 'white', dim = false }) {
  const tones = {
    white: 'bg-white text-black',
    cold: 'bg-sky-400 text-black',
    hot: 'bg-red-500 text-white',
  }
  return (
    <span
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-lg font-black ${tones[tone]} ${dim ? 'opacity-30' : ''}`}
    >
      {n}
    </span>
  )
}
