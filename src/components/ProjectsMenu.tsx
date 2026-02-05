import { useState } from 'react'
import { CaretRight, ArrowSquareOut } from '@phosphor-icons/react'
import type { Project, CurrentPage } from '../types'
import { PhosphorIcon } from './PhosphorIcon'

interface ProjectsMenuProps {
  projects: Project[]
  currentPage: CurrentPage
  onNavigate: (page: CurrentPage) => void
}

export function ProjectsMenu({ projects, currentPage, onNavigate }: ProjectsMenuProps) {
  const [expandedAuthors, setExpandedAuthors] = useState<Set<string>>(new Set())
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())

  const projectsByAuthor = projects.reduce((acc, project) => {
    if (!acc[project.author]) acc[project.author] = []
    acc[project.author].push(project)
    return acc
  }, {} as Record<string, Project[]>)

  const toggleAuthor = (author: string) => {
    setExpandedAuthors(prev => {
      const next = new Set(prev)
      if (next.has(author)) next.delete(author)
      else next.add(author)
      return next
    })
  }

  const toggleProject = (projectName: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev)
      if (next.has(projectName)) next.delete(projectName)
      else next.add(projectName)
      return next
    })
  }

  return (
    <div className="absolute right-0 top-full mt-2 bg-background border border-border rounded-md min-w-64 max-h-[calc(100vh-7rem)] overflow-y-auto">
      {Object.entries(projectsByAuthor).map(([author, authorProjects]) => (
        <div key={author}>
          <button
            onClick={() => toggleAuthor(author)}
            className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 text-muted-foreground"
          >
            <CaretRight
              size={14}
              className={`transition-transform ${expandedAuthors.has(author) ? 'rotate-90' : ''}`}
            />
            {author}
          </button>

          {expandedAuthors.has(author) && (
            <div className="pl-4">
              {authorProjects.map(project => (
                <div key={project.name}>
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleProject(project.name)}
                      className="flex-1 px-4 py-2 text-left hover:bg-muted flex items-center gap-2"
                    >
                      <CaretRight
                        size={14}
                        className={`transition-transform ${expandedProjects.has(project.name) ? 'rotate-90' : ''}`}
                      />
                      {project.icon && <PhosphorIcon name={project.icon} size={16} />}
                      <span title={project.description}>{project.name}</span>
                    </button>
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-2 hover:bg-muted text-muted-foreground hover:text-foreground"
                      title="Open repository"
                    >
                      <ArrowSquareOut size={16} />
                    </a>
                  </div>

                  {expandedProjects.has(project.name) && (
                    <div className="pl-6">
                      {project.pages.map(page => (
                        <button
                          key={page.title}
                          onClick={() => onNavigate({ type: 'project', project, page })}
                          className={`w-full px-4 py-1.5 text-left hover:bg-muted flex items-center gap-2 text-sm ${
                            currentPage.type === 'project' &&
                            currentPage.page?.title === page.title &&
                            currentPage.project?.name === project.name
                              ? 'bg-muted'
                              : ''
                          }`}
                        >
                          <PhosphorIcon name={page.icon || 'arrow-fat-right'} size={14} />
                          {page.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
