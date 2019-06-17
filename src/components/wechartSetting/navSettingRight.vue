<template>
  <div class="setting-right">
    <img width="100%" height="64" src="./navbar.png" alt="">
    <div class="navbottom">
      <a class="navbottom-item" v-for="(item,index) in navList" v-if="item.status == 1 ? true : false">
        <img v-if="index < 1" width="25" height="25" :src='"../../../static/img/navico/" + curStyle+ "/"+ item.icon.idx + "/activeicon" + item.icon.url + ".png"' alt="">
        <img v-else width="25" height="25" :src='"../../../static/img/navico/" + curStyle+ "/"+ item.icon.idx + "/icon" + item.icon.url + ".png"' alt="">
        <p class="title-wrap">{{ item.title }}</p>
      </a>
    </div>
  </div>
</template>

<script>
    export default {
      name: "nav-settingRight",
      props: {
        navList: {
          type: Array,
          default: []
        },
        curStyle: {
          type: String,
          default: ''
        }
      },
      mounted() {
      }
    }
</script>

<style scoped>
  .title-wrap{
    width: 74px;
    overflow: hidden;
    margin: 0 auto;
  }
</style>
