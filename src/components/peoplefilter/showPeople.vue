<template>
    <div>
      <span>{{ limitCondition }}</span>
    </div>
</template>

<script>
    export default {
      name: "show-people",
      data() {
        return {
          memberGrade: [],
          curlimitCondition: ''
        }
      },
      props: ['limitCondition'],
      methods: {
        getGradeList() {
          this.axios.get('/api-admin/grade-list').then(res => {
            if (res.data.errorCode === 0) {
              this.memberGrade = res.data.result;

            }
          })
        }
      },
      watch: {
        limitCondition(newVal,oldVal) {
          console.log('ddd');
          console.log(newVal);
          this.curlimitCondition = newVal;
          let tempdata = JSON.parse(this.curlimitCondition);
          console.log(tempdata);
        }
      },
      mounted() {
        this.getGradeList();
      }
    }
</script>

<style scoped>

</style>
