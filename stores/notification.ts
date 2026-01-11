import { defineStore } from 'pinia'

export interface NotificationPayload {
  notificationId: string
  subject: string
  messageBody: string
  deepLink?: string
  timestamp: number
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<NotificationPayload[]>([])
  const unreadCount = ref(3) // Mock initial count

  const addNotification = (notification: NotificationPayload) => {
    // Avoid duplicates using ID if provided
    if (notifications.value.some(n => n.notificationId === notification.notificationId)) {
        return
    }
    notifications.value.push(notification)
    unreadCount.value++
    
    // Auto remove after 30 seconds
    setTimeout(() => {
      removeNotification(notification.notificationId)
    }, 60000)
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.notificationId === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearUnreadCount = () => {
    unreadCount.value = 0
  }

  return {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    clearUnreadCount
  }
})
