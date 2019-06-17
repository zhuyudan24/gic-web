module.exports = (parantfile,file) => (r) => {
  import('view/'+ parantfile + '/' + file + '.vue').then((module) => {
    r(module)
  })
}
