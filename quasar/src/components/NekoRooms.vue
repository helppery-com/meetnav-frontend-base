<template>
  <div v-if="rooms.length" class="col q-mr-md" style="text-align: right">
    <q-btn
      flat
      color="primary q-mr-md q-mt-md"
      :label="$t('Open rooms')"
      >
      <q-menu>
        <q-list>
          <q-item
            v-for="(room, ix) in roomAndPeriod" :key="ix"
          >
            <q-item-section v-if="room._period">
              {{ room._period }}
            </q-item-section>
            <q-item-section v-else>
              <div class="row">
                <q-badge rounded class="col-auto q-mr-xs" :color="room.running ? 'green' : 'dark' " />
                <router-link
                  :to="`/navroom/${room.roomId}`"
                  class="col q-mr-xs"
                >
                  {{ `@${room.owner}/${room.roomId}` }}
                </router-link>
                <q-avatar v-for="(user, iu) in room.users" :key="iu">
                  <img :src="user.avatar" style="margin-right: -10px" :title="`@${user.username}`"/>
                </q-avatar>
                <q-btn rounded color="white" class=" q-mx-xs bg-red" round icon="fas fa-sign-out-alt" size="md" @click="showLeaveRoom = true" />
                <q-dialog v-model="showLeaveRoom">
                  <LeaveRoom />
                </q-dialog>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>
<script>
import { formatRelative, parseISO } from 'date-fns'
import LeaveRoom from './LeaveRoom.vue'

export default {
  components: {
    LeaveRoom
  },
  data () {
    return {
      rooms: [],
      showLeaveRoom: false
    }
  },
  watch: {
    nekoRooms (rooms) {
      this.rooms = rooms
    }
  },
  computed: {
    nekoRooms () {
      return this.$storex.room.nekoRooms
    },
    roomAndPeriod () {
      const { rooms } = this
      const group = rooms
        .sort((a, b) => a.created > b.created ? -1 : 1)
        .reduce((acc, room) => {
          const k = this.frRoomCreated(room)
          const col = acc[k] || []
          col.push(room)
          acc[k] = col
          return acc
        }, {})
      return Object.keys(group)
        .reduce((acc, k) => {
          acc.push({ _period: k })
          acc.push(...group[k])
          return acc
        }, [])
    }
  },
  methods: {
    isOwnerRoom (room) {
      return room.users.filter(u => u.id === this.$storex.user.id && u.type === 'admin')
    },
    frRoomCreated (room) {
      return formatRelative(parseISO(room.created), new Date())
    },
    async stopRoom (room) {
      this.$q.dialog({
        title: this.$t('Confirm'),
        message: this.$t('Stop room?'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$storex.room.stopRoom(room)
      })
    },
    async deleteRoom (room) {
      this.$q.dialog({
        title: this.$t('Confirm'),
        message: this.$t('Delete room?'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$storex.room.deleteRoom(room)
      })
    },
    canDelete (room) {
      return this.$route.path.indexOf(room.roomId) === -1
    }
  }
}
</script>
