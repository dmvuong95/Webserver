module.exports = {
  filterMethod: function () {
    if (arguments[0] == undefined) return;
    if (typeof arguments[0] == 'object') {
      if (typeof arguments[0].before == 'function') this.filterStore['before-GlobalCtr'] = arguments[0].before;
      if (typeof arguments[0].after == 'function') this.filterStore['after-GlobalCtr'] = arguments[0].after;
    } else if (typeof arguments[0] == 'string') {
      if (typeof arguments[1] == 'object') {
        if (typeof arguments[1].before == 'function') this.filterStore[`before-${arguments[0]}`] = arguments[1].before;
        if (typeof arguments[1].after == 'function') this.filterStore[`after-${arguments[0]}`] = arguments[1].after;
      } else if (typeof arguments[1] == 'string') {
        if (typeof arguments[2] == 'object') {
          if (typeof arguments[2].before == 'function') this.filterStore[`before-${arguments[0]}-${arguments[1]}`] = arguments[2].before;
          if (typeof arguments[2].after == 'function') this.filterStore[`after-${arguments[0]}-${arguments[1]}`] = arguments[2].after;
        }
      }
    }
  },
  filterStore: {}
}