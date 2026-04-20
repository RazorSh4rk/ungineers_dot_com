import { useMemo, useRef, useEffect } from 'react'
import { DiscordLogoIcon } from '@phosphor-icons/react'

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function AboutPage() {
  const detailsRef = useRef<HTMLDetailsElement>(null)

  const imageFiles = useMemo(() => {
    const images = import.meta.glob('/src/about_us_gallery/*.{png,jpg,jpeg,webp,svg}', { 
      eager: true, 
      query: '?url', 
      import: 'default' 
    });

    return Object.values(images) as string[];
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        detailsRef.current.removeAttribute('open')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const displayImages = useMemo(() => {
    if (imageFiles.length === 0) return [];

    let baseSet = shuffleArray(imageFiles);

    const count = Math.floor(baseSet.length / 5) * 5;
    const trimmedBase = baseSet.slice(0, count);

    if (trimmedBase.length > 1 && trimmedBase[0] === trimmedBase[trimmedBase.length - 1]) {
      [trimmedBase[trimmedBase.length - 1], trimmedBase[trimmedBase.length - 2]] = 
      [trimmedBase[trimmedBase.length - 2], trimmedBase[trimmedBase.length - 1]];
    }

    return [...trimmedBase, ...trimmedBase];
  }, [imageFiles]);

  if (displayImages.length === 0) {
    return <div className="h-screen bg-black"></div>
  }

  return (
    <div className="fixed w-full h-screen overflow-hidden bg-black group">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="animate-infinite-scroll">
          <div className="p-2 grid lg:grid-cols-5 grid-cols-2 gap-2">
            {displayImages.map((img, index) => (
              <div
                key={`${img}-${index}`}
                className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900"
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover opacity-50"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-black/70 backdrop-blur-[1.5px]">
        <div className="bg-gray-500/10 p-6 md:p-8 rounded-xl flex flex-col items-center justify-center gap-2 backdrop-blur-xl w-full max-w-lg border border-white/5">
          
          <h1 className="text-2xl md:text-4xl text-center whitespace-nowrap text-white">
            Welcome to Ungineers
          </h1>
          
          <h2 className="leading-relaxed text-sm md:text-base max-w-md text-center opacity-90 text-zinc-300">
            A community of makers, tinkerers, and engineers building open-source 3D printers and tools.
          </h2>

          <a
            href="https://discord.com/invite/MBcHGUv2CB"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-all hover:brightness-125 my-2"
            style={{ color: "#5865f2" }}
          >
            <DiscordLogoIcon size={24} />
            <span>Join our Discord</span>
          </a>

          <details ref={detailsRef} className="relative group/details border border-transparent open:bg-black/20 rounded-md p-2 transition-all w-full text-center">
            <summary className="cursor-pointer list-none font-medium opacity-80 hover:opacity-100 text-white">
              Ungineers calibration cube
            </summary>
            
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 p-4 bg-zinc-900 backdrop-blur-md rounded-lg border border-white/10 z-20 shadow-xl w-[calc(100vw-2rem)] md:w-125">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-left">
                <div className="flex-1 flex flex-col gap-2">
                  <p className="text-sm leading-relaxed text-zinc-200">
                    Ungineers has its own calibration cube featuring multiple FDM printer challenges.
                  </p>
                  <a 
                    href="https://www.printables.com/model/634840-ungineers-calicube" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 underline mt-auto"
                  >
                    View on Printables
                  </a>
                </div>

                <a 
                  href="https://www.printables.com/model/634840-ungineers-calicube" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <img
                    src="/uni_cube_v0.webp"
                    alt="Ungineers Calicube"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-md object-cover border border-white/10 hover:scale-105 transition-transform"
                  />
                </a>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}