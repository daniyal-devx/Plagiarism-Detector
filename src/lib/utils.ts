import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

export function getColorByPercentage(percentage: number): string {
  if (percentage >= 80) return 'text-red-600'
  if (percentage >= 60) return 'text-orange-600'
  if (percentage >= 40) return 'text-yellow-600'
  if (percentage >= 20) return 'text-blue-600'
  return 'text-green-600'
}

export function getBgColorByPercentage(percentage: number): string {
  if (percentage >= 80) return 'bg-red-100 dark:bg-red-900/20'
  if (percentage >= 60) return 'bg-orange-100 dark:bg-orange-900/20'
  if (percentage >= 40) return 'bg-yellow-100 dark:bg-yellow-900/20'
  if (percentage >= 20) return 'bg-blue-100 dark:bg-blue-900/20'
  return 'bg-green-100 dark:bg-green-900/20'
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return url
  }
}

export function downloadJSON(data: any, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function generateReportFilename(): string {
  const date = new Date().toISOString().split('T')[0]
  const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-')
  return `plagiarism-report-${date}-${time}.json`
}
