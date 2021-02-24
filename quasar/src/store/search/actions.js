export const search = ({ commit }) => {
  setTimeout(() => {
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === XMLHttpRequest.DONE) {
        commit('updateSearch', JSON.parse(xhttp.response))
        commit('updateLoaded', true)
      }
    }
    xhttp.open('GET', 'https://raw.githubusercontent.com/helppery-com/meetnav-frontend-base/281a520cb57fadef7ccb6ab3952f294ba5a53513/tests/data/search.json')
    xhttp.send()
  }, 3000)
}
