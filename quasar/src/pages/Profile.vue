<template>
  <div>
      <q-page class="container">
        <!-- Header section -->
        <q-card flat class="card q-mt-md">
          <q-img class="cover" :src="user.cover" style="height: 250px" />
          <q-card-section class="move">
            <div class="header">
              <div class="header__left">
                <div class="header__left__avatar">
                  <q-avatar size="150px" font-size="52px" text-color="white">
                        <img :src="user.pp">
                      </q-avatar>
                </div>
                <div class="header__left__info">
                  <ul dense>
                    <li><span class="text-h6">{{user.name}}</span></li>
                    <li><span class="location text-grey-8"><q-icon name="place"/>{{user.address}}</span></li>
                    <li><span><div class="title"><div class="bg-red-13">{{user.level.tag}}</div><div>({{user.level.remain}} Points to level up)</div></div></span></li>
                  </ul>
                </div>
              </div>
              <div class="header__right">
                <div class="status">
                    <div class="status__item">
                      <div class="status__item__value">{{user.status.reviews}}</div>
                      <div class="status__item__label">Reviews</div>
                    </div>
                    <div class="status__separator"></div>
                    <div class="status__item">
                      <div class="status__item__value">{{user.status.photos}}</div>
                      <div class="status__item__label">Photos</div>
                    </div>
                    <div class="status__separator"></div>
                    <div class="status__item">
                      <div class="status__item__value">{{user.status.followers}}</div>
                      <div class="status__item__label">Followers</div>
                    </div>
                  </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
        <!-- Body section -->
        <div class="row">
          <div class="col-auto">
            <q-card class="q-mr-md widget" bordered flat>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-bold text-grey" style="font-size: 10px">PROFILE WIDGET</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>
                  <q-item-label class="text-bold">Dowload profile widget</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="arrow_right"></q-icon>
                </q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>
                  <q-item-label class="text-bold">Reviews</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="blue-2" class="text-blue text-bold" label="20" />
                </q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>
                  <q-item-label class="text-bold">Photos</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="blue-2" class="text-blue text-bold" label="15" />
                </q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>
                  <q-item-label class="text-bold">Followers</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="blue-2" class="text-blue text-bold" label="5" />
                </q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>
                  <q-item-label class="text-bold">Bookmarks</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="blue-2" class="text-blue text-bold" label="11" />
                </q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>
                  <q-item-label class="text-bold">Been there</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>
                  <q-item-label class="text-bold">Achievements</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>
                  <q-item-label class="text-bold">Recent viewed restaurants</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>
                  <q-item-label class="text-bold">Communuty blog</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            </q-card>
          </div>
          <div class="col">
            <q-card bordered flat>
              <q-card-section>
                <div style="position: relative;">
                <q-img src="https://image.freepik.com/free-vector/morning-view-mountains-green-hill-landscape-sunrise-among-mountains-view_2963-11.jpg" style="height: 200px;" />
                <div class="level">
                  <div class="level__top">
                    <div class="level__top__item">
                      <span class="value">182</span>
                      <span>Foodie</span>
                    </div>
                    <div class="level__top__item">
                      <span class="value">182</span>
                      <span>Foodie</span>
                    </div>
                  </div>
                  <div class="level__bottom">
                    <div>139 Points to level up</div>
                    <q-linear-progress :value="45/100" class="q-mt-md" />
                  </div>
                </div>
                </div>
              </q-card-section>
              <q-card-section>
                <div class="text-bold text-grey-9">Expertise</div>
                <div class="text-grey">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nihil molestias soluta velit veritatis accusamus optio est ducimus voluptatum delectus, reiciendis enim tempora ex alias illo ratione? Enim nobis eveniet at dolorem sit! Incidunt dicta laudantium magni! Voluptas minima quibusdam adipisci explicabo saepe voluptatibus? Reprehenderit cum deleniti sit similique debitis deserunt.
                </div>
                <div class="text-red-13">Learn more</div>
              </q-card-section>
              <q-card-section>
                <div class="text-bold text-grey-9">Here are the neighborhoods you're close to conquering</div>
                <div class="row q-col-gutter-md">
                  <div v-for="(friend, index) in friends" :key="index" class="col-12 col-md-6">
                    <div class="friend">
                      <div>{{friend.name}} ({{friend.done}}% done)</div>
                      <q-linear-progress :value="friend.done/100" class="q-mt-md" />
                      <div class="friend__profile">
                        <img class="friend__profile_pic" :src="friend.pic" alt="pic">
                        <div class="friend__profile__status">
                          <div class="friend__profile__status_item">{{friend.name}}</div>
                          <div class="friend__profile__status_item text-grey">{{friend.reviews}} Reviews, {{ friend.photos}} Photos</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="text-red-13">Learn friends</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data: () => {
    return {}
  },
  computed: {
    ...mapGetters({
      user: 'user/getUser',
      friends: 'user/getFriends'
    })
  },
  created () {
    this.$store.dispatch('user/getFriend', this.user.id)
  }
}
</script>

<style scoped>
.container{
  max-width: 1140px;
  width: 100%;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.card{
  height: 300px;
}
.move{
  transform: translateY(-80%);
  position: absolute;
  width: 100%;
}
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header__left{
  display: flex;
  align-items: center;
}
.header__left__avatar{}
.header__left__info{}
.header__left__info ul{
  list-style: none;
  padding: 0;
  margin: 0;
}
.header__left__info ul li{
  display: flex;
  padding: 0 10px;
}
.header__right{
}
.title{
  display: flex;
  align-items: center;
}
.title div:first-child{
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px 0 0 5px;
}
.title div:last-child{
  background-color: #fff;
  color: #999;
  padding: 5px 10px;
  border-radius: 0 5px 5px 0;
}
.location{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.status{
  display: flex;
  /* align-items: center; */
}
.status__separator{
  background-color: #999;
  margin: 20px 0;
  width: 1px;
}
.status__item{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
}
.status__item__value{
  font-size: 25px;
  font-weight: bold;
}
.status__item__label{
  font-size: 15px;
  color: #999;
}
.level{
  display: flex;
  flex-direction: column;
  bottom: 0;
  right: 0;
  padding: 25px;
  position: absolute;
  font-weight: bold;
  color: #333;
  width: 300px;
}
.level__top{
  display: flex;
}
.level__top__item{
  display: flex;
  align-items: center;
}
.level__top__item span{
  padding: 10px 5px;
}
.level__top__item .value{
  font-size: 25px
}
.friend{
  padding: 5px 0;
}
.friend__profile{
  display: flex;
  padding: 10px 0;
}
.friend__profile_pic{
  width: 50px;
  height: 50px;
  border-radius: 5px;
}
.friend__profile__status{
  padding: 0 10px;
}
.friend__profile__status_item{}
@media (max-width: 800px) {
  .widget{
    display: none;
  }
  .card{
    height: 500px;
  }
  .move {
    transform: translateY(-30%);
    width: 100%;
    padding: 10px 25px;
  }
  .header{
    flex-direction: column;
  }
  .header__left{
    flex-direction: column;
  }
  .header__left__avatar{}
  .header__left__info{}
  .header__left__info ul li{
  justify-content: center;
}
.header__right{}
.title div:last-child{
  background-color: #ddd;
  color: #666;
}
}
</style>
