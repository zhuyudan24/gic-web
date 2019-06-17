<template>
  <div class="template-wrap">
    <div :style="{ height: bodyHeight}">
      <div class="template-contain">
      <!-- 头部标题 -->
        <div class="template-head">
          <div class="template-title flex-1">
            <img src="../../../../static/img/logo45_45.png" alt="logo"/>
            <span class="template-title-span">开卡字段配置模板</span>
          </div>
          <div class="template-btns flex-1 flex-r">
            <el-row>
              <el-button plain @click="goBack">返回</el-button>
              <el-button :disabled="contactBool" type="primary" @click="saveAndBack">保存并启用</el-button>
            </el-row>
            
          </div>
        </div>
        <!-- 模板body -->
        <div class="template-body">
          <!-- 左侧 -->
          <div class="template-cell template-cell-l">
            <!-- tab 切换 -->
            <el-tabs v-model="activeName" >
              <el-tab-pane label="系统字段" name="first">
                <div class="filed-item-title">基本信息</div>
                <ul>
                  <draggable id="list1" @clone="baseInfoClone" :list="baseInfo" class="compenent" :options="leftOption" :move="onMove" @start="isDragging=true" @end="itemMoveEnd"><!-- @end="itemMoveEnd" -->
                    <li :class="['compenent-item',item.fixed==true? 'fixed-item': '']" :data-type='item.systemFieldId' v-for="item in baseInfo" @click="clickItem(item)" aria-hidden="true" >
                      <span v-if="item.systemFieldId == 'k101'">{{item.fieldName}}</span>
                      <span v-if="item.systemFieldId == 'k102'">{{item.fieldName}}</span>
                      <span v-if="item.systemFieldId == 'k103'">{{item.fieldName}}</span>
                      <span v-if="item.systemFieldId == 'k104'">{{item.fieldName}}</span>
                      <span v-if="item.systemFieldId == 'k105'">{{item.fieldName}}</span>
                      <span v-if="item.systemFieldId == 'k106'">{{item.fieldName}}</span>
                    </li>
                  </draggable>
                </ul>
                <div class="filed-item-title">家庭信息</div>
                <ul>
                  <draggable id="list2"  :list="familyInfo" class="compenent" :options="leftOption" :move="onMove" @start="isDragging=true" @end="itemMoveEnd">
                    <li :class="['compenent-item',item.fixed==true? 'fixed-item': '']" :data-type='item.systemFieldId' v-for="item in familyInfo">
                      <span v-if="item.systemFieldId == 'k201'">{{item.fieldName}}</span>
                      <span v-if="item.systemFieldId == 'k202'">{{item.fieldName}}</span>
                      <span v-if="item.systemFieldId == 'k203'">{{item.fieldName}}</span>
                      <span v-if="item.systemFieldId == 'k204'">{{item.fieldName}}</span>
                    </li>
                  </draggable>
                </ul>
                <div class="filed-item-title">资产信息</div>
                <ul>
                  <draggable id="list3"  :list="assetInfo" class="compenent" :options="leftOption" :move="onMove" @start="isDragging=true" @end="itemMoveEnd">
                    <li :class="['compenent-item',item.fixed==true? 'fixed-item': '']" :data-type='item.systemFieldId' v-for="item in assetInfo">
                      <span v-if="item.systemFieldId == 'k301'">{{item.fieldName}}</span>
                      <span v-if="item.systemFieldId == 'k302'">{{item.fieldName}}</span>
                      <span v-if="item.systemFieldId == 'k303'">{{item.fieldName}}</span>
                    </li>
                  </draggable>
                </ul>
                <div class="filed-item-title">其他信息</div>
                <ul>
                  <draggable id="list4"  :list="otherInfo" class="compenent" :options="leftOption" :move="onMove" @start="isDragging=true" @end="itemMoveEnd">
                    <li :class="['compenent-item',item.fixed==true? 'fixed-item': '']" :data-type='item.systemFieldId' v-for="item in otherInfo">
                      <span v-if="item.systemFieldId == 'k401'">{{item.fieldName}}</span>
                      <span v-if="item.systemFieldId == 'k402'">{{item.fieldName}}</span>
                      <span v-if="item.systemFieldId == 'k403'">{{item.fieldName}}</span>
                      <span v-if="item.systemFieldId == 'k404'">{{item.fieldName}}</span>
                    </li>
                  </draggable>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="自定义字段" name="second">
                <div class="filed-item-title"><!-- 其他信息 --></div>
                <ul>
                  <draggable id="list5"  :list="defineInfo" class="compenent" :options="leftDefineOption" :move="onChildMove" @start="isDragging=true" @end="itemMoveEnd" @clone="cloneDefine">
                    <li :class="['compenent-item',item.fixed==true? 'fixed-item': '',item.fieldType == 5?'block-class':'']" :data-type='item.systemFieldId' v-for="item in defineInfo">
                      <span v-if="item.systemFieldId == '-1' && item.fieldType==3">{{item.fieldNameCopy}}</span>
                      <span v-if="item.systemFieldId == '-1' && item.fieldType == 1">{{item.fieldNameCopy}}</span>
                      <span v-if="item.systemFieldId == '-1' && item.fieldType == 4">{{item.fieldNameCopy}}</span>
                      <span v-if="item.systemFieldId == '-1' && item.fieldType == 0">{{item.fieldNameCopy}}</span>
                      <span v-if="item.systemFieldId == '-1' && item.fieldType == 5">{{item.fieldNameCopy}}</span>
                      <i :class="{'one':item.systemFieldId == '-1' && item.fieldType==3,'two':item.systemFieldId == '-1' && item.fieldType==1,'three':item.systemFieldId == '-1' && item.fieldType==4,'four':item.systemFieldId == '-1' && item.fieldType==0,'five':item.systemFieldId == '-1' && item.fieldType==5}" class="bg-icon"></i>
                    </li>
                  </draggable>
                </ul>
              </el-tab-pane>
            </el-tabs>
          </div>
          <!-- 中间 -->
          <div class="template-cell template-cell-m">
            <div class="phone-view">
              <div class="phone-show-content">
                <!-- 拖拽展示区域 -->
                <div class="drag-show-content">
                  <div class="view-container">
                    <ul class="view-content" id="showPhoneView">
                      <template v-if="tempaletDataList.length == 0">
                        <img class="templet-null-img" src="../../../assets/templet_null_img.png"/>
                      </template>
                      <draggable :options="{group:{name:'people', pull:false, put:true },sort: true}"
                              v-model="tempaletDataList" class="drag-wrap" @add="addItem">
                          <li :class="['filed-item',currentIndex == index? 'active-item': '',item.systemFieldId==-1&&item.fieldType == 5? 'li-block':'']" v-for="(item,index) in tempaletDataList" @click="selectItem(item.systemFieldId,index)" :key="index">
                            <!-- 删除 -->
                            <span class="item-close" @click.stop="deleteItem(item.systemFieldId,index)"><i class="el-icon-close"></i></span>
                            <!-- item -->
                            <div v-if="item.systemFieldId == 'k103' && item.fieldContent.birthType">
                              <div class="no-change-birth" :class="['opencard-item-title', item.fieldName.length > 6 ? 'title-pre-wrap' : '']" style="line-height:66px">{{ item.fieldName }}</div>
                              <div class="draged-item-show">
                                <el-radio-group v-model="item.radio" style="margin-top:10px">
                                  <el-radio disabled :label="0">农历</el-radio>
                                  <el-radio disabled :label="1">阳历</el-radio>
                                </el-radio-group>
                                <span class="show-warm-text show-warm-text-flag" style="height:40px;line-height:40px;">{{ item.fieldDescription }}</span>
                              </div>
                            </div>
                            <div v-if="!(item.systemFieldId == -1 && item.fieldType == 5) && !(item.systemFieldId == 'k103' && item.fieldContent.birthType)">
                              <div :class="['opencard-item-title',item.fieldName.length>6? 'title-pre-wrap': '']">{{item.fieldName}}</div>
                              <div class="draged-item-show">
                                <span class="show-warm-text show-warm-text-flag">{{item.fieldDescription}}</span>
                              </div>
                            </div>
                            <template v-if="item.systemFieldId==-1&&item.fieldType == 5">
                              <div class="block">
                                <div class="block-head">
                                  <div :class="['opencard-item-title',item.fieldName.length>6? 'block-pre-wrap': '']">{{item.fieldName}}</div>
                                </div>

                                 <!--  <div class="draged-item-show">
                                    <span class="show-warm-text show-warm-text-flag">{{item.fieldDescription}}</span>
                                  </div> -->
                                  <ul class="view-content">
                                    <draggable :options="{group:{name:'people', pull:false, put:true },sort: true}" v-model="item.sonList" class="drag-wrap block-wrap" @add="addDragItem">

                                      <li :class="['filed-item',currentChildIndex == ind? 'active-item': '']" v-for="(childItem,ind) in item.sonList" @click.stop="selectChildItem(childItem.systemFieldId,index,ind,item.sonList)" >
                                        <!-- 删除 -->
                                        <span class="item-close" @click.stop="deleteChildItem(childItem.systemFieldId,index,ind,item.sonList)"><i class="el-icon-close"></i></span>
                                        <!-- item -->
                                        <div>
                                          <div :class="['opencard-item-title',childItem.fieldName.length>6? 'title-pre-wrap': '']" >{{childItem.fieldName}}</div>
                                          <div class="draged-item-show">
                                            <span class="show-warm-text show-warm-text-flag">{{childItem.fieldDescription}}</span>
                                          </div>
                                        </div>
                                      </li>
                                    </draggable>
                                  </ul>
                              </div>
                            </template>
                            <!-- <ul class="view-content" v-if="item.">
                                <draggable :options="{group:{name:'block', pull:false, put:true },sort: true}"v-model="tempaletDataList.blockList" class="drag-wrap" @add="addItem">

                                  <li :class="['filed-item',currentIndex == index? 'active-item': '']" v-for="(item,index) in tempaletDataList" @click="selectItem(item.systemFieldId,index)" >
                                    删除
                                    <span class="item-close" @click.stop="deleteItem(item.systemFieldId,index)"><i class="el-icon-close"></i></span>
                                    item
                                    <div>
                                      <div class="opencard-item-title">{{item.fieldName}}</div>
                                      <div class="draged-item-show">
                                        <span class="show-warm-text show-warm-text-flag">{{item.fieldDescription}}</span>
                                      </div>
                                    </div>
                                  </li>
                                </draggable>
                              </ul> -->
                          </li>
                      </draggable>
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <!-- 右侧 -->
          <div class="template-cell template-cell-r">
            <el-tabs v-model="rightName" >
              <el-tab-pane label="控件设置" name="first">

                  <div id="edit-box">
                    <div class="edit-view baby-info-flag baby-info">
                      <template v-for="(item,index) in tempaletDataList">
                        <!-- 公共 -->
                        <template v-if="currentIndex == index && item.isMult != 1 && item.systemFieldId != -1">
                          <div class="edit-item ">
                            <div class="edit-item-title edit-title-padding"> 标题 </div>
                            <add-input :inputValue="item.fieldName" :disFlag="1" :maxLength="10" @itemInput="itemInput"></add-input>
                          </div>
                         <!--  <div class="edit-item ">
                            <div class="edit-item-title">提示文字最多15个字</div>
                            <add-input :inputValue="item.fieldDescription" :disFlag="0" :maxLength="15" @itemInput="itemInput"></add-input>
                          </div> -->
                        </template>

                        <!-- 自定义中 根据 item.systemFieldId == -1 判断是否可编辑-->
                        <template v-if="currentIndex == index && item.systemFieldId == -1 && !currentChildIndex">
                          <div class="edit-item ">
                            <div class="edit-item-title"> 标题 </div>
                            <add-input :inputValue="item.fieldName" :titleName="'title'" :disFlag="0" :maxLength="10" @itemInput="itemInput"></add-input>
                          </div>
                        </template>

                        <template v-if="currentIndex == index && item.fieldType != 5" >
                          <div class="edit-item" >
                            <div class="edit-item-title">提示文字</div>
                            <!-- <el-input class="w-340" v-model="item.placeHolder" placeholder=""></el-input> -->
                            <add-input :inputValue="item.fieldDescription" :disFlag="0" :maxLength="15" @itemInput="itemInput"></add-input>
                          </div>
                        </template>

                        <!-- 组块内部 -->
                        <template v-if="childIndex == index && !!item.sonList && !!item.sonList.length && item.systemFieldId==-1">
                          <template v-for="(child,ind) in item.sonList">
                              <!-- 标题 -->
                              <template v-if="currentChildIndex == ind && (child.fieldType=='3'||child.fieldType=='1'||child.fieldType=='0'||child.fieldType=='4')">
                                <div class="edit-item test-title" >
                                  <div class="edit-item-title"> 标题 </div>
                                  <add-input :inputValue="child.fieldName" :titleName="'title'" :child="'child'" :disFlag="0" :maxLength="10" @itemInput="itemInput"></add-input>
                                </div>
                              </template>

                              <!-- 提示 -->
                              <template v-if="currentChildIndex == ind && (child.fieldType=='3'||child.fieldType=='1'||child.fieldType=='0'||child.fieldType=='4')" >
                                <div class="edit-item test-title" >
                                  <div class="edit-item-title">提示文字</div>
                                  <!-- <el-input class="w-340" v-model="item.placeHolder" placeholder=""></el-input> -->
                                  <add-input :inputValue="child.fieldDescription" :disFlag="0" :child="'child'" :maxLength="15" @itemInput="itemInput"></add-input>
                                </div>
                              </template>


                              <!-- 类型 -->
                              <template v-if="currentChildIndex == ind && (child.fieldType=='3'||child.fieldType=='1'||child.fieldType=='0'||child.fieldType=='4')">
                                <div class="edit-item " >
                                  <div class="edit-item-title">类型</div>
                                  <!-- <template v-for="(types,ind) in child.ruleContent">
                                    <el-checkbox v-model="types.checked" @change="changeCheck($event,ind,child.type)">{{types.name}}</el-checkbox>
                                  </template> -->
                                  <!-- 单选 -->
                                  <template v-if="child.fieldType == 3">
                                    <template v-for="(types,ind) in child.ruleContent">
                                      <el-radio v-model="types.checked" :label="types.checked">{{types.name}}</el-radio>
                                    </template>
                                  </template>
                                  <!-- 多选 -->
                                  <template v-if="child.fieldType == 1">
                                    <template v-for="(types,ind) in child.ruleContent">
                                      <el-checkbox v-model="types.checked=='checked'? true:false" :disabled="types.isEdit==0? true: false">{{types.name}}</el-checkbox>
                                    </template>
                                  </template>

                                  <!-- 单行输入框-->
                                  <template v-if="child.fieldType==0">
                                    <template v-for="(types,ind) in child.ruleContent">
                                      <el-checkbox v-model="types.select" @change="changeCheck($event,ind,child.type)">{{types.name}}</el-checkbox>
                                    </template>
                                  </template>

                                  <!-- 日期 -->
                                  <template v-if="currentChildIndex == ind && child.systemFieldId == -1 && child.fieldType==4">
                                    <template v-for="(types,ind) in child.ruleContent">
                                      <el-radio v-model="child.typeValue" :label="types.name" @change="changeRadio($event,ind,child)">{{types.name}}</el-radio>
                                    </template>
                                  </template>
                                </div>
                              </template>

                              <!-- 长度限制 -->
                              <template v-if="currentChildIndex == ind && child.fieldType==0">
                                <div class="edit-item ">
                                  <div class="edit-item-title">长度限制</div>
                                  <el-input v-model="child.limitCountMin" placeholder=""  @focus="inputFocus('limitCountMin',child)" @keyup.native="formatInput($event)" class="w-120"></el-input>
                                  <label class="label-txt">至</label>
                                  <el-input v-model="child.limitCountMax" placeholder=""  @focus="inputFocus('limitCountMax',child)" @keyup.native="formatInput($event)" class="w-120"></el-input>
                                  <label class="label-txt">位字符</label>
                                </div>
                              </template>

                              <!-- 选项 -->
                              <template v-if="currentChildIndex == ind && (child.fieldType=='3'||child.fieldType=='1')">
                                <div class="edit-item ">
                                  <div class="edit-item-title">选项 <span v-if="child.fieldType=='1'">最多20项，每项最多10个字</span> <span v-if="child.fieldType=='3'">最多5项，每项最多10个字</span></div>
                                  <template v-for="(types,ind) in child.fieldContent">
                                    <div class="margin-t-15" :style="ind==0? 'margin-top: 0':''">
                                      <add-input :inputValue="types.name" :childIndex="ind" :child="'child'" :childItem="(child.fieldType=='3' || child.fieldType=='1')? 'k303':''"  :disFlag="0" :maxLength="10" @itemInput="itemInput"></add-input>
                                      <i class="opt-btn el-icon-remove del-item" v-if="child.fieldContent.length>1" @click="delChildItem(index,ind,child)"></i>
                                      <template v-if="(child.systemFieldId == '-1'&&child.fieldType==1&&ind < 19)">
                                        <i class="opt-btn el-icon-circle-plus add-item" v-if="ind == child.fieldContent.length-1" @click="addChildItem(index,ind,child)"></i>
                                      </template>
                                      <template v-if="(child.systemFieldId == '-1'&&child.fieldType==3&&ind < 4)">
                                        <i class="opt-btn el-icon-circle-plus add-item" v-if="ind == child.fieldContent.length-1" @click="addChildItem(index,ind,child)"></i>
                                      </template>

                                    </div>
                                  </template>
                                </div>
                              </template>

                              <!-- 必填和商户 -->
                              <template v-if="currentChildIndex == ind && (child.fieldType=='3'||child.fieldType=='1'||child.fieldType=='0'||child.fieldType=='4')">
                                <div class="edit-item ">
                                  <div class="edit-item-title">验证</div>
                                  <el-checkbox v-model="child.isMust" >必填</el-checkbox>
                                </div>

                                <div class="edit-item" style="display: none;">
                                  <div class="edit-item-title">适用商户<!-- <el-checkbox :indeterminate="child.isIndeterminate" v-model="child.checkAll" @change="checkAllChange($event,child)" class="margin-l-15">全选</el-checkbox> --></div>
                                  <div class="edit-item-checkbox">
                                   <el-checkbox :indeterminate="child.isIndeterminate" v-model="child.checkAll" @change="checkAllChange($event,child)" class="margin-b-15">全选</el-checkbox>
                                  </div>
                                  <el-checkbox-group v-model="child.enterpriseIds" @change="checkedChange($event,child)">
                                    <!-- 商户列表 -->
                                    <template v-for="(merchantItem,idx) in merchantOptions">
                                      <div class="checkbox-cell">
                                        <el-checkbox :label="merchantItem.enterpriseId" :key="merchantItem.id">
                                        <el-input class="w-316" v-model="merchantItem.name" placeholder="" disabled></el-input></el-checkbox>
                                      </div>
                                    </template>
                                  </el-checkbox-group>
                                </div>
                              </template>

                              <!-- 单行输入框-->
                              <!-- <template v-if="currentChildIndex == ind && child.systemFieldId == -1 && child.fieldType==0">
                                <div class="edit-item ">
                                  <div class="edit-item-title">类型</div>
                                  <template v-for="(types,ind) in child.ruleContent">
                                    <el-checkbox v-model="types.checked" @change="changeCheck($event,ind,child.type)">{{types.name}}</el-checkbox>
                                  </template>
                                </div>
                                <div class="edit-item ">
                                  <div class="edit-item-title">长度限制</div>
                                  <el-input v-model="child.limitCountMin" placeholder=""  class="w-120"></el-input>
                                  <label class="label-txt">至</label>
                                  <el-input v-model="child.limitCountMax" placeholder=""  class="w-120"></el-input>
                                  <label class="label-txt">位字符</label>
                                </div>
                              </template> -->
                              <!-- 自定义日期 -->
                              <!-- <template v-if="currentChildIndex == ind && child.systemFieldId == -1 && child.fieldType==4">
                                <div class="edit-item ">
                                  <div class="edit-item-title">类型</div>
                                  <template v-for="(types,ind) in child.ruleContent">
                                    <el-radio v-model="child.typeValue" :label="types.name" @change="changeRadio($event,ind,child)">{{types.name}}</el-radio>
                                  </template>
                                </div>
                              </template> -->
                          </template>

                        </template>

                        <!-- 姓名 生日个人爱好-->
                        <template v-if="currentIndex == index && (item.systemFieldId == 'k101' || item.systemFieldId == 'k104' || item.systemFieldId == 'k401')">

                          <div class="edit-item ">
                            <div class="edit-item-title">类型</div>
                            <template v-for="(types,ind) in item.ruleContent">
                              <el-checkbox v-model="types.checked=='checked'? true:false" :disabled="types.isEdit==0? true: false">{{types.name}}</el-checkbox>
                            </template>
                          </div>
                          <div class="edit-item ">
                            <div class="edit-item-title">长度限制</div>
                            <el-input v-model="item.limitCountMin" placeholder="" disabled class="w-120"></el-input>
                            <label class="label-txt">至</label>
                            <el-input v-model="item.limitCountMax" placeholder="" disabled class="w-120"></el-input>
                            <label class="label-txt">位字符</label>
                          </div>

                        </template>
                        <!-- 性别 -->
                        <template v-if="currentIndex == index && item.systemFieldId == 'k102'">
                          <div class="edit-item ">
                            <div class="edit-item-title">类型</div>
                            <template v-for="(types,ind) in item.ruleContent">
                              <el-radio v-model="types.checked" :label="types.checked">{{types.name}}</el-radio>
                            </template>

                          </div>
                          <div class="edit-item ">
                            <div class="edit-item-title">选项</div>
                            <!-- <div>
                              <el-input class="w-340" v-model="item.male" placeholder="" disabled></el-input>
                            </div>
                            <div class="margin-t-15">
                              <el-input class="w-340" v-model="item.female" placeholder="" disabled></el-input>
                            </div> -->
                            <template v-for="(types,ind) in item.fieldContent">
                              <div class="margin-t-15" :style="ind==0? 'margin-top:0':''">
                                <add-input :inputValue="types.name" :disFlag="1" :maxLength="10" @itemInput="itemInput"></add-input>
                              </div>
                            </template>
                          </div>
                        </template>

                        <!-- 生日103  结婚纪念日204-->
                        <template v-if="currentIndex == index && (item.systemFieldId == 'k103'||item.systemFieldId == 'k204')">
                          <div class="edit-item " >
                            <div class="edit-item-title">数字</div>
                            <template v-for="(types,ind) in item.ruleContent">
                              <el-checkbox v-model="types.checked=='checked'? true:false" :disabled="types.isEdit==0? true: false">{{types.name}}</el-checkbox>
                            </template>
                          </div>
                          <div class="edit-item ">
                            <div class="edit-item-title">长度限制</div>
                            <el-input v-model="item.limitCountMin" placeholder="" disabled class="w-120"></el-input>
                            <label class="label-txt">至</label>
                            <el-input v-model="item.limitCountMax" placeholder="" disabled class="w-120"></el-input>
                            <label class="label-txt">位字符</label>
                          </div>      
                          <div class="edit-item " v-show="item.systemFieldId == 'k103'" >
                            <div class="edit-item-title">设置农历生日<el-popover width="200" trigger="hover" content="开启后用户可手动选择填写农历或阳历生日，不开启则默认用户填写生日为阳历生日" placement="top">
                              <i slot="reference" class="el-icon-question"></i></el-popover>
                            </div>
                            <el-switch v-model="item.fieldContent.birthType"></el-switch>
                            <div class="edit-item-title">年龄范围<el-popover width="215" trigger="hover" content="例：若用户填写年龄范围为0-10岁，则小程序端用户填写的生日年份只能为当前年份往前推10年内" placement="top">
                              <i slot="reference" class="el-icon-question"></i></el-popover>
                            </div>
                            <el-input-number class="w-120 my-input-number" :controls="false" v-model="item.fieldContent.sectionMin" min="0" max="99"></el-input-number>
                            <label class="label-txt">至</label>
                            <el-input-number class="w-120 my-input-number" type="number" :controls="false" v-model="item.fieldContent.sectionMax" :min="item.fieldContent.sectionMin" max="99"></el-input-number>
                            <label class="label-txt">岁</label>
                          </div>
                        </template>

                        <!-- 文化程度 婚姻状况 是否有房 是否有车-->
                        <template v-if="currentIndex == index && (item.systemFieldId == 'k105'|| item.systemFieldId == 'k201' || item.systemFieldId == 'k202' || item.systemFieldId == 'k301' || item.systemFieldId == 'k302')">
                          <div class="edit-item ">
                            <div class="edit-item-title">类型</div>
                            <template v-for="(types,ind) in item.ruleContent">
                              <el-radio v-model="types.checked" :label="types.checked">{{types.name}}</el-radio>
                            </template>
                          </div>
                          <div class="edit-item ">
                            <div class="edit-item-title">选项</div>
                            <template v-for="(types,ind) in item.fieldContent">
                              <div class="margin-t-15" :style="ind==0? 'margin-top: 0':''">
                                <add-input :inputValue="types.name" :disFlag="1" :maxLength="10" @itemInput="itemInput"></add-input>
                              </div>
                            </template>
                          </div>
                        </template>

                        <!-- 邮箱 -->
                        <template v-if="currentIndex == index && item.systemFieldId == 'k106'">
                          <div class="edit-item ">
                            <div class="edit-item-title">类型</div>
                            <template v-for="(types,ind) in item.ruleContent">
                              <el-checkbox v-model="types.checked=='checked'? true:false" :disabled="types.isEdit==0? true: false">{{types.name}}</el-checkbox>
                            </template>
                          </div>
                        </template>

                        <!-- 婚姻状况 文化程度相同 是否有房 是否有车-->

                        <!-- 宝宝信息  isMult  //是否支持复合 例如宝宝信息可以多条记录（0：不支持，1：支持）-->
                        <template v-if="currentIndex == index && item.isMult == 1 && item.systemFieldId == 'k203'">
                          <div class="edit-item ">
                            <div class="edit-item-title">标题最多10个字</div>
                              <el-checkbox-group v-model="item.babyIds">
                                <template v-for="(nameItem,idx) in nameList" >
                                  <div class="checkbox-cell">
                                    <el-checkbox :label="nameItem.fieldId" >{{ }}</el-checkbox>
                                    <el-input class="w-316" v-model="nameItem.fieldName" placeholder="" disabled></el-input>
                                  </div>
                                </template>
                              </el-checkbox-group>
                          </div>
                        </template>

                        <!-- 结婚街纪念日 生日 相同 -->
                        <!-- 是否有房 是否有车 文化程度 婚姻状况 相同-->

                        <!-- 年收入 购物周期  喜好的礼品-->
                        <template v-if="currentIndex == index && (item.systemFieldId == 'k303' ||item.systemFieldId == 'k403' || item.systemFieldId == 'k404' || (item.systemFieldId == '-1'&&item.fieldType=='3') || (item.systemFieldId == '-1'&&item.fieldType=='1'))">
                          <template v-if="item.ruleContent.length"><!-- v-if="item.systemFieldId == 'k303' || item.systemFieldId == 'k403' || item.systemFieldId == 'E1'"-->
                            <div class="edit-item ">
                              <div class="edit-item-title">类型</div>
                              <!-- 单选 -->
                              <template v-if="item.fieldType == 2||item.fieldType == 3">
                                <template v-for="(types,ind) in item.ruleContent">
                                  <el-radio v-model="types.checked" :label="types.checked">{{types.name}}</el-radio>
                                </template>
                              </template>
                              <!-- 多选 -->
                              <template v-if="item.fieldType == 1">
                                <template v-for="(types,ind) in item.ruleContent">
                                  <el-checkbox v-model="types.checked=='checked'? true:false" :disabled="types.isEdit==0? true: false">{{types.name}}</el-checkbox>
                                </template>
                              </template>
                            </div>
                          </template>
                          <!-- <template v-if="item.systemFieldId == 'k404' || item.systemFieldId == 'E2'">
                            <div class="edit-item ">
                            <div class="edit-item-title">类型</div>
                            <template v-for="(types,ind) in item.ruleContent">
                              <el-checkbox v-model="types.checked=='checked'? true:false" :disabled="types.isEdit==0? true: false">{{types.name}}</el-checkbox>
                            </template>
                          </div>
                          </template> -->
                          <div class="edit-item ">
                            <div class="edit-item-title">选项 <span v-if="item.systemFieldId == 'k404'||(item.systemFieldId == '-1'&&item.fieldType=='1')">最多20项，每项最多10个字</span> <span v-if="item.systemFieldId != 'k404' && (item.systemFieldId == 'k403'||item.systemFieldId == 'k303' || item.systemFieldId == '-1'&&item.fieldType=='3')">最多5项，每项最多10个字</span></div>
                            <template v-for="(types,ind) in item.fieldContent">
                              <div class="margin-t-15" :style="ind==0? 'margin-top: 0':''">
                                <add-input :inputValue="types.name" :childIndex="ind" :childItem="(item.systemFieldId == 'k403'||item.systemFieldId == 'k303' || item.systemFieldId == 'k404' || (item.systemFieldId == '-1'&&item.fieldType=='3') || (item.systemFieldId == '-1'&&item.fieldType=='1'))? 'k303':''"  :disFlag="0" :maxLength="10" @itemInput="itemInput"></add-input>
                                <i class="opt-btn el-icon-remove del-item" v-if="item.fieldContent.length>1" @click="delChildItem(index,ind,item)"></i>
                                <template v-if="((item.systemFieldId == 'k404'||(item.systemFieldId == '-1' && item.fieldType==1)) && ind < 19)">
                                  <i class="opt-btn el-icon-circle-plus add-item" v-if="ind == item.fieldContent.length-1" @click="addChildItem(index,ind,item)"></i>
                                </template>
                                <template v-if="((item.systemFieldId == 'k403'||item.systemFieldId == 'k303' || (item.systemFieldId == '-1'&&item.fieldType=='3')) && ind < 4)">
                                  <i class="opt-btn el-icon-circle-plus add-item" v-if="ind == item.fieldContent.length-1" @click="addChildItem(index,ind,item)"></i>
                                </template>
                              </div>
                            </template>
                          </div>
                        </template>

                        <!-- 期望消息推送 -->
                        <template v-if="currentIndex == index && item.systemFieldId == 'k402'">

                          <div class="edit-item ">
                            <div class="edit-item-title">类型</div>
                            <template v-for="(types,ind) in item.ruleContent">
                              <el-checkbox v-model="types.checked=='checked'? true:false" :disabled="types.isEdit==0? true: false">{{types.name}}</el-checkbox>
                            </template>
                          </div>
                          <div class="edit-item ">
                            <div class="edit-item-title">选项</div>
                            <template v-for="(types,ind) in item.fieldContent">
                              <div class="margin-t-15" :style="ind==0? 'margin-top: 0':''">
                                <add-input :inputValue="types.name" :disFlag="1" :maxLength="10" @itemInput="itemInput"></add-input>
                              </div>
                            </template>
                          </div>
                        </template>

                        <!-- 自定义字段 -->
                         <!-- 单行输入框-->
                        <template v-if="currentIndex == index && item.systemFieldId == -1&&item.fieldType==0">
                          <div class="edit-item ">
                            <div class="edit-item-title">类型</div>
                            <template v-for="(types,ind) in item.ruleContent">
                              <el-checkbox v-model="types.select" @change="changeCheck($event,ind,item.type)">{{types.name}}</el-checkbox>
                            </template>
                          </div>
                          <div class="edit-item ">
                            <div class="edit-item-title">长度限制</div>
                            <el-input v-model="item.limitCountMin" placeholder="" @focus="inputFocus('limitCountMin',item)" @keyup.native="formatInput($event)" class="w-120"></el-input>
                            <label class="label-txt">至</label>
                            <el-input v-model="item.limitCountMax" placeholder="" @focus="inputFocus('limitCountMax',item)" @keyup.native="formatInput($event)" class="w-120"></el-input>
                            <label class="label-txt">位字符</label>
                          </div>

                        </template>
                        <!-- 自定义日期 -->
                        <template v-if="currentIndex == index && item.systemFieldId == -1&& item.fieldType==4">

                          <div class="edit-item ">
                            <div class="edit-item-title">类型</div>
                            <template v-for="(types,ind) in item.ruleContent">
                              <el-radio v-model="item.typeValue" :label="types.name" @change="changeRadio($event,ind,item)">{{types.name}}</el-radio>
                            </template>
                          </div>
                        </template>

                        <!-- 公共 -->
                        <template v-if="currentIndex == index &&(item.systemFieldId != '-1' || (item.systemFieldId == '-1'&&item.fieldType!=5))">
                          <div class="edit-item ">
                            <div class="edit-item-title">验证</div>
                            <el-checkbox v-model="item.isMust" >必填</el-checkbox>
                          </div>
                          <!-- 生日时才有 -->
                          <template v-if="item.modifyLimitFlag == 1 ">
                            <div class="edit-item ">
                              <div class="edit-item-title">修改次数限制</div>
                              <div class="margin-t-0">
                                <el-radio v-model="item.modifyLimitStatus" label="0">最多修改</el-radio>
                                <el-input class="w-60" v-model="item.modifyTimesLimit" placeholder=""></el-input>
                                <label class="el-radio__label">次</label>
                              </div>
                              <div class="margin-t-15">
                                <el-radio v-model="item.modifyLimitStatus" label="1">每月最多修改1次</el-radio>
                              </div>
                              <div class="margin-t-15">
                                <el-radio v-model="item.modifyLimitStatus" label="2">每年最多修改1次</el-radio>
                              </div>
                            </div>
                          </template>
                          <div class="edit-item " style="display: none;">
                            <div class="edit-item-title">适用商户</div>
                            <div class="edit-item-checkbox">
                              <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll" @change="checkAllChange($event,item)" class="margin-b-15">全选</el-checkbox>
                            </div>
                            <el-checkbox-group v-model="item.enterpriseIds" @change="checkedChange($event,item)">
                              <!-- 商户列表 -->
                              <template v-for="(merchantItem,idx) in merchantOptions">
                                <div class="checkbox-cell">
                                  <el-checkbox :label="merchantItem.enterpriseId" :key="merchantItem.id">
                                  <el-input class="w-316" v-model="merchantItem.name" placeholder="" disabled></el-input></el-checkbox>
                                </div>
                              </template>

                            </el-checkbox-group>
                          </div>
                        </template>

                      </template>

                    </div>
                  </div>

              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
import AddInput from '@/components/memberShip/add-input';
import showMsg from '@/common/js/showmsg';
import errMsg  from '@/common/js/error';
import strLength from '@/common/js/strlen';
import { getRequest, postRequest, postJson, postForm } from '@/api/api';

export default {
  name: "memberInfoTemplate",
  data() {
    return {
      // tab
      activeName: 'first',
      // right tab
      rightName: 'first',

      bodyHeight: document.body.clientHeight,

      // option
      isDragging: false,
      delayedDragging: false,
      // leftOption
      leftOption: {
        group: {name:'people', pull:'clone', put:false},
        sort: false,
        disabled: false
      },
      leftDefineOption: {
        group: {name:'people', pull:'clone', put:false},
        sort: false,
        disabled: false
      },
      // rightOption

      // 宝宝生日字段列表
      nameList: [
            {
              fieldDescription: '请输入',
              fieldId: 'k20301',
              fieldName: '宝宝名称',
              fieldType: 0,
              limitCountMax: 20,
              limitCountMin: 1,
            },
            {
              fieldDescription: '请输入',
              fieldId: 'k20302',
              fieldName: '宝宝性别',
              fieldType: 1,
              limitCountMax: 20,
              limitCountMin: 1,
            },
            {
              fieldDescription: '请输入',
              fieldId: 'k20303',
              fieldName: '宝宝生日',
              fieldType: 2,
              limitCountMax: 20,
              limitCountMin: 1,
            },
             {
              fieldDescription: '请输入',
              fieldId: 'k20304',
              fieldName: '宝宝身高(cm)',
              fieldType: 3,
              limitCountMax: 20,
              limitCountMin: 1,
            },
            {
              fieldDescription: '请输入',
              fieldId: 'k20305',
              fieldName: '宝宝体重(kg)',
              fieldType: 4,
              limitCountMax: 20,
              limitCountMin: 1,
            },
            {
              fieldDescription: '请输入',
              fieldId: 'k20306',
              fieldName: '鞋码(码)',
              fieldType: 5,
              limitCountMax: 20,
              limitCountMin: 1,
            },
      ],

      selectKey: '',

      // 基本信息
      baseInfo: [],
      // 家庭信息
      familyInfo:[],
      // 资产信息
      assetInfo: [],
      // 其他信息
      otherInfo: [],
      // 自定义
      defineInfo: [
        {
          systemFieldId: '-1',
          fieldName: '单选框',
          fieldNameCopy: '单选框',
          fieldEdited: 1, // 修改（0：不可修改，1：可修改）
          fieldType: 3,
          fixed: false,
          "isMult": "0",
          "parentFieldId": "-1",
          fieldDescription: '请选择',
          "fieldCode": "-1",
          "regularRule": "0000000",
          "modifyTimesLimit": -1,
          ruleContent: [{'type':'radio','name':'单选', 'checked':'checked','isEdit':1}],
          fieldContent: [
            {'type':'radio','name':'选项1'},
            {'type':'radio','name':'选项2'},
            {'type':'radio','name':'选项3'},
          ],
          limitCountMin: 1,
          limitCountMax: 20,
          "allowEdit": "1001",
          "modifyLimitFlag": "0",
          "modifyLimitStatus": -1,
          isMust: true,
          checkAll: false,
          isIndeterminate: false,
          // enterpriseIds: [],

        },
        {
          systemFieldId: '-1',
          fieldName: '多选框',
          fieldNameCopy:'多选框',
          fieldEdited: 1, // 修改（0：不可修改，1：可修改）
          fieldType: 1,
          fixed: false,
          "isMult": "0",
          "parentFieldId": "-1",
          fieldDescription: '请选择',
          "fieldCode": "-1",
          "limitCountMin": "-1",
          "limitCountMax": "-1",
          "regularRule": "0000000",
          "modifyTimesLimit": -1,
          ruleContent: [{'type':'checkbox','name':'多选', 'checked':'checked','isEdit':0}],
          fieldContent: [
            {'type':'checkbox','name':'选项1'},
            {'type':'checkbox','name':'选项2'},
            {'type':'checkbox','name':'选项3'}
          ],
          isMust: true,
          checkAll: false,
          isIndeterminate: false,
          "allowEdit": "1001",
          "modifyLimitFlag": "0",
          "modifyLimitStatus": -1,
          // enterpriseIds: [],

        },
        {
          systemFieldId: '-1',
          fieldName: '日期',
          fieldNameCopy: '日期',
          fieldEdited: 1, // 修改（0：不可修改，1：可修改）
          fieldType: 4,
          fixed: false,
          "parentFieldId": "-1",
          fieldDescription: '请选择',
          typeValue: '年-月-日',
          "fieldCode": "-1",
          "limitCountMin": "-1",
          "limitCountMax": "-1",
          "regularRule": "0000100",
          "modifyTimesLimit": -1,
          ruleContent:[
            {'type':'radio','name':'年-月-日', 'checked':'checked','isEdit':1},
            {'type':'radio','name':'年-月','isEdit':1}
          ],
          "isMult": "0",
          isMust: true,
          checkAll: false,
          isIndeterminate: false,
          "allowEdit": "1100",
          "modifyLimitFlag": "0",
          "modifyLimitStatus": -1,
          // enterpriseIds: [],

        },
        {
          systemFieldId: '-1',
          fieldName: '单行输入框',
          fieldNameCopy: '单行输入框',
          fieldEdited: 1, // 修改（0：不可修改，1：可修改）
          fieldType: 0,
          fixed: false,
          "parentFieldId": "-1",
          fieldDescription: '请输入',
          "fieldCode": "-1",
          "limitCountMin": "0",
          "limitCountMax": "20",
          "regularRule": "0000000",
          "modifyTimesLimit": -1,
          ruleContent: [
            {'type':'checkbox','name':'中文', select: false, 'checked':'checked','isEdit':1},
            {'type':'checkbox','name':'数字', select: false, 'checked':'checked','isEdit':1},
            {'type':'checkbox','name':'字母', select: false, 'checked':'checked','isEdit':1},
            {'type':'checkbox','name':'符号', select: false, 'checked':'checked','isEdit':1}
          ],
          "isMult": "0",
          limitCountMin: 1,
          limitCountMax: 20,
          isMust: true,
          checkAll: false,
          isIndeterminate: false,
          "allowEdit": "1110",
          "modifyLimitFlag": "0",
          "modifyLimitStatus": -1,
          // enterpriseIds: [],

        },
        {
          systemFieldId: '-1',
          fieldName: '组块',
          fieldNameCopy: '组块',
          "fieldContent": "-1",
          "fieldDescription": "请输入",
          "parentFieldId": "ff8080816396562e016396605c450001",
          fieldType: 5,
          fieldEdited: 1, // 修改（0：不可修改，1：可修改）
          fixed: false,
          "isMult": "0",
          "isMust": "1",
          fieldDescription: '',
          sonList:[
          ],
          "fieldCode": "-1",
          "limitCountMin": "-1",
          "limitCountMax": "-1",
          "regularRule": "0000000",
          "modifyTimesLimit": -1,
          "ruleContent": "-1",
          "allowEdit": "0000",
          "modifyLimitFlag": "0",
          "modifyLimitStatus": -1,
          // enterpriseIds:''
        }
      ],

      // 中间数据集合
      currentIndex: 0, //当前选择的 item
      currentKey: '', // 当前选择的 item key
      tempaletDataList:[],

      // sonlist
      currentChildIndex: null,
      childIndex: 0,

      //商户列表
      merchantOptions: [],//

      // 已经选择的字段集合
      setList: [],

      contactBool:false,  // 是否关联集团

      smallWiath:'860px',


    }
  },
  created() {
    // this.selectReplayStyle()
  },
  methods: {
    // baseInfoClone
    baseInfoClone() {
      var that = this
      // that.baseInfo = JSON.parse(JSON.stringify(that.baseInfo))
    },

    inputFocus(tag,obj){
      var that = this
      that.tempTag = tag;
      that.tempObj = obj;

    },
    formatInput(e){
      var that = this
      that.tempObj[that.tempTag] = String(e.target.value).replace(/[^\d]/g,'')
      // 判断最大值和最小值
      if (that.tempObj['limitCountMin'] >= that.tempObj['limitCountMax']) {
        that.$message.error({
          duration: 1000,
          message: "长度限制格式有误"
        })
        // 重新赋值
        that.tempObj['limitCountMax'] = 20 + parseInt(that.tempObj['limitCountMin'])
      }
    },
    // 点击 item
    clickItem(item) {
      var that = this
      console.log(item)
      // item.fixed = !item.fixed
    },

    // move{relatedContext, draggedContext}
    onMove (evt) {
      if (evt.to.className.indexOf('block-wrap') != -1) {
        var tag = false
        return tag
      }
      const relatedElement = evt.relatedContext.element;
      const draggedElement = evt.draggedContext.element;
      return !draggedElement.fixed
    },

    // move child
    onChildMove(evt){
      var that = this
      var tag = true;
      if (evt.dragged.className.indexOf('block-class') != -1 ) {
        if (evt.to.className.indexOf('block-wrap') != -1) {
          tag = false
        }
      }
      return tag
    },

    // move end
    itemMoveEnd(evt) {
      var that = this
      that.isDragging = false;
      that.selectKey = '';
      that.selectKey = evt.clone.dataset.type
      // 判断中间是否已经添加
      that.tempaletDataList.forEach(function(ele,index){
        if (ele.systemFieldId == that.selectKey) {
          setKey()
        }
      })

      function setKey() {
        if (that.selectKey.indexOf('k10') !=-1) {
          that.baseInfo.forEach(function(ele,index){
            if (ele.systemFieldId == that.selectKey) {
              ele.fixed = true
            }
          })
          return;
        }
        if (that.selectKey.indexOf('k20') !=-1) {
          that.familyInfo.forEach(function(ele,index){
            if (ele.systemFieldId == that.selectKey) {
              ele.fixed = true
            }
          })
          return;
        }
        if (that.selectKey.indexOf('k30') !=-1) {
          that.assetInfo.forEach(function(ele,index){
            if (ele.systemFieldId == that.selectKey) {
              ele.fixed = true
            }
          })
          return;
        }
        if (that.selectKey.indexOf('k40') !=-1) {
          that.otherInfo.forEach(function(ele,index){
            if (ele.systemFieldId == that.selectKey) {
              ele.fixed = true
            }
          })
          return;
        }
        // 自定义暂时不限制
        // if (that.selectKey.indexOf('E') !=-1) {
        //   that.defineInfo.forEach(function(ele,index){
        //     if (ele.key == that.selectKey) {
        //       ele.fixed = true
        //     }
        //   })
        //   return;
        // }
      }

      that.selectKey = '';
      that.tempaletDataList = JSON.parse(JSON.stringify(that.tempaletDataList))
    },

    cloneDefine(evt) {
      var that = this
    },

    // 中间部分方法
    // 选择 item
    selectItem(key,index) {
      var that = this
      that.currentKey = key;
      that.currentIndex = index;
      that.currentChildIndex = null;
    },

    // 删除 item
    deleteItem(key,index) {
      var that = this
      that.tempaletDataList.splice(index,1)
      that.currentIndex --;

      if (that.currentIndex <= 0) {
        that.currentIndex = 0;
      }
      if (that.tempaletDataList.length) {
        that.currentKey = that.tempaletDataList[that.currentIndex].systemFieldId;
      }
      // 删除后重新设置 fixed 值
      if (key.indexOf('k10') != -1) {
        that.baseInfo.forEach(function(ele,index){
          if (ele.systemFieldId == key) {
            ele.fixed = false
          }
        })
      }
      if (key.indexOf('k20') != -1) {
        that.familyInfo.forEach(function(ele,index){
          if (ele.systemFieldId == key) {
            ele.fixed = false
          }
        })
      }
      if (key.indexOf('k30') != -1) {
        that.assetInfo.forEach(function(ele,index){
          if (ele.systemFieldId == key) {
            ele.fixed = false
          }
        })
      }
      if (key.indexOf('k40') != -1) {
        that.otherInfo.forEach(function(ele,index){
          if (ele.systemFieldId == key) {
            ele.fixed = false
          }
        })
      }
    },

    // 添加 item
    addItem(evt) {
      var that = this;
    },

    // 添加child
    addDragItem(evt) {
      var that = this;
      return false;
    },

    // 组块
    selectChildItem(key,index,ind,list) {
      var that = this
      that.currentKey = key;
      that.currentIndex = null;
      that.childIndex = index
      that.currentChildIndex = ind;
    },
    deleteChildItem(key,index,ind,list) {
      var that = this
      that.childIndex = index
      // list.splice(ind,1)
      that.tempaletDataList = JSON.parse(JSON.stringify(that.tempaletDataList))
      that.tempaletDataList[index].sonList.splice(ind,1)
    },

    //右侧方法

    // 全选
    checkAllChange(e,item){
      var that = this
      if (e) {
        that.merchantOptions.forEach(function(el,index) {
          item.enterpriseIds.push(el.enterpriseId)
        })
      }else {
        item.enterpriseIds = []
      }
      // item.enterpriseIds = (e==true ? that.merchantOptions: []);
      item.isIndeterminate = false;
    },
    checkedChange(e,item){
      var that = this
      let count = e.length;
      item.checkAll = (count == that.merchantOptions.length);
      item.isIndeterminate  = count > 0 && count< that.merchantOptions.length
    },

    // 添加删除选项
    delChildItem(index,ind,item) {
      var that = this
      item.fieldContent.splice(ind,1)
    },
    addChildItem(index,ind,item) {
      var that = this
      item.fieldContent.forEach(function(ele,index) {
        if (ele.name) {}
      })
      // 多选
      if (item.systemFieldId == "k404"|| item.systemFieldId == '-1'&&item.fieldType==1) {
        if (ind == 19) {
          that.$message.error({
            duration: 1000,
            message: "最多可添加 20 项"
          })
        }else {
          if (item.systemFieldId == '-1'&&item.fieldType==1){
            item.fieldContent.push(
              {'type':'checkbox','name':'请输入选项'},
            )
            // 判断重复字段
            var arrValues = item.fieldContent.map(ite=>ite.name) // 返回对象中键值集合的数组
            if (that.isRepeat(arrValues)) {
              item.fieldContent.splice(item.fieldContent.length-1,1)
              arrValues.splice(item.fieldContent.length-1,1)
              that.$message.error({
                duration: 1000,
                message: "选项不能重复"
              })
              return;
            }
            return;
          }
          item.fieldContent.push(
            {'type':'checkbox','name':'请输入选项'},
          )

          // 判断重复字段
          var arrValues = item.fieldContent.map(ite=>ite.name) // 返回对象中键值集合的数组
          if (that.isRepeat(arrValues)) {
            item.fieldContent.splice(item.fieldContent.length-1,1)
            arrValues.splice(item.fieldContent.length-1,1)
            that.$message.error({
              duration: 1000,
              message: "选项不能重复"
            })
            return;
          }

        }
        return;
      }

      // 单选
      if (ind == 4) {
        that.$message.error({
          duration: 1000,
          message: "最多可添加 5 项"
        })
        return;
      }

      item.fieldContent.push(
        {'type':'radio','name':'请输入选项'},
      )
      // 判断重复字段
      var arrValues = item.fieldContent.map(ite=>ite.name) // 返回对象中键值集合的数组
      if (that.isRepeat(arrValues)) {
        item.fieldContent.splice(item.fieldContent.length-1,1)
        arrValues.splice(item.fieldContent.length-1,1)
        that.$message.error({
          duration: 1000,
          message: "选项不能重复"
        })
        return;
      }

    },

    // 改变输入框的值,子组件触发方法
    itemInput(val) {
      var that = this
      // 判断组块子级
      if (!!val && val.child == 'child') {
        // 如果是标题
        if (!!val && val.title == 'title') {
          that.tempaletDataList[that.childIndex].sonList[that.currentChildIndex].fieldName = val.value;
          return;
        }
        // 如果是/
        if (!!val && val.flag == 'k303') {
          that.tempaletDataList[that.childIndex].sonList[that.currentChildIndex].fieldContent[val.c3Index].name = val.value;
          return;
        }
        that.tempaletDataList[that.childIndex].sonList[that.currentChildIndex].fieldDescription = val.value;

        return;
      }

      // 如果是标题
      if (!!val && val.title == 'title') {
        that.tempaletDataList[that.currentIndex].fieldName = val.value;
        return;
      }
      // 如果是年收入/
      if (!!val && val.flag == 'k303') {
        that.tempaletDataList[that.currentIndex].fieldContent[val.c3Index].name = val.value;
        return;
      }
      that.tempaletDataList[that.currentIndex].fieldDescription = val;
    },


    // 自定义复选(单行输入框)
    changeCheck(e,ind,item) {
      var that = this
      // item[ind].checked = e
      // if (e) {
      //   item[ind].checked = 'unchecked'
      // }else {
      //   item[ind].checked ='checked';
      // }

    },

    // 自定义单选(日期)
    changeRadio(e,ind,item) {
      var that = this
      if (e ="") {
        item[ind]
      }
    },

    // 判断添加重复字段
    isRepeat(arr) {
      var hash = {};
      for(var i in arr) {
        if(hash[arr[i]]){
           return true;
         }
         hash[arr[i]] = true;
      }
      return false;
    },


    //路由跳转
    changeRoute(route) {
      this.$router.push(route);
    },

    // 检查
    checkTag(data) {
      var that = this
      var tag = {}
      tag.flag = true;
      tag.bodyFlag = true;
      tag.filedFlag = true;
      data.forEach(function(ele,index){
        ele.isMust = ele.isMust == true? 1: 0; //是否必填（0：不是，1：必填）
        ele.sortNum = index + 1; //排序
        if (ele.fieldName == '') {
          tag.filedFlag = false
          tag.name = ele.fieldName || ''
          return false;
        }
        // if (!!ele.enterpriseIds && (ele.enterpriseIds == null || !ele.enterpriseIds.length)) {
        //   tag.flag = false
        //   tag.name = ele.fieldName
        // }
        if (ele.systemFieldId == 'k203' && !ele.babyIds.length) {
          tag.bodyFlag = false
          tag.name = ele.fieldName || '宝宝'
        }
        // 判断组块
        if (ele.systemFieldId == -1 && ele.fieldType == 5 ) {
          ele.sonList.forEach(function(el,index){
            if (el.fieldName == '') {
              tag.filedFlag = false
              tag.name = el.fieldName || ''
              return false;
            }
            // if (el.enterpriseIds == null || !el.enterpriseIds.length) {
            //   tag.flag = false
            //   tag.name = el.fieldName
            // }
          })
        }
      })
      return tag
    },

    guid() {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    },

    // 保存
    saveAndBack() {
      var that = this
      var data = JSON.parse(JSON.stringify(that.tempaletDataList))
      if (!data||!data.length) {
        that.$message.error({
          duration: 1000,
          message: '请配置开卡字段'
        })
        return;
      }

      var tagObj = that.checkTag(data)
      //console.log(tagObj)
      // 检查商户选中
      // if (!tagObj.flag) {
      //   that.$message.error({
      //     duration: 1000,
      //     message: tagObj.name+'字段至少选择一个商户'
      //   })
      //   return;
      // }
      // 检查空字段
      if (!tagObj.filedFlag) {
        that.$message.error({
          duration: 1000,
          message: tagObj.name+'字段标题不能为空'
        })
        return;
      }
      if (!tagObj.bodyFlag) {
        that.$message.error({
          duration: 1000,
          message: '宝宝信息字段选项不能为空'
        })
        return;
      }
      data.forEach(function(ele,index){
        ele.isMust = ele.isMust == true? 1: 0; //是否必填（0：不是，1：必填）
        // 判断可修改
        ele.fieldEdited = ele.fieldEdited==true? 1:0
        ele.sortNum = index + 1; //排序
        // if (!!ele.enterpriseIds && ele.enterpriseIds.length) {
        //   ele.enterpriseIds = ele.enterpriseIds.join(',')
        // }

        if (ele.babyIds) {
          ele.babyIds = ele.babyIds.join(',')
        }

        if (ele.fieldContent) {
          ele.fieldContent = JSON.stringify(ele.fieldContent)
        }

        if (ele.ruleContent) {
          ele.ruleContent = JSON.stringify(ele.ruleContent)
        }

        if (ele.systemFieldId != -1||(ele.systemFieldId == -1)&&ele.fieldType != 5) {
          ele.parentFieldId = '-1';
        }

        // 日期
        if (ele.systemFieldId == -1 && ele.fieldType == 4) {
          if (ele.typeValue == "年-月") {
            ele.regularRule = '0000010';
          }else{
            ele.regularRule = '0000100';
          }
        }

        // 组块:把子对象放到和组块同级中
        if (ele.systemFieldId == -1 && ele.fieldType == 5 ) {
          var newIdsArray = [];
          var uuid = that.guid();
          ele.parentFieldId = uuid; // 32 位 uuid
          ele.sonList.forEach(function(el,index){
            el.isMust = el.isMust == true? 1: 0; //是否必填（0：不是，1：必填）
            el.sortNum = index + 1; //排序
            // newIdsArray = newIdsArray.concat(el.enterpriseIds)
            // el.enterpriseIds = el.enterpriseIds.join(',')
            el.parentFieldId = uuid;
            data.push(el)
          })

          // ele.enterpriseIds = [...new Set(newIdsArray)].join(',') || []
          // console.log(">>>>>>>>>>>:",ele.enterpriseIds)

        }
        // 生日  农历  新增
        if(ele.systemFieldId=="k103"){
          ele.fieldContent = JSON.parse(ele.fieldContent);
          ele.fieldContent.birthType = ele.fieldContent.birthType?0:1;
          ele.fieldContent.sectionMin = ele.fieldContent.sectionMin>-1?Number(ele.fieldContent.sectionMin):-1;
          ele.fieldContent.sectionMax = ele.fieldContent.sectionMax>-1?Number(ele.fieldContent.sectionMax):-1;
          ele.fieldContent.timeFlag = ele.fieldContent.sectionMin==-1&&ele.fieldContent.sectionMax==-1?1:3;
        }
      })
      // 判断重复字段
      var flagArr = data.map(item=>item.fieldName)
      if (that.isRepeat(flagArr)) {
        that.$message.error({
          duration: 1000,
          message: '标题字段名不能重复'
        })
        return;
      }
      // 判断组块
      // var tagBlock = that.checkTag(data)
      // if (!tagBlock.flag) {
      //   that.$message.error({
      //     duration: 1000,
      //     message: tagBlock.name+'字段至少选择一个商户'
      //   })
      //   return;
      // }
      // return;
      that.saveAllData(data)
    },

    // 保存数据
    saveAllData(data) {
      var para =  {
        params: JSON.stringify(data)
      }
      postRequest('/api-admin/save-card-filed-template',para)
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {
          this.$router.push('/memberCardSet');
          showMsg.showmsg('保存成功','success')
          return;
        }
        errMsg.errorMsg(resData)

      })
      .catch(function (error) {
        console.log(error);
      });
    },

    // 获取模板所有字段
    getTempInfo() {
      var that = this
      var para = {

      }
      postRequest('/api-admin/member-card-filed-template',para)
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {

          var data = resData.result.cateList
          data.forEach(function(el,ind){
            el.fieldList.forEach(function(ele,index){
              if (!!ele.fieldContent && ele.fieldContent != -1) {
                if (ele.fieldContent.indexOf("'") != '-1') {
                  ele.fieldContent = JSON.parse(ele.fieldContent.replace(/'/g, '"'))
                }else {
                  ele.fieldContent = JSON.parse(ele.fieldContent)
                }
                // ele.fieldContent = JSON.parse(ele.fieldContent.replace(/'/g, '"'))

              }
              if (!!ele.ruleContent && ele.ruleContent != -1) {
                if (ele.ruleContent.indexOf("'") != '-1') {
                  ele.ruleContent = JSON.parse(ele.ruleContent.replace(/'/g, '"'))
                }else {
                  ele.ruleContent = JSON.parse(ele.ruleContent)
                }
                // ele.ruleContent = JSON.parse(ele.ruleContent.replace(/'/g, '"'))
              }

              // 判断必选
              ele.isMust = ele.isMust==1? true:false

              // 判断可修改
              ele.fieldEdited = ele.fieldEdited==1? true:false

              // 判断商户全选
              // if (!!ele.enterpriseIds && ele.enterpriseIds != ''&& ele.enterpriseIds != null && !!ele.enterpriseIds.length) {
              //   // console.log(ele.enterpriseIds)
              //   ele.enterpriseIds = ele.enterpriseIds.split(',')
              // }else{
              //   ele.enterpriseIds = []
              // }

              // console.log(ele.enterpriseIds)

              // ele.isIndeterminate = false;

              // if (!!ele.enterpriseIds&&ele.enterpriseIds.length == that.merchantOptions.length) {
              //   ele.checkAll = true;
              // }else {
              //   ele.checkAll = false;
              // }

              // if (!!ele.enterpriseIds&&!!ele.enterpriseIds.length&&ele.enterpriseIds.length < that.merchantOptions.length){
              //   ele.isIndeterminate = true;
              // }

              // 字段不一样,统一下字段
              if (!ele.systemFieldId) {
                ele.systemFieldId = ele.opencardFieldId
              }

              // 判断禁用 fixed 字段
              // console.log(that.setList)
              if (that.setList.indexOf(ele.systemFieldId)!=-1) {
                ele.fixed = true
              }else{
                ele.fixed = false;
              }

              // 如果是 k10开头
              if (ele.systemFieldId.indexOf('k10') != -1) {
                that.baseInfo.push(ele)
              }
              // 如果是 k20开头
              if (ele.systemFieldId.indexOf('k20') != -1) {
                // 宝宝信息
                if (ele.systemFieldId == 'k203') {
                  ele.babyIds = []
                }
                that.familyInfo.push(ele)
              }
              // 如果是 k30开头
              if (ele.systemFieldId.indexOf('k30') != -1) {
                that.assetInfo.push(ele)
              }
              // 如果是 k40开头
              if (ele.systemFieldId.indexOf('k40') != -1) {
                that.otherInfo.push(ele)
              }
              // 自定义不是从接口返回
              // if (ele.systemFieldId == -1) {
              //   that.defineInfo.push(ele)
              // }
            })
          })
          // showMsg.showmsg('设置成功','success')
          return;
        }
        errMsg.errorMsg(resData)

      })
      .catch(function (error) {
        console.log(error);
      });
    },

    // 获取已经保存模板信息
    getInfo() {
      var that = this
      var para = {}
      postRequest('/api-admin/get-card-field-template-detail',para)
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {
          that.setList = [];
          var data = resData.result
          data.forEach(function(ele,index){
            if (!!ele.fieldContent && ele.fieldContent != -1) {
              if (ele.fieldContent.indexOf("'") != '-1') {
                ele.fieldContent = JSON.parse(ele.fieldContent.replace(/'/g, '"'))
              }else {
                ele.fieldContent = JSON.parse(ele.fieldContent)
              }
            }
            if (!!ele.ruleContent && ele.ruleContent != -1) {
              if (ele.ruleContent.indexOf("'") != '-1') {
                ele.ruleContent = JSON.parse(ele.ruleContent.replace(/'/g, '"'))
              }else {
                ele.ruleContent = JSON.parse(ele.ruleContent)
              }

              if (ele.systemFieldId==-1 && ele.fieldType == 0) {
                ele.ruleContent.forEach(function(el,ind){
                  el.select = el.select == 1? true:false
                })
              }
            }

            // 判断必选
            ele.isMust = ele.isMust==1? true:false
            // 判断可修改
            ele.fieldEdited = ele.fieldEdited==1? true:false

            // 判断商户全选
            // if (!!ele.enterpriseIds&&ele.enterpriseIds != ''&& ele.enterpriseIds != null) {
            //   ele.enterpriseIds = ele.enterpriseIds.split(',')
            // }
            // if (!!ele.enterpriseIds&&ele.enterpriseIds.length == that.merchantOptions.length) {
            //   ele.checkAll = true;
            // }else {
            //   ele.checkAll = false;
            // }


            // 判断半选
            // ele.isIndeterminate = false;

            // if (!!ele.enterpriseIds&&ele.enterpriseIds.length == that.merchantOptions.length) {
            //   ele.checkAll = true;
            // }else {
            //   ele.checkAll = false;
            // }

            // if (!!ele.enterpriseIds&&!!ele.enterpriseIds.length&&ele.enterpriseIds.length < that.merchantOptions.length){
            //   ele.isIndeterminate = true;
            // }

            // 如果是生日
            if(ele.modifyLimitStatus != '' || ele.modifyLimitStatus==0){
              ele.modifyLimitStatus = String(ele.modifyLimitStatus)
            }

            // 宝宝信息
            if (!!ele.babyIds) {
              ele.babyIds = ele.babyIds.split(',')
            }else {
              ele.babyIds = []
            }
            // 判断禁用,把已经获取的字段添加到数组中,以后判断是否禁用
            that.setList.push(ele.systemFieldId)

            // 日期
            if (ele.systemFieldId == -1 && ele.fieldType == 4) {
              if (ele.regularRule == '0000010') {
                ele.typeValue = "年-月";
              }else{
                ele.typeValue = "年-月-日";
              }
            }
            // 判断组块
            if (ele.systemFieldId == -1 && ele.fieldType == 5 ) {
              if (ele.sonList == null || !ele.sonList) {
                ele.sonList  = []
              }
              if (!!ele.sonList&&ele.sonList.length) {
                ele.sonList.forEach(function(el,index){
                  if (!!el.fieldContent && el.fieldContent != -1) {
                    if (el.fieldContent.indexOf("'") != '-1') {
                      el.fieldContent = JSON.parse(el.fieldContent.replace(/'/g, '"'))
                    }else {
                      el.fieldContent = JSON.parse(el.fieldContent)
                    }
                    //el.fieldContent = JSON.parse(el.fieldContent.replace(/'/g, '"'))

                  }
                  if (!!el.ruleContent && el.ruleContent != -1) {
                    if (el.ruleContent.indexOf("'") != '-1') {
                      el.ruleContent = JSON.parse(el.ruleContent.replace(/'/g, '"'))
                    }else {
                      el.ruleContent = JSON.parse(el.ruleContent)
                    }
                    // el.ruleContent = JSON.parse(el.ruleContent.replace(/'/g, '"'))
                  }

                  // 判断必选
                  el.isMust = el.isMust==1? true:false

                  // 判断商户全选
                  // if (!!el.enterpriseIds&&el.enterpriseIds != ''&& el.enterpriseIds != null) {
                  //   el.enterpriseIds = el.enterpriseIds.split(',')
                  // }
                  // if (!!el.enterpriseIds&&el.enterpriseIds.length == that.merchantOptions.length) {
                  //   el.checkAll = true;
                  // }else {
                  //   el.checkAll = false;
                  // }

                  // 日期
                  if (el.systemFieldId == -1 && el.fieldType == 4) {
                    if (el.regularRule == '0000010') {
                      el.typeValue = "年-月";
                    }else{
                      el.typeValue = "年-月-日";
                    }
                  }
                })
              }
            }
            // 生日 农历
            if(ele.systemFieldId=='k103'){
              ele.radio = '';
              ele.fieldContent.birthType = ele.fieldContent.birthType==0?true:false;
              ele.fieldContent.sectionMin = ele.fieldContent.sectionMin==-1?undefined:ele.fieldContent.sectionMin;
              ele.fieldContent.sectionMax = ele.fieldContent.sectionMax==-1?undefined:ele.fieldContent.sectionMax;
            }
          })
          that.tempaletDataList = data
          // 获取模板所有字段
          that.getTempInfo()
          // showMsg.showmsg('设置成功','success')
          return;
        }
        errMsg.errorMsg(resData)
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    // 获取商户列表
    getCliqueInfo() {
      var that = this
      var para = {}
      postRequest('/api-admin/list-enterprise',para)
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {
          var data = resData.result.listEnterprise
          data.forEach(function(ele,index) {
            ele.name = ele.brandName
            ele.id = ele.enterpriseId
          })
          that.merchantOptions = data
          return;
        }
        errMsg.errorMsg(resData)

      })
      .catch(function (error) {
        console.log(error);
      });
    },
    // 是否关联集团
    getContact(){   
      var para = {};
      getRequest('/api-auth/is-relevance-clique',para)
      .then((res) => {
        var resData = res.data
        // console.log(resData);
        if (resData.errorCode == 0) {
          this.contactBool = resData.result;
        }else{
          errMsg.errorMsg(resData)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    // 返回
    goBack(){
      if(this.contactBool){
        this.$router.push('/memberCardSet');
      }else{
        this.$confirm('确认放弃编辑内容？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push('/memberCardSet');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      }
    }
  },
  watch: {
    isDragging (newValue) {
      var that = this
      if (newValue){
        that.delayedDragging= true
        return
      }
      that.$nextTick( () =>{
        that.delayedDragging =false
      })
    }
  },
  components: {
    draggable,
    AddInput,
  },
  mounted() {
    var that = this;
    // 获取商户列表
    // that.getCliqueInfo()
    // 获取已经配置的数据
    that.getInfo();
    // 是否关联集团
    that.getContact();
    // 防止 拖拽过程中火狐浏览器打开新窗口
    document.body.ondrop = function (event) { 
      event.preventDefault();
      event.stopPropagation();
    }
  }
}

</script>
<style lang="less" scoped>
.template-wrap {
  min-width: 1400px;
  width: 100%;
  height: 100%;
  /*min-height: 860px;*/
  overflow-y: auto;
  padding: 0;
  margin: 0;
  background: url('../../../assets/template-bg.jpg') no-repeat 50%;
  background-size: 100% 100%;

  .template-contain {
    width: 1200px;
    margin: 0 auto;
    min-height: 860px;
  }

  .template-head {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    justify-content: space-between;
    height: 80px;
    align-items: center;

    .flex-1 {
      -webkit-flex: 1;
      -moz-flex: 1;
      -ms-flex: 1;
      -o-flex: 1;
      flex: 1;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      align-items: center;
    }

    .flex-r {
      justify-content: flex-end;
    }
    .template-title-span {
      color: #fff;
      font-size: 30px;
      padding-left: 18px;
    }
  }

  .template-body {
    width: 100%;
    position: relative;
    overflow: hidden;

    .template-cell {

    }
    
    /* 左侧 */
    .template-cell-l {
      width: 350px;
      float: left;
      height: 780px;
      padding-top: 40px;

      .el-tabs{
        /deep/ .el-tabs__item {
          width: 50%;
          width: 175px;
          /*padding: 0;*/
          color: rgba(255,255,255, .5);
          &.is-active {
            color: #1890ff;
          }
        }
      }

      .compenent-item {
        position: relative;
        width: 148px;
        height: 42px;
        margin: 0 15px 15px 0;
        line-height: 40px;
        padding: 0 10px;
        display: inline-block;
        text-align: center;
        cursor: move;
        color: #fff;
        padding: 0;
        overflow: hidden;
        font-size: 12px;
        border: 1px dashed rgba(255, 255, 255, 0.6);
        background: rgba(255, 255, 255, 0.1);
        &.fixed-item {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      #list5 {
        .compenent-item {
          text-align: left;
          padding: 0 16px;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          overflow: hidden;
          span,.bg-icon {
            display: inline-block;
            vertical-align: middle;
          }
          .bg-icon {
            position: absolute;
            top: 50%;
            right: 16px;
            -webkit-transform: translate(0,-50%);
            -ms-transform: translate(0,-50%);
            -o-transform: translate(0,-50%);
            transform: translate(0,-50%);
            width: 17px;
            height: 17px;
            background: url('../../../assets/icon-template.png') no-repeat center center;
            background-size: 100%;
          }
          .one{
            background-position: 0 -50px;
          }
          .two{
            background-position: 0 -182px;
          }
          .three{
            background-position: 0 -67px;
          }
          .four{
            background-position: 0 0;
          }
          .five{
            background-position: 0 -165px;
          }

          /*&:nth-child(1) {
            .bg-icon {
              background-position: 0 -50px;
            }
          }

          &:nth-child(2) {
            .bg-icon {
              background-position: 0 -182px;
            }
          }
          &:nth-child(3) {
            .bg-icon {
              background-position: 0 -67px;
            }
          }
          &:nth-child(4) {
            .bg-icon {
              background-position: 0 0;
            }
          }
          &:nth-child(5) {
            .bg-icon {
              background-position: 0 -165px;
            }
          }*/

        }
      }
      .filed-item-title {
          padding: 15px 0;
          font-size: 14px;
          color: #FFFFFF;
      }

    }
    /* 中间 */
    /* 模板 */
    .template-cell-m {
      float: left;
      width: 410px;
      height: 780px;
      margin: 0 20px;
      position: relative;

      .view-content {
        position: relative;
      }

      .templet-null-img {
        width: 249px;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        -o-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
      }
    }

    .drag-wrap {
      min-height: 530px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .phone-container{
      margin-top:40px;
    }
    .phone-view{
      background: url(../../../assets/iphone.png) no-repeat;
      background-size: 100%;
      width: 410px;
      height: 740px;
      /*margin: 0 20px;*/
      position: relative;
    }

    .phone-show-content{
      width: 330px;
      height: 537px;
      position:absolute;
      left:41px;
      top: 83px;
      overflow-y: auto;
    }

    .opend-card-item {
      height: 46px;
      line-height: 46px;
      background: #fff;
      border-bottom: 1px solid #e7e7eb;
      font-size: 14px;
      position: relative;

      &.sex::after {
        content: '';
        width: 100%;
        height: 100%;
        z-index: 2;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
    }

    .opend-card-group-title {
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
    }

    .opend-card-item {
      height: 46px;
      line-height: 46px;
      background: #fff;
      border-bottom: 1px solid #e7e7eb;
    }

    .phone-list-item{
      height:44px;
      line-height:44px;
      background: #fff;
      margin-bottom:5px;
    }

    .item-title {
      width: 100px;
      float: left;
      padding-left: 10px;
    }

    .filed-item {
      background: #fff;
      height: 46px;
      width: 100%;
      height: auto;
      background: #fff;
      position: relative;
      cursor: move;
      padding: 0px;
      margin: 0;
      font-size: 12px;
      color: #292929;

      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      &.active-item {
        border: 1px solid #1890ff;
      }

      &+.filed-item {
        margin-top: 5px;

        &.li-block {
          margin-top: 15px
        }
      }
      /*删除*/
      .item-close {
        position: absolute;
        top: 0;
        right: 0;
        width: 18px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        background: #1890ff;
        color: #fff;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        display: none;
        z-index: 2;
      }
      &:hover{
        border: 1px dashed #1890ff;
        .item-close {
          display: block;
        }
      }


    }
    /* 组块 */
    .block {
      min-height: 308px;
      background: #f0eff4;

      .block-head {
        width: 100%;
        background: #f5f5f8;
        padding: 0;
        height: 35px;

        .opencard-item-title {
          height: 35px;
          line-height: 35px;
        }
      }
      .drag-wrap {
        min-height: 250px;
      }
    }



    .opencard-drag {
      background: #fff;
      height: 46px;
    }

    .opencard-item-title{
      width: 90px;
      height: 46px;
      line-height: 46px;
      text-align: left;
      float: left;
      padding-left: 10px;
      overflow: hidden;
      white-space: nowrap;
      &.title-pre-wrap {
        line-height: 15px;
        word-break: break-all;
        white-space: pre-wrap;
        padding-top: 9px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }
    }
    .show-warm-text{
      color:#C8C8CD;
      width:185px;
      text-align: left;
      display:inline-block;
      white-space: nowrap;
      height:46px;
      line-height:46px;
    }


    /* 右侧 */
    .template-cell-r{
      width: 400px;
      float: left;
      overflow: hidden;
      padding-top: 40px;

      .el-tabs {
        /deep/.el-tabs__item {
          width: 175px;
          /* padding: 0; */
          /*color: rgba(255, 255, 255, 0.5);*/
        }

        /deep/.el-tabs__nav-wrap::after {
          content: none;
        }
      }

      .label-txt {
        margin: 0 10px;
        font-size: 14px;
        color: #fff;
      }

      .margin-t-15 {
        margin-top: 15px;
      }

      .margin-t-30 {
        margin-top: 30px;
      }

      .margin-l-15 {
        margin-left: 15px;
      }

      .margin-b-15 {
        margin-bottom: 15px;
      }

      .w-60 {
        width: 60px;
      }

      .w-120 {
        width: 120px;
      }

      .w-316 {
        width: 316px;
      }

      .w-340 {
        width: 340px;
        /deep/ .el-input__inner {
          color: #fff;
          background-color: rgba(255,255,255,.1);
        }
      }

      .opt-btn {
        cursor: pointer;
        color: #C9D3DF;

        &.add-item:hover {
          /*color: #1890ff;*/
        }
        &.del-item:hover {
          /*color: #F56C6C;*/
        }
      }

      .checkbox-cell {
        &+.checkbox-cell {
          margin-top: 15px;
        }
        color: #fff;
      }

      .el-checkbox {
        /deep/ span.el-checkbox__label {
          color: #fff;
        }
        &.is-disabled {
          /deep/ span.el-checkbox__label {
            color: #fff;
          }
        }

      }

      .el-radio {
        /deep/ span.el-radio__label {
          color: #fff;
        }
        &.is-disabled {
          /deep/ span.el-radio__label {
            color: #fff;
          }
        }

      }

      .el-input {
        /deep/ .el-input__inner {
          color: #fff;
          background-color: rgba(255,255,255,.1);
          line-height: 1;
        }
        .is-disabled{
          /deep/ .el-input__inner {
            color: #fff;
            background-color: rgba(255,255,255,.1);
          }
        }
      }

      .el-checkbox {
        color: #fff;
      }

      .edit-view {
        /*height: 700px;*/
        /*overflow-y: auto;*/
        /*margin-top:40px;*/
      }

      .edit-item {
        color: #fff;
        padding-bottom: 10px;

        .tip {
            margin-left: -40px;
            color: rgba(255,255,255,0.7);
            width: 30px;
            display: inline-block;
            text-align: right;
            margin-right: 10px;
            font-size: 12px;
        }
      }

      .edit-item-title {
        color: #FFFFFF;
        font-size: 14px;
        font-weight: normal;
        padding: 20px 0;

        &.edit-title-padding {
          padding-top: 15px;
        }
      }

      .edit-item-title span {
        font-size: 12px;
        margin-left:5px;
      }
    }
  }
}
.template-wrap /deep/ .el-tabs__content {
  height: 660px;
  overflow-y: scroll;
}
 
 /*---滚动条默认显示样式--*/ 
.template-wrap /deep/ .el-tabs__content::-webkit-scrollbar-thumb{  
   background:rgba(0,0,0,0.1);  
   height:50px;
   -webkit-border-radius:6px;
}  
/*---鼠标点击滚动条显示样式--*/ 
.template-wrap /deep/ .el-tabs__content::-webkit-scrollbar-thumb:hover{  
   background:rgba(0,0,0,0.1);  
   height:50px;  
   -webkit-border-radius:6px;  
}  
/*---滚动条大小--*/ 
.template-wrap /deep/ .el-tabs__content::-webkit-scrollbar{  
   width:5px;  
   height:5px;  
} 
/*---滚动框背景样式--*/ 
.template-wrap /deep/ .el-tabs__content::-webkit-scrollbar-track-piece{  
   background-color:transparent;  
   -webkit-border-radius:6px;  
}

.template-wrap .template-head /deep/ .el-button--default.is-plain{
  background: hsla(0,0%,100%,0);
  color: #fff;
}
.template-wrap .template-head /deep/ .el-button--default.is-plain:hover {
    color: #1890ff;
}
.my-input-number /deep/ .el-input__inner{
  background: rgba(255, 255, 255, 0.1);
  text-align: left;
  color: #fff;
}
.no-change-birth::after {
  content: '';
  width: 100%;
  height: 100%;
  z-index: 2;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
