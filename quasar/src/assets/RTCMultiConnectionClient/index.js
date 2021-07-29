/* eslint-disable */
import RTCMultiConnection from 'rtcmulticonnection'
import * as io from 'socket.io-client'
import hark from 'hark'

global.io = io
global.hark = hark

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
  acceptedParticipants = []
  updatedAt = new Date()
  isHost = false
  recorder = null
  users = {}
  liveVideoChat = false

  extra = {
    paused: false,
    muted: false
  }

  onMessage (event) {}
  onUserConnected (event) {}
  onUserDisconnected () {}
  onGuestWaiting (event) {}
  onRoomOpened () {}
  onUserChanged () {}

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

  async connect (roomId, { withCamera, withMic }) {
    this.isHost = !roomId
    const { connection } = this
  
    if (roomId) {
      this.roomId = roomId
    } else {
      await this.newRoomId()
    }

    const dataOnly = !(withCamera || withMic)
    let camera = {}
    let audio = {}
    await this.initRTC()
    if (dataOnly) {
      connection.session = {
        audio: false,
        video: false,
        data: true
      }
    } else {
      connection.session = {
        audio: connection.DetectRTC.hasMicrophone,
        video: connection.DetectRTC.hasWebcam,
        data: true
      }
      camera = this.getCameraById(withCamera)
      audio = this.getMicrophoneById(withMic)
      if (true || this.lowBandwith) {
        // logging.info('lowBandwith', connection)
        connection.bandwidth = {
          audio: 50, // 50 kbps
          video: 300, // 256 kbps
          screen: 300 // 300 kbps
        }
        connection.mediaConstraints = {
          audio: {
            deviceId: audio.id
          },
          video: {
            deviceId: camera.id
          }
        }
      }
      // For extra
      camera = {
        id: camera.id,
        label: camera.label
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
    connection.onExtraDataUpdated = this.onExtraDataUpdated.bind(this)
    connection.onUserStatusChanged = this.onUserStatusChanged.bind(this)

    this.extra = {
      ...this.extra,
      ...this.user,
      camera,
      dataOnly
    }
    connection.extra = this.encodeExtra()
    if (this.isHost) {
      this.connection.onNewParticipant = this.onNewParticipant.bind(this)
    }
    return await this.joinRoom()
  }

  getCameraById (id) {
    const { videoInputDevices } = this.connection.DetectRTC
    return videoInputDevices.filter(i => i.id === id)[0]
  }

  getMicrophoneById (id) {
    const { audioInputDevices } = this.connection.DetectRTC
    return audioInputDevices.filter(i => i.id === id)[0]
  }

  async onSocketDisconnect (event) {
    console.log('onSocketDisconnect', event)
    if (this.connected) {
      console.log('onSocketDisconnect, reconnecting')
      await this.connect(this.roomId, {
        withCamera: !this.extra.dataOnly,
        withMic: !this.extra.dataOnly
      })
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
        this.onRoomOpened()
        this.send('hello')
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
        this.roomId = `${this.user.id}-${makeid(3)}`
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
    if (msg === 'hello') {
      this.updateExtra()
    } else {
      this.onMessage({
        ...msg,
        ...msg.data,
        ...this.decodeExtra(msg.extra)
      })
    }
  }

  // @Log
  onMute (ev) {
    const { userid, muteType: type } = ev
    const stream = this.streams[userid]
    if (type === 'audio' || type === 'both') {
      stream.extra.muted = true
    }
    if (type === 'video' || type === 'both') {
      stream.extra.paused = true
    }
  }

  // @Log
  onUnmute (ev) {
    const { userid, unmuteType: type } = ev
    const stream = this.streams[userid]
    if (type === 'audio' || type === 'both') {
      stream.extra.muted = false
    }
    if (type === 'video' || type === 'both') {
      stream.extra.paused = false
    }
  }

  // @Log
  onStream (stream) {
    console.log('RTC on stream', stream)
    stream.updatedAt = new Date()
    // stream.mediaElement.snapshot = '/incognito-mode.png'
    stream.mediaElement.poster = ''
    stream.extra = this.decodeExtra(stream.extra)
    const { userid, extra } = stream
    if (extra.id) {
      if (extra.id === this.user.id) {
        this.userStream = {
          ...stream,
          extra: this.extra
        }
        this.streams[userid] = this.userStream
        this.connected = true
        try {
          this.startRecording(stream.stream)
        } catch(ex) {
          console.error('Error recording stream', ex)
        }
      } else {
        this.streams[userid] = stream
      }
      this.onUserConnected(stream)
      if (this.isHost || extra.isHost) {
        this.anyHostConnected = true
      }
    } else {
      console.error('Invalid stream', stream)
    }
    stream.speechEvents = hark(stream.stream, {});
    stream.speechEvents.on('speaking', () => {
      const stream = this.streams[userid]
      stream.extra.speaking = true
      this.onUserChanged(stream)
    })
    stream.speechEvents.on('stopped_speaking', () => {
      const stream = this.streams[userid]
      stream.extra.speaking = false
      this.onUserChanged(stream)
    })
  }

  onUserStatusChanged (user) {
    const { userid, status, extra } = user
    if (status === 'offline') {
      delete this.users[userid]
      this.users = {
        ...this.users
      }
    } else {
      this.users = {
        ...this.users,
        [userid]: {
          ...user,
          extra: this.decodeExtra(extra)
        }
      }
    }
    this.liveVideoChat = Object.keys(this.users)
      .map(k => this.users[k].extra)
      .filter(extra => extra && extra.camera && !!extra.camera.id).length !== 0
  }

  onSpeaking (event) {
    const { userid } = event
    const stream = this.streams[userid]
    stream.speaking = true
  }

  onSilence (event) {
    const { userid } = event
    const stream = this.streams[userid]
    stream.speaking = false
  }

  startRecording (stream) {
    return
    const options = {
      audioBitsPerSecond : 128000,
      videoBitsPerSecond : 0,
      mimeType : 'video/webm;codecs=vp9'
    }
    this.recorder = new MediaRecorder(stream, options)
    this.recorder.ondataavailable = function(e) {
      // console.log('Video data available, size: ' + (e.data||{size: 0}).size);
    }
    this.recorder.start(5000)
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
    const { extra, userid } = event
    delete this.streams[userid]
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
    this.extra = {}
  }

  get paused () {
    return this.extra.paused
  }

  get muted () {
    return this.extra.muted
  }

  toggleVideo () {
    if (this.paused) {
      this.userStream.stream.unmute('video')
      /* 
        if (this.muted) {
          this.userStream.stream.mute('audio')
        }
      */
    } else {
      this.userStream.stream.mute('video')      
    }
    this.updateExtra()
  }

  toggleAudio () {
    if (this.muted) {
      this.userStream.stream.unmute('audio')
      this.userStream.mediaElement.muted = true
    } else {
      this.userStream.stream.mute('audio')
    }
    this.updateExtra()
  }

  setExtra (extra) {
    this.extra = {
      ...this.extra,
      ...extra
    }
    this.updateExtra()
  }

  updateExtra() {
    this.connection.extra = this.encodeExtra()
    this.connection.updateExtraData()
    this.onUserChanged(this.userStream)
  }

  onExtraDataUpdated (stream) {
    const { extra, userid } = stream
    const user = this.streams[userid]
    if (user) {
      user.extra = this.decodeExtra(extra)
    }
    this.onUserStatusChanged({ ...stream, status: 'online' })
  }

  encodeExtra () {
    return encodeURIComponent(JSON.stringify(this.extra))
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
    return this.initRTC().then(() =>
      this.connection.DetectRTC.videoInputDevices
    )
  }

  get microphones () {
    return this.initRTC().then(() =>
      this.connection.DetectRTC.audioInputDevices
    )
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

  // ----------------------------------------------------
  // getStats codes goes here
  // ----------------------------------------------------
  onPeerStateChanged (event) {
    if(event.iceConnectionState === 'connected' && event.signalingState === 'stable') {
      if(connection.peers[event.userid].gettingStats === true) {
        return;
      }
      connection.peers[event.userid].gettingStats = true; // do not duplicate

      var peer = connection.peers[event.userid].peer;
      var interval = 1000;

      if(DetectRTC.browser.name === 'Firefox') {
        getStats(peer, peer.getLocalStreams()[0].getTracks()[0], function(stats) {
          onGettingWebRTCStats(stats, event.userid);
        }, interval);
      }
      else {
        getStats(peer, function(stats) {
          onGettingWebRTCStats(stats, event.userid);
        }, interval);
      }
    }
  }

  onGettingWebRTCStats(stats, remoteUserId) {
    if(!this.connection.peers[remoteUserId]) {
      stats.nomore();
    }
  
    var statsData = 'UserID: ' + remoteUserId + '\n';
    statsData += 'Bandwidth: ' + bytesToSize(stats.bandwidth.speed);
    statsData += '\n';
    statsData += 'Encryption: ' + stats.encryption;
    statsData += '\n';
    statsData += 'Codecs: ' + stats.audio.recv.codecs.concat(stats.video.recv.codecs).join(', ');
    statsData += '\n';
    statsData += 'Data: ' + bytesToSize(stats.audio.bytesReceived + stats.video.bytesReceived);
    statsData += '\n';
    statsData += 'ICE: ' + stats.connectionType.remote.candidateType.join(', ');
    statsData += '\n';
    statsData += 'Port: ' + stats.connectionType.remote.transport.join(', ');
    console.log(statsData)  
  }
}
