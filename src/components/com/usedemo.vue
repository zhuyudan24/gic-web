<template>
  <div>
    <a @click="showDialog">会员分析</a>
    <v-dialog :dialogVisible="show" @cancleHandle="cancleHandle">
    </v-dialog>
    <div style="margin: 100px 100px;">
      <v-selectStore @selectStore="selectStore"></v-selectStore>
    </div>
  </div>
</template>

<script>
  import vDialog from 'components/com/dialog.vue'
  import vSelectStore from 'components/com/selectStore.vue'
  export default {
    name: "salesanalysis",
    data() {
      return {
        show: false,
        curraido: '',
      }
    },
    methods: {
      showDialog() {
        this.show = true;
      },
      cancleHandle(radio) {
        this.show = false;
        if(radio) {
          this.curraido = radio;
          console.log(this.curraido);
        }
      },
      selectStore(stores) {
        console.log(stores);
      }
    },
    created() {

    },
    mounted() {
    },
    components: {
      vDialog,
      vSelectStore
    }
  }
</script>

<style>
</style>
