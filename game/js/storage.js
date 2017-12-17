const Storage = {// eslint-disable-line
  loadItem (id) {
    return window.localStorage.getItem('spielsklave_' + id)
  },

  saveItem (id, value) {
    window.localStorage.setItem('spielsklave_' + id, value)
  }
}
