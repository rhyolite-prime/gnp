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

  const addNotification = (notification: NotificationPayload) => {
    // Avoid duplicates using ID if provided
    if (notifications.value.some(n => n.notificationId === notification.notificationId)) {
        return
    }
    notifications.value.push(notification)
    
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

  return {
    notifications,
    addNotification,
    removeNotification
  }
})
