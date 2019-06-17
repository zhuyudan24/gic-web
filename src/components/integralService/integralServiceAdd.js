// import membercenterAddLeft from './membercenterAddLeft.vue'
import * as bases from '../../common/js/basecompents'
import draggable from 'vuedraggable'
import {checkFalse, checkStatus, checkSuccess} from "../../common/js/checkStatus.js";
import navlogo from '../../../static/img/navlogo.png'
import hyzxtext from '../../../static/img/integral-service-icon.png'
import defaultImg  from '../../../static/img/default.jpg'
import barcode  from '../../../static/img/barcode.png'
import Linktools from 'components/linktools/linktools.vue'
import peopleFilter from 'components/peoplefilter/peopleFilter.vue'
import { minxinbase } from '../com/mixins'

import static1 from '../../../static/img/coupon-mould_pic.png'
import static2 from '../../../static/img/gift-mould_pic.png'
import static3 from '../../../static/img/task-mould_pic.png'

// 富文本编辑器
import tinymceEdit from 'components/memberShip/tinymce-edit'
import editor from 'components/memberShip/editor'
// 自定义魔方
import selfDefined from 'components/selfDefined/selfDefined'
let qs = require('qs');
const baseData = bases.baseList;
const dataObj = bases.dataObj; // 双横栏
export default {
  mixins: [minxinbase],
  data() {
    return {
      data1:[JSON.parse(JSON.stringify(dataObj))],
      data2:[JSON.parse(JSON.stringify(dataObj)),JSON.parse(JSON.stringify(dataObj))],
      bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
      pageId: this.$route.query.pageId || '',
      navlogo: navlogo,
      hyzxtext: hyzxtext,
      defaultImg: defaultImg,
      barcode: barcode,
      baseList: baseData,
      ruleForm: {
        title: '',
        entryCondition: 0,
      },
      ruleForm2:{
        bgImg: {
          code: '',
          url: '../../../static/img/credit-banner_bg.png'
        },
        integral: {
          show: true,
          title: '可用积分',
          fontColor: '#fff',
          numColor: '#dfb772'
        },
        unIntegral: {
          show: true,
          title: '冻结积分',
          fontColor: '#fff',
          numColor: '#bc8e3c'
        },
        sign: {
          status: true,
          before:{
            code: '',
            url: '../../../static/img/credit-sign_bg.png'
          },
          after:{
            code: '',
            url: '../../../static/img/credit-sign_bg2.png'
          }
        },
      },
      rules: {},
      curIndex: null,
      curKey: '',
      componentList: [
        {
          key: "B8",
          img:static1,
          elementIndex: 1
        },
        {
          key: "B9",
          img:static2,
          elementIndex: 2
        },
        {
          key: "B10",
          img:static3,
          elementIndex: 3
        }
      ],
      curCardType: 'one',
      curImgIdx: '',
      imageUrl: '',
      imageMofangUrl: '',
      curjggIndex: null,
      curjggItemsort: null,
      isjumpType: true,
      tempArrimg: [],
      curCard:  1,
      linkToolsVisible: false,
      curlinkIdx: null,
      curjggLink: '',
      jgglimitCondition: '',
      peopleModal: false,
      limitCondition: '',
      limitIdx: null,
      curjggradio: true,
      merchant: {},
      merchantList: [],
      isRelevance: false,
      integral: {},
      projectName: 'gic-web',

      peopleFilterDetail:"", // 筛选详情

      curjggFilterDetail:"",// 九宫格的筛选详情

      extitle:'', // 判断页面名称是否存在

      // 卡券
      memberGradeList:[], // 会员等级
      monthData:Array.from(Array(31), (v,k) =>(k+1).toString()),
      weekData:['1','2','3','4','5','6','7'],

      // 卡券弹窗
      projectName: 'gic-web', //当前项目名
      showCardDialog: false,
      cardLimit: -1, //卡券限制类型 1-限制领取1张的卡券 2- 限制领取 1~100的卡券 3-限制领取>=100 的卡券
      cardType: null, //卡券类型集合（0：抵金券，1：折扣券，2：兑换券）null-为全部类型 逗号分隔
      cardObj:{}, // 选择之后的卡券的对象

      nowDate:'',

      flag:true,

      disabledList:[], // 禁用的卡券

      // 自定义魔方
      curTelIdx:0, // 选中的模板的
      telData:[
        {
          img:require('../../../static/img/jgg.png'),
          title:'九宫格'
        },{
          img:require('../../../static/img/cube-mould_08.png'),
          title:'自定义'
        }
      ],
      changeStatus:false,
      selectAll:true, // 自定义魔方是否选中全部
      // 会员分组
      dialogMemberGroup:false,
      memberGroupReRender:false,
      defaltSelected: [], //  默认穿梭窗已选入数据 groupName, isRealTime必传， 其他若无需求可不传
      height:400, // 穿梭窗高度， 默认是543
      headerList: ['isRealTime', 'latestUpdateTime', 'updateType', 'effectiveStatus', 'effectiveDate'], // 表头配置，默认全部，分组名称默认显示不可配置
      effectiveStatus:1, // 不传： 所有状态 1： 有效 0： 失效
      /* 人群筛选器   新 */
      dialogVisiblePeople:false,
      peopleFilterReRender:false,
      sceneValue: 'member',  // 场景值
      useId:'',
      searchParams:'',
      hasSearchData: '' , // 当前页回显的数据(接口返回)
      operateType:true,
      toggleTag:false,
      cardIndex:0,
      imgIndex:0,
      hengIndex:0,
      iconIndex:0,
      // 人群类型
      peopleStyle:"0",
      peopleAllStyle:"0",
      peopleMemberStyle:"2",
      peopleFilterStyle:"1",
      // 调用保存接口的标识，防止同一页面多次保存
      saveBtnBool:true,
    }
  },
  methods: {
    // 获取富文本内容
    contentUe(val){
      // console.log(val);
      this.componentList.forEach((item,index) => {
        if(item.key == 'A1' && val.index == index){
          item.richTextContent = val.content;
        }
      })
    },
    // 横栏  选择模板
    changeTemplateType(index,val,data){
      if(parseInt(val) == 3){
        if (this.data2.length === 1) {
          this.data2.push(JSON.parse(JSON.stringify(dataObj)));
        }
        this.data2 = [JSON.parse(JSON.stringify(dataObj)),JSON.parse(JSON.stringify(dataObj))]
        this.componentList[index].data  =  this.data2
      }else{
        this.data1 = [JSON.parse(JSON.stringify(dataObj))];
        this.componentList[index].data = this.data1;
      }
    },
    // 获取进入积分组件的配置
    getIntegralSetting(){
      this.axios.post('/api-admin/get-integral-setting',qs.stringify({
        requestProject: 'gic-web'
      })).then(res => {
        if(res.data.errorCode == 0) {
          this.ruleForm2 = res.data.result;
        }else {
          checkFalse(res.data.message);
          return false;
        }
      }).catch(err => {
        checkStatus(err);
      })
    },
    // 保存
    submitForm(saveType) {
      if(!this.ruleForm.title.trim()) {
        checkFalse('请填写页面名称');
        return false;
      }
      this.comitForm(saveType)
    },
    async comitForm(saveType){
      let value = [];
      this.flag = true;
      this.componentList.forEach((item,index) => {
        if(item.key == 'B7'){
          var limitType = item.receiveLimitType; // 1 统一，2单独
          if(limitType==1){
            var data = item.cardSetting[0];
            this.checkCardData(data,index);
            if(data.cardData.length<1){ // 是否选择卡券
              checkFalse(`请添加第${ index + 1 }个组件(卡券)中的卡券`);
              this.flag = false;
            }
            if(data.visibleCondition==this.peopleMemberStyle) {
              if(!data.memberGroupTagList || (data.memberGroupTagList && data.memberGroupTagList.length<1)){
                checkFalse(`请填写第${ index + 1 }个组件(卡券)中的会员分组`);
                this.flag = false;
              }
            }else if(data.visibleCondition==this.peopleFilterStyle) {
              if(!data.limitCondition){
                checkFalse(`请填写第${ index + 1 }个组件(卡券)中的人群条件`);
                this.flag = false;
              }
            }
          }else if(limitType==2){
            if(item.cardSetting.length<1){ // 是否选择卡券
              checkFalse(`请添加第${ index + 1 }个组件(卡券)中的卡券`);
              this.flag = false;
            }else {
              item.cardSetting.forEach((list)=>{
                this.checkCardData(list,index);
                if(list.visibleCondition==this.peopleMemberStyle) {
                  if(!list.memberGroupTagList || (list.memberGroupTagList && list.memberGroupTagList.length<1)){
                    checkFalse(`请填写第${ index + 1 }个组件(卡券)中的会员分组`);
                    this.flag = false;
                  }
                }else if(list.visibleCondition==this.peopleFilterStyle) {
                  if(!list.limitCondition){
                    checkFalse(`请填写第${ index + 1 }个组件(卡券)中的人群条件`);
                    this.flag = false;
                  }
                }
              })
            }
          }
          // if(item.cardSetting.length>0){
          //   item.cardSetting.forEach((ele,idx)=>{
          //     if(ele.visibleCondition==1 && !ele.limitCondition) {
          //       checkFalse(`请填写第${ index + 1 }个组件(卡券)中的可见人群的限定条件`);
          //       this.flag = false;
          //     }
          //   })
          // }
        }else if(item.key == 'A1'){
          // if(item.visibleCondition==1 && !item.limitCondition){
          //   checkFalse(`请填写第${ index + 1 }个组件(富文本)中的可见人群的限定条件`);
          //   this.flag = false;
          // }
          if(!item.richTextContent){  // 未点击且无值
            checkFalse(`请填写第${ index + 1 }个组件(富文本)中的内容`);
            this.flag = false;
          }
          if(item.visibleCondition==this.peopleMemberStyle) {
            if(!item.memberGroupTagList || (item.memberGroupTagList && item.memberGroupTagList.length<1)){
              checkFalse(`请填写第${ index + 1 }个组件(富文本)中的会员分组`);
              this.flag = false;
            }
          }else if(item.visibleCondition==this.peopleFilterStyle) {
            if(!item.limitCondition){
              checkFalse(`请填写第${ index + 1 }个组件(富文本)中的人群条件`);
              this.flag = false;
            }
          }
        }else if(item.key == 'A2') {
          item.data.forEach((list) => {
            if(list.qcloudImageUrl == '') {
              checkFalse(`请填写第${ index + 1 }个组件(图片广告)中的图片`);
              this.flag = false;
            }
            if(list.visibleCondition==this.peopleMemberStyle) {
              if(!list.memberGroupTagList || (list.memberGroupTagList && list.memberGroupTagList.length<1)){
                checkFalse(`请填写第${ index + 1 }个组件(图片广告)中的会员分组`);
                this.flag = false;
              }
            }else if(list.visibleCondition==this.peopleFilterStyle) {
              if(!list.limitCondition){
                checkFalse(`请填写第${ index + 1 }个组件(图片广告)中的人群条件`);
                this.flag = false;
              }
            }
            // if(list.visibleCondition==1 && !list.limitCondition) {
            //   checkFalse(`请填写第${ index + 1 }个组件(图片广告)中的可见人群的限定条件`);
            //   this.flag = false;
            // }
          });
        }else if(item.key == 'A3') {
          if(item.templateType==9){ // 九宫格
            // new 上传一张即可保存
            var count = 0
            item.data.forEach((list) => {
              if(list.qcloudImageUrl) {
                count++;
                if(list.visibleCondition==this.peopleMemberStyle) {
                  if(!list.memberGroupTagList || (list.memberGroupTagList && list.memberGroupTagList.length<1)){
                    checkFalse(`请填写第${ index + 1 }个组件(魔方)中的会员分组`);
                    this.flag = false;
                  }
                }else if(list.visibleCondition==this.peopleFilterStyle) {
                  if(!list.limitCondition){
                    checkFalse(`请填写第${ index + 1 }个组件(魔方)中的人群条件`);
                    this.flag = false;
                  }
                }
                // if(list.visibleCondition==1 && !list.limitCondition) {
                //   checkFalse(`请填写第${ index + 1 }个组件(魔方)中的可见人群的限定条件`);
                //   this.flag = false;
                // }
              }
            });
            if(count<=0){
              checkFalse(`请上传第${ index + 1 }个组件(魔方)中的图片`);
              this.flag = false;
            }
          }else if(item.templateType==8){ // 自定义  需全部上传
            if (item.selectAll==2) { // 1true 2false   !item.selectAll
              checkFalse(`第${ index + 1 }个组件(魔方)必须全部填充`)
              this.flag = false;
            }
            item.data.forEach((list) => {
              if(list.qcloudImageUrl == '') {
                checkFalse(`请上传第${ index + 1 }个组件(魔方)中的图片`);
                this.flag = false;
              }
              if(list.visibleCondition==this.peopleMemberStyle) {
                if(!list.memberGroupTagList || (list.memberGroupTagList && list.memberGroupTagList.length<1)){
                  checkFalse(`请填写第${ index + 1 }个组件(魔方)中的会员分组`);
                  this.flag = false;
                }
              }else if(list.visibleCondition==this.peopleFilterStyle) {
                if(!list.limitCondition){
                  checkFalse(`请填写第${ index + 1 }个组件(魔方)中的人群条件`);
                  this.flag = false;
                }
              }
            });
          }
        }else if(item.key == 'A5') {
          if(!item.content.trim()) {
            checkFalse(`请填写第${ index + 1 }个组件(文本)中的文本内容`);
            this.flag = false;
          }
          if(item.visibleCondition==this.peopleMemberStyle) {
            if(!item.memberGroupTagList || (item.memberGroupTagList && item.memberGroupTagList.length<1)){
              checkFalse(`请填写第${ index + 1 }个组件(文本)中的会员分组`);
              this.flag = false;
            }
          }else if(item.visibleCondition==this.peopleFilterStyle) {
            if(!item.limitCondition){
              checkFalse(`请填写第${ index + 1 }个组件(文本)中的人群条件`);
              this.flag = false;
            }
          }
          // if(item.visibleCondition==1 && !item.limitCondition) {
          //   checkFalse(`请填写第${ index + 1 }个组件(文本)中的可见人群的限定条件`);
          //   this.flag = false;
          // }
        }else if(item.key == 'A6') {
          item.data.forEach((list) => {
            if(!list.title.trim()) {
              checkFalse(`请填写第${ index + 1 }个组件(横栏)中的标签名称`);
              this.flag = false;
            }
            if(parseInt(item.templateType) != 2) {
              if(!list.qcloudImageUrl) {
                checkFalse(`请上传第${ index + 1 }个组件(横栏)中的图片`);
                this.flag = false;
              }
            }
            if(list.visibleCondition==this.peopleMemberStyle) {
              if(!list.memberGroupTagList || (list.memberGroupTagList && list.memberGroupTagList.length<1)){
                checkFalse(`请填写第${ index + 1 }个组件(横栏)中的会员分组`);
                this.flag = false;
              }
            }else if(list.visibleCondition==this.peopleFilterStyle) {
              if(!list.limitCondition){
                checkFalse(`请填写第${ index + 1 }个组件(横栏)中的人群条件`);
                this.flag = false;
              }
            }
            // if(list.visibleCondition==1 && !list.limitCondition) {
            //   checkFalse(`请填写第${ index + 1 }个组件(横栏)中的可见人群的限定条件`);
            //   this.flag = false;
            // }
          });
        }else if(item.key == 'B2') {
          item.data.forEach((list,idx) => {
            if(list.status) {
              if(!list.title.trim()) {
                checkFalse(`请填写第${ index + 1 }个组件(数据icon)中的标签名称`);
                this.flag = false;
              }
              if(parseInt(item.templateType) == 1) {
                if(!list.qcloudImageUrl) {
                  checkFalse(`请上传第${ index + 1 }个组件(数据icon)中的横栏图标`);
                  this.flag = false;
                }
              }
              if(list.visibleCondition==this.peopleMemberStyle) {
                if(!list.memberGroupTagList || (list.memberGroupTagList && list.memberGroupTagList.length<1)){
                  checkFalse(`请填写第${ index + 1 }个组件(数据icon)中的会员分组`);
                  this.flag = false;
                }
              }else if(list.visibleCondition==this.peopleFilterStyle) {
                if(!list.limitCondition){
                  checkFalse(`请填写第${ index + 1 }个组件(数据icon)中的人群条件`);
                  this.flag = false;
                }
              }
            }
          });
        }
      });
      if(this.flag == false) {
        return false;
      }else {
        let appName = "", appid = "", _result,xcxAppName = "";
        for(let i in this.componentList){
          if(this.componentList[i].key == 'A2' || this.componentList[i].key == 'A3' || this.componentList[i].key == 'A6'){    // 图片广告 魔方 横栏
            for(let j in this.componentList[i].data){
              let ele = this.componentList[i].data[j];
              if(ele.link.appid){ // 选择的是第三方
                appid = ele.link.appid;
                appName = ele.link.name;
                _result = await this.checkAPIOpen(appid,appName);
                if(_result.xcxAPIDialog && xcxAppName.indexOf( _result.xcxAppName)<0){
                  xcxAppName += _result.xcxAppName
                }
              }
            }
          }
        }
        // console.log(xcxAppName);
        if(xcxAppName){
          var html = '请至小程序API管理页配置：'+ xcxAppName.substring(0,xcxAppName.length-1);
          this.$alert(html, '提示', {
            dangerouslyUseHTMLString: true,
            confirmButtonText:'确定',
            cancelButtonText: '取消',
            showCancelButton:true,
            type: 'warning'
          }).then(() => {
            window.open('/gic-web/#/xcxAPI', '_blank');
          }).catch(() => {

          });
          return false;
        }else{
          this.componentList.forEach((item,index) => {
            let temp = {};
            if(item.key == 'B8'){
              temp = {
                key: item.key,
                elementIndex: index + 1
              }
            }else if(item.key == 'B9'){
              temp = {
                key: item.key,
                elementIndex: index + 1
              }
            }else if(item.key == 'B10'){
              temp = {
                key: item.key,
                elementIndex: index + 1
              }
            }else if(item.key == 'B7'){
              var listArr = [];
              item.cardSetting.forEach((list)=>{
                var listObj = JSON.parse(JSON.stringify(list));
                // 展示时间
                var obj = {};
                obj.startShowTime = listObj.timeValueRegular?listObj.timeValueRegular[0]:"";
                obj.endShowTime = listObj.timeValueRegular?listObj.timeValueRegular[1]:"";
                listObj.timeValueRegular = obj;
                listObj.timeValueMonth = listObj.timeValueMonth?listObj.timeValueMonth.join(','):"";
                listObj.timeValueWeek = listObj.timeValueWeek?listObj.timeValueWeek.join(','):"";
                // 领取时段 部分时段
                var timeValueArr = [];
                if(listObj.receiveTimeType==2){
                  listObj.receiveTimeValue.forEach((list)=>{
                    var timeValueObj = {};
                    timeValueObj.startGetTime = list.timeRange[0];
                    timeValueObj.endGetTime = list.timeRange[1];
                    timeValueArr.push(timeValueObj);
                  })
                }else{
                  timeValueArr.push({
                    endGetTime: "08:00",
                    startGetTime: "08:00"
                  });
                }
                listObj.receiveTimeValue = timeValueArr;
                // 人群条件
                listObj.receivePeopleValue = listObj.receivePeopleValue?listObj.receivePeopleValue.join(','):"";
                // 领取人群 会员等级
                listObj.memberGrade = listObj.memberGrade?listObj.memberGrade.join(','):"";

                if(listObj.visibleCondition==this.peopleMemberStyle){ // 会员分组
                  var ids = "";
                  listObj.memberGroupTagList = listObj.memberGroupTagList?listObj.memberGroupTagList:[];
                  listObj.memberGroupTagList.forEach((item)=>{
                    ids += item.memberTagGroupId + ',';
                  })
                  listObj.limitCondition = ids.substring(0,ids.length-1);
                }else if(listObj.visibleCondition==this.peopleFilterStyle){  // 人群筛选器

                }
                delete listObj.memberGroupTagList;
                delete listObj.limitMemberGroup;
                delete listObj.businessId;
                listArr.push(listObj);
              })
              // console.log(listArr);
              if(item.receiveLimitType==1){
                temp = {
                  key:item.key,
                  elementIndex:index + 1,
                  cardType:item.cardType,
                  cardStyle:item.cardStyle,
                  receiveLimitType:item.receiveLimitType,
                  cardSetting:[listArr[0]]
                }
              }else if(item.receiveLimitType==2){
                temp = {
                  key:item.key,
                  elementIndex:index + 1,
                  cardType:item.cardType,
                  cardStyle:item.cardStyle,
                  receiveLimitType:item.receiveLimitType,
                  cardSetting:listArr
                }
              }
            }else if(item.key == 'A1') {
              if(item.visibleCondition==this.peopleMemberStyle){ // 会员分组
                var ids = "";
                item.memberGroupTagList = item.memberGroupTagList?item.memberGroupTagList:[];
                item.memberGroupTagList.forEach((item)=>{
                  ids += item.memberTagGroupId + ',';
                })
                item.limitCondition = ids.substring(0,ids.length-1);
              }
              temp = {
                key: item.key,
                visibleCondition: item.visibleCondition,
                limitCondition: item.limitCondition,
                backgroundColor: !item.backgroundColor?'#fff':item.backgroundColor,
                fillWay: parseInt(item.fillWay),
                richTextContent: item.richTextContent,
                elementIndex: index + 1,
                detailParams:item.detailParams,
              }
            }else if(item.key == 'A2') {
              var newDataList = [];
              // console.log(item.data);
              item.data.forEach(list => {
                if(!list.link.name) {
                  list.link = '';
                }
                if(list.visibleCondition==this.peopleMemberStyle){ // 会员分组
                  var ids = "";
                  list.memberGroupTagList = list.memberGroupTagList?list.memberGroupTagList:[];
                  list.memberGroupTagList.forEach((el)=>{
                    ids += el.memberTagGroupId + ',';
                  })
                  list.limitCondition = ids.substring(0,ids.length-1);
                }
                var newData = {
                  dataType:list.dataType,
                  fontColor:list.fontColor,
                  hotspot:list.hotspot,
                  imageFiledCode: list.imageFiledCode,
                  limitCondition: list.limitCondition,
                  detailParams:list.detailParams,
                  link: list.link,
                  pos:list.pos,
                  qcloudImageUrl: list.qcloudImageUrl,
                  status:list.status,
                  title: list.title,
                  visibleCondition: list.visibleCondition
                };
                newDataList.push(newData);
              });
              temp = {
                key: item.key,
                templateType: 1,
                fillWay: parseInt(item.fillWay),
                imageSpace: item.imageSpace,
                screenPhotos: this.componentList[index].data.length,
                elementIndex: index + 1,
                imgHeight: item.imgHeight,
                data: newDataList
              }
            }else if(item.key == 'A3') {
              var newDataList = [];
              // console.log(item);
              item.data.forEach((list,index) => {
                if(!list.link.name) {
                  list.link = '';
                }
                if(list.visibleCondition==this.peopleMemberStyle){ // 会员分组
                  var ids = "";
                  list.memberGroupTagList = list.memberGroupTagList?list.memberGroupTagList:[];
                  list.memberGroupTagList.forEach((el)=>{
                    ids += el.memberTagGroupId + ',';
                  })
                  list.limitCondition = ids.substring(0,ids.length-1);
                }
                // 魔方图片位置
                if(item.templateType==9){
                  list.pos = index+1
                }else if(item.templateType==8){
                  list.pos = list.pos?list.pos:(list.left+'.'+list.top+','+list.endLeft+'.'+list.endTop);
                }
                delete list.memberGroupTagList;
                delete list.limitMemberGroup;
                delete list.businessId;
              });
              temp = {
                key: item.key,
                templateType: item.templateType,
                lineSetting:item.lineSetting,
                imageSpace: parseInt(item.imageSpace),
                customDensity: item.customDensity,
                elementIndex: index + 1,
                data: item.data
              };
            }else if(item.key == 'A5') {
              if(item.visibleCondition==this.peopleMemberStyle){ // 会员分组
                var ids = "";
                item.memberGroupTagList = item.memberGroupTagList?item.memberGroupTagList:[];
                item.memberGroupTagList.forEach((item)=>{
                  ids += item.memberTagGroupId + ',';
                })
                item.limitCondition = ids.substring(0,ids.length-1);
              }
              temp = {
                key: item.key,
                content: item.content,
                fontColor: item.fontColor,
                backgroundColor: item.backgroundColor,
                pos: item.pos,
                fillWay: parseInt(item.fillWay),
                visibleCondition: parseInt(item.visibleCondition),
                limitCondition: item.limitCondition,
                detailParams:item.detailParams,
                elementIndex: index + 1
              };
            }else if(item.key == 'A6') {
              item.data.forEach(list => {
                if(!list.link.name) {
                  list.link = '';
                }
                if(list.visibleCondition==this.peopleMemberStyle){ // 会员分组
                  var ids = "";
                  list.memberGroupTagList = list.memberGroupTagList?list.memberGroupTagList:[];
                  list.memberGroupTagList.forEach((el)=>{
                    ids += el.memberTagGroupId + ',';
                  })
                  list.limitCondition = ids.substring(0,ids.length-1);

                  delete list.memberGroupTagList;
                  delete list.limitMemberGroup;
                  delete list.businessId;
                }
              });
              temp = {
                key: item.key,
                templateType: parseInt(item.templateType),
                jumpHint: item.jumpHint == true ? 1 : 0,
                backgroundColor: item.backgroundColor,
                fontColor: item.fontColor,
                elementIndex: index + 1,
                data: item.data
              };
            }else if(item.key == 'A7') {
              temp = {
                key: item.key,
                fontColor: item.fontColor,
                style: item.style,
                fillWay: parseInt(item.fillWay),
                elementIndex: index + 1
              }
            }else if(item.key == 'A8') {
              temp = {
                key: item.key,
                fillWay: item.fillWay,
                elementIndex: index + 1
              }
            }else if(item.key == 'B2') {
              item.data.forEach(list => {
                list.status = list.status == true ? 1 : 0;
                if(list.visibleCondition==this.peopleMemberStyle){ // 会员分组
                  var ids = "";
                  list.memberGroupTagList = list.memberGroupTagList?list.memberGroupTagList:[];
                  list.memberGroupTagList.forEach((el)=>{
                    ids += el.memberTagGroupId + ',';
                  })
                  list.limitCondition = ids.substring(0,ids.length-1);

                  delete list.memberGroupTagList;
                  delete list.limitMemberGroup;
                  delete list.businessId;
                }
              });
              temp = {
                key: item.key,
                templateType: parseInt(item.templateType),
                elementType: 3,
                amount: parseInt(item.amount),
                fontColor: item.fontColor,
                backgroundColor: item.backgroundColor,
                elementIndex: index + 1,
                data: item.data
              }
            }else if(item.key == 'B4') {
              temp = {
                key: item.key,
                elementIndex: index + 1
              }
            }else if(item.key == 'B5') {
              temp = {
                key: item.key,
                elementIndex: index + 1,
                data: []
              }
            }
            value.push(temp);
          });
        }
      }
      // let membercard = [{
      //   key:  'B3',
      //   elementIndex: 0
      // }];
      // let curvalue = membercard.concat(value);
      let params = {
        pageId: this.pageId,
        title: this.ruleForm.title,
        entryCondition: parseInt(this.ruleForm.entryCondition),
        pageType: 8,
        value: value
      };
      // console.log(params);
      if(this.saveBtnBool){
        this.saveBtnBool = false;
        this.axios.post('/api-admin/save-page',qs.stringify({
          requestProject: 'gic-web',
          saveType: saveType,
          params: JSON.stringify(params)
        })).then(res => {
          this.saveBtnBool = true;
          if(res.data.errorCode == 0) {
            checkSuccess('保存成功');
            setTimeout(this.$router.push('integralService'),3000);
          }else {
            checkFalse('操作失败');
            return false;
          }
        }).catch(err => {
          checkStatus(err);
        })
      }

    },
    cardDetail() {
      this.curCardType = 'two';
    },
    getDetail(pageId){
      this.axios.get('/api-admin/page-detail',{
        params: {
          requestProject: 'gic-web',
          pageId: pageId
        }
      }).then(res => {
        this.getMemberGrade(); // 获取会员等级
        if(res.data.errorCode == 0) {
          let tempDetail = res.data.result;
          this.ruleForm.title = tempDetail.title;
          this.extitle = tempDetail.title;
          this.ruleForm.entryCondition = tempDetail.entryCondition;
          this.componentList = tempDetail.value;
          this.componentList.forEach(item => {
            if(item.key == 'B8'){
              item.img = static1;
            }
            if(item.key == 'B9'){
              item.img = static2;
            }
            if(item.key == 'B10'){
              item.img = static3;
            }
            if(item.key == 'B7'){
              this.disabledList = [];
              item.cardSetting.forEach((list)=>{
                // 展示时间 固定日期
                list.timeValueRegular = list.timeValueRegular.endShowTime?[list.timeValueRegular.startShowTime,list.timeValueRegular.endShowTime]:[];
                // 展示时间 每月
                list.timeValueMonth = list.timeValueMonth?list.timeValueMonth.split(','):[];
                // 展示时间 每周
                list.timeValueWeek = list.timeValueWeek?list.timeValueWeek.split(','):[];
                // 部分时段
                var timeVal = "";
                list.receiveTimeValue.forEach((val)=>{
                  timeVal += val.startGetTime +'-'+ val.endGetTime +'#';
                })
                let timeList = timeVal.split('#').filter(v => v);
                timeList.map((v, i) => {
                  let arr = v.split('-');
                  this.$set(list.receiveTimeValue, i, { timeRange: [arr[0], arr[1]] })
                });
                // 领取人群 限定条件
                list.receivePeopleValue = list.receivePeopleValue ? list.receivePeopleValue.split(',') : [];
                // 领取人群 限定条件 会员等级
                list.memberGrade = list.memberGrade?list.memberGrade.split(','):[];
                // 数量限制  传0时转为空
                list.numberLimitValue = list.numberLimitValue?list.numberLimitValue:null;
                // 得出人群条件
                // list.peopleFilterDetail = this.getPeopleDetail(list.limitCondition);
                if(list.visibleCondition==this.peopleMemberStyle){  // 会员分组
                  list.limitMemberGroup = list.limitCondition;
                  list.limitCondition = "";
                }else if(list.visibleCondition==this.peopleFilterStyle){  // 人群筛选器
                  list.limitMemberGroup = "";
                }
              })
              var limitType = item.receiveLimitType;
              if(limitType==1){
                if(item.cardSetting[0].cardData.length>0){
                  item.cardSetting[0].cardData.forEach((ele)=>{
                    this.disabledList.push(ele.coupCardId);
                  })
                }
              }else if(limitType==2){
                item.cardSetting.forEach((list)=>{
                  if(list.cardData.length>0){
                    this.disabledList.push(list.cardData[0].coupCardId);
                  }
                })
              }
            }
            if(item.key == 'A1'){
              if(item.visibleCondition==this.peopleMemberStyle){  // 会员分组
                item.limitMemberGroup = item.limitCondition;
                item.limitCondition = "";
              }else if(item.visibleCondition==this.peopleFilterStyle){  // 人群筛选器
                item.limitMemberGroup = "";
              }
              // item.peopleFilterDetail = this.getPeopleDetail(item.limitCondition);
            }
            if(item.key == 'A2') {
              item.data.forEach(list => {
                if(!list.link) {
                  list.link = {
                    name : ''
                  };
                }
                if(list.visibleCondition==this.peopleMemberStyle){  // 会员分组
                  list.limitMemberGroup = list.limitCondition;
                  list.limitCondition = "";
                }else if(item.visibleCondition==this.peopleFilterStyle){  // 人群筛选器
                  list.limitMemberGroup = "";
                }
                // list.peopleFilterDetail = this.getPeopleDetail(list.limitCondition);
              });
            }
            if(item.key == 'A3') {
              // this.peopleStyle = null
              item.data.forEach(list => {
                if(!list.link) {
                  list.link = {
                    name : ''
                  };
                }
                if(list.visibleCondition==this.peopleMemberStyle){  // 会员分组
                  list.limitMemberGroup = list.limitCondition;
                  list.limitCondition = "";
                }else if(item.visibleCondition==this.peopleFilterStyle){  // 人群筛选器
                  list.limitMemberGroup = "";
                }
              });
              item.lineSetting = JSON.parse(item.lineSetting)
            }
            if(item.key == 'A5'){
              if(item.visibleCondition==this.peopleMemberStyle){  // 会员分组
                item.limitMemberGroup = item.limitCondition;
                item.limitCondition = "";
              }else if(item.visibleCondition==this.peopleFilterStyle){  // 人群筛选器
                item.limitMemberGroup = "";
              }
              // item.peopleFilterDetail = this.getPeopleDetail(item.limitCondition);
            }
            if(item.key == 'A6') {
              // if(item.templateType == 3){ // 双横栏
              //   item.data = item.data.slice(0,2);
              // }
              this.data1 =  item.data;
              this.data2 =  item.data.slice(0,2);

              item.jumpHint = parseInt(item.jumpHint) == 1 ? true : false;
              item.data.forEach(list => {
                if(!list.link) {
                  list.link = {
                    name : ''
                  };
                }
                if(list.visibleCondition==this.peopleMemberStyle){  // 会员分组
                  list.limitMemberGroup = list.limitCondition;
                  list.limitCondition = "";
                }else if(item.visibleCondition==this.peopleFilterStyle){  // 人群筛选器
                  list.limitMemberGroup = "";
                }
                // list.peopleFilterDetail = this.getPeopleDetail(list.limitCondition);
              });
            }
            if(item.key == 'B2') {
              item.templateType = item.templateType;
              item.amount = item.amount;
              item.data.forEach(list => {
                list.status = (list.status == 1) ? true : false;
                if(list.visibleCondition==this.peopleMemberStyle){  // 会员分组
                  list.limitMemberGroup = list.limitCondition;
                  list.limitCondition = "";
                }else if(item.visibleCondition==this.peopleFilterStyle){  // 人群筛选器
                  list.limitMemberGroup = "";
                }
                // list.peopleFilterDetail = this.getPeopleDetail(list.limitCondition);
              });
            }
          })
        }
      }).catch(err => {
        console.log(err);
        return false;
      })
    },
    // 获取详情时获取人群条件的详情
    getPeopleDetail(data){
      // console.log(data);
      if(data){
        var temp = JSON.parse(data);
        this.peopleFilterDetail = "";
        if(temp.gradeLevel){
          this.peopleFilterDetail += '会员等级：' + temp.gradeLevelName + '；';
        }
        if(temp.costAllEnd>-1){
          this.peopleFilterDetail += '消费总额：' + temp.costAllBegin + '至' + temp.costAllEnd + '元；'
        }
        if(temp.costTimesEnd>-1){
          this.peopleFilterDetail += '消费次数：' + temp.costTimesBegin + '至' + temp.costTimesEnd + '次；'
        }
        if(temp.avgCostEnd>-1){
          this.peopleFilterDetail += '客单价：' + temp.avgCostBegin + '至' + temp.avgCostEnd + '元；'
        }
        if(temp.avgNumberEnd>-1){
          this.peopleFilterDetail += '连带率：' + temp.avgNumberBegin + '至' + temp.avgNumberEnd + '件；'
        }
        if(temp.birthdayMDEndStr){
          this.peopleFilterDetail += '生日：' + temp.birthdayMDBeginStr + '至' + temp.birthdayMDEndStr + '；'
        }
        return this.peopleFilterDetail
      }
    },
    backBtn(){
      this.$confirm('确认放弃编辑内容？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({
          path: '/integralService'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    }
  },
  mounted() {
    this.nowDate = this.getNowDate(); // 获取现在的时间

    this.getIntegralSetting(); // 获取进入积分组件的配置
    if(this.pageId) {
      this.getDetail(this.pageId);
    }else{
      this.getMemberGrade(); // 获取会员等级
    }

    window.onresize = () => {
      return (() => {
        this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
      })()
    }

    // 解决火狐拖拽情况下搜索
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  },
  created() {
    this.$store.commit('isShowFoot',false);
  },
  components: {
    // 'v-membercenterAddLeft': membercenterAddLeft,
    draggable,
    Linktools,
    peopleFilter,
    tinymceEdit,
    editor,
    selfDefined
  }
}
