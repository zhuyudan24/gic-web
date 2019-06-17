<template>
  <transition name="slide-fade">
   	<div>
    	<div  class="custom">
        <div class="custom-header">
          <div class="logo">
            <a class="logoimg"><img width="158" height="49" :src="navlogo" alt=""></a>
            <a class="logoimg logotext"><img :src="hyzxtext" alt=""></a>
          </div>
          <div class="handler">
            <el-row>
              <el-button type="primary" plain @click="backBtn">返 回</el-button>
              <el-button type="primary" plain @click="submitForm('1')">保 存</el-button>
              <el-button type="primary" @click="submitForm('2')">保存并发布</el-button>
            </el-row>
          </div>
        </div>
        <div class="container" :style="{height: (bodyHeight - 65) + 'px'}">
          <div class="container-item1 left">
            <div>
              <h1 class="container-title">基础组件</h1>
              <div class="line"></div>
              <draggable id="list1" @clone='cloneComponent' :list="baseList" class="compenent" :options="{group:{name:'people', pull:'clone', put:false},'sort': false}">
                <a class="compenent-item" :data-type='item.key' v-for="(item, index) in baseList" :key="index">
                  <span v-if="item.key == 'B7'">卡券</span>
                  <span v-if="item.key == 'A1'">富文本</span>
                  <span v-if="item.key == 'A2'">图片广告</span>
                  <span v-if="item.key == 'A3'">魔方</span>
                  <span v-if="item.key == 'A5'">文本</span>
                  <span v-if="item.key == 'A6'">横栏</span>
                  <span v-if="item.key == 'A7'">辅助线</span>
                  <span v-if="item.key == 'A8'">辅助空白</span>
                </a>
              </draggable>
            </div>

            <div>
              <h1 class="container-title">功能组件</h1>
              <div class="line"></div>
              <draggable id="list1" @clone='cloneFunctionComponent' :list="mainList" class="compenent" :options="{group:{name:'people', pull:'clone', put:false},'sort': false}">
                <a class="compenent-item" :data-type='item.key' v-for="(item, index) in mainList" :key="index">
                  <span v-if="item.key == 'B2'">数据icon</span>
                  <span v-if="item.key == 'B4'">进入特权</span>
                  <span v-if="item.key == 'B5'">进入集团</span>
                </a>
              </draggable>
            </div>

          </div>
          <div class="container-item2 middle">
            <div class="displayCustom">
              <div class="displayheader"> {{ ruleForm.title }} </div>
              <div class="container-content">
                <div class="frontcard">
                  <div class="frontcard-one" v-show="curCard == 1">
                    <div class="frontcard-oneimg">
                      <span class="frontcard-code">
                        <img v-if="userInfo.cardType == 1" :src="barcode" alt="">
                        <i v-if="userInfo.cardType == 2"  class="iconfont icon-icon-QRcode" style="font-size: 25px;"></i>
                      </span>
                      <div class="frontcard-item1">
                        <img v-if='userInfo.logo.type==1' width="60" height="60" :src="userInfo.logo.url" alt="">
                        <img v-if='userInfo.logo.type==2' width="60" height="60" :src="defaultImg" alt="">
                        <!-- <img v-if="userInfo.logo.url" width="60" height="60" :src="userInfo.logo.url" alt="">
                        <img v-else width="60" height="60" :src="defaultImg" alt=""> -->
                      </div>
                      <div class="frontcard-item2">
                        <p class="frontcard-onep1">银卡会员</p>
                        <p class="frontcard-onep2" style="display: flex;flex-flow: wrap;width: 80%;">
                          <span style="flex: 0 0 50%" v-if="userInfo.integral.show == 1">{{ userInfo.integral.title }} : <i class="el-icon-close"></i></span>
                          <span style="flex: 0 0 50%" v-if="userInfo.totalAmount.show == 1">{{ userInfo.totalAmount.title }} : <i class="el-icon-close"></i></span>
                          <span style="flex: 0 0 50%" v-if="userInfo.remainMoney.show == 1">{{ userInfo.remainMoney.title }} : <i class="el-icon-close"></i></span>
                          <span style="flex: 0 0 50%" v-if="userInfo.consumeTimes.show == 1">{{ userInfo.consumeTimes.title }} : <i class="el-icon-close"></i></span>
                        </p>
                        <p class="member-text3" v-if="userInfo.integral.overShow == 1">你有X积分将于XX年X月X日过期</p>
                      </div>
                    </div>
                  </div>
                  <div class="frontcard-two" v-show="curCard == 2">
                    <div class="frontcard-twoimg">
                      <span class="frontcard-code">
                        <img v-if="userInfo.cardType == 1" :src="barcode" alt="">
                        <i v-if="userInfo.cardType == 2"  class="iconfont icon-icon-QRcode" style="font-size: 25px;"></i>
                      </span>
                      <div class="frontcard-item1">
                        <img v-if='userInfo.logo.type==1' width="60" height="60" :src="userInfo.logo.url" alt="">
                        <img v-if='userInfo.logo.type==2' width="60" height="60" :src="defaultImg" alt="">
                        <!-- <img v-if="userInfo.logo.url" width="60" height="60" :src="userInfo.logo.url" alt="">
                        <img v-else width="60" height="60" :src="defaultImg" alt=""> -->
                      </div>
                      <div class="frontcard-item2">
                          <p class="frontcard-onep1">银卡会员</p>
                          <p class="frontcard-onep2" style="display: flex;flex-flow: wrap;width: 80%;">
                            <span style="flex: 0 0 50%" v-if="userInfo.integral.show == 1">{{ userInfo.integral.title }} : <i class="el-icon-close"></i></span>
                            <span style="flex: 0 0 50%" v-if="userInfo.totalAmount.show == 1">{{ userInfo.totalAmount.title }} : <i class="el-icon-close"></i></span>
                            <span style="flex: 0 0 50%" v-if="userInfo.remainMoney.show == 1">{{ userInfo.remainMoney.title }} : <i class="el-icon-close"></i></span>
                            <span style="flex: 0 0 50%" v-if="userInfo.consumeTimes.show == 1">{{ userInfo.consumeTimes.title }} : <i class="el-icon-close"></i></span>
                          </p>
                          <p class="member-text3" v-if="userInfo.integral.overShow == 1">你有X积分将于XX年X月X日过期</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="container-content">
                  <draggable :options="{group:{name:'people', pull:false, put:true }}"
                             v-model="componentList" style="min-height: 520px;">
                    <div class="displayItem" @click="handlerComponent(item.key,index)" :key="index" v-if="componentList.length > 0" v-for="(item,index) in componentList"
                         :class='["item" + item.key,{"curedit": curIndex == index }]'>
                      <div class="displayItem-mask edittip">
                        <p class="displayItem-maskedit" v-if="item.key == 'B7'">点击编辑卡券</p>
                        <p class="displayItem-maskedit" v-if="item.key == 'A1'">点击编辑富文本</p>
                        <p class="displayItem-maskedit" v-if="item.key == 'A2'">点击编辑图片广告</p>
                        <p class="displayItem-maskedit" v-if="item.key == 'A3'">点击编辑魔方</p>
                        <p class="displayItem-maskedit" v-if="item.key == 'A5'" >点击编辑文本</p>
                        <p class="displayItem-maskedit" v-if="item.key == 'A6'">点击编辑横栏</p>
                        <p class="displayItem-maskedit" v-if="item.key == 'A7'"></p>
                        <p class="displayItem-maskedit" v-if="item.key == 'A8'">点击编辑辅助空白</p>
                        <p class="displayItem-maskedit" v-if="item.key == 'B2'">点击编辑数据icon</p>
                        <p class="displayItem-maskedit" v-if="item.key == 'B4'">进入特权</p>
                        <p class="displayItem-maskedit" v-if="item.key == 'B5'">进入集团</p>
                      </div>
                      <span class="displayItem-close" @click="deleteConponent(item.key,index)"><i class="el-icon-close"></i></span>
                      <!-- 卡券 -->
                      <div v-if="item.key == 'B7'" class="card-wrap" :class="{'no-padding-r15':(item.cardSetting.length==1 && item.cardSetting[0].cardData.length>2) || item.cardSetting.length>2}">
                        <div class="img" v-if="item.cardStyle==1">
                          <img v-if="(item.cardSetting.length==1 && item.cardSetting[0].cardData.length<2) || item.cardSetting.length==0" src="../../../static/img/style2-1.png" alt="">
                          <img v-if="(item.cardSetting.length==1 && item.cardSetting[0].cardData.length==2) || item.cardSetting.length==2" src="../../../static/img/style2-2.png" alt="">
                          <img v-if="(item.cardSetting.length==1 && item.cardSetting[0].cardData.length>2) || item.cardSetting.length>2" src="../../../static/img/style01.png" alt="">
                        </div>
                        <div class="img" v-if="item.cardStyle==2">
                          <img v-if="(item.cardSetting.length==1 && item.cardSetting[0].cardData.length<2)|| item.cardSetting.length==0" src="../../../static/img/style1-1.png" alt="">
                          <img v-if="(item.cardSetting.length==1 && item.cardSetting[0].cardData.length==2) || item.cardSetting.length==2" src="../../../static/img/style1-2.png" alt="">
                          <img v-if="(item.cardSetting.length==1 && item.cardSetting[0].cardData.length>2) || item.cardSetting.length>2" src="../../../static/img/style02.png" alt="">
                        </div>
                        <div class="img" v-if="item.cardStyle==3">
                          <img src="../../../static/img/style03.png" alt="">
                        </div>
                      </div>
                      <!-- 富文本 -->
                      <div v-if="item.key == 'A1'" class="fu-text-wrap" v-html="item.richTextContent">

                      </div>
                      <!-- 图片广告 -->
                      <el-carousel :style="{height: parseInt(item.imgHeight/2) + 'px'}"  v-if="item.key == 'A2'" style="overflow: hidden;">
                        <el-carousel-item v-for="(list, index) in item.data" :key="index">
                          <img :style="{height: parseInt(item.imgHeight/2) + 'px'}"  width="100%" v-if="list.qcloudImageUrl" :src="list.qcloudImageUrl" alt="">
                          <img :style="{height: parseInt(item.imgHeight/2) + 'px'}"  width="100%" v-else src="../../../static/img/ad.png" alt="">
                        </el-carousel-item>
                      </el-carousel>
                       <!-- 魔方 九宫格-->
                      <div v-if="item.key == 'A3' && item.templateType==9">
                        <div class="main" style="padding: 4px;">
                          <div class="column-item">
                            <div class="mainbox">
                              <div class="mainboxdraggable clearfix">
                                <div class="mainboximg" :class="curjggIndex == index ? 'curitem' : ''"
                                    v-if="index < 3" v-for="(list,index) in item.data" @click="selectJgg(index)" :key="index">
                                  <img v-if="list.qcloudImageUrl" :src="list.qcloudImageUrl" alt="">
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="column-item">
                            <div class="mainbox">
                              <div class="mainboxdraggable clearfix">
                                <div class="mainboximg" :class="curjggIndex == index ? 'curitem' : ''"
                                     v-if="index >=3 && index < 6" v-for="(list,index) in item.data" @click="selectJgg(index)" :key="index">
                                  <img v-if="list.qcloudImageUrl" :src="list.qcloudImageUrl" alt="">
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="column-item">
                            <div class="mainbox">
                              <div class="mainboxdraggable clearfix">
                                <div class="mainboximg" :class="curjggIndex == index ? 'curitem' : ''"
                                     v-if="index >=6 && index < 9" v-for="(list,index) in item.data" @click="selectJgg(index)" :key="index">
                                  <img v-if="list.qcloudImageUrl" :src="list.qcloudImageUrl" alt="">
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- 魔方 自定义-->
                      <div v-if="item.key == 'A3' && item.templateType==8" class="phone-cube">
                        <div
                          v-if='(item.data.length>0 && item.data[0].pos=="") ||  item.data.length<1'
                          :style="{
                            height:350/item.lineSetting.column*item.lineSetting.row+'px',
                          }">
                        </div>
                        <div
                          v-else
                          :style="{
                            height:350/item.lineSetting.column*item.lineSetting.row+'px',
                          }">
                          <img
                            class="img-cube"
                            :src="itm.qcloudImageUrl"
                            alt=""
                            v-for='(itm,idx) in item.data'
                            :key="idx"
                            :style="{
                              width:(itm.pos[4]-itm.pos[0])*(350/item.lineSetting.column)+'px',
                              height:((itm.pos[7]==0?10:itm.pos[6])-itm.pos[2])*(350/item.lineSetting.column)+'px',
                              left:itm.pos[0]*(350/item.lineSetting.column)+'px',
                              top:itm.pos[2]*(350/item.lineSetting.column)+'px',
                              }">
                        </div>
                      </div>
                      <div v-if="item.key == 'A5'" class="threecontent" v-html="enterLine(item.content)"
                           :style="[{color: item.fontColor,background: item.backgroundColor,textAlign: item.pos},{padding: item.fillWay !== 0 ? '10px' : ''}]">
                      </div>
                      <!-- 横栏 -->
                      <div class="crossbar" v-if="item.key == 'A6'">
                        <!-- icon横栏 -->
                        <ul v-if="parseInt(item.templateType) == 1">
                          <li class="crossbar-list" :style="[{background: item.backgroundColor}]" v-for="(list, index) in item.data" :key="index">
                            <span class="crossbar-icon11" >
                              <img v-if="list.qcloudImageUrl" :src="list.qcloudImageUrl" alt="">
                              <img v-else src="../../../static/img/default.jpg" alt="">
                            </span>
                            <span class="crossbar-icon2" :style="[{color: item.fontColor}]">{{ list.title }}</span>
                            <span class="crossbar-icon3"> <i class="el-icon-arrow-right" v-if="item.jumpHint"></i> </span>
                          </li>
                        </ul>
                        <!-- 纯文字横栏 -->
                        <ul v-if="parseInt(item.templateType) == 2">
                          <li class="crossbar-list" :style="[{background: item.backgroundColor}]" v-for="(list, index) in item.data" :key="index">
                            <span class="crossbar-icon2" :style="[{color: item.fontColor}]">{{ list.title }}</span>
                            <span class="crossbar-icon3"> <i class="el-icon-arrow-right" v-if="item.jumpHint"></i> </span>
                          </li>
                        </ul>
                        <!-- 双向横栏 -->
                        <ul v-if="parseInt(item.templateType) == 3">
                          <li class="crossbar-list" :style="[{background: item.backgroundColor}]" >
                            <div class="double-heng-item" v-for="(list, index) in item.data" :key="index">
                              <span class="crossbar-icon11" >
                                <img v-if="list.qcloudImageUrl" :src="list.qcloudImageUrl" alt="">
                                <img v-else src="../../../static/img/default.jpg" alt="">
                              </span>
                              <span class="crossbar-icon2" :style="[{color: item.fontColor}]">{{ list.title }}</span>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div v-if="item.key == 'A7'">
                        <div class="fuzhuline" :style="[{borderColor: item.fontColor,
                     borderStyle: parseInt(item.style) == 1 ? 'solid' : parseInt(item.style) == 2 ? 'dashed': parseInt(item.style) == 3 ? 'dotted': ''},{margin: parseInt(item.fillWay) == 1 ? '2px 10px' : ''}]"></div>
                      </div>
                      <div v-if="item.key == 'A8'">
                        <div :style="{height: item.fillWay +'px'}"></div>
                      </div>

                      <div v-if="item.key == 'B1'">
                        <div class="integral-list-page" v-if="item.setting">
                          <div class="integral-list-top">
                            <img class="integral-img" v-if="item.setting.bgImg.url" :src="item.setting.bgImg.url">
                            <img class="integral-img" v-else src="../../../static/img/credit-banner_bg.png" alt="">
                            <div class="integral-list-item">
                              <p class="integral-num"  :style="{color: item.setting.integral.numColor}">10000</p>
                              <p class="integral-item-title" :style="{color:item.setting.integral.fontColor}" v-if="item.setting.integral.title !== ''">
                                {{ item.setting.integral.title }}</p>
                              <p class="integral-item-title" :style="{color:item.setting.integral.fontColor}" v-else>可用积分</p>
                            </div>
                            <div class="integral-list-item">
                              <p class="integral-num"  :style="{color: item.setting.unIntegral.numColor}">300</p>
                              <p class="integral-item-title" :style="{color:item.setting.unIntegral.fontColor}" v-if="item.setting.unIntegral.title !== ''">
                                {{ item.setting.unIntegral.title }}</p>
                              <p class="integral-item-title" :style="{color:item.setting.unIntegral.fontColor}" v-else>冻结积分</p>
                            </div>
                          </div>
                          <div class="integral-list-bottom" style="overflow: hidden;">
                            <img width="353" height="85"  v-if="item.setting.sign.before.url" :src="item.setting.sign.before.url" alt="">
                            <img width="353" height="85" v-else src="../../../static/img/credit-sign_bg.png">
                          </div>
                        </div>
                      </div>

                      <div v-if="item.key == 'B2'">
                        <div class="customicon" v-if="parseInt(item.templateType) == 3">
                          <div class="customicon-item" :class="{'dataiconflex': parseInt(item.amount) == 3}" v-if="list.status == true"  v-for="(list, index) in item.data" :key="index">
                            <p :style="{color: list.fontColor}">0</p>
                            <p :style="{color: list.fontColor}">
                              <span>{{ list.title }}</span>
                            </p>
                          </div>
                        </div>
                        <div class="customicon" v-if="parseInt(item.templateType) !==  3">
                          <ul style='width: 100%'>
                            <li class="crossbar-list" :style="[{background: item.backgroundColor}]" v-if="list.status == true" v-for="(list, index) in item.data" :key="index">
                          <span class="crossbar-icon1" v-if="parseInt(item.templateType) == 1">
                            <img width="20" height="20" v-if="list.qcloudImageUrl" :src="list.qcloudImageUrl" alt="">
                            <img width="20" height="20" v-else src="../../../static/img/default.jpg" alt="">
                          </span>
                              <span class="crossbar-icon2" :style="[{color: item.fontColor}]">
                               <span>{{ list.title }}</span>
                            </span>
                              <span class="crossbar-icon3">0</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div  v-if="item.key == 'B4'">
                        <img src="../../../static/img/tequantitle.png" alt="">
                      </div>
                      <div v-if="item.key == 'B5'">
                        <div class="memberlogo" style="justify-content: flex-start">
                          <div class="memberlogo-item" v-for="(list, index) in item.data" :key="index">
                            <img v-if="list.url" width="65" height="65" :src="list.url" alt="">
                            <img v-else width="65" height="65" :src="defaultImg" alt="">
                          </div>
                        </div>
                        <div class="memberlogo-more">查看所有适用品牌</div>
                      </div>

                    </div>
                    <div v-if="componentList.length < 1" style="border: 1px dashed #dcdfe6;line-height: 36px;">拖拽添加组件</div>
                  </draggable>
                </div>
              </div>
            </div>
          </div>
          <div class="container-item4 right form">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  class="demo-ruleForm ruleform" label-width="70px">
              <el-form-item label="活动名称">
               <div class="forminputWidth form-item-box">
                 <gic-input v-model="ruleForm.title" :max="10"></gic-input>
               </div>
             </el-form-item>
             <el-form-item label="进入条件" style="margin-bottom:0">
                <el-radio-group v-model="ruleForm.entryCondition">
                  <el-radio :label=0>不限</el-radio>
                  <el-radio :label=1>开卡会员</el-radio>
                  <el-radio :label=2>认证会员</el-radio>
                </el-radio-group>
             </el-form-item>
             <!-- 卡券 -->
              <div v-if="curIndex == index && item.key == 'B7'" v-for="(item, index) in componentList" :key="index">
                <div class="templateone mtop">
                  <h1 class="title mbottom">卡券</h1>
                </div>
                <div class="formwrap mtop formwrap-hook formwrap-radio-hook">
                  <span class="formname">卡券类型</span>
                  <span  class="formtext">
                    <el-radio-group v-model="item.cardType">
                      <el-radio :label=1>卡券展架</el-radio>
                    </el-radio-group>
                  </span>
                </div>
                <div class="formwrap mtop formwrap-hook formwrap-radio-hook">
                  <span class="formname">样式</span>
                  <span  class="formtext">
                    <el-radio-group v-model="item.cardStyle">
                      <el-radio :label=1>样式1</el-radio>
                      <el-radio :label=2>样式2</el-radio>
                      <!-- <el-radio :label=3>样式3</el-radio> -->
                    </el-radio-group>
                  </span>
                </div>
                <div class="formwrap mtop formwrap-hook formwrap-radio-hook">
                  <span class="formname">领取限制</span>
                  <span class="formtext">
                    <el-radio-group @change="changeReceiveLimit" v-model="item.receiveLimitType">
                      <el-radio :label=1>统一条件</el-radio>
                      <el-radio :label=2>每张卡券单独设置条件</el-radio>
                    </el-radio-group>
                  </span>
                </div>
                <!-- 统一设置条件 -->
                <div v-if="item.receiveLimitType==1 && item.cardSetting.length>0">
                  <div class="only-setting-wrap total-setting-wrap">
                    <div class="only-setting total-setting">
                      <div class="show-time-warp mtop formwrap-hook formwrap-radio-hook" style="margin-bottom: 22px;">
                        <div class="formwrap" style="margin-bottom: 10px;">
                          <span class="formname">展示时间</span>
                          <span class="formtext">
                            <el-radio-group v-model="item.cardSetting[0].timeType">
                              <el-radio :label=1>全部日期</el-radio>
                              <el-radio :label=2>固定日期</el-radio>
                              <el-radio :label=3>每月</el-radio>
                              <el-radio :label=4>每周</el-radio>
                            </el-radio-group>
                          </span>
                        </div>
                        <div v-show="item.cardSetting[0].timeType==2">
                          <el-date-picker
                            @change="changeDate"
                            class="time-date-wrap"
                            v-model="item.cardSetting[0].timeValueRegular"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                          </el-date-picker>
                        </div>
                        <div class="time-range-wrap ">
                          <el-select v-show="item.cardSetting[0].timeType==3" class="select-month" v-model="item.cardSetting[0].timeValueMonth" multiple filterable placeholder="请选择" size="small">
                            <el-option
                              v-for="week in monthData"
                              :key="week"
                              :label="week"
                              :value="week">
                            </el-option>
                          </el-select>
                          <el-select v-show="item.cardSetting[0].timeType==4" class="select-month" v-model="item.cardSetting[0].timeValueWeek" multiple placeholder="请选择" size="small">
                            <el-option
                              v-for="week in weekData"
                              :key="week"
                              :label="week"
                              :value="week">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                      <div class="mtop formwrap-hook formwrap-radio-hook" style="margin-bottom: 22px;">
                        <div class="formwrap" style="margin-bottom: 10px;">
                          <span class="formname">领取时段</span>
                          <span class="formtext">
                            <el-radio-group v-model="item.cardSetting[0].receiveTimeType">
                              <el-radio :label=1>全部时段</el-radio>
                              <el-radio :label=2>部分时段</el-radio>
                            </el-radio-group>
                          </span>
                        </div>
                        <div v-show="item.cardSetting[0].receiveTimeType==2" class="time-range-wrap ">
                          <div class="time-range-content">
                            <div class="time-range" v-for="(v,idx) in item.cardSetting[0].receiveTimeValue" :key="idx">
                              <el-time-picker
                                style="width: 240px;"
                                is-range
                                @change="changeTime"
                                value-format="HH:mm"
                                format="HH:mm"
                                v-model="v.timeRange"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                placeholder="选择时间范围">
                              </el-time-picker><el-button v-show="item.cardSetting[0].receiveTimeValue.length>1" style="margin-left: 10px;" type="text" @click="deleteTime(0,idx)">删除</el-button>
                            </div>
                          </div>
                          <p v-show="item.cardSetting[0].receiveTimeValue.length<5"><el-button style="padding: 0"  type="text" @click="addTime(0)">+ 添加时间段</el-button></p>
                        </div>
                      </div>
                      <div class="imgflex2 imgmtop formwrap-radio-hook">
                        <span class="formname">可见人群</span>
                        <span  class="formtext">
                          <span class="crowstyle" @click="selectPeople('card',item,peopleAllStyle)">
                            <span class="el-radio__input" :class="item.cardSetting[0].visibleCondition == peopleAllStyle ? 'is-checked' : ''">
                              <span class="el-radio__inner"></span>
                            </span><span class="el-radio__label">所有会员</span>
                          </span><span class="crowstyle" @click="selectPeople('card',item,peopleMemberStyle)">
                            <span class="el-radio__input" :class="item.cardSetting[0].visibleCondition == peopleMemberStyle ? 'is-checked' : ''">
                              <span class="el-radio__inner"></span>
                            </span><span class="el-radio__label">会员分组</span>
                          </span><span class="crowstyle" @click="selectPeople('card',item,peopleFilterStyle)">
                            <span class="el-radio__input" :class="item.cardSetting[0].visibleCondition == peopleFilterStyle ? 'is-checked' : ''">
                              <span class="el-radio__inner"></span>
                            </span><span class="el-radio__label">人群筛选器</span>
                          </span>
                        </span>
                      </div>
                      <div class="formwrap mtop formwrap-hook formwrap-radio-hook" style="margin-bottom: 0">
                        <span class="formname">领取人群</span>
                        <span class="formtext">
                          <el-radio-group v-model="item.cardSetting[0].receivePeopleType">
                            <el-radio :label=0>不限</el-radio>
                            <el-radio :label=1>限定人群</el-radio>
                          </el-radio-group>
                        </span>
                      </div>
                      <div v-if="item.cardSetting[0].receivePeopleType==1" class="get-limit-people">
                        <el-checkbox-group v-model="item.cardSetting[0].receivePeopleValue">
                          <el-checkbox label=1>开卡会员</el-checkbox><br>
                          <el-checkbox label=2>认证会员</el-checkbox><br>
                          <el-checkbox label=3>当月生日会员</el-checkbox><br>
                          <el-checkbox label=4>选择会员等级</el-checkbox><el-select :disabled="item.cardSetting[0].receivePeopleValue.indexOf('4')<0" v-model="item.cardSetting[0].memberGrade" size="small" multiple placeholder="请选择" style="width: 150px;margin-left: 10px;">
                            <el-option
                              v-for="item in memberGradeList"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                          </el-select>
                        </el-checkbox-group>
                      </div>
                      <div class="show-time-warp mtop formwrap-hook formwrap-radio-hook">
                        <span class="show-name">数量限制</span>
                        <div class="show-time-content count-wrap">
                          <el-radio-group v-model="item.cardSetting[0].numberLimitType">
                            <!-- <el-radio class="show-time" :label=1>每张卡券每人限领<el-input v-model="personCount"></el-input>张</el-radio> -->
                            <el-radio class="show-time" :label=1>每张卡券每人限领1张</el-radio>
                            <el-radio class="show-time" :label=2>每张卡券每人每天限领<el-input @keyup.native="item.cardSetting[0].numberLimitValue = String(item.cardSetting[0].numberLimitValue).replace(/[^\d]/g,'')" :disabled="item.cardSetting[0].numberLimitType!=2"  v-model="item.cardSetting[0].numberLimitValue"></el-input>张</el-radio>
                          </el-radio-group>
                        </div>
                      </div>
                      <div class="card-list">
                        <draggable :options="{group:{name:'card'}}" v-model="item.cardSetting[0].cardData">
                          <div class="imgwrap" v-for="(card,index) in item.cardSetting[0].cardData">
                            <span class="delete" @click="deleteImg(index)">
                              <i class="el-icon-close closeshow"></i><i class="el-icon-circle-close circleshow"></i>
                            </span>
                            <div class="card">
                              <span v-if="card.cardType==0">抵金券：</span>
                              <span v-if="card.cardType==1">折扣券：</span>
                              <span v-if="card.cardType==2">兑换券：</span>
                              <div>
                                <p>{{card.cardName}}</p>
                                <p v-if="card.isHasDate==0">{{card.cardStartTime}}至{{card.cardEndTime}}</p>
                                <p v-if="card.isHasDate==1">领取{{card.validStartDate==0?'当天':card.validStartDate+'天'}}生效，有效期{{ card.validEndDate }}天</p>
                              </div>
                            </div>
                            <p v-if="card.status==0" class="card-tip"><img src="../../../static/img/delete_tag.png" alt=""></p>
                            <p v-if="card.status==5" class="card-tip"><img src="../../../static/img/overdue_tag.png" alt=""></p>
                            <!-- <p v-if="card.isHasDate==0 && (nowDate>card.cardEndTime)" class="card-tip"><img src="../../../static/img/overdue_tag.png" alt=""></p> -->
                          </div>
                        </draggable>
                      </div>
                    </div>
                  </div>
                  <div v-if="item.cardSetting[0].cardData.length<10" class="imgaddwrap imgaddwrap2"><p class="imgadd imgadd2" @click="addImg">+ 添加卡券</p></div>
                </div>
                <!-- 单独设置条件 -->
                <div v-if="item.cardSetting.length>0 && item.receiveLimitType==2" class="only-setting-wrap">
                  <draggable :options="{group:{name:'card1'}}" v-model="item.cardSetting">
                    <div v-if="list.cardData.length>0" class="only-setting" v-for="(list, index) in item.cardSetting" :key="index">
                      <div class="imgwrap">
                        <span class="delete" @click="deleteImg(index)">
                          <i class="el-icon-close closeshow"></i><i class="el-icon-circle-close circleshow"></i>
                        </span>
                        <div class="card">
                          <span v-if="list.cardData[0].cardType==0">抵金券：</span>
                          <span v-if="list.cardData[0].cardType==1">折扣券：</span>
                          <span v-if="list.cardData[0].cardType==2">兑换券：</span>
                          <div>
                            <p>{{list.cardData[0].cardName}}</p>
                            <p v-if="list.cardData[0].isHasDate==0">{{list.cardData[0].cardStartTime}}至{{list.cardData[0].cardEndTime}}</p>
                            <p v-if="list.cardData[0].isHasDate==1">领取{{list.cardData[0].validStartDate==0?'当天':list.cardData[0].validStartDate+'天'}}生效，有效期{{ list.cardData[0].validEndDate }}天</p>
                          </div>
                        </div>
                        <p v-if="list.cardData[0].status==0" class="card-tip"><img src="../../../static/img/delete_tag.png" alt=""></p>
                        <p v-if="list.cardData[0].status==5" class="card-tip"><img src="../../../static/img/overdue_tag.png" alt=""></p>
                        <!-- <p v-if="list.cardData[0].isHasDate==0 && (nowDate>list.cardData[0].cardEndTime)" class="card-tip"><img src="../../../static/img/overdue_tag.png" alt=""></p> -->
                      </div>
                      <div class="show-time-warp mtop formwrap-hook formwrap-radio-hook" style="margin-bottom: 20px;">
                        <div class="formwrap" style="margin-bottom: 10px;">
                          <span class="formname">展示时间</span>
                          <span class="formtext">
                            <el-radio-group v-model="list.timeType">
                              <el-radio :label=1>全部日期</el-radio>
                              <el-radio :label=2>固定日期</el-radio>
                              <el-radio :label=3>每月</el-radio>
                              <el-radio :label=4>每周</el-radio>
                            </el-radio-group>
                          </span>
                        </div>
                        <div v-show="list.timeType==2">
                          <el-date-picker
                            @change="changeDate"
                            class="time-date-wrap"
                            v-model="list.timeValueRegular"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                          </el-date-picker>
                        </div>
                        <div class="time-range-wrap ">
                          <el-select v-show="list.timeType==3" class="select-month" v-model="list.timeValueMonth" multiple filterable placeholder="请选择" size="small">
                            <el-option
                              v-for="week in monthData"
                              :key="week"
                              :label="week"
                              :value="week">
                            </el-option>
                          </el-select>
                          <el-select v-show="list.timeType==4" class="select-month" v-model="list.timeValueWeek" multiple placeholder="请选择" size="small">
                            <el-option
                              v-for="week in weekData"
                              :key="week"
                              :label="week"
                              :value="week">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                      <div class="mtop formwrap-hook formwrap-radio-hook" style="margin-bottom: 22px;">
                        <div class="formwrap" style="margin-bottom: 10px;">
                          <span class="formname">领取时段</span>
                          <span class="formtext">
                            <el-radio-group v-model="list.receiveTimeType">
                              <el-radio :label=1>全部时段</el-radio>
                              <el-radio :label=2>部分时段</el-radio>
                            </el-radio-group>
                          </span>
                        </div>
                        <div v-show="list.receiveTimeType==2" class="time-range-wrap ">
                          <div class="time-range-content">
                            <div class="time-range" v-for="(v,idx) in list.receiveTimeValue" :key="idx">
                              <el-time-picker
                                style="width: 230px;"
                                is-range
                                @change="changeTime"
                                value-format="HH:mm"
                                format="HH:mm"
                                v-model="v.timeRange"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                placeholder="选择时间范围">
                              </el-time-picker><el-button v-show="list.receiveTimeValue.length>1" style="margin-left: 10px;" type="text" @click="deleteTime(index,idx)">删除</el-button>
                            </div>
                          </div>
                          <p v-show="list.receiveTimeValue.length<5"><el-button style="padding: 0"  type="text" @click="addTime(index)">+ 添加时间段</el-button></p>
                        </div>
                      </div>
                      <div class="imgflex2 imgmtop formwrap-radio-hook">
                        <span class="formname">可见人群</span>
                        <span  class="formtext">
                          <span class="crowstyle" @click="selectPeople('card',list,peopleAllStyle,index)">
                            <span class="el-radio__input" :class="list.visibleCondition == peopleAllStyle ? 'is-checked' : ''">
                              <span class="el-radio__inner"></span>
                            </span><span class="el-radio__label">所有会员</span>
                          </span><span class="crowstyle" @click="selectPeople('card',list,peopleMemberStyle,index)">
                            <span class="el-radio__input" :class="list.visibleCondition == peopleMemberStyle ? 'is-checked' : ''">
                              <span class="el-radio__inner"></span>
                            </span><span class="el-radio__label">会员分组</span>
                          </span><span class="crowstyle" @click="selectPeople('card',list,peopleFilterStyle,index)">
                            <span class="el-radio__input" :class="list.visibleCondition == peopleFilterStyle ? 'is-checked' : ''">
                              <span class="el-radio__inner"></span>
                            </span><span class="el-radio__label">人群筛选器</span>
                          </span>
                        </span>
                      </div>
                      <div class="formwrap mtop formwrap-hook formwrap-radio-hook" style="margin-bottom: 0">
                        <span class="formname">领取人群</span>
                        <span class="formtext">
                          <el-radio-group v-model="list.receivePeopleType">
                            <el-radio :label=0>不限</el-radio>
                            <el-radio :label=1>限定人群</el-radio>
                          </el-radio-group>
                        </span>
                      </div>
                      <div v-if="list.receivePeopleType==1" class="get-limit-people">
                        <el-checkbox-group v-model="list.receivePeopleValue">
                          <el-checkbox label=1>开卡会员</el-checkbox><br>
                          <el-checkbox label=2>认证会员</el-checkbox><br>
                          <el-checkbox label=3>当月生日会员</el-checkbox><br>
                          <el-checkbox label=4>选择会员等级</el-checkbox><el-select :disabled="list.receivePeopleValue.indexOf('4')<0" v-model="list.memberGrade" size="small" multiple placeholder="请选择" style="width: 150px;margin-left: 10px;">
                            <el-option
                              v-for="item in memberGradeList"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                          </el-select>
                        </el-checkbox-group>
                      </div>
                      <div class="show-time-warp mtop formwrap-hook formwrap-radio-hook">
                        <span class="show-name">数量限制</span>
                        <div class="show-time-content count-wrap">
                          <el-radio-group v-model="list.numberLimitType">
                            <!-- <el-radio class="show-time" :label=1>每张卡券每人限领<el-input v-model="personCount"></el-input>张</el-radio> -->
                            <el-radio class="show-time" :label=1>每张卡券每人限领1张</el-radio>
                            <el-radio class="show-time" :label=2>每张卡券每人每天限领<el-input @keyup.native="list.numberLimitValue = String(list.numberLimitValue).replace(/[^\d]/g,'')" v-model="list.numberLimitValue" :disabled="list.numberLimitType!=2"></el-input>张</el-radio>
                          </el-radio-group>
                        </div>
                      </div>
                    </div>
                  </draggable>
                </div>
                <div v-if="item.receiveLimitType==2 && item.cardSetting.length<10" class="imgaddwrap imgaddwrap2"><p class="imgadd imgadd2" @click="addImg">+ 添加卡券</p></div>
              </div>
               <!-- 富文本 -->
              <div v-if="curIndex == index && item.key == 'A1'" v-for="(item, index) in componentList" :key="index">
                <div class="templateone mtop">
                  <h1 class="title mbottom">富文本</h1>
                </div>
                <div class="imgflex2 imgmtop formwrap-radio-hook">
                  <span class="formname">可见人群</span>
                  <span  class="formtext">
                    <span class="crowstyle" @click="selectPeople('fu',item,peopleAllStyle)">
                      <span class="el-radio__input" :class="item.visibleCondition == peopleAllStyle ? 'is-checked' : ''">
                        <span class="el-radio__inner"></span>
                      </span><span class="el-radio__label">所有会员</span>
                    </span><span class="crowstyle" @click="selectPeople('fu',item,peopleMemberStyle)">
                      <span class="el-radio__input" :class="item.visibleCondition == peopleMemberStyle ? 'is-checked' : ''">
                        <span class="el-radio__inner"></span>
                      </span><span class="el-radio__label">会员分组</span>
                    </span><span class="crowstyle" @click="selectPeople('fu',item,peopleFilterStyle)">
                      <span class="el-radio__input" :class="item.visibleCondition == peopleFilterStyle ? 'is-checked' : ''">
                        <span class="el-radio__inner"></span>
                      </span><span class="el-radio__label">人群筛选器</span>
                    </span>
                  </span>
                </div>
                <div class="formwrap mtop formwrap-hook">
                  <span class="formname">背景颜色</span>
                  <span><el-color-picker  v-model="item.backgroundColor"></el-color-picker></span>
                  <span class="formreset" @click="item.backgroundColor = '#fff'">重置</span>
                </div>
                <div class="formwrap mtop formwrap-hook formwrap-radio-hook">
                  <span class="formname">是否留白</span>
                  <span  class="formtext">
                    <el-radio-group v-model="item.fillWay">
                      <el-radio :label=0>否</el-radio>
                      <el-radio :label=1>左右留白</el-radio>
                    </el-radio-group>
                  </span>
                </div>
                <!-- 富文本编辑器 -->
                <div class="defined-tinymce-wrap">
                  <editor ref="ue1" :value="item.richTextContent" :editindex="index" @input="contentUe" :projectName="projectName"></editor>
                </div>
              </div>

              <!--图片广告-->
              <div v-if="curIndex == index && item.key == 'A2'" v-for="(item, index) in componentList" :key="index">
                <div class="templateone mtop">
                  <h1 class="title mbottom">图片广告</h1>
                  <p class="text">选择模板</p>
                  <div class="templatewrap">
                    <a class="template">
                      <img width="100%" height="74" src="./pic1.png" alt="">
                      <p class="templatetext">轮播海报</p>
                    </a>
                  </div>
                </div>
                <div class="formwrap">
                  <span class="formname">模板尺寸</span>
                  <span  class="formtext">
                  750* <el-input-number style="width: 110px;" v-model="item.imgHeight" controls-position="right" :min="220" :max="2000"></el-input-number> px
                  <span style="padding-left: 5px;font-size: 12px;">范围：220px至2000px</span>
                 </span>
                </div>
                <draggable :options="{group:{name:'imgwrap'}}" v-model="item.data">
                  <div class="imgwrap" v-for="(list, index) in item.data" :key="index">
                    <span v-if="item.data.length > 1" class="delete" @click="deleteImg(index)">
                     <i class="el-icon-close closeshow"></i><i class="el-icon-circle-close circleshow"></i>
                    </span>
                    <div class="imgflex">
                      <span class="imgflex-item1">图片</span>
                      <span class="imgflex-item2" @click="uploadImg(index)">
                       <img v-if="list.qcloudImageUrl" :src="list.qcloudImageUrl" class="avatar">
                       <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </span>
                    </div>
                    <div class="imgflex2 imgmtop">
                      <span class="imgflex-item1">链接</span>
                      <span class="imgflex-item3">
                     <a class="imgbtn" v-if="list.link && list.link.name">{{ list.link.name }}
                      <span class="imgbtndelete" @click="deleteLink(index)"><i class="el-icon-circle-close"></i></span>
                     </a>
                     <a class="imgbtnsetting" v-else @click="linkTool(index)"> 设置链接 </a>
                     <span v-if="list.link && list.link.name" class="imgedit" @click="linkTool(index)">修改</span>
                     </span>
                    </div>
                    <div class="imgflex2 imgmtop formwrap-radio-hook">
                      <span class="imgflex-item1">人群</span>
                      <span  class="formtext">
                        <span class="crowstyle" @click="selectPeople('img',list,peopleAllStyle,index)">
                          <span class="el-radio__input" :class="list.visibleCondition == peopleAllStyle ? 'is-checked' : ''">
                            <span class="el-radio__inner"></span>
                          </span><span class="el-radio__label">所有会员</span>
                        </span><span class="crowstyle" @click="selectPeople('img',list,peopleMemberStyle,index)">
                          <span class="el-radio__input" :class="list.visibleCondition == peopleMemberStyle ? 'is-checked' : ''">
                            <span class="el-radio__inner"></span>
                          </span><span class="el-radio__label">会员分组</span>
                        </span><span class="crowstyle" @click="selectPeople('img',list,peopleFilterStyle,index)">
                          <span class="el-radio__input" :class="list.visibleCondition == peopleFilterStyle ? 'is-checked' : ''">
                            <span class="el-radio__inner"></span>
                          </span><span class="el-radio__label">人群筛选器</span>
                        </span>
                      </span>
                    </div>
                    <p @click="peopleFilter(list.limitCondition,index,2)" v-show="list.visibleCondition == 1 && list.limitCondition!='' " class="filter-text"> {{ list.peopleFilterDetail }} </p>
                  </div>
                </draggable>
                <div class="imgaddwrap" @click="addImg">
                  <p class="imgadd">+ 添加一个背景图片</p>
                  <p class="imgtip">图片高度范围220~2000像素</p>
                </div>
                <p class="beizhu">最多添加10个广告，拖动选中的图片可对其排序</p>
              </div>
              <!--图片广告-end-->

              <!--魔方-->
              <div v-if="curIndex == index && item.key == 'A3'" v-for="(item, index) in componentList" :key="index">
                <div class="templateone mtop">
                  <h1 class="title mbottom">魔方</h1>
                  <p class="text">选择模板</p>
                  <div class="templatewrap">
                    <a  @click="selectMfStyle(item,telIdx)" v-for="(telItem,telIdx) in telData" :key="telIdx" class="template" :class="{'on':item.templateType != telIdx+8}">
                     <img width="100%" height="74" :src="telItem.img" alt="">
                     <p class="templatetext">{{ telItem.title }}</p>
                   </a>
                  </div>
                  <p class="text">布局</p>
                  <!-- 九宫格 -->
                  <div v-if="item.templateType==9" class="templatewrap">
                    <div class="main">
                      <div class="column-item">
                        <div class="mainbox">
                          <draggable class="mainboxdraggable clearfix" :options="{group:{name:'mofang1'}}" v-model="item.data">
                            <div class="mainboximg mainboximgbg" :class="curjggIndex == index ? 'curitem' : ''"
                                 v-if="index < 3" v-for="(list, index) in item.data" @click="selectJgg(index)" :key="index">
                              <img v-if="list.qcloudImageUrl" :src="list.qcloudImageUrl" alt="">
                            </div>
                          </draggable>
                        </div>
                      </div>
                      <div class="column-item">
                        <div class="mainbox">
                          <draggable class="mainboxdraggable clearfix" :options="{group:{name:'mofang2'}}" v-model="item.data">
                            <div class="mainboximg mainboximgbg" :class="curjggIndex == index ? 'curitem' : ''"
                                 v-if="index >=3 && index < 6" v-for="(list, index) in item.data" @click="selectJgg(index)" :key="index">
                              <img v-if="list.qcloudImageUrl" :src="list.qcloudImageUrl" alt="">
                            </div>
                          </draggable>
                        </div>
                      </div>
                      <div class="column-item">
                        <div class="mainbox">
                          <draggable class="mainboxdraggable clearfix" :options="{group:{name:'mofang3'}}" v-model="item.data">
                            <div class="mainboximg mainboximgbg" :class="curjggIndex == index ? 'curitem' : ''"
                                 v-if="index >=6 && index < 9" v-for="(list, index) in item.data" @click="selectJgg(index)" :key="index">
                              <img v-if="list.qcloudImageUrl" :src="list.qcloudImageUrl" alt="">
                            </div>
                          </draggable>
                        </div>
                      </div>
                    </div>
                    <p class="beizhu">选定布局区域，在下方添加图片，建议添加250*250像素</p>
                  </div>
                  <!-- 自定义魔方 -->
                 <div v-if="item.templateType==8" class="templatewrap">
                   <selfDefined :selfData="item" :changeStatus="changeStatus" @getEditMess="getEditMess"></selfDefined>
                 </div>
                </div>
                <div v-if="item.templateType==9" class="imgwrap">
                  <div class="imgflex">
                    <span class="imgflex-item1">图片</span>
                    <span class="imgflex-item2" @click="uploadMofang">
                     <img v-if="imageMofangUrl" :src="imageMofangUrl" class="avatar">
                     <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <el-upload id="Mofang" style="display: none" class="avatar-uploader" action="/api-plug/upload-img?requestProject=gic-web"
                                 :show-file-list="false" :on-success="handleMofangSuccess" :before-upload="beforeMofangUpload">
                      <img v-if="imageMofangUrl" :src="imageMofangUrl" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                   </span>
                  </div>
                  <div class="imgflex2 imgmtop">
                    <span class="imgflex-item1">链接</span>
                    <span class="imgflex-item3">
                   <a class="imgbtn" v-if="curjggLink !== ''">{{ curjggLink }}
                    <span class="imgbtndelete" @click="deleteJggLink"><i class="el-icon-circle-close"></i></span>
                   </a>
                   <a v-if="curjggLink == ''" class="imgbtnsetting" @click="jgglinkTool"> 设置链接 </a>
                   <span v-if="curjggLink !== ''" class="imgedit" @click="jgglinkTool">修改</span>
                   </span>
                  </div>
                  <div class="imgflex2 imgmtop formwrap-radio-hook">
                    <span class="imgflex-item1">人群</span>
                    <span  class="formtext">
                      <span class="crowstyle" @click="selectPeople('jgg',item.data[curjggIndex],peopleAllStyle)">
                        <span class="el-radio__input" :class="peopleStyle == peopleAllStyle || (item.data[curjggIndex] && item.data[curjggIndex].visibleCondition == peopleAllStyle) ? 'is-checked' : ''">
                          <span class="el-radio__inner"></span>
                        </span><span class="el-radio__label">所有会员</span>
                      </span><span class="crowstyle" @click="selectPeople('jgg',item.data[curjggIndex],peopleMemberStyle)">
                        <span class="el-radio__input" :class="peopleStyle == peopleMemberStyle || (item.data[curjggIndex] && item.data[curjggIndex].visibleCondition == peopleMemberStyle) ? 'is-checked' : ''">
                          <span class="el-radio__inner"></span>
                        </span><span class="el-radio__label">会员分组</span>
                      </span><span class="crowstyle" @click="selectPeople('jgg',item.data[curjggIndex],peopleFilterStyle)">
                        <span class="el-radio__input" :class="peopleStyle == peopleFilterStyle || (item.data[curjggIndex] && item.data[curjggIndex].visibleCondition == peopleFilterStyle) ? 'is-checked' : ''">
                          <span class="el-radio__inner"></span>
                        </span><span class="el-radio__label">人群筛选器</span>
                      </span>
                    </span>
                  </div>
                  <p @click="peopleJggFilter(2)" v-show="!curjggradio && curjggFilterDetail" class="filter-text"> {{ curjggFilterDetail }} </p>
                </div>
              </div>
              <!--魔方-end-->
              <!--文本-->
              <div v-if="curIndex == index && item.key == 'A5'" v-for="(item, index) in componentList" :key="index">
                <div class="templateone mtop">
                  <h1 class="title mbottom">文本</h1>
                </div>
                <div v-if="curIndex == index" v-for="(item, index) in componentList" :key="index">
                  <div class="formareawrap text-content">
                    <span class="formareaname">内容</span>
                    <span  class="formtext">
                       <div class="forminputWidth">
                           <gic-textarea v-model="item.content" :curvalue="item.content"  :max="1000" placeholder="请输入内容"></gic-textarea>
                       </div>
                    </span>
                  </div>
                  <div class="formwrap">
                    <span class="formname">文本颜色</span>
                    <span>
                    <el-color-picker v-model="item.fontColor"></el-color-picker>
                 </span>
                    <span class="formreset" @click="item.fontColor = '#1E1E1E'">重置</span>
                  </div>
                  <div class="formwrap mtop">
                    <span class="formname">背景颜色</span>
                    <span><el-color-picker  v-model="item.backgroundColor"></el-color-picker></span>
                    <span class="formreset" @click="item.backgroundColor = '#fff'">重置</span>
                  </div>
                  <div class="formwrap mtop formwrap-radio-hook">
                    <span class="formname">显示位置</span>
                    <span  class="formtext">
                     <el-radio-group v-model="item.pos">
                       <el-radio label="left">居左</el-radio>
                       <el-radio label="center">居中</el-radio>
                       <el-radio label="right">居右</el-radio>
                     </el-radio-group>
                 </span>
                  </div>
                  <div class="formwrap mtop formwrap-radio-hook">
                    <span class="formname">是否留白</span>
                    <span  class="formtext">
                     <el-radio-group v-model="item.fillWay">
                       <el-radio :label=0>不限</el-radio>
                       <el-radio :label=1>左右留白</el-radio>
                     </el-radio-group>
                 </span>
                  </div>
                  <div class="imgflex2 imgmtop formwrap-radio-hook">
                    <span class="formname">人群</span>
                    <span  class="formtext">
                     <span class="crowstyle" @click="selectPeople('text',item,peopleAllStyle)">
                        <span class="el-radio__input" :class="item.visibleCondition == peopleAllStyle ? 'is-checked' : ''">
                        <span class="el-radio__inner"></span>
                        </span><span class="el-radio__label">所有会员</span>
                      </span><span class="crowstyle" @click="selectPeople('text',item,peopleMemberStyle)">
                        <span class="el-radio__input" :class="item.visibleCondition == peopleMemberStyle ? 'is-checked' : ''">
                        <span class="el-radio__inner"></span>
                        </span><span class="el-radio__label">会员分组</span>
                      </span><span class="crowstyle" @click="selectPeople('text',item,peopleFilterStyle)">
                        <span class="el-radio__input" :class="item.visibleCondition == peopleFilterStyle ? 'is-checked' : ''">
                        <span class="el-radio__inner"></span>
                        </span><span class="el-radio__label">人群筛选器</span>
                      </span>
                    </span>
                  </div>
                  <p @click="peopleWenbenFilter(item.limitCondition,2)" v-show="item.visibleCondition == 1 && item.limitCondition!='' " class="filter-text"> {{ item.peopleFilterDetail }} </p>
                </div>
              </div>
              <!--文本-end-->
              <!--横栏-->
              <div v-if="curIndex == index && item.key == 'A6'" v-for="(item, index) in componentList" :key="index">
                <div class="templateone mtop">
                  <h1 class="title mbottom">横栏</h1>
                </div>
                <div v-if="curIndex == index" v-for="(item, index) in componentList" :key="index">
                  <div class="formwrap mtop formwrap-hook formwrap-radio-hook">
                    <span class="formname">选择模板</span>
                    <span  class="formtext form-heng-lan">
                      <el-radio-group class="henglan-radio" @change="changeTemplateType(index,item.templateType,item.data)" v-model="item.templateType">
                        <el-radio :label=1>icon横栏</el-radio>
                        <el-radio :label=2>纯文字横栏</el-radio>
                        <el-radio :label=3>双向横栏</el-radio>
                      </el-radio-group>
                  </span>
                  </div>
                  <div v-show="item.templateType!=3" class="formwrap mtop formwrap-hook formwrap-radio-hook">
                    <span class="formname">跳转提示</span>
                    <span  class="formtext">
                      <el-checkbox v-model="item.jumpHint">显示</el-checkbox>
                  </span>
                  </div>
                  <div class="formwrap mtop formwrap-hook">
                    <span class="formname">文本颜色</span>
                    <span>
                    <el-color-picker v-model="item.fontColor"></el-color-picker>
                  </span>
                    <span class="formreset" @click="item.fontColor = '#1E1E1E'">重置</span>
                  </div>
                  <div class="formwrap mtop formwrap-hook">
                    <span class="formname">背景颜色</span>
                    <span><el-color-picker  v-model="item.backgroundColor"></el-color-picker></span>
                    <span class="formreset" @click="item.backgroundColor = '#fff'">重置</span>
                  </div>
                <draggable :options="{group:{name:'henglan'}}" v-model="item.data" >
                  <div class="imgwrap" v-for="(list, index) in item.data" :key="index">
                      <span v-if="item.templateType!=3 && item.data.length > 1" class="delete" @click="deleteImg(index)">
                        <i class="el-icon-close closeshow"></i><i class="el-icon-circle-close circleshow"></i>
                      </span>
                      <div class="imgflex2 imgmtop imgmtop-first" >
                        <span class="imgflex-item1">标签名称</span>
                        <span  class="formtext">
                        <div class="forminputWidth">
                            <gic-input v-model="list.title" :curvalue="list.title" :max="item.templateType!=3?10:6" placeholder="请输入标签名称"></gic-input>
                        </div>
                    </span>
                    </div>
                    <div class="imgflex imgmtop" v-if="item.templateType != 2">
                        <span class="imgflex-item1">图片</span>
                        <span class="imgflex-crossbar" @click="uploadImg(index)">
                        <img v-if="list.qcloudImageUrl" :src="list.qcloudImageUrl" class="avatarcrossbar">
                        <i v-else class="el-icon-plus avatar-uploader-iconcrossbar"></i>
                        <p class="text-tip">建议上传40*40像素的图片</p>
                        </span>
                      </div>
                      <div class="imgflex2 imgmtop">
                        <span class="imgflex-item1">链接</span>
                        <span class="imgflex-item3">
                          <a class="imgbtn" v-if="list.link && list.link.name">{{ list.link.name }}
                            <span class="imgbtndelete" @click="deleteLink(index)"><i class="el-icon-circle-close"></i></span>
                          </a>
                          <a class="imgbtnsetting" v-else @click="linkTool(index)"> 设置链接 </a>
                          <span v-if="list.link && list.link.name" class="imgedit" @click="linkTool(index)">修改</span>
                        </span>
                      </div>
                      <div v-if="item.templateType != 3" class="imgflex2 imgmtop formwrap-radio-hook">
                        <span class="imgflex-item1">人群</span>
                        <span  class="formtext">
                          <span class="crowstyle" @click="selectPeople('heng',list,peopleAllStyle,index)">
                            <span class="el-radio__input" :class="list.visibleCondition == peopleAllStyle ? 'is-checked' : ''">
                              <span class="el-radio__inner"></span>
                            </span><span class="el-radio__label">所有会员</span>
                          </span><span class="crowstyle" @click="selectPeople('heng',list,peopleMemberStyle,index)">
                            <span class="el-radio__input" :class="list.visibleCondition == peopleMemberStyle ? 'is-checked' : ''">
                              <span class="el-radio__inner"></span>
                            </span><span class="el-radio__label">会员分组</span>
                          </span><span class="crowstyle" @click="selectPeople('heng',list,peopleFilterStyle,index)">
                            <span class="el-radio__input" :class="list.visibleCondition == peopleFilterStyle ? 'is-checked' : ''">
                              <span class="el-radio__inner"></span>
                            </span><span class="el-radio__label">人群筛选器</span>
                          </span>
                        </span>
                      </div>
                      <p @click="peopleFilter(list.limitCondition,index,2)" v-show="list.visibleCondition == 1 && list.limitCondition!='' " class="filter-text"> {{ list.peopleFilterDetail }} </p>
                    </div>
                  </draggable>

                  <div v-if="item.templateType != 3 " class="imgaddwrap imgaddwrap2" @click="addImg">
                    <p class="imgadd imgadd2">+ 添加横栏</p>
                  </div>
                  <p class="beizhu">最多添加10个横栏，拖动选中的横栏可对其排序,建议尺寸40*40像素</p>

                </div>
              </div>
              <!--辅助线-->
              <div v-if="curIndex == index && item.key == 'A7'" v-for="(item, index) in componentList" :key="index">
                <div class="templateone mtop">
                  <h1 class="title mbottom">辅助线</h1>
                </div>
                <div v-if="curIndex == index" v-for="(item, index) in componentList" :key="index">
                  <div class="formwrap mtop">
                    <span class="formname">线条颜色</span>
                    <span>
                    <el-color-picker v-model="item.fontColor"></el-color-picker>
                 </span>
                    <span class="formreset" @click="item.fontColor = '#E5E5E5'">重置</span>
                  </div>
                  <div class="formwrap mtop formwrap-radio-hook">
                    <span class="formname">边距</span>
                    <span  class="formtext">
                     <el-radio-group v-model="item.fillWay">
                       <el-radio :label=0>无边距</el-radio>
                       <el-radio :label=1>左右留边</el-radio>
                     </el-radio-group>
                 </span>
                  </div>
                  <div class="formwrap mtop formwrap-radio-hook">
                    <span class="formname">样式</span>
                    <span  class="formtext">
                     <el-radio-group v-model="item.style">
                       <el-radio :label=1>实线</el-radio>
                       <el-radio :label=2>虚线</el-radio>
                       <el-radio :label=3>点线</el-radio>
                     </el-radio-group>
                 </span>
                  </div>
                </div>
              </div>
              <!--辅助线-end-->

              <!--辅助留白-->
              <div v-if="curIndex == index && item.key == 'A8'" v-for="(item, index) in componentList" :key="index">
                <div class="templateone mtop">
                  <h1 class="title mbottom">辅助空白</h1>
                </div>
                <div v-if="curIndex == index" v-for="(item, index) in componentList" :key="index">
                  <div class="formwrap mtop formwrap-hook">
                    <span class="formname">边距</span>
                    <span  class="formtext">
                    <el-input-number v-model="item.fillWay" :min="10" :max="100" label=""></el-input-number>
                    <p class="text-tip">区间范围：10-100像素</p>
                 </span>
                  </div>
                </div>
              </div>
              <!--辅助留白-end-->

              <!--数据icon-->
              <div v-if="curIndex == index && item.key == 'B2'" v-for="(item, index) in componentList" :key="index">
                <div class="templateone mtop">
                  <h1 class="title mbottom">数据icon</h1>
                </div>
                <div v-if="curIndex == index" v-for="(item, index) in componentList" :key="index">
                  <div class="formwrap mtop formwrap-hook formwrap-radio-hook">
                    <span class="formname">选择模板</span>
                    <el-radio-group v-model="item.templateType" class="margin-left-20">
                      <el-radio :label=3>1行多个</el-radio>
                      <el-radio :label=1>icon横栏</el-radio>
                      <el-radio :label=2>纯文字横栏</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="formwrap mtop formwrap-hook formwrap-radio-hook" v-if="parseInt(item.templateType) == 3">
                    <span class="formname">单行个数</span>
                    <span  class="formtext">
                     <el-radio-group v-model="item.amount">
                       <el-radio :label=3>3个</el-radio>
                       <el-radio :label=4>4个</el-radio>
                     </el-radio-group>
                  </span>
                  </div>

                  <div v-if="item.templateType !== 3">
                    <div class="formwrap mtop formwrap-hook" >
                      <span class="formname">文本颜色</span>
                      <span>
                       <el-color-picker v-model="item.fontColor" size="medium"></el-color-picker>
                      </span>
                      <span class="formreset" @click="item.fontColor = '#1E1E1E'">重置</span>
                    </div>
                    <div class="formwrap mtop formwrap-hook">
                      <span class="formname">背景颜色</span>
                      <span><el-color-picker  v-model="item.backgroundColor" size="medium"></el-color-picker></span>
                      <span class="formreset" @click="item.backgroundColor = '#fff'">重置</span>
                    </div>
                  </div>

                  <draggable :options="{group:{name:'dataiconone'}}" v-model="item.data">
                  <div v-if="item.templateType !== 3" class="imgwrap" v-for="(list, index) in item.data" :key="index">
                    <div class="customtitlewrap">
                      <span class="customtitle">
                        <span v-if="list.dataType == 'D1'">商城订单</span>
                        <span v-else-if="list.dataType == 'D2'">门店消费</span>
                        <span v-else-if="list.dataType == 'D3'">卡券包</span>
                        <span v-else-if="list.dataType == 'D5'">购物车</span>
                        <span v-else-if="list.dataType == 'D6'">收藏商品	</span>
                        <span v-else-if="list.dataType == 'D7'">地址管理	</span>
                      </span>
                      <span class="customswitch fr"><el-switch  v-model="list.status"></el-switch></span>
                    </div>
                    <div class="imgflex2 imgmtop">
                      <span class="imgflex-item1">标签名称</span>
                      <span  class="formtext">
                         <div class="forminputWidth">
                            <gic-input v-model="list.title" :curvalue="list.title" :max="5" placeholder="请输入标签名称"></gic-input>
                         </div>
                      </span>
                    </div>
                    <div class="imgflex imgmtop" v-if="item.templateType == 1">
                      <span class="imgflex-item1">图片</span>
                      <span class="imgflex-crossbar" @click="uploadImg(index)">
                        <img v-if="list.qcloudImageUrl" :src="list.qcloudImageUrl" class="avatarcrossbar">
                        <i v-else class="el-icon-plus avatar-uploader-iconcrossbar"></i>
                      </span>
                    </div>
                    <div class="imgflex2 imgmtop">
                      <span class="imgflex-item1">人群</span>
                      <span  class="formtext">
                        <span class="crowstyle" @click="selectPeople('icon',list,peopleAllStyle,index)">
                          <span class="el-radio__input" :class="list.visibleCondition == peopleAllStyle ? 'is-checked' : ''">
                            <span class="el-radio__inner"></span>
                          </span><span class="el-radio__label">所有会员</span>
                        </span><span class="crowstyle" @click="selectPeople('icon',list,peopleMemberStyle,index)">
                          <span class="el-radio__input" :class="list.visibleCondition == peopleMemberStyle ? 'is-checked' : ''">
                            <span class="el-radio__inner"></span>
                          </span><span class="el-radio__label">会员分组</span>
                        </span><span class="crowstyle" @click="selectPeople('icon',list,peopleFilterStyle,index)">
                          <span class="el-radio__input" :class="list.visibleCondition == peopleFilterStyle ? 'is-checked' : ''">
                            <span class="el-radio__inner"></span>
                          </span><span class="el-radio__label">人群筛选器</span>
                        </span>
                      </span>
                    </div>
                    <p @click="peopleFilter(list.limitCondition,index,2)" v-show="list.visibleCondition == 1 && list.limitCondition!='' " class="filter-text"> {{ list.peopleFilterDetail }} </p>
                  </div>
                  </draggable>

                  <draggable :options="{group:{name:'dataicontwo'}}" v-model="item.data">
                  <div v-if="item.templateType == 3"  class="imgwrap" v-for="(list, index) in item.data" :key="index">
                    <div class="customtitlewrap">
                      <span class="customtitle">
                        <span v-if="list.dataType == 'D1'">商城订单</span>
                        <span v-else-if="list.dataType == 'D2'">门店消费</span>
                        <span v-else-if="list.dataType == 'D3'">卡券包</span>
                        <span v-else-if="list.dataType == 'D5'">购物车</span>
                        <span v-else-if="list.dataType == 'D6'">收藏商品	</span>
                        <span v-else-if="list.dataType == 'D7'">地址管理	</span>
                      </span>
                      <span class="customswitch fr"><el-switch  v-model="list.status"></el-switch></span>
                    </div>
                    <div class="imgflex2 imgmtop">
                      <span class="imgflex-item1">标签名称</span>
                      <span  class="formtext">
                         <div class="forminputWidth">
                            <gic-input v-model="list.title" :curvalue="list.title" :max="5" placeholder="请输入标签名称"></gic-input>
                         </div>
                      </span>
                    </div>
                    <div class="imgflex2 imgmtop">
                      <span class="imgflex-item1">文本颜色</span>
                      <span><el-color-picker  v-model="list.fontColor" size="small"></el-color-picker></span>
                      <span class="formreset" @click="list.fontColor = '#1E1E1E'">重置</span>
                    </div>
                    <div class="imgflex2 imgmtop">
                      <span class="imgflex-item1">人群</span>
                      <span  class="formtext">
                        <span class="crowstyle" @click="selectPeople('icon',list,peopleAllStyle,index)">
                          <span class="el-radio__input" :class="list.visibleCondition == peopleAllStyle ? 'is-checked' : ''">
                            <span class="el-radio__inner"></span>
                          </span><span class="el-radio__label">所有会员</span>
                        </span><span class="crowstyle" @click="selectPeople('icon',list,peopleMemberStyle,index)">
                          <span class="el-radio__input" :class="list.visibleCondition == peopleMemberStyle ? 'is-checked' : ''">
                            <span class="el-radio__inner"></span>
                          </span><span class="el-radio__label">会员分组</span>
                        </span><span class="crowstyle" @click="selectPeople('icon',list,peopleFilterStyle,index)">
                          <span class="el-radio__input" :class="list.visibleCondition == peopleFilterStyle ? 'is-checked' : ''">
                            <span class="el-radio__inner"></span>
                          </span><span class="el-radio__label">人群筛选器</span>
                        </span>
                      </span>
                    </div>
                    <p @click="peopleFilter(list.limitCondition,index,2)" v-show="list.visibleCondition == 1 && list.limitCondition!='' " class="filter-text"> {{ list.peopleFilterDetail }} </p>
                  </div>
                  </draggable>
                </div>
                <p class="beizhu" v-if="item.templateType == 1">icon横栏图标建议尺寸40*40像素</p>
              </div>
              <!--数据icon-end-->

            </el-form>


            <!--图片上传-->
            <el-upload id="imgupload" style="display: none"
                       class="avatar-uploader"
                       action="/api-plug/upload-img?requestProject=gic-web"
                       :show-file-list="false"
                       :on-success="handleImgSuccess"
                       :before-upload="beforeImgUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <!--图片上传-->

          </div>
        </div>
      </div>
      <linktools :projectName="projectName" :linkVisible.sync="linkToolsVisible" :isWx=false @linkSelect="linkSelect"/>
      <!-- <peopleFilter :peopleModal="peopleModal" @closeModal="closeModal" @getCrowdData="getCrowdData" :limitCondition="limitCondition"></peopleFilter> -->
      <!-- 人群筛选器 -->
      <el-dialog
        title="自定义人群"
        :visible.sync="dialogVisiblePeople"
        width="1175px">
        <div class="select-people">
          <vue-gic-people v-if="peopleFilterReRender" :flag="true" :projectName="projectName" :useId="useId" :hasSearchData="hasSearchData" :sceneValue="sceneValue" ref="peopleFilter" @findFilter="findFilter" @getBackData="getBackData" @editHide="editHide" @editShow="editShow" @hideBtn="hideBtn" :isAdd="operateType"></vue-gic-people>
          <div v-show="toggleTag" class="people-btn-wrap">
            <el-row>
              <el-button @click="getData" type="primary" size="small">确定</el-button>
              <el-button @click="cancelFilter" size="small">取消</el-button>
            </el-row>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-row>
            <el-button @click="dialogVisiblePeople = false">取 消</el-button>
            <el-button type="primary" @click="getPeopleData">确 定</el-button>
          </el-row>
        </span>
      </el-dialog>
      <!-- 会员分组 -->
      <el-dialog
        title="会员分组"
        :visible.sync="dialogMemberGroup"
        width="900px">
        <vue-gic-member-group
          v-if="memberGroupReRender"
          :defaltSelected="defaltSelected"
          :height='height'
          :projectName="projectName"
          :headerList='headerList'
          :effectiveStatus="effectiveStatus"
          @handleDataTransferred="handleDataTransferred"
          @handleDataLeft="handleDataLeft">
        </vue-gic-member-group>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogMemberGroup = false">取 消</el-button>
          <el-button type="primary" @click="memberGroupBtn">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 选择卡券 -->
      <vue-gic-card v-if="showCardDialog" ref="selectCard" class="select-card" :disabledList="disabledList" :projectName="projectName" :showCardDialog="showCardDialog" :cardLimit="cardLimit" :cardType="cardType" @selectCard="selectCard"></vue-gic-card>
  	</div>
  </transition>
</template>

<script>
    module.exports = require('./membercenterAdd')
</script>

<style lang="less" scoped>
@import "./membercenter";
</style>
