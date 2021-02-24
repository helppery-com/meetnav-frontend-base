const users = [
  {
    id: 1,
    name: 'Mike Edward',
    address: 'Lisbone Portugal',
    username: 'admin',
    password: 'admin',
    avatar: 'https://eu.ui-avatars.com/api/?name=username',
    level: {
      tag: '05 Foot',
      remain: '150'
    },
    cover: 'https://coverfiles.alphacoders.com/295/29523.jpg',
    pp: 'https://housemydog.com/blog/wp-content/uploads/2016/07/AnimalPictureCuteLabradorRetrieverPuppyWithBowTieAndRoseInMouth1024x768.jpg',
    status: {
      reviews: '142',
      photos: '201',
      followers: '3.2k'
    }
  }
]

const friends = [
  { id: 1, userId: 1, name: 'La La Land Brew Pub', done: 12, pic: 'https://i.pinimg.com/236x/ec/a9/5e/eca95e0fc834114ffe630e0be215e051.jpg', reviews: 2, photos: 10 },
  { id: 2, userId: 1, name: 'DLF Phase 1, Gurgaon', done: 18, pic: 'https://i.pinimg.com/236x/ec/a9/5e/eca95e0fc834114ffe630e0be215e051.jpg', reviews: 2, photos: 10 },
  { id: 3, userId: 1, name: 'Name3', done: 65, pic: 'https://i.pinimg.com/236x/ec/a9/5e/eca95e0fc834114ffe630e0be215e051.jpg', reviews: 2, photos: 10 },
  { id: 4, userId: 1, name: 'Name4', done: 30, pic: 'https://i.pinimg.com/236x/ec/a9/5e/eca95e0fc834114ffe630e0be215e051.jpg', reviews: 2, photos: 10 },
  { id: 5, userId: 1, name: 'Name5', done: 12, pic: 'https://i.pinimg.com/236x/ec/a9/5e/eca95e0fc834114ffe630e0be215e051.jpg', reviews: 2, photos: 10 }
]

export const getUser = (id) => {
  return users.filter(user => user.id === id)[0]
}

export const getFriends = (id) => {
  return friends.filter(friends => friends.userId === id)
}
