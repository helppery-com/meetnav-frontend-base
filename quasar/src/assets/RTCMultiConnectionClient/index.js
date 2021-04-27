/* eslint-disable */
import RTCMultiConnection from 'rtcmulticonnection'
import * as io from 'socket.io-client'
global.io = io

function randomString(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
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
  anyHostConnected = false
  isMuted = false
  isPaused = false
  acceptedParticipants = []
  updatedAt = new Date()
  isHost = false

  onMessage = () => {}
  onUserConnected (event) {}
  onUserDisconnected () {}
  onGuestWaiting (event) {}

  constructor (user) {
    this.user = user
    this.connection = new RTCMultiConnection()
    // TODO: connection.password = this.room.roomPassword
    this.connection.socketURL = (process.env.RTC_IO_SERVER + '') + '/'
    // STUN / TURN Servers
    this.connection.iceServers = []
    this.connection.iceServers.push({
      urls: 'stun:turn.meetnav.com:3478'
    })
    this.connection.iceServers.push({
      urls: 'turn:turn.meetnav.com:3478',
      credential: 'meetnav',
      username: 'meetnav'
    })
    this.connection.iceTransportPolicy = 'relay'
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
    const camera = this.connection.DetectRTC.videoInputDevices[0]
    if (true || this.lowBandwith) {
      // logging.info('lowBandwith', connection)
      connection.bandwidth = {
        audio: 50, // 50 kbps
        video: 150, // 256 kbps
        screen: 300 // 300 kbps
      }
      connection.mediaConstraints = {
        audio: true,
        video: {
          deviceId: camera.id
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
    connection.onmessage = this.receive.bind(this)
    connection.onmute = this.onMute.bind(this)
    connection.onunmute = this.onUnmute.bind(this)
    connection.onclose = this.onClose.bind(this)
    connection.onSocketDisconnect = this.onSocketDisconnect.bind(this)
    connection.extra = this.encodeExtra({
      id: this.user.id,
      username: this.user.username,
      camera: {
        id: camera.id,
        label: camera.label
      }
    })
    if (this.isHost) {
      this.connection.onNewParticipant = this.onNewParticipant.bind(this)
    }
    return await this.joinRoom()
  }

  async onSocketDisconnect (event) {
    console.log('onSocketDisconnect', event)
    if (this.connected) {
      console.log('onSocketDisconnect, reconnecting')
      await this.connect(this.roomId)
    }
  }

  async checkPresence () {
    return new Promise((resolve, reject) => {
      this.connection.checkPresence(this.roomId, (isRoomExist, roomid, extra) => {
        extra._room.isFull ? reject(error) : resolve({ isRoomExist, roomid })
      })
    })
  }

  async openOrJoin () {
    const { isRoomExist, roomId } = await this.checkPresence()
    return new Promise((resolve, reject) => {
      this.connection[isRoomExist ? 'join' : 'open'](this.roomId, (isRoomExist, roomid, error) => {
        error ? reject(error) : resolve({ isRoomExist, roomid })
      })
    })
  }

  async sleep (tout) {
    return new Promise(resolve => setTimeout(resolve, tout))
  }

  async joinRoom () {
    let attempts = 10
    while(attempts--) {
      try {
        await this.openOrJoin()
        break
      } catch(ex) {
        console.error('Error joining room', this.roomId)
      }
      await this.sleep(3000)
    }
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

  receive (msg) {
    this.onMessage({
      ...msg,
      ...msg.data,
      ...this.decodeExtra(msg.extra)
    })
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
    console.log('RTC on stream', stream)
    stream.updatedAt = new Date()
    stream.mediaElement.snapshot = '/incognito-mode.png'
    stream.extra = this.decodeExtra(stream.extra)
    const { userid, extra } = stream
    this.streams[extra.username || userid] = stream
    if (extra.username === this.user.username) {
      this.userStream = stream
      this.connected = true
    }
    this.onUserConnected(stream)
    if (this.isHost || extra.isHost) {
      this.anyHostConnected = true
    }
  }

  onClose (event) {
    const { userid } = event
    console.log('onClose ', event)
  }

  // @Log
  onUserIdAlreadyTaken (useridAlreadyTaken, yourNewUserId) {
    // logging.warn('Userid already taken.', useridAlreadyTaken, 'Your new userid:', yourNewUserId)
    this.connection.userid = this.connection.token()
    this.connect()
  }


  // @Log
  onStreamEnded (event) {
    const { extra } = event
    delete this.streams[extra.username]
    this.onUserDisconnected(event)
    if (extra.id === this.user.id && this.connected) {
      this.joinRoom()
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
      this.onGuestWaiting(newParticipant)
    } else {
      this.connection.acceptParticipationRequest(participantId, userPreferences)
    }
  }

  acceptUser (newParticipant) {
    const { userPreferences } = newParticipant
    const { sender } = userPreferences.connectionDescription
    this.acceptedParticipants.push(participantId)
    this.connection.acceptParticipationRequest(sender, userPreferences)
    this.connection.send('Welcome', sender)
  }

  rejectUser (newParticipant) {
  }

  leave () {
    if (!this.connection) {
      return
    }
    this.connected = false
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
    return this.isPaused
  }

  get muted () {
    return this.isMuted
  }

  toggleVideo () {
    const pause = !this.paused
    if (pause) {
      this.userStream.stream.mute('video')
      this.isPaused = true
    } else {
      this.userStream.stream.unmute()
      if (this.isMuted) {
        this.userStream.stream.mute('audio')
      }
      this.isPaused = false
    }
  }

  toggleAudio () {
    if (this.isMuted) {
      this.userStream.stream.unmute('audio')
      this.userStream.mediaElement.muted = true
      if (this.paused) {
        this.toggleVideo ()
      }
      this.isMuted = false
    } else {
      this.userStream.stream.mute('audio')
      this.isMuted = true
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

  get cameras () {
    return this.connection.DetectRTC.videoInputDevices
  }

  selectFrontCameraDuringActiveSession() {
    // we need to stop previous video tracks because
    // mobile device may not allow us capture
    // both front and back camera streams
    // at the same time
    connection.attachStreams.forEach(function(stream) {
        // stop only video tracks
        // so that we can recapture video track
        stream.getVideoTracks().forEach(function(track) {
            track.stop();
        });
    });

    var mediaConstraints = {
        audio: false, // NO need to capture audio again
        video: {
            facingMode: {exact : 'user'}
        }
    };

    navigator.mediaDevices.getUserMedia(mediaConstraints).then(function(frontCamera) {
        var frontCameraTrack = frontCamera.getVideoTracks()[0];
        connection.getAllParticipants().forEach(function(pid) {
            connection.peers[pid].peer.getSenders().forEach(function(sender) {
                if (sender.track.kind == 'video') {
                    sender.replaceTrack(frontCameraTrack);
                }
            });
        });
    });
  }

  selectBackCameraDuringActiveSession() {
    // we need to stop previous video tracks because
    // mobile device may not allow us capture
    // both front and back camera streams
    // at the same time
    connection.attachStreams.forEach(function(stream) {
        // stop only video tracks
        // so that we can recapture video track
        stream.getVideoTracks().forEach(function(track) {
            track.stop();
        });
    });

    var mediaConstraints = {
        audio: false, // NO need to capture audio again
        video: {
            facingMode: {exact : 'environment'}
        }
    };

    navigator.mediaDevices.getUserMedia(mediaConstraints).then(function(frontCamera) {
        var frontCameraTrack = frontCamera.getVideoTracks()[0];
        connection.getAllParticipants().forEach(function(pid) {
            connection.peers[pid].peer.getSenders().forEach(function(sender) {
                if (sender.track.kind == 'video') {
                    sender.replaceTrack(frontCameraTrack);
                }
            });
        });
    });
  }
}
