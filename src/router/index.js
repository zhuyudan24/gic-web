import Vue from 'vue'
import Router from 'vue-router'
import _import from './_import.js'
import _import2 from './_import2.js'
Vue.use(Router);

const login = (r) => {
  import('components/login/login.vue').then((module) => {
    r(module)
  })
};
const error401 = (r) => {
  import('view/errorPage/401.vue').then((module) => {
    r(module)
  })
};
const error404 = (r) => {
  import('view/errorPage/404.vue').then((module) => {
    r(module)
  })
};
// 页面刷新时，重新赋值token
if (window.sessionStorage.getItem('token')) {
  store.commit(types.LOGIN, window.sessionStorage.getItem('token'))
}
export const constantRouterMap = [
         {
           path: "/login",
           name: "用户登录",
           component: _import("login", "login")
         },
         {
           path: "/",
           name: "登陆",
           component: _import("login", "login")
         },
         {
           path: "/index",
           name: "index",
           component: _import("index", "index"),
           children: [
             {
               path: "/xcxindex",
               name: "小程序",
               component: _import("xcxindex", "xcxindex"),
               children: [
                 {
                   path: "/themeSetting",
                   name: "主题设置",
                   component: _import("themeSetting", "themeSetting")
                 },
                 {
                   path: "/navSetting",
                   name: "导航设置",
                   component: _import("wechartSetting", "navSetting")
                 },
                 {
                   path: "/custom",
                   name: "自定义页面",
                   component: _import("wechartSetting", "custom")
                 },
                 {
                   path: "/customAdd",
                   name: "自定义页面-新增",
                   component: _import("wechartSetting", "customAdd")
                 },
                 {
                   path: "/member",
                   name: "会员体系",
                   component: _import("member", "member")
                 },
                 {
                   path: "/membercard",
                   name: "会员卡页面",
                   component: _import("member", "membercard")
                 },
                 {
                   path: "/integral",
                   name: "积分页面",
                   component: _import("member", "integral")
                 },
                 {
                   path: "/privilege",
                   name: "特权页面",
                   component: _import("member", "privilege")
                 },
                 {
                   path: "/merchant",
                   name: "集团商户页面",
                   component: _import("member", "merchant")
                 },
                 {
                   path: "/membercenter",
                   name: "会员中心",
                   component: _import("membercenter", "membercenter")
                 },
                 {
                   path: "/membercenterAdd",
                   name: "会员中心-新增",
                   component: _import("membercenter", "membercenterAdd")
                 },
                 {
                   path: "/integralService",
                   name: "积分服务",
                   component: _import(
                     "integralService",
                     "integralService"
                   )
                 },
                 {
                   path: "/integralServiceAdd",
                   name: "积分服务-新增",
                   component: _import(
                     "integralService",
                     "integralServiceAdd"
                   )
                 },
                 {
                   path: "/customerService",
                   name: "客户服务",
                   component: _import(
                     "customerService",
                     "customerService"
                   )
                 },
                 {
                   path: "/xcxAPI",
                   name: "小程序API",
                   component: _import("xcxAPI", "xcxAPI")
                 }
               ]
             },
             // 企业管理 -- 运营策略
             {
               path: "/service",
               name: "运营策略",
               component: _import(
                 "basicConfig/companyManage",
                 "service"
               ),
               children: [
                 {
                   path: "/ser_order_evaluate",
                   name: "订单评价机制",
                   component: _import(
                     "basicConfig/companyManage",
                     "ser_order_evaluate"
                   )
                 },
                 {
                   path: "/money_performance",
                   name: "业绩结算",
                   component: _import(
                     "basicConfig/companyManage",
                     "money_performance"
                   )
                 },
                 {
                   path: "/event_allocaction",
                   name: "事务分配机制",
                   component: _import(
                     "basicConfig/configCenter",
                     "event_allocaction"
                   )
                 },
                 {
                   path: "/member_say",
                   name: "会员在线沟通",
                   component: _import(
                     "basicConfig/configCenter",
                     "member_say"
                   )
                 },
                 {
                   path: "/checkerManage",
                   name: "审核员管理",
                   component: _import("dataSafety", "checkerManage")
                 }
               ]
             },
             // 企业管理 -- 企业资料
             {
               path: "/company",
               name: "企业资料",
               component: _import(
                 "basicConfig/companyManage",
                 "company"
               ),
               children: [
                 {
                   path: "/merchant_info",
                   name: "商户信息",
                   component: _import(
                     "basicConfig/companyManage",
                     "merchant_info"
                   )
                 },
                 {
                   path: "/shop_tag",
                   name: "门店标签",
                   component: _import(
                     "basicConfig/companyManage",
                     "shop_tag"
                   )
                 },
                 {
                   path: "/shop_list",
                   name: "门店列表",
                   component: _import(
                     "basicConfig/companyManage",
                     "shop_list"
                   ),
                   meta: {
                     keepAlive: true
                   }
                 },
                 {
                   path: "/shop_list_add",
                   name: "新增门店",
                   component: _import(
                     "basicConfig/companyManage",
                     "shop_list_add"
                   ),
                   meta: {
                     keepAlive: true
                   }
                 },
                 {
                   path: "/shop_list_recycle",
                   name: "门店回收站",
                   component: _import(
                     "basicConfig/companyManage",
                     "shop_list_recycle"
                   )
                 },
                 {
                   path: "/shop_list_import",
                   name: "批量导入",
                   component: _import(
                     "basicConfig/companyManage",
                     "shop_list_import"
                   )
                 },
                 {
                   path: "/shop_recycle_member",
                   name: "待处理会员",
                   component: _import(
                     "basicConfig/companyManage",
                     "shop_recycle_member"
                   )
                 },
                 {
                   path: "/shop_recycle_clerk",
                   name: "待处理店员",
                   component: _import(
                     "basicConfig/companyManage",
                     "shop_recycle_clerk"
                   )
                 },
                 {
                   path: "/shop_recycle_event",
                   name: "待处理事务",
                   component: _import(
                     "basicConfig/companyManage",
                     "shop_recycle_event"
                   )
                 },
                 {
                   path: "/clerk_list",
                   name: "店员列表",
                   component: _import(
                     "basicConfig/companyManage",
                     "clerk_list"
                   )
                 },
                 {
                   path: "/clerk_list_add",
                   name: "新增店员",
                   component: _import(
                     "basicConfig/companyManage",
                     "clerk_list_add"
                   )
                 },
                 {
                   path: "/clerk_quanxian_manage",
                   name: "权限管理",
                   component: _import(
                     "basicConfig/companyManage",
                     "clerk_quanxian_manage"
                   )
                 },
                 {
                   path: "/clerk_quanxian_edit",
                   name: "编辑角色",
                   component: _import(
                     "basicConfig/companyManage",
                     "clerk_quanxian_edit"
                   )
                 },
                 {
                   path: "/shop_active",
                   name: "门店活动",
                   component: _import(
                     "basicConfig/companyManage",
                     "shop_active"
                   )
                 },
                 {
                   path: "/shop_active_edit",
                   name: "编辑活动",
                   component: _import(
                     "basicConfig/companyManage",
                     "shop_active_edit"
                   )
                 },
                 {
                   path: "/shop_active_edit2",
                   name: "编辑活动",
                   component: _import(
                     "basicConfig/companyManage",
                     "shop_active_edit"
                   )
                 },
                 {
                   path: "/shop_active_detail",
                   name: "活动详情",
                   component: _import(
                     "basicConfig/companyManage",
                     "shop_active_detail"
                   )
                 }
               ]
             },
             // 积分结算
             {
               path: "/integral_all",
               name: "积分结算",
               component: _import(
                 "basicConfig/companyManage",
                 "integral"
               ),
               children: [
                 {
                   path: "/integral_all",
                   name: "积分汇总",
                   component: _import(
                     "basicConfig/companyManage",
                     "integral_all"
                   )
                 },
                 {
                   path: "/integral_produce_all",
                   name: "积分产生汇总",
                   component: _import(
                     "basicConfig/companyManage",
                     "integral_produce_all"
                   )
                 },
                 {
                   path: "/integral_consume_all",
                   name: "积分消耗汇总",
                   component: _import(
                     "basicConfig/companyManage",
                     "integral_consume_all"
                   )
                 },
                 {
                   path: "/integral_close_all",
                   name: "积分结算汇总",
                   component: _import(
                     "basicConfig/companyManage",
                     "integral_close_all"
                   )
                 },
                 {
                   path: "/integral_help_dtl",
                   name: "积分补贴明细",
                   component: _import(
                     "basicConfig/companyManage",
                     "integral_help_dtl"
                   )
                 },
                 {
                   path: "/integral_produce_dtl",
                   name: "积分产生明细",
                   component: _import(
                     "basicConfig/companyManage",
                     "integral_produce_dtl"
                   )
                 },
                 {
                   path: "/integral_use_dtl",
                   name: "积分使用明细",
                   component: _import(
                     "basicConfig/companyManage",
                     "integral_use_dtl"
                   )
                 },
                 {
                   path: "/integral_close_dtl",
                   name: "积分结算明细",
                   component: _import(
                     "basicConfig/companyManage",
                     "integral_close_dtl"
                   )
                 },
                 {
                   path: "/integral_cost",
                   name: "积分成本配置",
                   component: _import(
                     "basicConfig/companyManage",
                     "integral_cost"
                   )
                 },
                 {
                   path: "/integral_close",
                   name: "积分结算归属",
                   component: _import(
                     "basicConfig/companyManage",
                     "integral_close"
                   )
                 }
               ]
             },
             // 配置中心  --- 公众号配置
             {
               path: "/public_num",
               name: "公众号配置",
               component: _import(
                 "basicConfig/configCenter",
                 "public_num"
               ),
               children: [
                 {
                   path: "/public_num",
                   name: "被关注回复",
                   component: _import(
                     "basicConfig/configCenter",
                     "public_num_attention"
                   )
                 },
                 {
                   path: "/public_num_keyword",
                   name: "关键字回复",
                   component: _import(
                     "basicConfig/configCenter",
                     "public_num_keyword"
                   )
                 },
                 {
                   path: "/public_keyword_add",
                   name: "添加回复",
                   component: _import(
                     "basicConfig/configCenter",
                     "public_keyword_add"
                   )
                 },
                 {
                   path: "/public_num_defined",
                   name: "自定义菜单",
                   component: _import(
                     "basicConfig/configCenter",
                     "public_num_defined"
                   )
                 },
                 {
                   path: "/public_defined_addmenu",
                   name: "新增菜单",
                   component: _import(
                     "basicConfig/configCenter",
                     "public_defined_addmenu"
                   )
                 }
               ]
             },
             // 配置中心 -- 广告位管理
             {
               path: "/ad_manage_common",
               name: "广告位管理",
               component: _import(
                 "basicConfig/configCenter",
                 "ad_manage"
               ),
               children: [
                 {
                   path: "/ad_manage_common",
                   name: "通用广告位",
                   component: _import(
                     "basicConfig/configCenter",
                     "ad_manage_common"
                   )
                 },
                 {
                   path: "/ad_manage_special",
                   name: "特例广告位",
                   component: _import(
                     "basicConfig/configCenter",
                     "ad_manage_special"
                   )
                 },
                 {
                   path: "/ad_manage_edit",
                   name: "编辑广告位",
                   component: _import(
                     "basicConfig/configCenter",
                     "ad_manage_edit"
                   )
                 },
                 {
                   path: "/ad_manage_edit2",
                   name: "编辑广告位",
                   component: _import(
                     "basicConfig/configCenter",
                     "ad_manage_edit"
                   )
                 },
                 {
                   path: "/ad_add_special",
                   name: "新增特例",
                   component: _import(
                     "basicConfig/configCenter",
                     "ad_add_special"
                   )
                 }
               ]
             },
             // 配置中心 -- 授权绑定管理
             {
               path: "/allow_bind",
               name: "授权绑定管理",
               component: _import(
                 "basicConfig/configCenter",
                 "allow_bind"
               )
             },
             // 配置中心 -- 营销场景配置
             {
               path: "/marketing_scene",
               name: "营销场景配置",
               component: _import(
                 "basicConfig/configCenter",
                 "marketing_scene"
               )
             },
             // 配置中心 -- 支付方式配置
             {
               path: "/pay_way",
               name: "支付方式配置",
               component: _import("basicConfig/configCenter", "pay_way")
             },
             // 授权
             {
               path: "/allow_bind_detail",
               name: "授权详情",
               component: _import(
                 "basicConfig/configCenter",
                 "allow_bind_detail"
               )
             },
             // 二维码
             {
               path: "/erweima",
               name: "二维码管理",
               component: _import("basicConfig/configCenter", "erweima"),
               children: [
                 {
                   path: "/erweima",
                   name: "接口二维码",
                   component: _import(
                     "basicConfig/configCenter",
                     "erweima_port"
                   )
                 },
                 {
                   path: "/erweima_edit",
                   name: "编辑二维码组",
                   component: _import(
                     "basicConfig/configCenter",
                     "erweima_edit"
                   )
                 }
               ]
             },
             // 会员体系
             {
               path: "/member_config",
               name: "会员设置",
               component: _import(
                 "basicConfig/configCenter",
                 "member_config"
               ),
               children: [
                 {
                   path: "/memberCardSet",
                   name: "会员卡设置",
                   component: _import2(
                     "companyGroup/membershipSystem",
                     "memberCardSet"
                   )
                 },

                 {
                   path: "/memberGrade",
                   name: "会员等级列表",
                   component: _import2(
                     "companyGroup/membershipSystem",
                     "memberGrade"
                   )
                 },
                 {
                   path: "/addMemberGrade",
                   name: "添加等级列表",
                   component: _import2(
                     "companyGroup/membershipSystem",
                     "addMemberGrade"
                   )
                 },
                 {
                   path: "/editMemberGrade",
                   name: "编辑等级列表",
                   component: _import2(
                     "companyGroup/membershipSystem",
                     "editMemberGrade"
                   )
                 },
                 {
                   path: "/addGroupGrade",
                   name: "添加集团会员等级",
                   component: _import2(
                     "companyGroup/membershipSystem",
                     "addGroupGrade"
                   )
                 },
                 {
                   path: "/editGroupGrade",
                   name: "编辑集团会员等级",
                   component: _import2(
                     "companyGroup/membershipSystem",
                     "editGroupGrade"
                   )
                 },
                 {
                   path: "/addGroupCate",
                   name: "添加集团折扣策略",
                   component: _import2(
                     "companyGroup/membershipSystem",
                     "addGroupCate"
                   )
                 },
                 {
                   path: "/editGroupCate",
                   name: "编辑集团折扣策略",
                   component: _import2(
                     "companyGroup/membershipSystem",
                     "editGroupCate"
                   )
                 },
                 {
                   path: "/pointSystem",
                   name: "积分制度",
                   component: _import2(
                     "companyGroup/membershipSystem",
                     "pointSystem"
                   )
                 },
                 {
                   path: "/addPointSystem",
                   name: "新增积分获取策略",
                   component: _import2(
                     "companyGroup/membershipSystem",
                     "addPointSystem"
                   )
                 },
                 {
                   path: "/editPointSystem",
                   name: "编辑积分获取策略",
                   component: _import2(
                     "companyGroup/membershipSystem",
                     "editPointSystem"
                   )
                 },
                 {
                   path: "/addIntegralSytem",
                   name: "新增积分抵现策略",
                   component: _import2(
                     "companyGroup/membershipSystem",
                     "addIntegralSytem"
                   )
                 },
                 {
                   path: "/editIntegralSytem",
                   name: "编辑积分抵现策略",
                   component: _import2(
                     "companyGroup/membershipSystem",
                     "editIntegralSytem"
                   )
                 },

                 {
                   path: "/member_privilege",
                   name: "会员特权",
                   component: _import(
                     "basicConfig/configCenter",
                     "member_privilege"
                   )
                 },
                 {
                   path: "/member_privilege_edit",
                   name: "编辑会员特权",
                   component: _import(
                     "basicConfig/configCenter",
                     "member_privilege_edit"
                   )
                 },
                 {
                   path: "/member_info",
                   name: "会员信息字段",
                   component: _import(
                     "basicConfig/configCenter",
                     "member_info"
                   )
                 },
                 {
                   path: "/member_info_edit",
                   name: "编辑字段",
                   component: _import(
                     "basicConfig/configCenter",
                     "member_info_edit"
                   )
                 },
                 {
                   path: "/member_value",
                   name: "会员价值分类",
                   component: _import(
                     "basicConfig/configCenter",
                     "member_value"
                   )
                 }
               ]
             },
             // 数据安全
             {
               path: "/dangerChange",
               name: "日志管理",
               component: _import("dataSafety", "log"),
               children: [
                 {
                   path: "/dangerChange",
                   name: "风险模式切换日志",
                   component: _import("dataSafety", "dangerChange")
                 },
                 {
                   path: "/downloadLog",
                   name: "下载日志",
                   component: _import("dataSafety", "downloadLog")
                 }
               ]
             },
             {
               path: "/reportCenter",
               name: "报表中心",
               component: _import("dataSafety", "reportCenter")
             },
             // 佣金结算
             {
               path: "/store_all",
               name: "佣金结算",
               component: _import("brokerage", "brokerage"),
               children: [
                 {
                   path: "/store_all",
                   name: "门店佣金汇总",
                   component: _import("brokerage", "store_all")
                 },
                 {
                   path: "/brokerage_rule",
                   name: "佣金结算规则",
                   component: _import("brokerage", "brokerage_rule")
                 },
                 {
                   path: "/add_special_belong",
                   name: "新建特殊归属佣金结算策略",
                   component: _import("brokerage", "add_special_belong")
                 },
                 {
                   path: "/add_special_deliver",
                   name: "新建特殊发货佣金结算策略",
                   component: _import("brokerage", "add_special_deliver")
                 },
                 {
                   path: "/send_refund_dtl",
                   name: "发货退佣结算",
                   component: _import("brokerage", "send_refund_dtl")
                 },
                 {
                   path: "/send_brokerage_dtl",
                   name: "发货佣金结算",
                   component: _import("brokerage", "send_brokerage_dtl")
                 },
                 {
                   path: "/belong_refund_dtl",
                   name: "归属退佣明细",
                   component: _import("brokerage", "belong_refund_dtl")
                 },
                 {
                   path: "/belong_brokerage_dtl",
                   name: "归属佣金明细",
                   component: _import(
                     "brokerage",
                     "belong_brokerage_dtl"
                   )
                 },
                 {
                   path: "/store_brokerage_all",
                   name: "门店佣金汇总",
                   component: _import("brokerage", "store_brokerage_all")
                 },
                 {
                   path: "/guider_brokerage_all",
                   name: "导购佣金汇总",
                   component: _import(
                     "brokerage",
                     "guider_brokerage_all"
                   )
                 }
               ]
             },
             // 数据配置
             {
               path: "/payWayShow",
               name: "数据配置",
               component: _import("dataConfig", "index"),
               children: [
                 {
                   path: "/payWayShow",
                   name: "支付方式展示",
                   component: _import("dataConfig", "payWayShow")
                 },
                 {
                   path: "/performanceSettle",
                   name: "业绩结算",
                   component: _import("dataConfig", "performanceSettle")
                 }
               ]
             }
           ]
         },
         {
           path: "/memberInfoTemplate",
           name: "开卡字段配置模板",
           component: _import2(
             "companyGroup/membershipSystem",
             "memberInfoTemplate"
           )
         },
         {
           path: "/401",
           name: "无权访问",
           component: error401
         },
         {
           path: "/404",
           name: "error404",
           component: error404
         },

         { path: "*", redirect: "/404", hidden: true }
       ];
export default new Router({
  routes: constantRouterMap,
  scrollBehavior: () => ({ y: 0 }),
})
