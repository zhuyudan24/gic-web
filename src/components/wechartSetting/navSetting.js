import leftMenu from 'components/leftMenu/leftMenu.vue'
import nav from 'components/nav/nav.vue'
import settingRight from './navSettingRight.vue'
import draggable from 'vuedraggable'
import { checkSuccess,checkFalse,checkStatus } from '../../common/js/checkStatus.js'
import Linktools from 'components/linktools/linktools.vue'
let qs = require('qs');
export default {
  name: "navSetting",
  data() {
    return {
      show: true,
      bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
      defaultActive: '/navSetting',
      navpath: [
        {
          name: '小程序配置',
          path: ''
        },
        {
          name: '导航设置',
          path: '/navSetting'
        }
      ],
      navList: [],
      dialogIconVisible: false,
      imgCount: [
        {
          index: 1,
          name: '积分商城'
        },
        {
          index: 2,
          name: '附近门店'
        },
        {
          index: 3,
          name: '积分服务'
        },
        {
          index: 4,
          name: '我的'
        },
        {
          index: 5,
          name: '分类'
        },
        {
          index: 6,
          name: '购物车'
        },
        {
          index: 7,
          name: '小程序'
        },
        {
          index: 8,
          name: '客服'
        }
      ],
      curEdit: '',
      curStyle: 'red',
      curdelete: [],
      linkToolsVisible: false,
      curlinkIdx: null,
      errortip: false,
      collapseFlag: false,
      leftModulesName: '小程序配置',
      leftMenuRouter: [],
      iconState:false,
      projectName: 'gic-web',

      // 类型
      options: [],
      navStyle: '',
      oldLinkId:'',

      allStyleIdArr:[],   // 保存所有的id、pageId 用于做 类型与类型 不能重复的判断
      allNavIdArr:[],   // 保存所有的导航链接id - 最后一级id  导航与导航

      allStyleIdArr2:[],   // 保存所有的类型id 用于做 类型与导航 不能重复的判断

      loading:true,

      addNavBtnBool:true, // 添加导航的按钮是否显示
    }
  },
  methods: {
    // 复制
    onErrorLink() {
      this.$message({
        message: '复制失败',
        type: 'error'
      });
    },
    onCopyLink() {
      this.$message({
        message: '已复制到粘贴板',
        type: 'success'
      });
    },
    linkTool(Idx,item) {
      // console.log(item);
      this.linkToolsVisible = true;
      this.curlinkIdx = Idx;
      if(item.link){
        var id = item.link.params.pageId?item.link.params.pageId:item.link.id;
        this.linkToolId = id
        this.oldLinkId = item.linkId;
      }
    },
    // 选择链接的确定按钮
    linkSelect(val) {
      if('params' in val) {
        // 判断 导航与导航 是否重复
        var id = val.params.pageId?val.params.pageId:val.id;
        // console.log(this.allStyleIdArr);
        if(id!=5){  // id 为5 时是 h5 链接，不作处理
          if(id != this.linkToolId){
            if(this.allNavIdArr.indexOf(id)>-1){
              checkFalse('导航链接不能重复哦');
              return;
            }else{
              if(id!=17){  // 不为5 且不为17 不显示类型
                if(this.oldLinkId){ // 若有类型，则去掉
                  this.navList[this.curlinkIdx].linkId = null;
                  this.navList[this.curlinkIdx].customLinkType = null;
                  var idx = this.allStyleIdArr.indexOf(this.oldLinkId);
                  this.allStyleIdArr.splice(idx,1);
                }
              }else{  // 要显示出类型

              }
            }
            if(this.allStyleIdArr.indexOf(id)>-1){
              checkFalse('导航链接与类型不能重复哦');
              return;
            }
          }
        }
        // console.log(this.allStyleIdArr);
        this.allNavIdArr[this.curlinkIdx] = id;
        this.navList[this.curlinkIdx].link = val;
        this.linkToolsVisible = false;
      }else{
        this.linkToolsVisible = false;
      }
    },
    // 拖拽事件  拖动中
    getListdata(){  
      // console.log(this.navList);
    },
    // 拖动结束
    datadragEnd (evt) { 
      // console.log(this.navList);
      this.getIdArr(this.navList); // 获得this.allStyleIdArr 和 this.allNavIdArr
      // console.log('拖动前的索引 :' + evt.oldIndex)
      // console.log('拖动后的索引 :' + evt.newIndex)
    },
    cloneComponent(){
      // console.log(this.navList);
    },
    // 获得类型
    getNavStyle(){ 
      this.axios.get('/api-admin/list-guide-type',{
        params: {
          requestProject: 'gic-web'
        }
      }).then(res => {
        var data = res.data;
        // console.log(data); 
        if(data.errorCode==0){
          this.options = data.result;
        }else{
          checkFalse();
          return false;
        }
      })
    },
    // 改变类型  判断是否重复
    changeNavStyle(val,item,index){ // index为整个设置数值的下标
      // console.log(val);
      if(val){
        let obj = {};
        obj = this.options.find((style) => {
          return style.guideType === val;
        })

        this.getIdArr(this.navList); // 获得this.allStyleIdArr 和 this.allNavIdArr

        if(this.allStyleIdArr.indexOf(obj.linkId) > -1){  // 先类型间相比较
          checkFalse('类型不能重复哦');
          item.customLinkType = null;
          this.navList[index].linkId = null;
          this.navList[index].customLinkType = null;
        }else{  // 再类型与导航相比较
          if(this.allNavIdArr.indexOf(obj.linkId) > -1){
            checkFalse('类型与导航链接不能重复哦');
            item.customLinkType = null;
            this.navList[index].linkId = null;
            this.navList[index].customLinkType = null;
          }else{
            if(item.linkId){
              var idx = this.allStyleIdArr.indexOf(item.linkId);
              this.allStyleIdArr.splice(idx,1);  // 去除原来的
            }
            this.navList[index].linkId = obj.linkId;
            this.navList[index].customLinkType = val;
            this.allStyleIdArr.push(obj.linkId);  // 添加新的
          }
        }
      }else{  // 不存在，则选中的是其他

      }
    },
    // 获得数据
    getGuide() {
      this.axios.get('/api-admin/get-custom-guide',{
        params: {
          requestProject: 'gic-web'
        }
      }).then(res => {
          this.loading = false;
          if(res.data.errorCode == 0) {
            this.getNavStyle();  // 获得类型
            this.curdelete = [];
            this.navList = res.data.result;
            var openNavCount = 0;
            this.navList.forEach(item => {
              if(item.status==1){ // 有几个开启的导航
                openNavCount++
              }
              if(item.icon !== '' && item.icon !== '{}') {
                item.icon = JSON.parse(item.icon);
                this.curStyle = item.icon.cur;
              }else {
                item.icon = {
                  idx: 'fill',
                  url: '1'
                }
              }
              if(item.link == '{}') {
                item.link = '';
              }else if(item.link) {
                item.link = JSON.parse(item.link);
              }
              if(item.status == 1) {
                item.status = true;
              }else {
                item.status = false;
              }
              if(!item.customLinkType){
                item.customLinkType = null
              }
            })
            // 添加按钮是否开启
            if(openNavCount>4){
              this.addNavBtnBool = false;
            }else{
              this.addNavBtnBool = true;
            }
            this.getIdArr(this.navList); // 获得this.allStyleIdArr 和 this.allNavIdArr
          }else {
            checkFalse();
            return false;
          }
      }).catch(err => {
          checkStatus(err);
      })
    },
    // this.allStyleIdArr 保存所有的导航id和类型id、不需要pageId
    // this.allNavIdArr 保存最后一级的导航id和类型id，有pageId的属于最后一级id
    getIdArr(arr){
      this.allStyleIdArr = [];
      this.allNavIdArr = [];
      this.allStyleIdArr2 = [];
      arr.forEach(item => {
        // 所有导航id
        var itemData = item.link;
        if(itemData.params.pageId){
          if(this.allNavIdArr.indexOf(itemData.params.pageId)==-1){
            this.allNavIdArr.push(itemData.params.pageId);
          }
        }else{
          if(itemData.id){
            this.allNavIdArr.push(itemData.id);
          }
        }
        // 所有类型id
        if(item.linkId){
          if(this.allStyleIdArr.indexOf(item.linkId)==-1){
            this.allStyleIdArr.push(item.linkId);
          }
        }
      })
      //console.log('类型：' + this.allStyleIdArr);
      //console.log('导航：' + this.allNavIdArr);
    },

    // 保存数据
    submitForm(type) {
      let params = [];
      let flag = true;
      // if(this.navList.length > 5) {
      //   checkFalse('导航不能超过五个');
      //   return false;
      // }
      // console.log(this.navList);
      this.navList.forEach((item,index) => {
        if(item.title == '') {
          flag = false;
        }
        if(item.link == '') {
          // checkFalse('导航链接不能为空');
          flag = false;
        }
        if(item.link.id=='5' || item.link.id=='17'){
          if(!item.customLinkType) {
            // checkFalse('类型不能为空');
            flag = false;
          }
        }
      });

      if(flag) {
        this.navList.forEach((item,index) => {
          let tempArr = {
            guideId: item.guideId,
            icon: JSON.stringify({
              cur:  this.curStyle,
              idx:  item.icon.idx,
              url:  parseInt(item.icon.url),
            }),
            title:  item.title,
            entryCondition: item.entryCondition,
            link: item.link,
            status: item.status === true ? 1 : 2,
            sort: index,
            customLinkType:item.link.id=='5'||item.link.id=='17'?item.customLinkType:null
          };
          params.push(tempArr);
        });
        if(this.curdelete.length > 0) {
          this.curdelete.forEach(item => {
            item.status = 0;
            params.push(item);
          });
        }
      }else {
        this.errortip = true;
        return false;
      }
      this.axios.post('/api-admin/save-custom-guide',qs.stringify({
        requestProject: 'gic-web',
        isNewVersion: type,
        guide: JSON.stringify(params)
      })).then(res => {
        if(res.data.errorCode == 0) {
          this.getGuide();
          checkSuccess('保存成功');
        }else {
          if(res.data.errorCode === 110012) {
            this.$confirm(res.data.message, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.axios.post('/api-admin/save-custom-guide',qs.stringify({
                requestProject: 'gic-web',
                isNewVersion: 1,
                guide: JSON.stringify(params)
              })).then(res => {
                  if(res.data.errorCode === 0) {
                    checkSuccess();
                  }else {
                    checkFalse(res.data.message);
                  }
                 this.getGuide();
              }).catch(err => {
                checkStatus(err);
              })
            }).catch((err) => {
              checkStatus(err);
            });
          }else {
            checkFalse(res.data.message);
          }
        }
      }).catch(err => {
          checkStatus(err);
      })
    },
    // 是否启用导航
    changeSwitch(status,index) {
      let switchcount = 0;
      this.navList.forEach(item => {
        if(item.status) {
          switchcount ++;
        }
      });
      if(switchcount < 2) {
        this.navList[index].status = true;
        checkFalse('导航开启不能少于2个');
      }
      if(switchcount < 5) {
        this.addNavBtnBool = true;
      }else{
        this.addNavBtnBool = false;
      }
      if(switchcount > 5 ) {
        this.navList[index].status = false;
        checkFalse('导航最多开启5个');
      }
    },
    changeStyle(style) {
      this.curStyle = style;
    },
    selectNavImg(url,idx) {
      this.dialogIconVisible = false;
      this.curEdit.icon.url = url;
      this.curEdit.icon.idx = idx;
    },
    // 导航图片修改弹出框
    editNavImg(el,idx) {
      this.dialogIconVisible = true; 
      this.curEdit = this.navList[idx];
    },
    // 删除导航
    deleteNav(el,idx) {
      let navstatus = 0;
      for(let i = 0 ; i < this.navList.length ; i++) {
        if(this.navList[i].status) {
          navstatus ++;
        }
      }
      // console.log(navstatus);
      if(navstatus == 2) {
        if(el.status) {
          checkFalse('导航开启不能少于2个');
          return false;
        }else {
          this.$confirm('确认删除该导航', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // this.curdelete = [];
            this.navList = this.navList.filter((item,index) => {
              if(index == idx) {
                let deletedata = item;
                if(deletedata.guideId !== '') {
                  deletedata.status = 0;
                  this.curdelete.push(deletedata);
                }
              }
              return index !== idx;
            });
            // 判断添加导航按钮是否开启
            var openNavCount = 0;
            this.navList.forEach(item => {
              if(item.status==1 || item.status){ // 有几个开启的导航
                openNavCount++
              }
            })
            if(openNavCount>4){
              this.addNavBtnBool = false;
            }else{
              this.addNavBtnBool = true;;
            }

            this.getIdArr(this.navList); // 获得this.allStyleIdArr 和 this.allNavIdArr
            checkSuccess();
          }).catch((err) => {
            checkStatus(err);
          });
        }
      }else{
        this.$confirm('确认删除该导航?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log('klkl')
          this.navList = this.navList.filter((item,index) => {
            if(index == idx) {
              let deletedata = item;
              if(deletedata.guideId !== '') {
                deletedata.status = 0;
                this.curdelete.push(deletedata);
              }
            }
            return index !== idx;
          });
          // 判断添加导航按钮是否开启
          var openNavCount = 0;
          this.navList.forEach(item => {
            if(item.status==1 || item.status){ // 有几个开启的导航
              openNavCount++
            }
          })
          if(openNavCount>4){
            this.addNavBtnBool = false;
          }else{
            this.addNavBtnBool = true;;
          }

          this.getIdArr(this.navList); // 获得this.allStyleIdArr 和 this.allNavIdArr
          checkSuccess();
        }).catch((err) => {
          // checkStatus(err);
        });
      }
    },
    // 添加导航的按钮
    addNavList() {
      var openNavCount = 0;
      var len = this.navList.length;
      this.navList.forEach(item => {
        if(item.status==1 || item.status==true){ // 有几个开启的导航
          openNavCount++
        }
      })
      if(openNavCount>3){
        this.addNavBtnBool = false;
      }else{
        this.addNavBtnBool = true;;
      }

      // let navlength = this.navList.length;
      // if(navlength > 4) {
      //   checkFalse('导航最多添加5个');
      // }else {
        
      // }
      

      let tempArr = {
        guideId: '',
        icon: {
          idx: 'fill',
          url: '1'
        },
        title: '',
        entryCondition: 0,
        link:"",
        status: true,
        sort: len,
        customLinkType:null
      };
      this.navList.push(tempArr);
    },
    toggleIconEnter(){
      this.iconState  =  true
    },
    toggleIconLeave(){
      this.iconState  =  false
    }
  },
  mounted() {


    this.$dragging.$on('dragged', ({ value }) => {
      console.log(this.navList);
      // console.log(value);
      // this.navList = value.list
      // console.log(this.navList);
      // console.log(value.item)
      // console.log(value.list)
      // console.log(value.group)
    });


    this.getGuide();
    window.onresize = () => {
      return (() => {
        this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
      })()
    }
  },
  created() {
    this.$store.commit('isShowFoot',true);
  },
  components: {
    'v-leftMenu': leftMenu,
    'v-nav': nav,
    'v-draggable': draggable,
    'v-settingRight': settingRight,
    Linktools
  }
}
