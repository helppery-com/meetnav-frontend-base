<template>
  <div v-if="rooms.length" class="col-auto">
    <q-btn-dropdown auto-close stretch flat
      color="primary q-mr-md q-mt-md"
      :label="$t('Rooms')">
      <q-list>
        <q-item
          v-for="(room, ix) in roomAndPeriod" :key="ix"
        >
          <q-item-section v-if="room._period">
            {{ room._period }}
          </q-item-section>
          <q-item-section v-else>
            <div class="row q-gutter-md">
              <q-badge rounded class="col-auto" :color="room.running ? 'green' : 'dark' " />
              <router-link
                :to="`/navroom/${room.roomId}`"
                class="col"
              >
                {{ `@${room.owner}/${room.roomId}` }}
              </router-link>
              <q-btn icon="incognito" @click="$router.push({ path: `/navroom/${room.roomId}`, query: { incognito: true }})" />
              <q-avatar v-for="(user, iu) in room.users" :key="iu">
                <img :src="user.avatar" style="margin-right: -10px" :title="`@${user.username}`"/>
              </q-avatar>
              <q-btn
                class="col-auto"
                icon="stop"
                color="red"
                v-if="room.running && isOwnerRoom(room) && canDelete(room)"
                @click="stopRoom(room)"
              />
              <q-btn
                class="col-auto"
                icon="delete"
                color="dark"
                v-if="isOwnerRoom(room) && canDelete(room)"
                @click="deleteRoom(room)"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-badge color="orange" text-color="white" :label="rooms.length"
      style="margin-left: -75px;margin-right: 30px;"/>
  </div>
</template>
<script>
import { formatRelative, parseISO } from 'date-fns'

export default {
  data () {
    return {
      rooms: []
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
