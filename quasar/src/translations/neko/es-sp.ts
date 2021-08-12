export const logout = 'cerrar sesión'
export const unsupported = 'este navegador no es compatible con webrtc'
export const admin_loggedin = 'Estás conectado como administrador'
export const you = 'Tú'
export const send_a_message = 'Enviar un mensaje'

export const side = {
  chat: 'Charlar',
  settings: 'Configuración'
}

export const connect = {
  login_title: 'Por favor, inicie sesión',
  invitation_title: 'Usted ha sido invitado a esta sala',
  displayname: 'Escriba su nombre para mostrar',
  password: 'Contraseña',
  connect: 'Conectar',
  error: 'Error de inicio de sesión'
}

export const context = {
  ignore: 'Ignorar',
  unignore: 'Unignore',
  mute: 'Mudo',
  unmute: 'Reactivar el reactivar el mínimo',
  release: 'Forzar controles de liberación',
  take: 'Forzar controles de toma',
  give: 'Dar controles',
  kick: 'Patear',
  ban: 'Prohibir IP',
  confirm: {
    kick_title: 'retirar {name}?',
    kick_text: 'Estás seguro de que desea eliminar {name}?',
    ban_title: 'prohibición {name}?',
    ban_text: '¿Estás seguro de que quieres prohibir a {name}? Deberá reiniciar el servidor para deshacer esto.',
    mute_title: 'silencio {name}?',
    mute_text: 'Estas seguro que quieres silenciar {name}?',
    unmute_title: 'Ruidosa {name}?',
    unmute_text: '¿Estás seguro de que quieres activar el sonido? {name}?',
    button_yes: 'sí',
    button_cancel: 'Cancelar',
  },
}

export const controls = {
  release: 'Controles de liberación',
  request: 'Controles de solicitud',
  lock: 'Controles de bloqueo',
  unlock: 'Desbloquear controles'
}

export const room = {
  lock: 'Bloquear sala (para usuarios)',
  unlock: 'Desbloquear sala (para usuarios)',
  locked: 'Sala bloqueada (para usuarios)',
  unlocked: 'Sala desbloqueada (para usuarios)'
}

export const setting = {
  scroll: 'Sensibilidad de desplazamiento',
  scroll_invert: 'Invertir desplazamiento',
  autoplay: 'Reproducción automática de vídeo',
  ignore_emotes: 'Ignorar Emotes',
  chat_sound: 'Reproducir sonido de chat',
  keyboard_layout: 'Distribución del teclado',
  broadcast_is_active: 'Transmisión habilitada',
  broadcast_url: 'URL de RTMP',
}

export const connection = {
  logged_out: '¡Se ha desesgado!',
  connected: 'Conectado correctamente',
  disconnected: 'Se le ha desconectado',
  button_confirm: 'De acuerdo'
}

export const notifications = {
  connected: '{name} conectado',
  disconnected: '{name} desconectado',
  controls_taken: '{name} tomó los controles',
  controls_taken_force: 'la fuerza tomó los controles',
  controls_taken_steal: 'tomó los controles de {name}',
  controls_released: '{name} soltó los controles',
  controls_released_force: 'fuerza soltó los controles',
  controls_released_steal: 'liberó los controles de {name}',
  controls_given: 'le dio los controles a {name}',
  controls_has: '{name} tiene los controles',
  controls_has_alt: 'Pero les dejé saber que lo querías',
  controls_requesting: '{name} está solicitando los controles',
  resolution: 'cambió la resolución a {width}x{height}@{rate}',
  banned: 'banned {name}',
  kicked: 'golpeado {name}',
  muted: 'apagado {name}',
  unmuted: 'sin silenciar {name}',
  room_locked: 'cerró la habitación',
  room_unlocked: 'desbloqueó la habitación',
}
