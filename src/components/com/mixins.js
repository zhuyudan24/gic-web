import * as bases from '../../common/js/basecompents'
import {checkFalse, checkSuccess,checkStatus} from "../../common/js/checkStatus.js";
let qs = require('qs');
const baseData = bases.baseList;
const cardSetting = bases.cardSetting;
const jggBaseList = bases.jggBaseList;
import { findAnyComponent } from '../../utils/assist.js';

const minxinbase = {
  methods: {
    cloneComponent() {
      // this.baseList = _.cloneDeep(baseData);
      this.baseList = JSON.parse(JSON.stringify(baseData))
    },
    // 选择人群  新
    selectPeople(type,item,val,index){ //
      // console.log(item);
      var itemObj;
      if(type=="card"){ // 卡券
        if(item.receiveLimitType == 1){ // 统一
          itemObj = item.cardSetting[0];
        }else{
          itemObj = item;
          this.cardIndex = index;
        }
      }else if(type=="text"){ // 文本
        itemObj = item;
      }else if(type=="fu"){ // 富文本
        itemObj = item;
      }else if(type=="img"){ // 图片广告
        itemObj = item;
        this.imgIndex = index;
      }else if(type=="heng"){ // 横栏
        itemObj = item;
        this.hengIndex = index;
      }else if(type=="icon"){ // 数据icon
        itemObj = item;
        this.iconIndex = index;
      }else if(type=="jgg"){ // 魔方  九宫格
        if(item){
          itemObj = item;
          this.peopleStyle = null;
        }else{
          this.$message.error('请选择九宫格');
          return;
        }
      }
      itemObj.visibleCondition = val;
      if(val == this.peopleMemberStyle){
        this.dialogMemberGroup = true;
        this.defaltSelected = itemObj.memberGroupTagList?itemObj.memberGroupTagList:[];
        this.memberGroupReRender = false;
        this.$nextTick(_ => {
          this.memberGroupReRender = true;
        });
      }else if(val == this.peopleFilterStyle){
        this.dialogVisiblePeople = true;
        this.useId = itemObj.businessId;
        this.hasSearchData = itemObj.limitCondition;
        this.peopleFilterReRender = false;
        this.$nextTick(_ => {
          this.peopleFilterReRender = true;
          // const component = findAnyComponent(this, 'vue-gic-people');
          // component.getTempDetail();
        });
      }
    },
    // 人群筛选器
    getData() { // 父组件调用子组件方法,触发父组件事件
      this.$refs.peopleFilter.confirmSet()
    },
    getBackData(val) {
      // console.log('健身卡的就看见' + val);
      var item = this.componentList[this.curIndex];
      if(item.key=='B7'){ // 卡券
        if(item.receiveLimitType==1){ // 统一条件
          item.cardSetting[0].detailParams = val;
        }else{ // 单独设置条件
          item.cardSetting[this.cardIndex].detailParams = val;
        }
      }else if(item.key=='A2'){ // 图片广告
        item.data[this.imgIndex].detailParams = val;
      }else if(item.key=='A6'){ // 横栏
        item.data[this.hengIndex].detailParams = val;
      }else if(item.key=='B2'){ // 数据icon
        item.data[this.iconIndex].detailParams = val;
      }else if(item.key=='A3'){ // 魔方
        item.data[this.curjggIndex].detailParams = val;
      }else { // 文本 富文本
        item.detailParams = val;
      }
    },
    findFilter(val){  // 子组件触发父组件事件,返回过滤条件数据
      // console.log(val);
      var item = this.componentList[this.curIndex];
      if(item.key=='B7'){ // 卡券
        if(item.receiveLimitType==1){ // 统一条件
          item.cardSetting[0].limitCondition = val;
        }else{ // 单独设置条件
          item.cardSetting[this.cardIndex].limitCondition = val;
        }
      }else if(item.key=='A2'){ // 图片广告
        item.data[this.imgIndex].limitCondition = val;
      }else if(item.key=='A6'){ // 横栏
        item.data[this.hengIndex].limitCondition = val;
      }else if(item.key=='B2'){ // 数据icon
        item.data[this.iconIndex].limitCondition = val;
      }else if(item.key=='A3'){ // 魔方
        item.data[this.curjggIndex].limitCondition = val;
      }else { // 文本
        item.limitCondition = val;
      }
    },
    getPeopleData(){  // 筛选器 弹框的确认按钮
      var that = this;
      that.$refs.peopleFilter.confirmSet();
      var item = that.componentList[that.curIndex];
      setTimeout(function(){
        if(item.key=='B7'){ // 卡券
          if(item.receiveLimitType==1){ // 统一条件
            if(item.cardSetting[0].detailParams){
              that.lsSaveBtn(item.cardSetting[0])
            }
          }else{ // 单独设置条件
            if(item.cardSetting[that.cardIndex].detailParams){
              that.lsSaveBtn(item.cardSetting[that.cardIndex])
            }
          }
        }else if(item.key=='A2'){ // 图片广告
          if(item.data[that.imgIndex].detailParams){
            that.lsSaveBtn(item.data[that.imgIndex])
          }
        }else if(item.key=='A6'){ // 横栏
          if(item.data[that.hengIndex].detailParams){
            that.lsSaveBtn(item.data[that.hengIndex])
          }
        }else if(item.key=='B2'){ // 数据icon
          if(item.data[that.iconIndex].detailParams){
            that.lsSaveBtn(item.data[that.iconIndex])
          }
        }else if(item.key=='A3'){ // 魔方
          if(item.data[that.curjggIndex].detailParams){
            that.lsSaveBtn(item.data[that.curjggIndex])
          }
        }else { // 文本
          if(item.detailParams){
            that.lsSaveBtn(item)
          }
        }
      },500)
    },
    cancelFilter(){
      this.$refs.peopleFilter.cancelSet()
    },
    // 隐藏保存按钮和确认按钮  (子组件会调用)
    hideBtn() {
      var that = this
      that.toggleTag= false;
    },
    // 显示编辑,保存按钮隐藏,确认按钮显示 (子组件会调用)
    editShow() {
      this.toggleTag= true
    },
    editHide() {
      this.toggleTag= false
    },
    lsSaveBtn(item){  // 人群筛选器弹框的确定按钮  临时保存
      this.axios.post('/api-admin/get-screen-detail-param',qs.stringify({
        requestProject: 'gic-web',
        tempBusinessId: item.tempBusinessId?item.tempBusinessId:"",
        detailParams: item.detailParams
      })).then(res => {
        if(res.data.errorCode == 0) {
          item.tempBusinessId = res.data.result;
          item.businessId = res.data.result;
          this.dialogVisiblePeople = false;
        }else {
          this.$message.error(data.message);
        }
        // console.log(item.tempBusinessId);
      }).catch(err => {
        checkStatus(err);
      })
    },
    // 人群条件  会员分组
    handleDataTransferred(data) {
      var item = this.componentList[this.curIndex];
      if(item.key=="B7"){ // 卡券
        if(item.receiveLimitType==1){ // 统一条件
          item.cardSetting[0].memberGroupTagList = data;
        }else{ // 单独设置条件
          item.cardSetting[this.cardIndex].memberGroupTagList = data;
        }
      }else if(item.key=="A2"){ // 图片广告
        item.data[this.imgIndex].memberGroupTagList = data;
      }else if(item.key=="A6"){ // 横栏
        item.data[this.hengIndex].memberGroupTagList = data;
      }else if(item.key=="B2"){ // 数据icon
        item.data[this.iconIndex].memberGroupTagList = data;
      }else if(item.key=="A3"){ // 魔方
        item.data[this.curjggIndex].memberGroupTagList = data;
        // if(item.templateType==9){ // 九宫格
        //   item.data[this.curjggIndex].memberGroupTagList = data;
        // }else{

        // }

      }else{ // 文本  富文本
        item.memberGroupTagList = data;
      }
    },
    handleDataLeft(selectedData, selectionToRemove) { // selectedData 剔除后剩下的数据  selectionToRemove 剔除的数据
      var item = this.componentList[this.curIndex];
      if(item.key=="B7"){
        if(item.receiveLimitType==1){ // 统一条件
          item.cardSetting[0].memberGroupTagList = selectedData;
        }else{ // 单独设置条件
          item.cardSetting[this.cardIndex].memberGroupTagList = selectedData;
        }
      }else if(item.key=="A2"){
        item.data[this.imgIndex].memberGroupTagList = selectedData;
      }else if(item.key=="A6"){ // 横栏
        item.data[this.hengIndex].memberGroupTagList = selectedData;
      }else if(item.key=="B2"){ // 数据icon
        item.data[this.iconIndex].memberGroupTagList = selectedData;
      }else if(item.key=="A3"){ // 魔方
        item.data[this.curjggIndex].memberGroupTagList = selectedData;
      }else{ // 文本
        item.memberGroupTagList = selectedData;
      }
    },
    memberGroupBtn(){ // 会员分组弹框的确定按钮
      var item = this.componentList[this.curIndex];
      var itemObj;
      if(item.key=="B7"){
        if(item.receiveLimitType==1){ // 统一条件
          itemObj = item.cardSetting[0]
        }else{
          itemObj = item.cardSetting[this.cardIndex];
        }
      }else if(item.key=="A2"){ // 图片广告
        itemObj = item.data[this.imgIndex];
      }else if(item.key=="A6"){ // 横栏
        itemObj = item.data[this.hengIndex];
      }else if(item.key=="B2"){ // 数据icon
        itemObj = item.data[this.iconIndex];
      }else if(item.key=="A3"){ // 魔方
        itemObj = item.data[this.curjggIndex];
      }else if(item.key=="A5" || item.key=="A1"){ // 文本  富文本
        itemObj = item
      }
      if(itemObj.visibleCondition==this.peopleMemberStyle){
        if(itemObj.memberGroupTagList && itemObj.memberGroupTagList.length<1){
          this.$message.error('请选择会员分组');
        }else{
          this.dialogMemberGroup = false;
        }
      }
    },
    // 人群 end
    // 验证 第三方小程序API是否启用
    checkAPIOpen(appid,appname){
      return new Promise((resolve,reject) => {
        var xcxAppName = '';
        this.axios.post('/api-admin/applet-app-is-enable',qs.stringify({
          requestProject: 'gic-web',
          appId:appid
        })).then(res => {
          var data = res.data;
          if(data.errorCode==0){
            var obj = {};
            if(!data.result.flag){
              xcxAppName += appname + '、';
              obj.xcxAPIDialog = true;
              obj.xcxAppName = xcxAppName;
            }
            resolve(obj);
          }else{
            reject(data);
            this.$message.error(data.message)
          }
        })
      })
    },
    // 选择魔方类型
    selectMfStyle(item,telIdx){
      // console.log('选择魔方类型：' + telIdx);
      if(telIdx==0){ // 九宫格
        item.templateType = 9;
        item.data = JSON.parse(JSON.stringify(jggBaseList));
      }else if(telIdx==1){ // 自定义
        item.templateType = 8;
        item.lineSetting = {column: 4, row: 4};
        item.data = [
          {
            title: '',
            link: {
              name: ''
            },
            left:0,
            top:0,
            endLeft:0,
            endTop:0,
            visibleCondition: "0",
            limitCondition: '',
            detailParams:'',
            limitMemberGroup:'',
            memberGroupTagList:[],
            imageFiledCode: '',
            qcloudImageUrl: '',
            pos: '0'
          },
        ];
      }
    },
    // 获得自定义魔方组件 getBoxArr 传递的数组
    getEditMess(boxArr,selectAll){
      // this.selectAll = selectAll;
      boxArr.selectAll = selectAll?1:2;
      boxArr.data.forEach((list)=>{
        list.pos = list.pos?list.pos:(list.left+'.'+list.top+','+list.endLeft+'.'+list.endTop);
      })
      this.$set(this.componentList, this.curIndex, boxArr)
      // this.componentList[this.curIndex] = boxArr;
      // console.log(this.componentList);
    },

    // 卡券  获取会员等级
    getMemberGrade(){
      this.axios.get('/api-admin/grade-list',{
        params: {
          requestProject: 'gic-web'
        }
      }).then(res => {
        var data = res.data;
        if(data.errorCode==0){
          this.memberGradeList = data.result;
        }
      })
    },
    // 卡券
    changeReceiveLimit(val){ // 切换领取限制
      var l = this.componentList[this.curIndex].cardSetting.length;
      this.componentList[this.curIndex].cardSetting.splice(0,l);
      var newCard = {
        timeType:1, //展示时间（1：全部日期2：固定日期3：每月4：每周）
        timeValueRegular:[],  //（如果是2：固定日期，精确到秒）
        timeValueMonth:[],  //（如果是3：每月日期，日期用英文逗号隔开）
        timeValueWeek:[], //(如果是4：每周，1表示周一，2表示周二，英文逗号隔开)
        receiveTimeType:1,  //领取时间段(1：全部时段2：部分时段)
        receiveTimeValue:[{}],
        visibleCondition: 0,  //可见人群；0不限，1限
        limitCondition:"",  //可见人群参数值
        receivePeopleType:0,  //领取人群类型0不限，1限
        receivePeopleValue:[], //多选，英文逗号隔开，且的关系（1：开卡会员2：认证会员3：当月生日会员4：选择会员等级）
        memberGrade:[],  //会员等级值
        numberLimitType:1,  //数量限制类型（1：每张卡券每人限领一张2：每张卡券每人每天限领N张）
        numberLimitValue:null,  //每张卡券每人每天限领张数
        cardData:[],
      }
      if(val == 1){
        this.componentList[this.curIndex].cardSetting.push(newCard);
      }
    },
    changeDate(val){ // 卡券里选择日期
      // console.log(val);
    },
    changeTime(val){ // 卡券里的部分时段
      // console.log(val);
    },
    // 改变卡券的数量限制
    changeLimit(val){
      // if(val == 1){
      //   this.cardLimit = 1;
      // }else if(val == 2){
      //   this.cardLimit = 2;
      // }
      // this.$nextTick(_=>{
      //   this.$refs.selectCard.getCardList()
      // })
    },
    // 卡券弹窗
    selectCard(val) {
      // 模拟检查数据
      // console.log(val);
      if(val){
        var beginDate="" , endDate="";
        if(val.cardEffectiveMode==0){ // 有日期
          var begin = val.beginDate.substring(0,val.beginDate.length-1).split('.');
          beginDate = begin[0] +'年'+ begin[1] +'月'+ begin[2]  +'日';
          var end = val.endDate.substring(0,val.endDate.length-1).split('.');
          endDate = end[0] +'年'+ end[1] +'月'+ end[2]  +'日';
        }
        var cardSettingObj = JSON.parse(JSON.stringify(cardSetting)); // 深拷贝，以免影响原有数据
        var cardObj = {
          coupCardId:val.coupCardId, //卡券id
          cardName:val.cardName,  //卡券名称
          cardType:val.cardType, // 卡券类型
          cardStartTime:beginDate, // 开始时间
          cardEndTime:endDate, // 结束时间
          isHasDate:val.cardEffectiveMode, // 有没有日期，1无0有
          validStartDate:val.startDay, // 几天后生效
          validEndDate:val.limitDay, // 生效后的几天失效
        };
        var limitType = this.componentList[this.curIndex].receiveLimitType; // 1 统一，2单独

        if(limitType==1){
          var len = this.componentList[this.curIndex].cardSetting[0].cardData.length;
          cardObj.cardSort = len + 1; //排序值
          this.componentList[this.curIndex].cardSetting[0].cardData.push(cardObj)
        }else if(limitType==2){
          var len = this.componentList[this.curIndex].cardSetting.length;
          cardObj.cardSort = len + 1; //排序值
          cardSettingObj.cardData[0] = cardObj;
          this.componentList[this.curIndex].cardSetting.push(cardSettingObj);
        }
      }
      this.showCardDialog = false;
    },
    // 获取当前时间的年月日
    getNowDate(){
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month < 10) {
          month = "0" + month;
      }
      if (day < 10) {
          day = "0" + day;
      }
      return year + "年" + month + "月" + day + "日";
    },
    // 添加时间段
    addTime(index){
      // console.log(this.componentList[this.curIndex]);
      if(this.curKey && this.curKey == 'B7') {
        var len = this.componentList[this.curIndex].cardSetting[index].receiveTimeValue.length;
        var timeRangeList = this.componentList[this.curIndex].cardSetting[index].receiveTimeValue;
        if(len>=5){
          this.$message.error('最多添加5个时间段');
          return;
        }
        timeRangeList.push({})
        // this.$set(timeRangeList, len, { timeRange: ['', ''] })
      }
    },
    // 删除时间段
    deleteTime(index,idx){
      this.componentList[this.curIndex].cardSetting[index].receiveTimeValue.splice(idx,1);
    },
    // 卡券 切换人群
    unpeopleCardFilter(index){
      if(this.componentList[this.curIndex].receiveLimitType==1){ // 统一条件
        this.componentList[this.curIndex].cardSetting[0].visibleCondition = 0;
      }else{ // 单独设置条件
        this.componentList[this.curIndex].cardSetting[index].visibleCondition = 0;
      }
    },
    peopleCardFilter(limitCondition,limitIdx,type){
      this.limitIdx = limitIdx;
      this.limitCondition = limitCondition;
      //console.log(this.limitCondition);
      if(this.componentList[this.curIndex].receiveLimitType==1){ // 统一条件
        this.componentList[this.curIndex].cardSetting[0].visibleCondition = 1;
      }else{ // 单独设置条件
        this.componentList[this.curIndex].cardSetting[limitIdx].visibleCondition = 1;
      }
      if(type==1){  // 限定条件的点击
        if(this.limitCondition){
          this.peopleModal = false;
        }else{
          this.peopleModal = true;
        }
      }else if(type==2){  // 选中条件之后的蓝色字体的点击
        this.peopleModal = true;
      }
    },
    // 判断卡券的数据
    checkCardData(data,index){
      if(data.timeType==2){ // 展示时间类型 固定日期
        if(data.timeValueRegular.length<1){
          checkFalse(`请选择第${ index + 1 }个组件(卡券)中的固定日期`);
          this.flag = false;
        }
      }else if(data.timeType==3){ // 展示时间类型 每月
        if(data.timeValueMonth.length<1){
          checkFalse(`请选择第${ index + 1 }个组件(卡券)中的每月`);
          this.flag = false;
        }
      }else if(data.timeType==4){ // 展示时间类型 每周
        if(data.timeValueWeek.length<1){
          checkFalse(`请选择第${ index + 1 }个组件(卡券)中的每周`);
          this.flag = false;
        }
      }
      if(data.receiveTimeType==2){ // 领取时段的 部分时段
        // console.log(data);
        let list = [];
        let flag = false;
        let arr = [];
        data.receiveTimeValue.forEach(v => {
          if (!v.timeRange || !v.timeRange[0]) {
            flag = true;
          } else {
            arr.push(v.timeRange);
            list.push(v.timeRange[0] + '-' + v.timeRange[1]);
          }
        })
        if (flag) {
          checkFalse(`第${ index + 1 }个组件(卡券)中部分时段未填写完整`);
          this.flag = false;
          return;
        }
        let breakFlag = false;
        for (var i = 0; i < arr.length; i++) {
          if (breakFlag) {
            break;
          }
          var p1 = arr[i];
          for (var j = i + 1; j < arr.length; j++) {
            var p2 = arr[j];
            if ((p2[0] > p1[0] && p2[0] < p1[1]) || (p2[1] > p1[0] && p2[1] < p1[1]) || (p1[0] > p2[0] && p1[0] < p2[1]) || (p1[1] > p2[0] && p1[1] < p2[1])) {
              breakFlag = true;
              break;
            }
            if(p2[0] == p1[0] && p2[0] == p1[1]){
              checkFalse(`第${ index + 1 }个组件(卡券)中部分时段之间不允许出现重复时段`);
              this.flag = false;
              break;
            }
          }
        }
        if (breakFlag) {
          checkFalse(`第${ index + 1 }个组件(卡券)中部分时段之间不允许出现时间交叠`);
          this.flag = false;
        }
      }
      if(data.receivePeopleType==1){ // 领取人群 限定条件
        if(data.receivePeopleValue.length<1){
          checkFalse(`请选择第${ index + 1 }个组件(卡券)中领取人群的限定条件`);
          this.flag = false;
        }
        if(data.receivePeopleValue.length>0 && data.receivePeopleValue.indexOf('4')>-1){
          if(data.memberGrade.length<1){
            checkFalse(`请选择第${ index + 1 }个组件(卡券)中领取人群的会员等级`);
            this.flag = false;
          }
        }
      }
      if(data.numberLimitType==2){ // 数量限制 每人每天限领
        if(!data.numberLimitValue){
          checkFalse(`请填写第${ index + 1 }个组件(卡券)中的每人每天限领的张数`);
          this.flag = false;
        }
        if(data.numberLimitValue<1){
          checkFalse(`第${ index + 1 }个组件(卡券)中的每人每天限领的张数不能小于1`);
          this.flag = false;
        }
        if(data.numberLimitValue>10){
          checkFalse(`第${ index + 1 }个组件(卡券)中的每人每天限领的张数不能大于10`);
          this.flag = false;
        }
      }
    },
    // 富文本 切换人群
    unpeopleWenbenFilter(index) {
      // this.componentList[this.curIndex].limitCondition = '';
      this.componentList[this.curIndex].visibleCondition = 0;
    },
    peopleWenbenFilter(item,type) {
      // this.peopleModal = true;
      this.limitCondition = this.componentList[this.curIndex].limitCondition;
      this.componentList[this.curIndex].visibleCondition = 1;

      if(type==1){  // 限定条件的点击
        if(this.limitCondition){
          this.peopleModal = false;
        }else{
          this.peopleModal = true;
        }
      }else if(type==2){  // 选中条件之后的蓝色字体的点击
        this.peopleModal = true;
      }
    },
    // 魔方  切换人群
    unpeopleJggFilter() {
      if(this.curjggIndex == null) {
        this.$message.error('请选择九宫格');
        return false;
      }else {
        this.curjggradio = true;
        // this.componentList[this.curIndex].data[this.curjggIndex].limitCondition = '';
        this.componentList[this.curIndex].data[this.curjggIndex].visibleCondition = 0;
      }
    },
    deleteJggLink() {
      if(this.curjggIndex == null) {
        this.$message.error('请选择九宫格');
        return false;
      }else {
        this.componentList[this.curIndex].data[this.curjggIndex].link = '';
        this.curjggLink = '';
      }
    },
    deleteLink(idx) {
      this.componentList[this.curIndex].data[idx].link = '';
    },
    peopleJggFilter(type) {
      if(this.curjggIndex == null) {
        this.$message.error('请选择九宫格');
        return false;
      }else {
        this.curjggradio = false;
        // this.peopleModal = true;
        this.limitIdx = this.curjggIndex;
        this.limitCondition = this.componentList[this.curIndex].data[this.curjggIndex].limitCondition;
        //
        this.componentList[this.curIndex].data[this.curjggIndex].visibleCondition = 1;
        if(this.limitCondition){
          this.curjggFilterDetail = this.getPeopleDetail(this.limitCondition)
        }else{
          this.curjggFilterDetail = '';
        }

        if(type==1){
          if(this.curjggFilterDetail){
            this.peopleModal = false;
          }else{
            this.peopleModal = true;
          }
        }else if(type==2){
          this.peopleModal = true;
        }
      }
    },
    // 点击人群后获取到筛选的条件
    getCrowdData(data) {
      //console.log("筛选的条件？" + data);
      this.peopleModal = false;
      if(data == "{}" || !data){
        data = "";
        this.peopleFilterDetail = "";
      }else{
        var dataObj = JSON.parse(data);
        this.peopleFilterDetail = "";
        if(dataObj.gradeLevel){
          this.peopleFilterDetail = '会员等级：' + dataObj.gradeLevelName + '；';
        }
        if(dataObj.costAllEnd>-1){
          this.peopleFilterDetail += '消费总额：' + dataObj.costAllBegin + '至' + dataObj.costAllEnd + '元；'
        }
        if(dataObj.costTimesEnd>-1){
          this.peopleFilterDetail += '消费次数：' + dataObj.costTimesBegin + '至' + dataObj.costTimesEnd + '次；'
        }
        if(dataObj.avgCostEnd>-1){
          this.peopleFilterDetail += '客单价：' + dataObj.avgCostBegin + '至' + dataObj.avgCostEnd + '元；'
        }
        if(dataObj.avgNumberEnd>-1){
          this.peopleFilterDetail += '连带率：' + dataObj.avgNumberBegin + '至' + dataObj.avgNumberEnd + '件；'
        }
        if(dataObj.birthdayMDEndStr){
          this.peopleFilterDetail += '生日：' + dataObj.birthdayMDBeginStr + '至' + dataObj.birthdayMDEndStr + '；'
        }
      }
      // console.log(this.curKey);
      if(this.curKey == 'B7'){ // 卡券
        if(this.componentList[this.curIndex].receiveLimitType==1){ // 统一条件
          if(!this.peopleFilterDetail){
            this.componentList[this.curIndex].cardSetting[0].visibleCondition = 0;
          }else{
            this.componentList[this.curIndex].cardSetting[0].limitCondition = data;
            this.componentList[this.curIndex].cardSetting[0].peopleFilterDetail = this.peopleFilterDetail;
          }
        }else{ // 单独设置条件
          if(!this.peopleFilterDetail){
            this.componentList[this.curIndex].cardSetting[this.limitIdx].visibleCondition = 0;
          }else{
            this.componentList[this.curIndex].cardSetting[this.limitIdx].limitCondition = data;
            this.componentList[this.curIndex].cardSetting[this.limitIdx].peopleFilterDetail = this.peopleFilterDetail;
          }
        }
      }else if(this.curKey == 'A5' || this.curKey == 'A1') { // 文本 或者 富文本
        this.componentList[this.curIndex].limitCondition = data;
        this.componentList[this.curIndex].peopleFilterDetail = this.peopleFilterDetail;
      }else if(this.curKey == 'A3'){ // 魔方特殊处理
        this.curjggFilterDetail = this.peopleFilterDetail;
        this.componentList[this.curIndex].data[this.limitIdx].limitCondition = data;
        // this.componentList[this.curIndex].data[this.limitIdx].peopleFilterDetail = this.peopleFilterDetail;
      } else {
        this.componentList[this.curIndex].data[this.limitIdx].limitCondition = data;
        this.componentList[this.curIndex].data[this.limitIdx].peopleFilterDetail = this.peopleFilterDetail;
        this.limitIdx = null;
      }
    },
    closeModal() {
      this.peopleModal = false;
      this.limitIdx = null;
    },
    // 图片广告 横栏 数据icon  切换人群
    unpeopleFilter(index) {
      // this.componentList[this.curIndex].data[index].limitCondition = '';
      this.componentList[this.curIndex].data[index].visibleCondition = 0;
    },
    peopleFilter(limitCondition,limitIdx,type) {
      // this.peopleModal = true;
      this.limitIdx = limitIdx;
      this.limitCondition = limitCondition;
      this.componentList[this.curIndex].data[limitIdx].visibleCondition = 1;

      if(type==1){  // 限定条件的点击
        if(this.limitCondition){
          this.peopleModal = false;
        }else{
          this.peopleModal = true;
        }
      }else if(type==2){  // 选中条件之后的蓝色字体的点击
        this.peopleModal = true;
      }
    },
    linkTool(Idx) {
      this.linkToolsVisible = true;
      this.curlinkIdx = Idx;
    },
    linkSelect(val) {
      if(val && !!val.name) {
        this.componentList[this.curIndex].data[this.curlinkIdx].link = val;
        if(this.componentList[this.curIndex].key == 'A3') {
          this.curjggLink = this.componentList[this.curIndex].data[this.curlinkIdx].link.name;
        }
      }
      this.linkToolsVisible = false;
    },
    jgglinkTool() {
      if(this.curjggIndex == null) {
        this.$message.error('请选择九宫格');
        return false;
      }else {
        this.linkToolsVisible = true;
        this.curlinkIdx = this.curjggIndex;
      }
    },
    // 选择某一个魔方
    selectJgg(idx) {
      // console.log( this.componentList[this.curIndex]);
      this.peopleStyle = null;
      this.curjggIndex = idx;
      this.imageMofangUrl = this.componentList[this.curIndex].data[this.curjggIndex].qcloudImageUrl;
      this.jgglimitCondition = this.componentList[this.curIndex].data[this.curjggIndex].limitCondition;
      this.jggvisibleCondition = this.componentList[this.curIndex].data[this.curjggIndex].visibleCondition;

      // 显示选中的人群条件
      // if(this.componentList[this.curIndex].data[this.curjggIndex].visibleCondition){
      //   this.curjggFilterDetail = this.getPeopleDetail(this.jgglimitCondition);
      //   // console.log(this.curjggFilterDetail);
      // }else{
      //   this.curjggFilterDetail = ""
      // }
      // if(this.jggvisibleCondition==1){
      //   this.curjggFilterDetail = this.getPeopleDetail(this.jgglimitCondition);
      // }else{
      //   this.curjggFilterDetail = ""
      // }

      // if(this.jgglimitCondition !== '') {
      //   this.curjggradio = false;
      // }else {
      //   this.curjggradio = true;
      // }
      if(this.jggvisibleCondition == 1 ) {
        this.curjggradio = false;
      }else {
        this.curjggradio = true;
      }
      let linkname = this.componentList[this.curIndex].data[this.curjggIndex].link.name;
      if(linkname) {
        this.curjggLink = linkname;
      }
    },
    handleMofangSuccess(res, file) {
      if(res.errorCode == 0) {
        this.componentList[this.curIndex].data[this.curjggIndex].qcloudImageUrl = res.result[0].qcloudImageUrl;
        this.componentList[this.curIndex].data[this.curjggIndex].imageFiledCode = res.result[0].imageFiledCode;
        this.imageMofangUrl = this.componentList[this.curIndex].data[this.curjggIndex].qcloudImageUrl;
        checkSuccess('图片上传成功');
      }else {
        checkFalse('图片上传失败');
      }
    },
    beforeMofangUpload(file) {
      if(this.curjggIndex == null) {
        this.$message.error('请选择九宫格');
      }else {
        const isImg = file.type === 'image/jpeg' || 'image/png' || 'image/gif' || 'image/svg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isImg) {
          this.$message.error('上传图片只能是 JPG/PNG/GIF/SVG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        let _this = this;
        return  isImg && isLt2M && new Promise(function(resolve, reject) {
            let reader = new FileReader();
            reader.onload = function(event) {
              let image = new Image();
              image.onload = function () {
                let width = this.width;
                let height = this.height;
                if(_this.curKey == 'A3') {
                  if (width !== 250){
                    _this.$message.error('图片尺寸宽度必须为250px!');
                    reject();
                  }
                  if (height < 50) {
                    _this.$message.error('图片尺寸高度不能小于50px!');
                    reject();
                  }
                }
                resolve();
              };
              image.src = event.target.result;
            };
            reader.readAsDataURL(file);
          });
      }
    },
    deleteImg(idx) {
      if(this.curKey == 'B7'){ // 卡券
        // console.log(this.componentList[this.curIndex]);
        var limitType = this.componentList[this.curIndex].receiveLimitType; // 1 统一，2单独
        if(limitType==1){
          this.componentList[this.curIndex].cardSetting[0].cardData.splice(idx,1);
        }else if(limitType==2){

          if(this.componentList[this.curIndex].cardSetting.length>1){
            this.componentList[this.curIndex].cardSetting.splice(idx,1);
          }else{
            this.componentList[this.curIndex].cardSetting[0].cardData = [];
          }
        }
      }else{
        let temp = this.componentList[this.curIndex].data.length;
        if(temp > 1) {
          this.componentList[this.curIndex].data.splice(idx,1);
        }else {
          checkFalse('最少一条数据');
        }
      }
    },
    addImg() {
      if(this.curKey) {
        if(this.curKey == 'B7'){ // 卡券
          this.showCardDialog = true; // 卡券弹窗
          this.disabledList = [];
          this.componentList.forEach((item,index)=>{
            if(item.key=='B7'){
              var limitType = item.receiveLimitType;
              if(limitType==1){
                item.cardSetting[0].cardData.forEach((ele)=>{
                  this.disabledList.push(ele.coupCardId);
                })
              }else if(limitType==2){
                item.cardSetting.forEach((list)=>{
                  this.disabledList.push(list.cardData[0].coupCardId);
                })
              }
            }
          })
          // this.$refs.selectCard.getCardList();
        }else{
          let imgLength = this.componentList[this.curIndex].data.length;
          if(imgLength > 9) {
            checkFalse('最多添加10条数据');
          }else {
            if(this.curKey == 'A2') { // 图片广告
              this.componentList[this.curIndex].data.push({
                title: '',
                link: {
                  name: ''
                },
                visibleCondition: "0",
                limitCondition: '',
                detailParams:'',
                limitMemberGroup:'',
                memberGroupTagList:[],
                imageFiledCode: '',
                qcloudImageUrl: '',
                sort: 1,
                hotspot: [{
                  leftX: 1,
                  leftY: 1,
                  rightX: 1,
                  rightY: 1,
                  link: ''
                }]
              });
            }else if(this.curKey == 'A6') { // 横栏
              this.componentList[this.curIndex].data.push({
                title: '',
                link: {
                  name: ''
                },
                visibleCondition: "0",
                limitCondition: '',
                detailParams:'',
                limitMemberGroup:'',
                memberGroupTagList:[],
                imageFiledCode: '',
                qcloudImageUrl: '',
                sort: 1
              });
            }
          }
        }
      }else {
        checkFalse('请点击选择要编辑的组件');
      }
    },
    uploadImg(idx) {
      this.curImgIdx = idx;
      document.getElementById('imgupload').getElementsByClassName('el-upload__input')[0].click();
    },
    uploadMofang() {
      if(this.curjggIndex == null) {
        this.$message.error('请选择九宫格');
        return false;
      }
      document.getElementById('Mofang').getElementsByClassName('el-upload__input')[0].click();
    },
    // 上传成功
    handleImgSuccess(res,file) {
      if(res.errorCode == 0) {
        this.componentList[this.curIndex].data[this.curImgIdx].qcloudImageUrl = res.result[0].qcloudImageUrl;
        this.componentList[this.curIndex].data[this.curImgIdx].imageFiledCode = res.result[0].imageFiledCode;
        this.componentList[this.curIndex].data.forEach(item => {
          this.tempArrimg.push({url: item.qcloudImageUrl})
        });
        checkSuccess('图片上传成功');
      }else {
        checkFalse('图片上传失败');
      }
    },
    // 上传之前
    beforeImgUpload(file) {
      const isImg = file.type === 'image/jpeg' || 'image/png' || 'image/gif' || 'image/svg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImg) {
        this.$message.error('上传图片只能是 JPG/PNG/GIF/SVG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      let _this = this;
      return  isImg && isLt2M && new Promise(function(resolve, reject) {
          let reader = new FileReader();
          reader.onload = function(event) {
            let image = new Image();
            image.onload = function () {
              let width = this.width;
              let height = this.height;
              if(_this.curKey == 'A2') {
                if (width !== 750){
                  _this.$message.error('图片尺寸宽度必须为750px!');
                  reject();
                }
                var imgHeight = _this.componentList[_this.curIndex].imgHeight;
                if (height !== imgHeight) {
                  _this.$message.error('图片尺寸高度范围必须为'+imgHeight+'px!');
                  reject();
                }
                // if (height < 220 || height > 2000) {
                //   _this.$message.error('图片高度范围：220px~2000px');
                //   reject();
                // }
              }
              if(_this.curKey == 'A6') {
                if (width !== 40){
                  _this.$message.error('图片尺寸必须为40px*40px!');
                  reject();
                }
                if (height !== 40) {
                  _this.$message.error('图片尺寸必须为40px*40px!');
                  reject();
                }
              }
              if(_this.curKey == 'B2') {
                if (width !== 40){
                  _this.$message.error('图片尺寸必须为40px*40px!');
                  reject();
                }
                if (height !== 40) {
                  _this.$message.error('图片尺寸必须为40px*40px!');
                  reject();
                }
              }
              resolve();
            };
            image.src = event.target.result;
          };
          reader.readAsDataURL(file);
        });
    },
    handlerComponent(type,idx) {
      this.curCardType = 'two';
      this.curKey = type;
      this.curIndex = idx;
      this.changeStatus=!this.changeStatus;
      // if(type=="B7"){ // 卡券
      //   // 解决 部分时段 响应式问题
      //   if(this.componentList[this.curIndex].cardSetting[0].receiveTimeType==2){
      //     var value = this.componentList[this.curIndex].cardSetting[0].receiveTimeValue;
      //     if(!value[0].timeRange){
      //       this.$set(value, 0, { timeRange: ['', ''] })
      //     }
      //   }
      // }
    },
    deleteConponent(type,idx) {
      this.componentList.splice(idx,1);
      this.curIndex = null;
      this.curKey = '';

      // console.log(this.componentList);
    },
    enterLine(val) {
      if(val) {
        val= val.replace(/\n/g,"<br>");
      }
      return val;
    }
  }
}
export { minxinbase }
