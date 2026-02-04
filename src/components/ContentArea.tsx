import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import type { Page } from '../types'

interface ContentAreaProps {
  page: Page
}

function extractGitHubInfo(url: string): { owner: string; repo: string; branch: string; basePath: string } | null {
  // Match raw.githubusercontent.com URLs
  const rawMatch = url.match(/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/(?:refs\/heads\/)?([^/]+)\/(.*)/)
  if (rawMatch) {
    const [, owner, repo, branch, path] = rawMatch
    const basePath = path.split('/').slice(0, -1).join('/')
    return { owner, repo, branch, basePath }
  }
  // Match github.com raw URLs
  const githubRawMatch = url.match(/github\.com\/([^/]+)\/([^/]+)\/raw\/(?:refs\/heads\/)?([^/]+)\/(.*)/)
  if (githubRawMatch) {
    const [, owner, repo, branch, path] = githubRawMatch
    const basePath = path.split('/').slice(0, -1).join('/')
    return { owner, repo, branch, basePath }
  }
  return null
}

function rewriteUrl(href: string, githubInfo: ReturnType<typeof extractGitHubInfo>): string {
  if (!githubInfo) return href
  if (href.startsWith('http://') || href.startsWith('https://')) return href
  if (href.startsWith('#')) return href

  const { owner, repo, branch, basePath } = githubInfo

  // Handle relative paths
  let resolvedPath: string
  if (href.startsWith('./')) {
    resolvedPath = basePath ? `${basePath}/${href.slice(2)}` : href.slice(2)
  } else if (href.startsWith('../')) {
    const parts = basePath.split('/')
    let hrefParts = href.split('/')
    while (hrefParts[0] === '..') {
      parts.pop()
      hrefParts.shift()
    }
    resolvedPath = [...parts, ...hrefParts].join('/')
  } else if (!href.startsWith('/')) {
    resolvedPath = basePath ? `${basePath}/${href}` : href
  } else {
    resolvedPath = href.slice(1)
  }

  return `https://github.com/${owner}/${repo}/blob/${branch}/${resolvedPath}`
}

function rewriteImageUrl(src: string, githubInfo: ReturnType<typeof extractGitHubInfo>): string {
  if (!githubInfo) return src
  if (src.startsWith('http://') || src.startsWith('https://')) return src

  const { owner, repo, branch, basePath } = githubInfo

  let resolvedPath: string
  if (src.startsWith('./')) {
    resolvedPath = basePath ? `${basePath}/${src.slice(2)}` : src.slice(2)
  } else if (src.startsWith('../')) {
    const parts = basePath.split('/')
    let srcParts = src.split('/')
    while (srcParts[0] === '..') {
      parts.pop()
      srcParts.shift()
    }
    resolvedPath = [...parts, ...srcParts].join('/')
  } else if (!src.startsWith('/')) {
    resolvedPath = basePath ? `${basePath}/${src}` : src
  } else {
    resolvedPath = src.slice(1)
  }

  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${resolvedPath}`
}

export function ContentArea({ page }: ContentAreaProps) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (page.embed || page.pdf) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    fetch(page.url)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
        return res.text()
      })
      .then(text => {
        setContent(text)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [page.url, page.embed, page.pdf])

  if (page.embed) {
    return (
      <div className="flex-1 w-full h-full">
        <iframe
          src={page.url}
          className="w-full h-full border-0"
          title={page.title}
        />
      </div>
    )
  }

  if (page.pdf) {
    return (
      <div className="flex-1 w-full h-full">
        <object
          data={page.url}
          type="application/pdf"
          className="w-full h-full"
        >
          <p className="p-8 text-center">
            Unable to display PDF.{' '}
            <a href={page.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
              Download it here
            </a>
          </p>
        </object>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    )
  }

  const githubInfo = extractGitHubInfo(page.url)

  return (
    <div className="flex-1 overflow-auto p-8 max-w-4xl mx-auto w-full">
      <div className="prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            a: ({ href, children }) => (
              <a
                href={rewriteUrl(href || '', githubInfo)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            img: ({ src, alt }) => (
              <img
                src={rewriteImageUrl(src || '', githubInfo)}
                alt={alt}
                loading="lazy"
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
