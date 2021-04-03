<template>
  <q-page class="row fit">
    <div class="col-6 column q-px-md q-pb-xs justify-between">
        <div class="col-auto row">
            <div class="col-3">
                <img :src="profile.logo" width="100%" height="100%"/>
            </div>
            <div class="col column justify-start">
                <div class="text-h5 col">{{ profile.title }}</div>
                <div class="col" v-html="profile.title"></div>
                <q-btn color="primary" :label="$t('Follow')" icon="person_add" />
            </div>
        </div>
        <div class="col-3 q-mt-md">
            <div v-html="profile.intro"></div>
        </div>
        <div class="col-auto">
            <div class="row q-gutter-md">
                <q-btn color="primary" :label="$t('Connect now')" icon="duo" class="col"/>
                <q-btn color="accent" :label="$t('Book a call')" icon="calendar_today" class="col">
                    <q-menu>
                        <q-list>
                            <q-item clickable v-close-popup>
                                <q-item-section>10:00</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup>
                                <q-item-section>10:00</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup>
                                <q-item-section>10:00</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup>
                                <q-item-section>10:00</q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
            </div>
        </div>
        <div class="col-auto row text-dark">
            <div class="col-4 text-h6">{{ $t('Follow us')}}</div>
            <div class="col-8 row q-gutter-md justify-evenly">
              <q-icon class="col" size="xl" :name="`fab fa-${social.type}`" v-for="(social, ix) in profile.social" :key="ix" />
            </div>
        </div>
    </div>
    <div class="col-6 column q-pa-xs">
        <div class="col-4">
            <!--img :src="profile.backgroundPicture" width="100%" height="100%"/-->
            <q-card>
                <q-card-section>
                    <q-carousel
                        animated
                        v-model="slide"
                        arrows
                        navigation
                        infinite
                        autoplay
                        >
                        <q-carousel-slide class="rounded-corners" v-for="(img, ix) in profile.gallery" :name="ix" :key="ix" :img-src="img" />
                    </q-carousel>
                </q-card-section>
            </q-card>
        </div>
    </div>
  </q-page>
</template>
<script>
export default {
  data () {
    return {
      slide: 0,
      profile: {
        username: 'username',
        title: 'AUBA Oversize Style',
        subtitle: '<a href="">@AUBABoutique</a>',
        following: false,
        backgroundPicture:
          'https://media.istockphoto.com/photos/background-of-mannequin-for-female-on-color-canvas-background-picture-id1094745512?k=6&m=1094745512&s=612x612&w=0&h=SC6JoW3rV5xcNI6dSmRVCNK36Sb5dZguPXFGZ3q-Rwc=',
        logo:
          'https://scontent.fpmi1-1.fna.fbcdn.net/v/t1.6435-1/p320x320/130457284_3536493656439221_3369668135175541122_n.jpg?_nc_cat=105&ccb=1-3&_nc_sid=1eb0c7&_nc_ohc=zOCWGO34XMwAX_G_eGU&_nc_oc=AQkABq4dsUUYXjA-LWeJe5vlvdny76f-tnnpOCqApQllRE4o4MpnR2M9Hrw18vyWmp8&_nc_ht=scontent.fpmi1-1.fna&tp=6&oh=ee44dec25457994e3db7d59c165f1454&oe=608886D2',
        intro:
          'The store is open, come visit us 😘 #aubaboutique #palmademallorca #womenfashion #fashionoversize #curvyfashion #spana #baleares #spring2021 #happysaturday #mallorca #fashion2021 #spring',
        location,
        online: true,
        social: [
          { type: 'twitter', url: '' },
          { type: 'facebook', url: '' },
          { type: 'instagram', url: '' },
          { type: 'whatsapp', url: '' }
        ],
        gallery: [
          'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/E1266601_%285398889640%29.jpg/1200px-E1266601_%285398889640%29.jpg',
          'https://static.onecms.io/wp-content/uploads/sites/14/2020/07/15/fashion-header-1-2000.jpg',
          'https://www.criteo.com/wp-content/uploads/2020/07/fashion-featured-image.png',
          'https://www.fbifashioncollege.com.au/wp-content/uploads/2019/11/1.jpg'
        ],
        calendar: [
          { dt: '2021-03-31T10:00:00', username: '' },
          { dt: '2021-03-31T12:00:00', username: '' },
          { dt: '2021-03-31T14:00:00', username: '' },
          { dt: '2021-04-31T11:00:00', username: '' },
          { dt: '2021-04-31T12:00:00', username: '' },
          { dt: '2021-05-31T15:00:00', username: '' }
        ],
        reviews: 124,
        followers: 3200
      }
    }
  }
}
</script>
