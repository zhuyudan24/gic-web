// 卡券
export const cardSetting = {  
    timeType:1, //展示时间（1：全部日期2：固定日期3：每月4：每周）
    timeValueRegular:[],  //（如果是2：固定日期，精确到秒）
    timeValueMonth:[],  //（如果是3：每月日期，日期用英文逗号隔开）
    timeValueWeek:[], //(如果是4：每周，1表示周一，2表示周二，英文逗号隔开)
    receiveTimeType:1,  //领取时间段(1：全部时段2：部分时段)
    receiveTimeValue:[{
      endGetTime: "08:00", 
      startGetTime: "08:00"
    }],
    visibleCondition: "0",  //可见人群；0不限，1限
    limitCondition:"",  //可见人群参数值
    receivePeopleType:0,  //领取人群类型0不限，1限
    receivePeopleValue:[], //多选，英文逗号隔开，且的关系（1：开卡会员2：认证会员3：当月生日会员4：选择会员等级）
    memberGrade:[],  //会员等级值
    numberLimitType:1,  //数量限制类型（1：每张卡券每人限领一张2：每张卡券每人每天限领N张）
    numberLimitValue:null,  //每张卡券每人每天限领张数
    cardData:[],
    detailParams:'',
    limitMemberGroup:'',
    memberGroupTagList:[]
}
// 横栏
export const dataObj = {
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
  sort: 2,
}

export const baseList = [
  {
    key:"B7",
    elementIndex:1,
    cardType:1,  //卡券类型(1：卡券展架)
    cardStyle:1,  //样式(1：样式1；2：样式2；3：样式3)
    receiveLimitType:1, //领取限制(1：统一条件2：每张卡券单独设置条件)
    cardSetting:[cardSetting]
  },
  {
    key:"A1",   // 富文本
    visibleCondition: '0',  //可见人群；0不限，1限
    limitCondition: "",   //人群条件
    backgroundColor: "#fff",
    fillWay: 0,  //填充方式 0全屏
    richTextContent: "",
    elementIndex: 1,
    detailParams:'',
    limitMemberGroup:'',
    memberGroupTagList:[]
  },
  {
    key: 'A2',
    templateType:  1,
    fillWay: 0,
    imageSpace: 0,
    screenPhotos: 1,
    elementIndex: 1,
    imgHeight:  220,
    data: [
      {
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
      }
    ]
  },
  {
    key: 'A3',
    templateType: 9,
    imageSpace: 0,
    customDensity: 1,
    elementIndex: 1,
    lineSetting:{column: 4, row: 4},
    selectAll:true,
    data: [
      {
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
        pos: '0'
      },
      {
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
        pos: '1'
      },
      {
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
        pos: '2'
      },
      {
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
        pos: '3'
      },
      {
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
        pos: '4'
      },
      {
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
        pos: '5'
      },
      {
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
        pos: '6'
      },
      {
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
        pos: '7'
      },
      {
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
        pos: '8'
      }
    ]
  },
  {
    key: 'A5',
    content: '',
    fontColor: '#1E1E1E',
    backgroundColor: '#fff',
    pos: 'left',
    fillWay: 0,
    visibleCondition: '0',
    elementIndex: 0,
    limitCondition: '',
    detailParams:'',
    limitMemberGroup:'',
    memberGroupTagList:[]
  },
  {
    key: 'A6',
    templateType:  1,
    jumpHint: true,
    backgroundColor: '#fff',
    fontColor: '#1E1E1E',
    elementIndex: 1,
    data: [dataObj]
  },
  {
    key: 'A7',
    fontColor: '#E5E5E5',
    style: 1,
    fillWay: 0,
    elementIndex: 0
  },
  {
    key: 'A8',
    fillWay: 12,
    elementIndex: 0
  }
];

export const mainList = [
  {
    key: 'B2',
    templateType: 3,
    elementType: 3,
    amount: 4,
    elementIndex: 1,
    backgroundColor: '#fff',
    fontColor: '#333',
    data: [{
      photoId: '',
      templateId: '',
      dataType: 'D1',
      title: '商城订单',
      link: '',
      visibleCondition: "0",
      limitCondition: '',
      detailParams:'',
      limitMemberGroup:'',
      memberGroupTagList:[],
      imageFiledCode: '',
      qcloudImageUrl: '',
      sort: 1,
      status: true,
      fontColor: '#1E1E1E',
    },{
      photoId: '',
      templateId: '',
      dataType: 'D2',
      title: '门店消费',
      link: '',
      visibleCondition: "0",
      limitCondition: '',
      detailParams:'',
      limitMemberGroup:'',
      memberGroupTagList:[],
      imageFiledCode: '',
      qcloudImageUrl: '',
      sort: 1,
      status: true,
      fontColor: '#1E1E1E',
    },{
      photoId: '',
      templateId: '',
      dataType: 'D3',
      title: '卡券包',
      link: '',
      visibleCondition: "0",
      limitCondition: '',
      detailParams:'',
      limitMemberGroup:'',
      memberGroupTagList:[],
      imageFiledCode: '',
      qcloudImageUrl: '',
      sort: 1,
      status: true,
      fontColor: '#1E1E1E',
    },{
      photoId: '',
      templateId: '',
      dataType: 'D5',
      title: '购物车',
      link: '',
      visibleCondition: "0",
      limitCondition: '',
      detailParams:'',
      limitMemberGroup:'',
      memberGroupTagList:[],
      imageFiledCode: '',
      qcloudImageUrl: '',
      sort: 1,
      status: false,
      fontColor: '#1E1E1E',
    },{
      photoId: '',
      templateId: '',
      dataType: 'D6',
      title: '收藏商品',
      link: '',
      visibleCondition: "0",
      limitCondition: '',
      detailParams:'',
      limitMemberGroup:'',
      memberGroupTagList:[],
      imageFiledCode: '',
      qcloudImageUrl: '',
      sort: 1,
      status: false,
      fontColor: '#1E1E1E',
    },{
      photoId: '',
      templateId: '',
      dataType: 'D7',
      title: '地址管理',
      link: '',
      visibleCondition: "0",
      limitCondition: '',
      detailParams:'',
      limitMemberGroup:'',
      memberGroupTagList:[],
      imageFiledCode: '',
      qcloudImageUrl: '',
      sort: 1,
      status: false,
      fontColor: '#1E1E1E',
    }
    ]
  }
];

export const jggBaseList = [
  {
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
    pos: '0'
  },
  {
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
    pos: '1'
  },
  {
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
    pos: '2'
  },
  {
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
    pos: '3'
  },
  {
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
    pos: '4'
  },
  {
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
    pos: '5'
  },
  {
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
    pos: '6'
  },
  {
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
    pos: '7'
  },
  {
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
    pos: '8'
  }
];

export const mallList = [
  {
    name:"商品", id: 1
  },
  {
    name:"商品分组", id: 2
  },
  {
    name:"商品搜索", id: 3
  }
];

export const saleList = [
  {
    name:"优惠券", id: 1
  },
  {
    name:"拼团", id: 2
  },
  {
    name:"周期购", id: 3
  },
  {
    name:"限时折扣", id: 4
  },
  {
    name:"秒杀", id: 5
  },
  {
    name:"预售", id: 6
  }
];
