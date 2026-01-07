import { useState, useEffect } from 'react'

interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: 'default' | 'destructive'
}

interface ToastState {
  toasts: Toast[]
}

let toastCount = 0

export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] })

  const toast = ({
    title,
    description,
    action,
    variant = 'default',
  }: Omit<Toast, 'id'>) => {
    const id = `toast-${toastCount++}`
    const newToast: Toast = { id, title, description, action, variant }

    setState((prev) => ({
      toasts: [...prev.toasts, newToast],
    }))

    setTimeout(() => {
      setState((prev) => ({
        toasts: prev.toasts.filter((t) => t.id !== id),
      }))
    }, 5000)

    return id
  }

  const dismiss = (toastId: string) => {
    setState((prev) => ({
      toasts: prev.toasts.filter((t) => t.id !== toastId),
    }))
  }

  return {
    toasts: state.toasts,
    toast,
    dismiss,
  }
}
