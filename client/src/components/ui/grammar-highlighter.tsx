import { useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'

export interface GrammarIssue {
  message: string
  offset: number
  length: number
  replacements: { value: string }[]
}

interface Props {
  paragraph: string
  issues?: GrammarIssue[]
}

export function GrammarHighlighter({ paragraph, issues }: Props) {
  const [showError, setShowError] = useState(false)
  if (!issues) {
    return paragraph
  }
  const sortedIssues = [...issues].sort((a, b) => a.offset - b.offset)

  function renderWithHighlights() {
    const parts: React.ReactNode[] = []
    let lastIndex = 0

    sortedIssues.forEach((issue, idx) => {
      const start = issue.offset
      const end = issue.offset + issue.length

      if (lastIndex < start) {
        parts.push(<span key={`text-${idx}-${lastIndex}`}>{paragraph.slice(lastIndex, start)}</span>)
      }

      parts.push(
        <Tooltip key={`error-${idx}`}>
          <TooltipTrigger asChild>
            <span className='cursor-help rounded bg-red-200 px-0.5 text-red-900'>{paragraph.slice(start, end)}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p className='text-sm font-medium'>{issue.message}</p>
            {issue.replacements.length > 0 && (
              <ul className='mt-1 list-inside list-disc text-xs'>
                {issue.replacements.map((r, i) => (
                  <li key={i}>{r.value}</li>
                ))}
              </ul>
            )}
          </TooltipContent>
        </Tooltip>
      )

      lastIndex = end
    })

    // Remaining text after last error
    if (lastIndex < paragraph.length) {
      parts.push(<span key={`text-end`}>{paragraph.slice(lastIndex)}</span>)
    }

    return parts
  }

  return (
    <TooltipProvider>
      <div className='flex flex-col space-y-4'>
        <p className='leading-relaxed'>{showError ? renderWithHighlights() : paragraph}</p>
        <Button
          className='absolute top-0 right-6 w-fit translate-y-1/2 cursor-pointer text-xs'
          variant='destructive'
          size='sm'
          onClick={() => setShowError(!showError)}
        >
          Show: {issues.length} issues founded
          <Eye className='size-4' />
        </Button>
      </div>
    </TooltipProvider>
  )
}
