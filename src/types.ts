export interface Page {
  title: string
  url: string
  icon?: string
  embed?: string
}

export interface Project {
  name: string
  icon?: string
  description?: string
  repo: string
  author: string
  pages: Page[]
}

export interface PagesData {
  projects: Project[]
}

export interface CurrentPage {
  type: 'about' | 'project'
  project?: Project
  page?: Page
}
