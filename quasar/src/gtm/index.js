/* eslint-disable */
import { uid } from 'quasar'

let initialised = false
export default {
  init () {
    if (initialised) {
      return
    }
    initialised = true
    const src = document.createElement('script')
    src.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=UA-179501912-1')
    document.head.appendChild(src)

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'UA-179501912-1');

    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-K8CDPQK')
  },
  logEvent(category, action, label, value) {

    if (typeof(dataLayer) !== 'undefined') {
      dataLayer.push({
        'event': 'customEvent',
        'category': category,
        'action': action,
        'label': label,
        'value': value,
        'cid': this.getCid()
      });
    }
  },

  logPage(path) {
    // Here you can preprocess the path, if needed
    if (typeof(dataLayer) !== 'undefined') {
      dataLayer.push({
        'event': 'customPageView',
        'path': path,
        'cid': this.getCid()
      });
    }
  },

  getCid() {
    // We need an unique identifier for this session
    // We store it in a localStorage, but you may use cookies, too
    if (!localStorage.cid) {
      localStorage.cid = uid();
    }
    return localStorage.cid;
  },

}