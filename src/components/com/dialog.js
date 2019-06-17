export default {
  name: "salesanalysis",
  data() {
    return {
      tableData: [{
        id: 'aaa',
        name: '门店1',
        remarks: '测试',
        validity: '2018-05-21',
        store: '门店1',
        stock: '222'
      }],
      radio: '',
      page: {
        current_page: 1,
        page_size: 10,
        total: 100
      },
      dialogCardVisible: false
    }
  },
  props: {
    dialogStoreVisible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    dialogStoreVisible: function (val) {
      if(val) {
        this.dialogCardVisible = true;
      }
    }
  },
  methods: {
    closeDialog() {
      this.radio = '';
      this.$emit('cancleHandle','')
    },
    cancle(){
      this.radio = '';
      this.dialogCardVisible = false;
      this.$emit('cancleHandle','')
    },
    handleCurrentChange(val) {
      this.page.current_page = val;
    },
    sureCard() {
      if(!this.radio) {
        this.$message({
          type: 'warnning',
          message: '请选择门店'
        });
        return false;
      }else {
        this.dialogCardVisible = false;
        this.$emit('cancleHandle',this.radio);
      }
    },
    getList() {
    //动态获取数据
    }
  },
  created() {
      this.getList();
  },
  mounted() {
  }
}
