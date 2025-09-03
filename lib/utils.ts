import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from 'crypto'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hashApiKey(key: string): string {
  const salt = process.env.INGEST_KEY_ROTATE_SALT || 'default-salt'
  return crypto.createHash('sha256').update(key + salt).digest('hex')
}

export function generateApiKey(): string {
  return `gb_${crypto.randomBytes(32).toString('hex')}`
}

export function maskApiKey(key: string): string {
  if (!key || key.length < 12) return key
  return `${key.slice(0, 6)}...${key.slice(-4)}`
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(cents / 100)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}
