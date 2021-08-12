export const logout = 'लॉग आउट'
export const unsupported = 'यह ब्राउज़र webrtc का समर्थन नहीं करता'
export const admin_loggedin = 'आप एक व्यवस्थापक के रूप में लॉग इन हैं'
export const you = 'आप'
export const send_a_message = 'एक संदेश भेजें'

export const side = {
  chat: 'चैट',
  settings: 'समायोजन',
}

export const connect = {
  login_title: 'कृपया लौग इन करें',
  invitation_title: 'आपको इस कमरे में आमंत्रित किया गया है',
  displayname: 'अपना प्रदर्शन नाम दर्ज करें',
  password: 'कुंजिका',
  connect: 'जुडिये',
  error: 'लॉगिन त्रुटि',
}

export const context = {
  ignore: 'नज़रअंदाज़ करना',
  unignore: 'अनदेखा न करें',
  mute: 'मूक',
  unmute: 'अनम्यूट',
  release: 'बल रिलीज नियंत्रण',
  take: 'फोर्स टेक कंट्रोल',
  give: 'नियंत्रण दें',
  kick: 'हटाना',
  ban: 'आईपी ​​पर प्रतिबंध लगाओ',
  confirm: {
    kick_title: '{नाम} को हटा दें ?',
    kick_text: 'क्या आप वाकई {name} को हटाना चाहते हैं?',
    ban_title: 'प्रतिबंध {name}?',
    ban_text: 'क्या आप वाकई {name} पर प्रतिबंध लगाना चाहते हैं? इसे पूर्ववत करने के लिए आपको सर्वर को पुनरारंभ करना होगा।',
    mute_title: 'म्यूट {नाम}?',
    mute_text: 'क्या आप वाकई {name} को म्यूट करना चाहते हैं?',
    unmute_title: 'अनम्यूट {नाम}?',
    unmute_text: 'क्या आप वाकई {name} को अनम्यूट करना चाहते हैं?',
    button_yes: 'हाँ',
    button_cancel: 'रद्द करना',
  },
}

export const controls = { release: 'नियंत्रण जारी करें',
    request: 'नियंत्रण का अनुरोध करें',
    lock: 'लॉक कंट्रोल',
    unlock: 'नियंत्रण अनलॉक करें'
}

export const room = { 
  lock: 'लॉक रूम (उपयोगकर्ताओं के लिए)',
  unlock: 'कमरे अनलॉक (उपयोगकर्ताओं के लिए)',
  locked: 'कमरा बंद (उपयोगकर्ताओं के लिए)',
  unlocked: 'कमरा अनलॉक (उपयोगकर्ताओं के लिए)'
}

export const setting = {
  scroll: 'संवेदनशीलता स्क्रॉल करें',
  scroll_invert: 'उलटा स्क्रॉल',
  autoplay: 'ऑटोप्ले वीडियो',
  ignore_emotes: 'इमोट्स पर ध्यान न दें',
  chat_sound: 'चैट साउंड खेलें',
  keyboard_layout: 'कीबोर्ड लेआउट',
  broadcast_is_active: 'प्रसारण सक्षम',
  broadcast_url: 'आरटीएमपी यूआरएल',
}

export const connection = {
  logged_out: 'आप लॉग आउट कर दिया गया है!',
  connected: 'सफलतापूर्वक जुड़ा हुआ',
  disconnected: 'आप काट दिया गया है',
  button_confirm: 'ठीक है'
}

export const notifications = {
  connected: '{name} जुड़ा',
  disconnected: '{name} कट गया',
  controls_taken: '{name} नियंत्रण लिया',
  controls_taken_force: 'बल नियंत्रण ले लिया',
  controls_taken_steal: 'से नियंत्रण ले लिया {name}',
  controls_released: '{name} नियंत्रण जारी',
  controls_released_force: 'बल नियंत्रण जारी',
  controls_released_steal: 'से नियंत्रण जारी किया {name}',
  controls_given: 'को नियंत्रण दिया {name}',
  controls_has: '{name} नियंत्रण है',
  controls_has_alt: 'लेकिन मैंने उन्हें बता दिया कि आप इसे चाहते थे',
  controls_requesting: '{name} नियंत्रण का अनुरोध कर रहा है',
  resolution: 'संकल्प को बदल दिया {width}x{height}@{rate}',
  banned: 'पर प्रतिबंध लगा दिया {name}',
  kicked: 'निकाला गया {name}',
  muted: 'म्यूट किए गए {name}',
  unmuted: 'अनम्यूट किया गया {name}',
  room_locked: 'कमरा बंद कर दिया',
  room_unlocked: 'कमरा खोल दिया',
}
