module.exports = (parantfile,file) => (r) => {
  import('components/'+ parantfile + '/' + file + '.vue').then((module) => {
    r(module)
  })
}

