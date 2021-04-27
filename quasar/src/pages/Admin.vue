<template>
  <q-page class="home-admin">
    <chat-window
      :current-user-id="user.id"
      :rooms="rooms"
      :messages="messages"
    />
  </q-page>
</template>
<script>
import ChatWindow from 'vue-advanced-chat'
import 'vue-advanced-chat/dist/vue-advanced-chat.css'

export default {
  components: {
    ChatWindow
  },
  data () {
    return {
      rooms: [
        {
          roomId: 1,
          roomName: 'Room 1',
          avatar: 'https://cdn.quasar.dev/img/avatar.png',
          unreadCount: 4,
          index: 3,
          lastMessage: {
            content: 'Last message received',
            senderId: 1234,
            username: 'John Doe',
            timestamp: '10:20',
            saved: true,
            distributed: false,
            seen: false,
            new: true
          },
          users: [
            {
              _id: 1234,
              username: 'John Doe',
              avatar: 'assets/imgs/doe.png',
              status: {
                state: 'online',
                lastChanged: 'today, 14:30'
              }
            },
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            }
          ],
          typingUsers: [4321]
        }
      ],
      messages: []
    }
  },
  computed: {
    user () {
      return this.$storex.user.user
    }
  }
}
</script>
