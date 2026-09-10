'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  AppNotification,
  allNotificationsMarkedRead,
  hydrateNotifications,
  notificationMarkedRead,
  notificationReceived,
  selectNotifications,
  selectUnreadCount,
} from '../store/notificationsSlice'
import { subscribeToAlerts } from '@/lib/pusher-client'

function timeAgo(iso: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function NotificationBell() {
  const dispatch = useAppDispatch()
  const notifications = useAppSelector(selectNotifications)
  const unreadCount = useAppSelector(selectUnreadCount)
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<AppNotification | null>(null)
  const [sendingTestAlert, setSendingTestAlert] = useState(false)

  // Initial load of recent notifications + unread count.
  useEffect(() => {
    let cancelled = false

    fetch('/api/notifications')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          dispatch(hydrateNotifications(data))
        }
      })
      .catch((err) => console.error('Failed to load notifications:', err))

    return () => {
      cancelled = true
    }
  }, [dispatch])

  // Live updates over the WebSocket connection to Pusher.
  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    try {
      unsubscribe = subscribeToAlerts((payload) => {
        const notification = payload as AppNotification
        dispatch(notificationReceived(notification))
        setToast(notification)
        window.setTimeout(() => setToast((current) => (current?.id === notification.id ? null : current)), 5000)
      })
    } catch (err) {
      // Pusher env vars not configured yet - fail quietly rather than
      // breaking the rest of the page.
      console.error('Real-time alerts unavailable:', err)
    }

    return () => unsubscribe?.()
  }, [dispatch])

  async function markRead(id: number) {
    dispatch(notificationMarkedRead(id))
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' })
    } catch (err) {
      console.error('Failed to mark notification read:', err)
    }
  }

  async function markAllRead() {
    dispatch(allNotificationsMarkedRead())
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' })
    } catch (err) {
      console.error('Failed to mark all notifications read:', err)
    }
  }

  // Demo-only helper: fires a sample alert on demand so this can be
  // demonstrated live without waiting on a real HubSpot webhook.
  async function sendTestAlert() {
    setSendingTestAlert(true)
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'test',
          title: 'Test alert',
          body: `Sent at ${new Date().toLocaleTimeString()}`,
        }),
      })
    } catch (err) {
      console.error('Failed to send test alert:', err)
    } finally {
      setSendingTestAlert(false)
    }
  }

  return (
    <div className="relative flex items-center gap-2">
      <button
        type="button"
        onClick={sendTestAlert}
        disabled={sendingTestAlert}
        className="text-xs text-zinc-400 underline decoration-dotted hover:text-zinc-600 disabled:opacity-50 dark:hover:text-zinc-300"
        title="Demo helper: fires a sample alert to every connected client"
      >
        Send test alert
      </button>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
        aria-label="Notifications"
      >
        <BellIcon />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-medium text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-11 z-20 w-80 rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
            <p className="text-sm font-medium">Alerts</p>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-orange-600 hover:underline"
              >
                Mark all read
              </button>
            ) : null}
          </div>

          <ul className="max-h-80 divide-y divide-zinc-100 overflow-y-auto dark:divide-zinc-800">
            {notifications.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-zinc-500">No alerts yet.</li>
            ) : (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  onClick={() => !notification.read_at && markRead(notification.id)}
                  className={`cursor-pointer px-4 py-3 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
                    notification.read_at ? '' : 'bg-orange-50/60 dark:bg-orange-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{notification.title}</p>
                    {!notification.read_at ? (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-600" />
                    ) : null}
                  </div>
                  {notification.body ? (
                    <p className="mt-0.5 text-zinc-500">{notification.body}</p>
                  ) : null}
                  <p className="mt-1 text-xs text-zinc-400">{timeAgo(notification.created_at)}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed right-6 top-6 z-50 w-72 rounded-xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm font-medium">{toast.title}</p>
          {toast.body ? <p className="mt-0.5 text-sm text-zinc-500">{toast.body}</p> : null}
        </div>
      ) : null}
    </div>
  )
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 8a6 6 0 1 1 12 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 17a2.5 2.5 0 0 0 5 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
