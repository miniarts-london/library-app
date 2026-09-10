import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

export type AppNotification = {
  id: number
  type: string
  title: string
  body: string | null
  data: unknown
  read_at: string | null
  created_at: string
}

type NotificationsState = {
  items: AppNotification[]
  unreadCount: number
  // Whether the initial GET /api/notifications fetch has completed, so the
  // bell can render an empty-but-loaded state instead of a misleading 0.
  hydrated: boolean
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  hydrated: false,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    hydrateNotifications(
      state,
      action: PayloadAction<{ notifications: AppNotification[]; unreadCount: number }>,
    ) {
      state.items = action.payload.notifications
      state.unreadCount = action.payload.unreadCount
      state.hydrated = true
    },
    // Called when a new-notification event arrives live over Pusher.
    notificationReceived(state, action: PayloadAction<AppNotification>) {
      const exists = state.items.some((item) => item.id === action.payload.id)
      if (exists) return
      state.items.unshift(action.payload)
      state.unreadCount += 1
    },
    notificationMarkedRead(state, action: PayloadAction<number>) {
      const item = state.items.find((n) => n.id === action.payload)
      if (item && !item.read_at) {
        item.read_at = new Date().toISOString()
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    allNotificationsMarkedRead(state) {
      const now = new Date().toISOString()
      state.items.forEach((item) => {
        if (!item.read_at) item.read_at = now
      })
      state.unreadCount = 0
    },
  },
})

export const {
  hydrateNotifications,
  notificationReceived,
  notificationMarkedRead,
  allNotificationsMarkedRead,
} = notificationsSlice.actions

export const selectNotifications = (state: RootState) => state.notifications.items
export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount
export const selectNotificationsHydrated = (state: RootState) => state.notifications.hydrated

export default notificationsSlice.reducer
