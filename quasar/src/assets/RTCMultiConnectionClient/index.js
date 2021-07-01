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
  acceptedParticipants = []
  updatedAt = new Date()
  isHost = false
  recorder = null

  extra = {
    paused: false,
    muted: false
  }

  onMessage (event) {}
  onUserConnected (event) {}
  onUserDisconnected () {}
  onGuestWaiting (event) {}
  onRoomOpened () {}

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
    if (dataOnly) {
      connection.session = {
        audio: false,
        video: false,
        data: true
      }
    } else {
      await this.initRTC()
      connection.session = {
        audio: connection.DetectRTC.hasMicrophone,
        video: connection.DetectRTC.hasWebcam,
        data: true
      }
      camera = this.connection.DetectRTC.videoInputDevices[0]
      if (true || this.lowBandwith) {
        // logging.info('lowBandwith', connection)
        connection.bandwidth = {
          audio: 50, // 50 kbps
          video: 300, // 256 kbps
          screen: 300 // 300 kbps
        }
        connection.mediaConstraints = {
          audio: true,
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
    this.extra = {
      ...this.extra,
      ...this.user,
      camera
    }
    connection.extra = this.encodeExtra()
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
        this.onRoomOpened()
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
      /* if (e.muteType === 'video') {
        e.mediaElement.setAttribute('poster', '/incognito-mode.png')
      } */
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
    // stream.mediaElement.snapshot = '/incognito-mode.png'
    stream.mediaElement.poster = ''
    stream.extra = this.decodeExtra(stream.extra)
    const { userid, extra } = stream
    if (extra.id) {
      this.streams[userid] = stream
      if (extra.id === this.user.id) {
        this.userStream = {
          ...stream,
          extra: this.extra
        }
        this.connected = true
        try {
          this.startRecording(stream.stream)
        } catch(ex) {
          console.error('Error recording stream', ex)
        }
      }
      this.onUserConnected(stream)
      if (this.isHost || extra.isHost) {
        this.anyHostConnected = true
      }
    } else {
      console.error('Invalid stream', stream)
    }
  }

  startRecording (stream) {
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
    delete this.connection
  }

  get paused () {
    return this.extra.paused
  }

  get muted () {
    return this.extra.muted
  }

  toggleVideo () {
    this.extra.paused = !this.extra.paused
    if (this.extra.paused) {
      this.userStream.stream.mute('video')
    } else {
      this.userStream.stream.unmute()
      if (this.muted) {
        this.userStream.stream.mute('audio')
      }
    }
    this.updateExtra()
  }

  toggleAudio () {
    this.extra.muted = !this.extra.muted
    if (this.extra.muted) {
      this.userStream.stream.unmute('audio')
      this.userStream.mediaElement.muted = true
    } else {
      this.userStream.stream.mute('audio')
    }
    this.updateExtra()
  }


  updateExtra() {
    this.connection.extra = this.encodeExtra()
    this.connection.updateExtraData()
  }

  onExtraDataUpdated ({ extra, userid }) {
    extra = this.decodeExtra(extra)
    const user = this.streams[userid]
    if (user) {
      user.extra = extra
    }
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
