/* eslint-disable */
import RTCMultiConnection from 'rtcmulticonnection'
import * as io from 'socket.io-client'
global.io = io

function randomString(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result.toLowerCase();
}
function makeid (slots) {
  const res = []
  for(let c = 0; c < slots; ++c) {
    res.push(randomString(3))
  }
  return res.join("-")
}

export default class RTCNavroom {
  roomId = null
  connection = null
  connected = false
  user = null
  streams = {}
  userStrem = null
  guests = []
  waitingUsers = []
  anyHostConnected = false
  muted = false
  acceptedParticipants = []
  updatedAt = new Date()
  isHost = false

  onMessage = () => {}
  onUserConnected (event) {}
  onUserDisconnected () {}
  onGuestConnected (event) {}
  onGuestDisconnected (event) {}
  onGuestWaiting (event) {}

  constructor (user) {
    this.user = user
    this.connection = new RTCMultiConnection()
    // TODO: connection.password = this.room.roomPassword
    this.connection.socketURL = 'https://rtcmulticonnection.herokuapp.com/' // TODO: process.env.RTC_IO_SERVER
  }

  async connect (roomId) {
    this.isHost = !roomId
    const { connection } = this
  
    if (roomId) {
      this.roomId = roomId
    } else {
      await this.newRoomId()
    }

    await this.initRTC()
    connection.session = {
      audio: connection.DetectRTC.hasMicrophone,
      video: connection.DetectRTC.hasWebcam,
      data: true
    }
    if (this.lowBandwith) {
      // logging.info('lowBandwith', connection)
      connection.bandwidth = {
        audio: 50, // 50 kbps
        video: 256, // 256 kbps
        screen: 300 // 300 kbps
      }
      connection.mediaConstraints = {
        audio: true,
        video: {
          mandatory: {
            minFrameRate: 15,
            maxFrameRate: 15
          },
          optional: []
        }
      }
    }
    // STUN / TURN Servers
    // TODO: Read from server settings

    connection.socketMessageEvent = 'channel-' + this.roomId
    connection.channel = connection.sessionid = this.roomId
    
    connection.onstream = this.onStream.bind(this)
    connection.onstreamended = this.onStreamEnded.bind(this)
    connection.onUserIdAlreadyTaken = this.onUserIdAlreadyTaken.bind(this)
    connection.onmessage = this.onMessage.bind(this)
    connection.onmute = this.onMute()
    connection.onunmute = this.onUnmute()

    connection.extra = this.encodeExtra({
      id: this.user.id,
      username: this.user.username
    })
    if (this.isHost) {
      this.connection.onNewParticipant = this.onNewParticipant.bind(this)
    }
    const openOrJoin = this.isHost ? 'open' : 'join'
    return new Promise((resolve, reject) => {
      this.connection[openOrJoin](this.roomId, (isRoomOpened, roomid, error) => {
        if(error) {
          reject(error);
        } else {
          resolve()
        }
      })
    })
  }

  async initRTC () {
    return new Promise((resolve, reject) => {
      if (!this.connection.DetectRTC.isWebRTCSupported) {
        return reject('WebRTC is not supported')
      }
      try {
        this.connection.DetectRTC.load(resolve)
      } catch (ex) {
        console.log(error)
        reject()
      }
    })
  }

  async newRoomId () {
    let attemps = 10
    while(attemps--) {
      try {
        this.roomId = makeid(3)
        this.checkRoomIsFree(this.roomId)
        break
      } catch {}
    }
    if (!attemps) {
      throw new Error('No room id available or WebRTC problem')
    }
    return this.roomId
  }

  async checkRoomIsFree(roomId) {
    return new Promise((resolve, reject) => {
      this.connection.checkPresence(roomId, (isRoomExist) => {
        // logging.info('RTC check presence', roomInfo)
        if (isRoomExist) {
            reject()
        } else {
            resolve()
        }
      })
    })
  }

  send (msg) {
    this.connection.send(msg)
  }

  onMessage (msg) {
    if (this.onMessage) {
      this.onMessage(msg)
    }
  }

  // @Log
  onMute () {
    const org = this.connection.onmute
    return function (e) {
      org.call(this.connection, e)
      this.updatedAt = e.updatedAt = new Date()
      if (e.muteType === 'video') {
        e.mediaElement.setAttribute('poster', '/incognito-mode.png')
      }
    }
  }

  // @Log
  onUnmute () {
    const org = this.connection.onunmute
    return function (e) {
      org.call(this.connection, e)
      this.updatedAt = e.updatedAt = new Date()
    }
  }

  // @Log
  onStream (stream) {
    // logging.info('RTC on stream', stream)
    stream.updatedAt = new Date()
    stream.mediaElement.snapshot = '/incognito-mode.png'
    stream.extra = this.decodeExtra(stream.extra)
    const { userid, extra } = stream
    this.streams[extra.username || userid] = stream
    if (extra.username === this.user.username) {
      this.userStream = stream
      this.onUserConnected(stream)
    } else {
      this.guests.push(stream)
      this.onGuestConnected(stream)
    }
    if (this.isHost || extra.isHost) {
      this.anyHostConnected = true
    }
  }

  // @Log
  onUserIdAlreadyTaken (useridAlreadyTaken, yourNewUserId) {
    // logging.warn('Userid already taken.', useridAlreadyTaken, 'Your new userid:', yourNewUserId)
    this.connection.userid = this.connection.token()
    this.connect()
  }


  // @Log
  onStreamEnded (event) {
    let {userid, extra } = event
    delete this.streams[extra.username]
    if (event.userid === this.user.username) {
      this.onUserDisconnected()
    } else {
      this.guests.splice(this.guests.findIndex(v => v.userid === event.userid), 1)
    }
  }

  // @Log
  onNewParticipant (participantId, userPreferences) {
    // logging.info('RTC New participant request', participantId, userPreferences)
    // if OfferToReceiveAudio/OfferToReceiveVideo should be enabled for specific users
    userPreferences.localPeerSdpConstraints.OfferToReceiveAudio = true
    userPreferences.localPeerSdpConstraints.OfferToReceiveVideo = true

    // userPreferences.dontAttachStream = false // according to situation
    // userPreferences.dontGetRemoteStream = false  // according to situation

    // below line must be included. Above all lines are optional.
    // if below line is NOT included "join-request" will be considered rejected.
    const extra = this.decodeExtra(userPreferences.extra)
    if (this.acceptedParticipants.indexOf(extra.username) === -1) {
      const newParticipant = {
        participantId: extra.username,
        userPreferences,
        extra
      }
      this.waitingUsers.push(newParticipant)
      this.onGuestWaiting(newParticipant)
    } else {
      this.connection.acceptParticipationRequest(participantId, userPreferences)
    }
  }

  acceptUser (participantId) {
    const ix = this.waitingUsers.findIndex(e => e.participantId === participantId)
    const { userPreferences } = this.waitingUsers[ix]
    const { sender } = userPreferences.connectionDescription
    this.acceptedParticipants.push(participantId)
    this.connection.acceptParticipationRequest(sender, userPreferences)
    this.waitingUsers.splice(ix, 1)
    this.connection.send('Welcome', sender)
  }

  rejectUser (participantId) {
    const ix = this.waitingUsers.findIndex(e => e.participantId === participantId)
    this.waitingUsers.splice(ix, 1)
  }

  leave () {
    if (!this.connection) {
      return
    }
    // disconnect with all users
    this.connection.getAllParticipants().forEach(pid => this.connection.disconnectWith(pid))

    // stop all local cameras
    this.connection.attachStreams.forEach(stream =>
      stream.getTracks().forEach(track => track.stop())
    )
    this.connection.closeSocket()
    delete this.connection
  }

  get paused () {
    return this.userStream.mediaElement.paused
  }

  get muted () {
    return this.muted
  }

  toggleVideo () {
    const pause = !this.paused
    this.userStream.stream[pause ? "mute": "unmute"]('video')
  }

  toggleAudio () {
    if (this.muted) {
      this.userStream.stream.unmute('audio')
      this.userStream.mediaElement.muted = true
      if (this.paused) {
        this.toggleVideo ()
      }
      this.muted = false
    } else {
      this.userStream.stream.mute('audio')
      this.muted = true
    }
  }

  encodeExtra (extra) {
    return encodeURIComponent(JSON.stringify(extra))
  }

  decodeExtra (extra) {
    try {
      return JSON.parse(decodeURIComponent(extra))
    } catch (ex) {
      console.error('Error decoding user extra', ex)
    }
    return {}
  }
}
