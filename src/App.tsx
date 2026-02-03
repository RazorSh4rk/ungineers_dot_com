import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { Header } from './components/Header'
import { AboutPage } from './components/AboutPage'
import { ContentArea } from './components/ContentArea'
import type { PagesData, CurrentPage, Project } from './types'

function AppContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const params = useParams<{ author?: string; project?: string; page?: string }>()

  useEffect(() => {
    fetch('/pages.json')
      .then(res => res.json())
      .then((data: PagesData) => {
        setProjects(data.projects)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load pages.json:', err)
        setLoading(false)
      })
  }, [])

  const getCurrentPage = (): CurrentPage => {
    if (!params.author || !params.project || !params.page) {
      return { type: 'about' }
    }

    const project = projects.find(
      p => p.author.toLowerCase() === params.author?.toLowerCase() &&
           p.name.toLowerCase() === params.project?.toLowerCase()
    )

    if (!project) return { type: 'about' }

    const page = project.pages.find(
      p => p.title.toLowerCase().replace(/\s+/g, '-') === params.page?.toLowerCase()
    )

    if (!page) return { type: 'about' }

    return { type: 'project', project, page }
  }

  const handleNavigate = (newPage: CurrentPage) => {
    if (newPage.type === 'about') {
      navigate('/')
    } else if (newPage.project && newPage.page) {
      const author = newPage.project.author.toLowerCase()
      const project = newPage.project.name.toLowerCase()
      const page = newPage.page.title.toLowerCase().replace(/\s+/g, '-')
      navigate(`/${author}/${project}/${page}`)
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    )
  }

  const currentPage = getCurrentPage()

  return (
    <div className="h-screen flex flex-col">
      <Header
        projects={projects}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      <main className="flex-1 flex overflow-hidden">
        {currentPage.type === 'about' ? (
          <AboutPage />
        ) : currentPage.project && currentPage.page ? (
          <ContentArea page={currentPage.page} />
        ) : null}
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/:author/:project/:page" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
