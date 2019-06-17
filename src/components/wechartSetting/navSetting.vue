<template>
  <div>
    <div class="giccontent">
     <v-nav :navpath="navpath" :navtip='true'></v-nav>
     <div class="setting">
       <div class="setting-wrap" v-loading="loading">
         <div class="setting-left">
           <!--item1-->
           <!-- <v-draggable  v-model="navList" :move="getListdata" @update="datadragEnd" :options="{group:{name:'people', pull:false, put:true },sort: true}"> -->
            <div class="setting-item" v-for="(item, index) in navList" :key="index" v-dragging="{ item: item, list: navList, group: 'item' }">
              <div class="setting-delete" @click="deleteNav(item,index)"><i @mouseenter="toggleIconEnter" @mouseleave="toggleIconLeave" :class="{'el-icon-close':!iconState,'el-icon-circle-close':iconState}"></i></div>
              <div class="item itemmBottom">
                  <span class="itemname">导航名称</span>
                  <span class="itemtext">
                      <div class="forminputWidth form-item-box">
                        <gic-input v-model="item.title" :max="5"></gic-input>
                      </div>
                  </span>
                  <span class="errortip" v-if="errortip == true && item.title == ''">导航名称不能为空</span>
                  <span class="itemswitch">
                    <el-switch v-model="item.status" @change="changeSwitch(item.status,index)"></el-switch>
                  </span>
              </div>
              <div class="item2 itemmBottom">
                <span class="itemname">导航图片</span>
                <span class="itemtext"><span class="itemedit" @click="editNavImg(item,index)">修改</span>
                <div>
                  <div class="nav-img fl">
                    <a class="itemimg itemimgmr">
                    <img width="25" height="25" :src='"../../../static/img/navico/" + curStyle + "/" + item.icon.idx + "/activeicon" + item.icon.url + ".png"' alt="">
                    </a>
                    <p>选中</p>
                  </div>
                  <div class="nav-img fl">
                    <a class="itemimg">
                      <img width="25" height="25" :src='"../../../static/img/navico/" + curStyle + "/" + item.icon.idx + "/icon" + item.icon.url + ".png"' alt="">
                    </a>
                    <p>未选中</p>
                  </div>
                </div>
                </span>
              </div>
              <div class="item itemmBottom">
                <span class="itemname">进入条件</span>
                <span class="itemradio">
                  <el-radio-group v-model="item.entryCondition">
                      <el-radio :label=0>不限</el-radio>
                      <el-radio :label=1>开卡会员</el-radio>
                      <el-radio :label=2>认证会员</el-radio>
                    </el-radio-group>
                </span>
              </div>
              <div class="item">
                <span class="itemname">导航链接</span>
                <span class="itemradio">
                  <span class="itembtn" v-if="item.link.name">{{ item.link.name }}</span>
                  <span class="itembtn" v-else> \ </span>
                  <span class="itemedit" @click="linkTool(index,item)">修改</span>
                  <span class="errortip" v-if="errortip == true && item.link == ''">导航链接不能为空</span>
                </span>
              </div>
              <p class="itemurl " v-if="item.status == true && item.pagePath">{{ item.pagePath }}
                <span class="itemurlcopy" v-clipboard:copy="item.pagePath" v-clipboard:success="onCopyLink" v-clipboard:error="onErrorLink">复制</span></p>
              <div v-if="item.link.id=='5' || item.link.id=='17'" class="item itemmTop">
                <span class="itemname">类型</span>
                <div class="itemradio">
                  <el-select @change="changeNavStyle(item.customLinkType,item,index)" v-model="item.customLinkType" placeholder="请选择">
                    <el-option
                      v-for="(style,index) in options"
                      :key="index"
                      :label="style.name"
                      :value="style.guideType">
                    </el-option>
                  </el-select>
                  <span class="errortip" v-if="errortip == true && item.customLinkType == null">类型不能为空</span>
                </div>
              </div>
            </div>
           <!-- </v-draggable> -->
           <!--item1-end-->
           <div v-show="addNavBtnBool" class="setting-addnav" @click="addNavList"><i class="el-icon-plus"></i> 添加导航</div>
           <p class="add-nav-tip">最多添加5个导航，拖动选中的导航可对其排序</p>
         </div>
         <v-settingRight :navList="navList" :curStyle="curStyle"></v-settingRight>
       </div>
     </div>
   </div>

   <div class="footwrap" :class="{mLeftwrap: $store.state.show}">
     <el-button type="primary" size="small" @click="submitForm(0)">保 存</el-button>
   </div>

   <!--图标选择-->
   <el-dialog title="图标选择" :visible.sync="dialogIconVisible"  width="920px">
     <div class="iconwrap">
       <div class="iconstyle">
         <span class="iconstyle-item1">颜色风格</span>
         <span class="iconstyle-item2 mright" @click="changeStyle('red')" :class="curStyle == 'red' ? 'curstyle' : ''">
           <div class="iconstyle-text styleone"><i class="el-icon-check"></i></div>
         </span>
         <span class="iconstyle-item2 mright" @click="changeStyle('black')" :class="curStyle == 'black' ? 'curstyle' : ''">
             <div class="iconstyle-text styletwo"><i class="el-icon-check"></i></div>
         </span>
         <span class="iconstyle-item2" @click="changeStyle('green')" :class="curStyle == 'green' ? 'curstyle' : ''">
          <div class="iconstyle-text stylethree"><i class="el-icon-check"></i></div>
        </span>
       </div>
       <p class="title">风格一</p>
         <div class="iconselect">
           <div class="iconselect-item" @click.stop="selectNavImg(item.index,'fill')" v-for="(item, index) in imgCount" :key="index">
             <div class="iconselect-img">
               <img width="25" height="25" :src='"../../../static/img/navico/" + curStyle +"/fill/activeicon" + item.index + ".png"' alt="">
               <img width="25" height="25" :src='"../../../static/img/navico/" + curStyle +"/fill/icon" + item.index + ".png"' alt="">
             </div>
             <p  class="iconselect-name">{{ item.name }}</p>
           </div>
         </div>
       <p class="title">风格二</p>
       <div class="iconselect">
         <div class="iconselect-item" @click="selectNavImg(item.index,'flat')" v-for="(item, index) in imgCount" :key="index">
           <div class="iconselect-img">
             <img  width="25" height="25" :src='"../../../static/img/navico/" + curStyle +"/flat/activeicon" + item.index + ".png"' alt="">
             <img  width="25" height="25" :src='"../../../static/img/navico/" + curStyle +"/flat/icon" + item.index + ".png"' alt="">
           </div>
           <p  class="iconselect-name">{{ item.name }}</p>
         </div>
       </div>

     </div>
   </el-dialog>

   <!--链接小工具-->
   <linktools :projectName="projectName" :showType=1 :linkVisible.sync="linkToolsVisible" :isWx=false @linkSelect="linkSelect"/>

   <!-- 暂停服务的提示 -->
   <div class="xcx-dialog-wrap">
     <div class="xcx-dialog-content">
       <div class="el-dialog__header"><span class="el-dialog__title">提示</span></div>
       <div class="el-dialog__body"><span>该页面近期正在升级，如有相关紧急需求，请联系项目经理</span></div>
     </div>
   </div>
   <vue-gic-footer></vue-gic-footer>
 </div>
</template>

<script>
 module.exports = require('./navSetting')
</script>

<style lang="less">
 @import "./navSetting.less";
 .xcx-dialog-wrap{
   position: fixed;
   top: 64px;
   right: 0;
   bottom: 0;
   left: 200px;
   background: rgba(0,0,0,.5);
   z-index: 10;
   display: none;
   .xcx-dialog-content{
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%,-50%);
     background: #fff;
     border-radius: 2px;
     box-shadow: 0 1px 3px rgba(0,0,0,.3);
     box-sizing: border-box;
     width: 500px;
     .el-dialog__body{
       padding-bottom: 50px;
       text-align: center;
     }
   }
 }
</style>
