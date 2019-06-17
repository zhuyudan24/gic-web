export default {
  errorCode: 0,
  message: null,
  detailError: null,
  result: {
    pageType: 8,
    enterpriseId: "ff8080815d45ca76015d5ee0af746cc1",
    pageId: "ff80808168f1fbfb0168fe3dddf804a8",
    title: "积分服务",
    entryCondition: 0,
    value: [
      {
        elementIndex: 1,
        key: "B10"
      },
      {
        cardType: 1,
        receiveLimitType: 2,
        elementIndex: 2,
        cardSetting: [
          {
            cardData: [
              {
                cardName: "4月铂金卡生日福利",
                cardStartTime: "2019年04月01日",
                coupCardId: "ff80808169bfcbb30169c769bb055d91",
                cardEndTime: "2019年04月30日",
                cardType: 0,
                isHasDate: 0,
                validStartDate: null,
                validEndDate: null,
                cardSort: 3,
                status: 1
              }
            ],
            visibleCondition: 1,
            limitCondition:
              '{"list":[{"type":"or","list":[{"type":"data","data":{"key":"gradeId","compute":"in","value":"ff80808166356f36016656640f23373b"}}]},{"type":"or","list":[{"type":"data","data":{"key":"birthdayMD","compute":"between","value":"0401,0430"}}]}],"type":"and"}',
            numberLimitType: 1,
            memberGroupTagList: null,
            businessId: "08605c6c078443a89f4aee6393270102",
            timeType: 2,
            timeValueMonth: "",
            receiveTimeType: 1,
            receivePeopleValue: "3,2,4",
            receivePeopleType: 1,
            receiveTimeValue: [
              {
                startGetTime: "08:00",
                endGetTime: "08:00"
              }
            ],
            memberGrade: "ff80808166356f36016656640f23373b",
            detailParams:
              '[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","chainNodeName":"会员信息","children":[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","property":8,"chainNodeName":"会员信息","columnKey":"gradeId","computeCharacter":"in","columnValue":"ff80808166356f36016656640f23373b","children":[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","property":8,"levelModel":"memberGrade","templateCode":"com001","levelOptions":[{"key":"memberGrade","value":"会员等级"}]},{"esScreeningWidgetChainId":"fdd41c3f5d4746549082af2a84d00528","property":3,"levelModel":["ff80808166356f36016656640f23373b"],"templateCode":"com007","levelOptions":[{"gradeId":"ff80808166356f36016656640f23373b","gradeName":"铂金卡","value":"铂金卡","key":"ff80808166356f36016656640f23373b"}]}]}]},{"esScreeningWidgetChainId":"a828a6e39035497e9137931575b92b7a","chainNodeName":"开卡信息","children":[{"esScreeningWidgetChainId":"a828a6e39035497e9137931575b92b7a","property":8,"chainNodeName":"开卡信息","columnKey":"birthdayMD","computeCharacter":"between","columnValue":"0401,0430","children":[{"esScreeningWidgetChainId":"a828a6e39035497e9137931575b92b7a","property":8,"levelModel":"k103","templateCode":"com009","levelOptions":[{"name":"生日","id":"k103","value":"生日","key":"k103"}]},{"esScreeningWidgetChainId":"9110dcecc5564f40b5a7a3cbaac9c8f1","property":3,"levelModel":["0401","0430"],"templateCode":"com008","levelOptions":[null,null],"widgetInstruction":"请选择","storeOption":[0,1,2,3,4,5],"storeFlag":true,"operateType":true,"uuid":""}]}]}]',
            timeValueRegular: {
              endShowTime: "2019-05-01 00:00:00",
              startShowTime: "2019-04-01 00:00:00"
            },
            numberLimitValue: 0,
            timeValueWeek: ""
          },
          {
            cardData: [],
            visibleCondition: 1,
            limitCondition:
              '{"list":[{"type":"or","list":[{"type":"data","data":{"key":"birthdayMD","compute":"between","value":"0301,0331"}}]},{"type":"or","list":[{"type":"data","data":{"key":"gradeId","compute":"in","value":"ff8080815d94333b015dab0ab35b30ef"}}]}],"type":"and"}',
            numberLimitType: 1,
            memberGroupTagList: null,
            businessId: "6a9d0d8143834dde9fb1ebf506dc1fd8",
            timeType: 2,
            timeValueMonth: "",
            receiveTimeType: 1,
            receivePeopleValue: "3,4",
            receivePeopleType: 1,
            receiveTimeValue: [
              {
                startGetTime: "08:00",
                endGetTime: "08:00"
              }
            ],
            memberGrade: "ff8080815d94333b015dab0ab35b30ef",
            detailParams:
              '[{"esScreeningWidgetChainId":"a828a6e39035497e9137931575b92b7a","chainNodeName":"开卡信息","children":[{"esScreeningWidgetChainId":"a828a6e39035497e9137931575b92b7a","property":8,"chainNodeName":"开卡信息","columnKey":"birthdayMD","computeCharacter":"between","columnValue":"0301,0331","children":[{"esScreeningWidgetChainId":"a828a6e39035497e9137931575b92b7a","property":8,"levelModel":"k103","templateCode":"com009","levelOptions":[{"name":"生日","id":"k103","value":"生日","key":"k103"}]},{"esScreeningWidgetChainId":"9110dcecc5564f40b5a7a3cbaac9c8f1","property":3,"levelModel":["0301","0331"],"templateCode":"com008","levelOptions":[null,null],"widgetInstruction":"请选择","storeOption":[0,1,2,3,4,5],"storeFlag":true,"operateType":true,"uuid":""}]}]},{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","chainNodeName":"会员信息","children":[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","property":8,"chainNodeName":"会员信息","columnKey":"gradeId","computeCharacter":"in","columnValue":"ff8080815d94333b015dab0ab35b30ef","children":[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","property":8,"levelModel":"memberGrade","templateCode":"com001","levelOptions":[{"key":"memberGrade","value":"会员等级"}]},{"esScreeningWidgetChainId":"fdd41c3f5d4746549082af2a84d00528","property":3,"levelModel":["ff8080815d94333b015dab0ab35b30ef"],"templateCode":"com007","levelOptions":[{"gradeId":"ff8080815d94333b015dab0ab35b30ef","gradeName":"金卡","value":"金卡","key":"ff8080815d94333b015dab0ab35b30ef"}]}]}]}]',
            timeValueRegular: {
              endShowTime: "2019-03-31 00:00:00",
              startShowTime: "2019-03-01 00:00:00"
            },
            numberLimitValue: 0,
            timeValueWeek: ""
          },
          {
            cardData: [
              {
                cardName: "4月金卡生日福利",
                cardStartTime: "2019年04月01日",
                coupCardId: "ff80808169bfcbb30169c765eb5e5d04",
                cardEndTime: "2019年04月30日",
                cardType: 0,
                isHasDate: 0,
                validStartDate: null,
                validEndDate: null,
                cardSort: 2,
                status: 1
              }
            ],
            visibleCondition: 1,
            limitCondition:
              '{"list":[{"type":"or","list":[{"type":"data","data":{"key":"gradeId","compute":"in","value":"ff8080815d94333b015dab0ab35b30ef"}}]},{"type":"or","list":[{"type":"data","data":{"key":"birthdayMD","compute":"between","value":"0401,0430"}}]}],"type":"and"}',
            numberLimitType: 1,
            memberGroupTagList: null,
            businessId: "bc9e0abfcb4e4d77842fda84b93fd29b",
            timeType: 2,
            timeValueMonth: "",
            receiveTimeType: 1,
            receivePeopleValue: "3,4,2",
            receivePeopleType: 1,
            receiveTimeValue: [
              {
                startGetTime: "08:00",
                endGetTime: "08:00"
              }
            ],
            memberGrade: "ff8080815d94333b015dab0ab35b30ef",
            detailParams:
              '[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","chainNodeName":"会员信息","children":[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","property":8,"chainNodeName":"会员信息","columnKey":"gradeId","computeCharacter":"in","columnValue":"ff8080815d94333b015dab0ab35b30ef","children":[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","property":8,"levelModel":"memberGrade","templateCode":"com001","levelOptions":[{"key":"memberGrade","value":"会员等级"}]},{"esScreeningWidgetChainId":"fdd41c3f5d4746549082af2a84d00528","property":3,"levelModel":["ff8080815d94333b015dab0ab35b30ef"],"templateCode":"com007","levelOptions":[{"gradeId":"ff8080815d94333b015dab0ab35b30ef","gradeName":"金卡","value":"金卡","key":"ff8080815d94333b015dab0ab35b30ef"}],"storeFlag":true,"operateType":true}]}]},{"esScreeningWidgetChainId":"a828a6e39035497e9137931575b92b7a","chainNodeName":"开卡信息","children":[{"esScreeningWidgetChainId":"a828a6e39035497e9137931575b92b7a","property":8,"chainNodeName":"开卡信息","columnKey":"birthdayMD","computeCharacter":"between","columnValue":"0401,0430","children":[{"esScreeningWidgetChainId":"a828a6e39035497e9137931575b92b7a","property":8,"levelModel":"k103","templateCode":"com009","levelOptions":[{"name":"生日","id":"k103","value":"生日","key":"k103"}]},{"esScreeningWidgetChainId":"9110dcecc5564f40b5a7a3cbaac9c8f1","property":3,"levelModel":["0401","0430"],"templateCode":"com008","levelOptions":[null,null],"widgetInstruction":"请选择","storeOption":[0,1,2,3,4,5],"storeFlag":true,"operateType":true,"uuid":""}]}]}]',
            timeValueRegular: {
              endShowTime: "2019-05-01 00:00:00",
              startShowTime: "2019-04-02 00:00:00"
            },
            numberLimitValue: 0,
            timeValueWeek: ""
          }
        ],
        cardStyle: 2,
        key: "B7"
      },
      {
        cardType: 1,
        receiveLimitType: 1,
        elementIndex: 3,
        cardSetting: [
          {
            cardData: [
              {
                cardName: "19春款皮衣券",
                cardStartTime: "2019年03月07日",
                coupCardId: "ff80808169253ffe016956fd6d4d43b3",
                cardEndTime: "2019年03月31日",
                cardType: 0,
                isHasDate: 0,
                validStartDate: null,
                validEndDate: null,
                cardSort: 1,
                status: 5
              },
              {
                cardName: "19春款外套券",
                cardStartTime: "2019年03月08日",
                coupCardId: "ff80808169594b4001695c19b3e948a8",
                cardEndTime: "2019年03月31日",
                cardType: 0,
                isHasDate: 0,
                validStartDate: null,
                validEndDate: null,
                cardSort: 2,
                status: 5
              }
            ],
            visibleCondition: 1,
            limitCondition:
              '{"list":[{"type":"or","list":[{"type":"data","data":{"key":"mainStoreId","compute":"in","value":"9411f4c0417311e9ac36bd3fe71a15c2","dealKey":"storeWidget"}}]}],"type":"and"}',
            numberLimitType: 1,
            memberGroupTagList: null,
            businessId: "0a07f4e0f8b64c17a500e4e5a5b5d624",
            timeType: 2,
            timeValueMonth: "",
            receiveTimeType: 1,
            receivePeopleValue: "2",
            receivePeopleType: 1,
            receiveTimeValue: [
              {
                startGetTime: "08:00",
                endGetTime: "08:00"
              }
            ],
            memberGrade: "",
            detailParams:
              '[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","chainNodeName":"会员信息","children":[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","property":8,"chainNodeName":"会员信息","columnKey":"mainStoreId","computeCharacter":"in","columnValue":"9411f4c0417311e9ac36bd3fe71a15c2","children":[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","property":8,"levelModel":"mainStoreId","templateCode":"com001","levelOptions":[{"key":"mainStoreId","value":"服务门店"}]},{"esScreeningWidgetChainId":"9ddd478104a945729700762c8d7e22b0","property":19,"levelModel":"","templateCode":"com020","levelOptions":[],"widgetInstruction":"新版门店筛选器","widgetName":"新版门店筛选器","storeOption":[0,1,2,3,4,5],"storeFlag":true,"operateType":true,"uuid":"9411f4c0417311e9ac36bd3fe71a15c2"}],"dealKey":"storeWidget"}]}]',
            timeValueRegular: {
              endShowTime: "2019-03-31 00:00:00",
              startShowTime: "2019-03-08 00:00:00"
            },
            numberLimitValue: 0,
            timeValueWeek: ""
          }
        ],
        cardStyle: 2,
        key: "B7"
      },
      {
        cardType: 1,
        receiveLimitType: 1,
        elementIndex: 4,
        cardSetting: [
          {
            cardData: [
              {
                cardName: "19春款风衣券",
                cardStartTime: "2019年03月07日",
                coupCardId: "ff80808169253ffe016956eaae283fbd",
                cardEndTime: "2019年03月31日",
                cardType: 0,
                isHasDate: 0,
                validStartDate: null,
                validEndDate: null,
                cardSort: 1,
                status: 5
              },
              {
                cardName: "19春款线织衫券",
                cardStartTime: "2019年03月07日",
                coupCardId: "ff80808169253f2f01695704b61768ba",
                cardEndTime: "2019年03月31日",
                cardType: 0,
                isHasDate: 0,
                validStartDate: null,
                validEndDate: null,
                cardSort: 2,
                status: 5
              }
            ],
            visibleCondition: 1,
            limitCondition:
              '{"list":[{"type":"or","list":[{"type":"data","data":{"key":"mainStoreId","compute":"in","value":"7e2de6e0417411e9ac36bd3fe71a15c2","dealKey":"storeWidget"}}]}],"type":"and"}',
            numberLimitType: 1,
            memberGroupTagList: null,
            businessId: "28c98c57ea93435682508b4ff46d1343",
            timeType: 2,
            timeValueMonth: "",
            receiveTimeType: 1,
            receivePeopleValue: "2",
            receivePeopleType: 1,
            receiveTimeValue: [
              {
                startGetTime: "08:00",
                endGetTime: "08:00"
              }
            ],
            memberGrade: "",
            detailParams:
              '[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","chainNodeName":"会员信息","children":[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","property":8,"chainNodeName":"会员信息","columnKey":"mainStoreId","computeCharacter":"in","columnValue":"7e2de6e0417411e9ac36bd3fe71a15c2","children":[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","property":8,"levelModel":"mainStoreId","templateCode":"com001","levelOptions":[{"key":"mainStoreId","value":"服务门店"}]},{"esScreeningWidgetChainId":"9ddd478104a945729700762c8d7e22b0","property":19,"levelModel":"","templateCode":"com020","levelOptions":[],"widgetInstruction":"新版门店筛选器","widgetName":"新版门店筛选器","storeOption":[0,1,2,3,4,5],"storeFlag":true,"operateType":true,"uuid":"7e2de6e0417411e9ac36bd3fe71a15c2"}],"dealKey":"storeWidget"}]}]',
            timeValueRegular: {
              endShowTime: "2019-03-31 00:00:00",
              startShowTime: "2019-03-08 00:00:00"
            },
            numberLimitValue: 0,
            timeValueWeek: ""
          }
        ],
        cardStyle: 2,
        key: "B7"
      },
      {
        cardType: 1,
        receiveLimitType: 1,
        elementIndex: 5,
        cardSetting: [
          {
            cardData: [
              {
                cardName: "100元春装新品券",
                cardStartTime: "2019年03月22日",
                coupCardId: "ff8080816996cf3e0169a2f411216c07",
                cardEndTime: "2019年04月07日",
                cardType: 0,
                isHasDate: 0,
                validStartDate: null,
                validEndDate: null,
                cardSort: 1,
                status: 1
              }
            ],
            visibleCondition: 1,
            limitCondition:
              '{"list":[{"type":"or","list":[{"type":"data","data":{"key":"mainStoreId","compute":"in","value":"29900e504c4211e9978ea98f57d30e5f","dealKey":"storeWidget"}}]}],"type":"and"}',
            numberLimitType: 1,
            memberGroupTagList: null,
            businessId: "f234af02dcd04a92acd472a81b7f8d35",
            timeType: 2,
            timeValueMonth: "",
            receiveTimeType: 1,
            receivePeopleValue: "2",
            receivePeopleType: 1,
            receiveTimeValue: [
              {
                startGetTime: "08:00",
                endGetTime: "08:00"
              }
            ],
            memberGrade: "",
            detailParams:
              '[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","chainNodeName":"会员信息","children":[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","property":8,"chainNodeName":"会员信息","columnKey":"mainStoreId","computeCharacter":"in","columnValue":"29900e504c4211e9978ea98f57d30e5f","children":[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","property":8,"levelModel":"mainStoreId","templateCode":"com001","levelOptions":[{"key":"mainStoreId","value":"服务门店"}]},{"esScreeningWidgetChainId":"9ddd478104a945729700762c8d7e22b0","property":19,"levelModel":"","templateCode":"com020","levelOptions":[],"widgetInstruction":"新版门店筛选器","widgetName":"新版门店筛选器","storeOption":[0,1,2,3,4,5],"storeFlag":true,"operateType":true,"uuid":"29900e504c4211e9978ea98f57d30e5f"}],"dealKey":"storeWidget"}]}]',
            timeValueRegular: {
              endShowTime: "2019-04-08 00:00:00",
              startShowTime: "2019-03-22 00:00:00"
            },
            numberLimitValue: 0,
            timeValueWeek: ""
          }
        ],
        cardStyle: 2,
        key: "B7"
      },
      {
        cardType: 1,
        receiveLimitType: 2,
        elementIndex: 6,
        cardSetting: [
          {
            cardData: [
              {
                cardName: "200元春装新品券",
                cardStartTime: "2019年03月22日",
                coupCardId: "ff8080816996ceb401699e9cf7a307ce",
                cardEndTime: "2019年04月07日",
                cardType: 0,
                isHasDate: 0,
                validStartDate: null,
                validEndDate: null,
                cardSort: 1,
                status: 1
              }
            ],
            visibleCondition: 1,
            limitCondition:
              '{"list":[{"type":"or","list":[{"type":"data","data":{"key":"mainStoreId","compute":"in","value":"72bb87104b9a11e9a942f3671c71583c","dealKey":"storeWidget"}}]}],"type":"and"}',
            numberLimitType: 1,
            memberGroupTagList: null,
            businessId: "93ac2cbdaf2c4d06ae37f7d8d834150f",
            timeType: 2,
            timeValueMonth: "",
            receiveTimeType: 1,
            receivePeopleValue: "2",
            receivePeopleType: 1,
            receiveTimeValue: [
              {
                startGetTime: "08:00",
                endGetTime: "08:00"
              }
            ],
            memberGrade: "",
            detailParams:
              '[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","chainNodeName":"会员信息","children":[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","property":8,"chainNodeName":"会员信息","columnKey":"mainStoreId","computeCharacter":"in","columnValue":"72bb87104b9a11e9a942f3671c71583c","children":[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","property":8,"levelModel":"mainStoreId","templateCode":"com001","levelOptions":[{"key":"mainStoreId","value":"服务门店"}]},{"esScreeningWidgetChainId":"9ddd478104a945729700762c8d7e22b0","property":19,"levelModel":"","templateCode":"com020","levelOptions":[],"widgetInstruction":"新版门店筛选器","widgetName":"新版门店筛选器","storeOption":[0,1,2,3,4,5],"storeFlag":true,"operateType":true,"uuid":"72bb87104b9a11e9a942f3671c71583c"}],"dealKey":"storeWidget"}]}]',
            timeValueRegular: {
              endShowTime: "2019-04-08 00:00:00",
              startShowTime: "2019-03-20 00:00:00"
            },
            numberLimitValue: 0,
            timeValueWeek: ""
          }
        ],
        cardStyle: 2,
        key: "B7"
      },
      {
        cardType: 1,
        receiveLimitType: 2,
        elementIndex: 7,
        cardSetting: [
          {
            cardData: [
              {
                cardName: "300元春装新品券",
                cardStartTime: "2019年03月22日",
                coupCardId: "ff8080816996cda401699e9fbb7005f1",
                cardEndTime: "2019年04月07日",
                cardType: 0,
                isHasDate: 0,
                validStartDate: null,
                validEndDate: null,
                cardSort: 1,
                status: 1
              }
            ],
            visibleCondition: 1,
            limitCondition:
              '{"list":[{"type":"or","list":[{"type":"data","data":{"key":"mainStoreId","compute":"in","value":"8afb3d904bac11e98a855b3328f3a3c2","dealKey":"storeWidget"}}]}],"type":"and"}',
            numberLimitType: 1,
            memberGroupTagList: null,
            businessId: "3ace65175d404f00a324e638a2d050b3",
            timeType: 2,
            timeValueMonth: "",
            receiveTimeType: 1,
            receivePeopleValue: "2",
            receivePeopleType: 1,
            receiveTimeValue: [
              {
                startGetTime: "08:00",
                endGetTime: "08:00"
              }
            ],
            memberGrade: "",
            detailParams:
              '[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","chainNodeName":"会员信息","children":[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","property":8,"chainNodeName":"会员信息","columnKey":"mainStoreId","computeCharacter":"in","columnValue":"8afb3d904bac11e98a855b3328f3a3c2","children":[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","property":8,"levelModel":"mainStoreId","templateCode":"com001","levelOptions":[{"key":"mainStoreId","value":"服务门店"}]},{"esScreeningWidgetChainId":"9ddd478104a945729700762c8d7e22b0","property":19,"levelModel":"","templateCode":"com020","levelOptions":[],"widgetInstruction":"新版门店筛选器","widgetName":"新版门店筛选器","storeOption":[0,1,2,3,4,5],"storeFlag":true,"operateType":true,"uuid":"8afb3d904bac11e98a855b3328f3a3c2"}],"dealKey":"storeWidget"}]}]',
            timeValueRegular: {
              endShowTime: "2019-04-08 00:00:00",
              startShowTime: "2019-03-21 10:00:00"
            },
            numberLimitValue: 0,
            timeValueWeek: ""
          }
        ],
        cardStyle: 2,
        key: "B7"
      },
      {
        cardType: 1,
        receiveLimitType: 1,
        elementIndex: 8,
        cardSetting: [
          {
            cardData: [
              {
                cardName: "300元春装新品券",
                cardStartTime: "2019年03月25日",
                coupCardId: "ff8080816996cf3e0169b3bac45b17ac",
                cardEndTime: "2019年04月07日",
                cardType: 0,
                isHasDate: 0,
                validStartDate: null,
                validEndDate: null,
                cardSort: 1,
                status: 1
              }
            ],
            visibleCondition: 1,
            limitCondition:
              '{"list":[{"type":"or","list":[{"type":"data","data":{"key":"mainStoreId","compute":"in","value":"1cf36cb04ed011e98e06aba8685e1b37","dealKey":"storeWidget"}}]}],"type":"and"}',
            numberLimitType: 2,
            memberGroupTagList: null,
            businessId: "92b60a74478641a0abefce05e736b047",
            timeType: 2,
            timeValueMonth: "",
            receiveTimeType: 1,
            receivePeopleValue: "2",
            receivePeopleType: 1,
            receiveTimeValue: [
              {
                startGetTime: "08:00",
                endGetTime: "08:00"
              }
            ],
            memberGrade: "",
            detailParams:
              '[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","chainNodeName":"会员信息","children":[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","property":8,"chainNodeName":"会员信息","columnKey":"mainStoreId","computeCharacter":"in","columnValue":"1cf36cb04ed011e98e06aba8685e1b37","children":[{"esScreeningWidgetChainId":"6d9199d291a14f0b99a00944704ca621","property":8,"levelModel":"mainStoreId","templateCode":"com001","levelOptions":[{"key":"mainStoreId","value":"服务门店"}]},{"esScreeningWidgetChainId":"9ddd478104a945729700762c8d7e22b0","property":19,"levelModel":"","templateCode":"com020","levelOptions":[],"widgetInstruction":"新版门店筛选器","widgetName":"新版门店筛选器","storeOption":[0,1,2,3,4,5],"storeFlag":true,"operateType":true,"uuid":"1cf36cb04ed011e98e06aba8685e1b37"}],"dealKey":"storeWidget"}]}]',
            timeValueRegular: {
              endShowTime: "2019-04-07 00:00:00",
              startShowTime: "2019-03-25 00:00:00"
            },
            numberLimitValue: 5,
            timeValueWeek: ""
          }
        ],
        cardStyle: 1,
        key: "B7"
      },
      {
        elementIndex: 9,
        key: "B8"
      },
      {
        elementIndex: 10,
        key: "B9"
      }
    ],
    status: 1,
    setting: null
  }
};
