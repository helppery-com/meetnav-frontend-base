<template>
  <div class="session-settings">
    <q-splitter
      v-model="splitter"
      style="height: 250px"
    >
      <template v-slot:before>
        <q-tabs
          v-model="tab"
          vertical
        >
          <q-tab name="basic" :label="$t('Basic')" />
          <q-tab name="style" :label="$t('Style')" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="basic">
            <div class="row">
              <q-avatar class="col-auto q-mr-md btn" @click="changePicture">
                <img :src="settings.photo">
              </q-avatar>
              <q-input
                dense
                v-model="settings.name"
                :label="$t('Name')"
                :hint="$t('Session name')"
                lazy-rules
                :rules="[ val => val && val.length > 0 || $t('Please type something')]"
                class="col"
              />
            </div>
            <q-input
              v-model="settings.urls"
              :label="$t('Urls')"
              :hint="$t('List of urls to open with the session')"
              type="textarea"
            />
            <q-dialog v-model="uploadAvatar">
              <q-card>
                <q-uploader
                  :url="uploadUrl"
                  :headers="uploadHeaders"
                  fieldName="files"
                  style="max-width: 300px"
                  :filter="checkFileType"
                  @uploaded="onAvatarImageUploaded"
                />
                <q-card-actions align="right">
                  <q-btn color="red" icon="close" v-close-popup/>
                </q-card-actions>
              </q-card>
            </q-dialog>
          </q-tab-panel>
          <q-tab-panel name="style">
            <AceEditor
              v-model="styleEdited"
              @init="editorInit"
              lang="css"
              theme="monokai"
              width="100%"
              height="600px"
            />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>
<script>
import AceEditor from 'vuejs-ace-editor'

const roomStyle = `:root {
  --navroom-logo: url('https://static.thenounproject.com/png/778835-200.png');
  --navroom-primary: #004e6d;
  --navroom-bgimg: url('');
  --navroom-chat-bgcolor: #f8f7f5;
  --navroom-chat-bgimg: url('');
}

.room-layout {
    background-image: var(--navroom-bgimg);
    background-size: cover;
}

.room-layout .q-page {
    margin: 30px;
}

.room-layout .header .q-toolbar {
  background-image: var(--navroom-logo);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right;

}

.room-layout .users {
  background-color: var(--navroom-primary);
    border-radius: 3px;
    background-image: var(--navroom-logo);
    background-position: bottom;
    background-repeat: no-repeat;
}

.room-layout .chat {
    background-color: var(--navroom-chat-bgcolor);
    background-image: var(--navroom-chat-bgimg);
    background-size: contain;
    background-repeat: no-repeat;
}

.room-layout .q-drawer {
    background: transparent;
    margin: 10px;
}

.neko-chat .content .content-body {
    color: #1f1d1d !important;
    font-weight: 500;
}

.author {
    opacity: 0;
    width: 5px !important;
}

.room-layout .q-drawer--right {
}
`
export default {
  props: ['settings'],
  components: {
    AceEditor
  },
  data () {
    return {
      uploadUrl: this.$storex.room.uploadUrl,
      uploadAvatar: false,
      tab: 'basic',
      splitter: 20,
      styleEdited: this.initStyle(),
      name: '',
      urls: ''
    }
  },
  computed: {
    connected () {
      return this.$storex.room.connected
    },
    uploadHeaders () {
      const headers = this.$storex.room.uploadHeaders
      return Object.keys(headers)
        .reduce((acc, k) => acc.concat([{ name: k, value: headers[k] }]), [])
    }
  },
  watch: {
    connected (newVal) {
      if (newVal && this.$storex.room.room.style) {
        this.styleEdited = this.$storex.room.room.style
      }
    },
    styleEdited (style) {
      this.$props.settings.style = style
    }
  },
  methods: {
    initStyle () {
      if (!this.$props.settings.style) {
        this.$props.settings.style = roomStyle
      }
      return this.$props.settings.style
    },
    editorInit: function () {
      require('brace/ext/language_tools') // language extension prerequsite...
      require('brace/mode/css')
      require('brace/theme/monokai')
      require('brace/snippets/css') // snippet
    },
    changePicture () {
      this.uploadAvatar = true
    },
    checkFileType (files) {
      return files.filter(file => ['image/png', 'image/jpg', 'image/jpeg'].indexOf(file.type) !== -1)
    },
    onAvatarImageUploaded (info) {
      const url = JSON.parse(info.xhr.response)[0].url
      const mediaUrl = this.$storex.room.mediaUrl
      this.$props.settings.photo = `${mediaUrl}${url}`
      this.uploadAvatar = false
    }
  }
}
</script>
