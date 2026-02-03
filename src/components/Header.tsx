import { CaretDown } from '@phosphor-icons/react'
import type { Project, CurrentPage } from '../types'
import { ProjectsMenu } from './ProjectsMenu'
import { useState, useRef, useEffect } from 'react'

interface HeaderProps {
  projects: Project[]
  currentPage: CurrentPage
  onNavigate: (page: CurrentPage) => void
}

export function Header({ projects, currentPage, onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="border-b border-border h-20 flex items-center px-6 justify-between sticky top-0 bg-background z-50">
      <button onClick={() => onNavigate({ type: 'about' })} className="h-full py-3 cursor-pointer">
        <img src="/UNGINEERS.png" alt="ungineers" className="h-full hidden sm:block" />
        <img src="/ungineers.webp" alt="ungineers" className="h-full sm:hidden" />
      </button>

      <div className="flex items-center gap-8">
        <button
          onClick={() => onNavigate({ type: 'about' })}
          className={`text-lg font-bold hover:text-muted-foreground transition-colors ${currentPage.type === 'about' ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          about us
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 text-lg font-bold hover:text-muted-foreground transition-colors"
          >
            projects
            <CaretDown size={20} className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <ProjectsMenu
              projects={projects}
              currentPage={currentPage}
              onNavigate={(page) => {
                onNavigate(page)
                setMenuOpen(false)
              }}
            />
          )}
        </div>
      </div>
    </header>
  )
}
