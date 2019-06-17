<template>
  <div class="cube-content form">
    <div style="position: relative;" class="">
      <div class="cube-box">
        <ul v-for="(i,m) in lineData" class="cube-ul" :key="m">
          <li
            v-for="(j,n) in i.rowData"
            :key="n"
            @click="handleSelect(m,n)"
            style="position: relative;"
            @mouseenter="mouseMove(m,n)"
            class="cube-item"
            :style="{ 'background-color': j.isSelect?'#e8f7fd':'',width:boxWidth+'px',height:boxWidth+'px',
            'line-height': boxWidth+'px'  }">
            <span class="el-icon-plus"></span>
          </li>
        </ul>
      </div>
      <div style="display: none">
        {{refash}}
      </div>
      <div
        v-for="(item,index) in boxArr"
        v-show="(item.endLeft-item.left != 0) && (item.endTop-item.top != 0 )"
        :key="index"
        @click="selectBox(index)"
        class="click-box"
        :style="{
          'left': (item.left)*boxWidth+item.left+'px',
          'top':(item.top)*boxWidth+item.top+'px',
          'width':(item.endLeft-item.left)*boxWidth+(item.endLeft-item.left-1)+'px',
          'height':(item.endTop-item.top)*boxWidth+(item.endTop-item.top-1)+'px',
          'z-index':selecIndex === index?1:0,
          'border':selecIndex === index ? '1px solid #1890ff':'1px solid #dcdfe6' }">
          <span class="img-size-text">建议{{(750/column*(item.endLeft-item.left)).toFixed(0)}}x{{(750/column*(item.endTop-item.top)).toFixed(0)}}像素或同等比例</span>
          <img
            class='upload-img'
            :src="item.qcloudImageUrl"
            :style="{
              width:(item.endLeft-item.left)*boxWidth+(item.endLeft-item.left-1)+'px',
              height:(item.endTop-item.top)*boxWidth+(item.endTop-item.top-1)+'px',
              }"
            alt="">
        <span
          @click.stop="removeBox(index)"
          class="delete-cube-icon el-icon-error"
          :style="{
            display:selecIndex === index ? 'inline-block':'none'
          }">
        </span>

      </div>
    </div>

    <div class="imgwrap">
      <div class="imgflex imgmtop-first">
        <span class="imgflex-item1">图片</span>
        <span class="imgflex-item2" @click="uploadMofang">
          <img  v-if="boxArr[selecIndex]&&boxArr[selecIndex].qcloudImageUrl" :src="boxArr[selecIndex]?boxArr[selecIndex].qcloudImageUrl:'' " class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <el-upload
            id="Mofang"
            style="display: none"
            class="avatar-uploader"
            :show-file-list="false"
            :action="action"
            with-credentials
            :on-success="(response, file, fileList) => cubeUploadSuccess(response, file, fileList)"
            :before-upload="cubeUploadBefore"
            >
            <img  v-if="boxArr[selecIndex]&&boxArr[selecIndex].qcloudImageUrl" :src="boxArr[selecIndex]?boxArr[selecIndex].qcloudImageUrl:'' " class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </span>
      </div>
      <div class="imgflex2 imgmtop">
        <span class="imgflex-item1">链接</span>
        <span class="imgflex-item3">
          <a class="imgbtn" v-if="boxArr[selecIndex]&&boxArr[selecIndex].link.name">{{ boxArr[selecIndex].link.name }}
            <span class="imgbtndelete" @click="deleteJggLink"><i class="el-icon-circle-close"></i></span>
          </a>
          <span v-if="boxArr[selecIndex]&&boxArr[selecIndex].link.name" class="imgedit" @click="setLink">修改</span>
          <a v-else class="imgbtnsetting" @click="setLink"> 设置链接 </a>
        </span>
      </div>

      <div class="imgflex2 imgmtop formwrap-radio-hook">
        <span class="imgflex-item1">人群</span>
        <span  class="formtext">
          <span class="crowstyle" @click="selectPeople('self',boxArr[selecIndex],peopleAllStyle)">
            <span class="el-radio__input" :class="peopleStyle == peopleAllStyle || (boxArr[selecIndex] && boxArr[selecIndex].visibleCondition == peopleAllStyle) ? 'is-checked' : ''">
              <span class="el-radio__inner"></span>
            </span><span class="el-radio__label">所有会员</span>
          </span><span class="crowstyle" @click="selectPeople('self',boxArr[selecIndex],peopleMemberStyle)">
            <span class="el-radio__input" :class="peopleStyle == peopleMemberStyle || (boxArr[selecIndex] && boxArr[selecIndex].visibleCondition == peopleMemberStyle) ? 'is-checked' : ''">
              <span class="el-radio__inner"></span>
            </span><span class="el-radio__label">会员分组</span>
          </span><span class="crowstyle" @click="selectPeople('self',boxArr[selecIndex],peopleFilterStyle)">
            <span class="el-radio__input" :class="peopleStyle == peopleFilterStyle || (boxArr[selecIndex] && boxArr[selecIndex].visibleCondition == peopleFilterStyle) ? 'is-checked' : ''">
              <span class="el-radio__inner"></span>
            </span><span class="el-radio__label">人群筛选器</span>
          </span>
        </span>
      </div>

    </div>
    <linktools :projectName="projectName" :linkVisible.sync="linkToolsVisible" :isWx=false @linkSelect="linkSelect"/>
    <!-- <peopleFilter :peopleModal="peopleModal" @closeModal="closeModal" @getCrowdData="getCrowdData" :limitCondition="limitCondition"></peopleFilter> -->
    <!-- 人群筛选器 -->
    <el-dialog
      title="自定义人群"
      :visible.sync="dialogVisiblePeople"
      :modal-append-to-body="false"
      width="1175px">
      <div class="select-people">
        <vue-gic-people v-if="peopleFilterReRender" :flag="true" :projectName="projectName" :useId="useId" :hasSearchData="hasSearchData" :sceneValue="sceneValue" ref="peopleFilter" @findFilter="findFilter" @getBackData="getBackData" @editHide="editHide" @editShow="editShow" @hideBtn="hideBtn" :isAdd="false"></vue-gic-people>
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
      :modal-append-to-body="false"
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
  </div>
</template>

<script>
  let qs = require('qs');
  import copy  from '../../common/js/clone.js';
  import Linktools from 'components/linktools/linktools.vue'
  import peopleFilter from 'components/peoplefilter/peopleFilter.vue'

  export default {
    props:{
      column:{
        type:Number,
        default:3,
      },
      row:{
        type:Number,
        default:3,
      },
      boxMsg:{
        type:Array,
        default:[]
      },
      isNew:{
        type:Boolean,
        default:false
      }
    },

    data() {
      return {
        dialogVisible:false,
        boxWidth:0,
        boxHeigth:0,
        selecIndex:-1,
        refash:false,
        isClick:false,
        falseClick:{
          x:0,
          y:0
        },
        trueClick:{
          x:0,
          y:0
        },
        boxArr:[],
        boxPosition:[],
        lineData:[
          { rowData:[
            {isSelect:false,isUse:false},
            {isSelect:false,isUse:false},
            {isSelect:false,isUse:false}]
          },
          { rowData:[
            {isSelect:false,isUse:false},
            {isSelect:false,isUse:false},
            {isSelect:false,isUse:false}]
          },
          { rowData:[
            {isSelect:false,isUse:false},
            {isSelect:false,isUse:false},
            {isSelect:false,isUse:false}]
          },

        ],
        isUse:false,
        action:window.location.origin+'/api-plug/upload-img?requestProject=mall',
        // action:'http://gicdev.demogic.com/api-plug/upload-img?requestProject=mall',

        projectName: 'gic-web',
        // 链接小工具
        linkToolsVisible: false,
        curjggLink: '',
        // 人群筛选器
        peopleModal: false,
        limitCondition: '',
        curjggradio: true,

        dialogVisiblePeople:false,
        peopleFilterReRender:false,
        sceneValue: 'member',  // 场景值
        useId:'',
        searchParams:'',
        hasSearchData: "", // 当前页回显的数据(接口返回)
        operateType:true,
        toggleTag:false,
        // 会员分组
        dialogMemberGroup:false,
        memberGroupReRender:false,
        defaltSelected: [], //  默认穿梭窗已选入数据 groupName, isRealTime必传， 其他若无需求可不传
        height:400, // 穿梭窗高度， 默认是543
        headerList: ['isRealTime', 'latestUpdateTime', 'updateType', 'effectiveStatus', 'effectiveDate'], // 表头配置，默认全部，分组名称默认显示不可配置
        effectiveStatus:1, // 不传： 所有状态 1： 有效 0： 失效

        // 人群类型
        peopleStyle:"0",
        peopleAllStyle:"0",
        peopleMemberStyle:"2",
        peopleFilterStyle:"1",
      }
    },
    watch: {
      column() {
        this.changeRow(this.column);
      },
      row() {
        this.changeLine( this.row );
      },
      boxMsg() {
        // this.boxArr =  this.boxMsg.length>0?copy(this.boxMsg):this.boxArr;
        this.boxArr = copy(this.boxMsg);
        if( !this.boxArr.length ) {
          this.changeBox();
        }
        this.refash=!this.refash
      }
    },
    mounted(){

    },
    created(){
      this.boxArr = copy(this.boxMsg);
      this.boxWidth = 355/this.column;
      this.boxHeigth = this.boxWidth;
      this.changeBox();
      this.refash=!this.refash
    },
    methods: {
      uploadMofang(){
        var item = this.boxArr[this.selecIndex];
        if(item){
          document.getElementById('Mofang').getElementsByClassName('el-upload__input')[0].click();
        }else{
          this.$message.error('请选择自定义的方格');
        }
      },
      // 链接小工具
      linkSelect(val) {
        if(val && this.boxArr[this.selecIndex]) {
          this.boxArr[this.selecIndex].link = val;
          this.$emit( 'getBoxArr',this.boxArr,this.boxArr[this.selecIndex],this.selecIndex )
          this.$emit( 'getBoxIndex', this.selecIndex)
        }
        this.linkToolsVisible = false;
      },
      setLink() {
        var item = this.boxArr[this.selecIndex];
        if(item){
          this.linkToolsVisible = true;
        }else{
          this.$message.error('请选择自定义的方格');
        }
      },
      deleteJggLink(){  // 删除链接
        this.boxArr[this.selecIndex].link = "";
        this.$emit( 'getBoxArr',this.boxArr,this.boxArr[this.selecIndex],this.selecIndex )
        this.$emit( 'getBoxIndex', this.selecIndex)
      },
      // 选择人群
      selectPeople(type,item,val){
        if(item){
          item.visibleCondition = val;
          this.peopleStyle = null;
          if(val == this.peopleMemberStyle){
            this.dialogMemberGroup = true;
            this.defaltSelected = item.memberGroupTagList?item.memberGroupTagList:[];
            this.memberGroupReRender = false;
            this.$nextTick(_ => {
              this.memberGroupReRender = true;
            });
          }else if(val == this.peopleFilterStyle){
            this.dialogVisiblePeople = true;
            this.useId = item.businessId;
            this.hasSearchData = item.limitCondition;
            // console.log(item);
            this.peopleFilterReRender = false;
            this.$nextTick(_ => {
              this.peopleFilterReRender = true;
            });
          }
        }else{
          this.$message.error('请选择自定义的方格');
        }
      },
      // 人群筛选器
      getData() { // 父组件调用子组件方法,触发父组件事件
        this.$refs.peopleFilter.confirmSet()
      },
      getBackData(val) {
        // console.log(val);
        this.boxArr[this.selecIndex].detailParams = val;
      },
      findFilter(val){  // 子组件触发父组件事件,返回过滤条件数据
        // console.log(val);
        this.boxArr[this.selecIndex].limitCondition = val;
      },
      getPeopleData(){  // 筛选器 弹框的确认按钮
        var that = this;
        that.$refs.peopleFilter.confirmSet();
        setTimeout(function(){
          if(that.boxArr[that.selecIndex].detailParams){
            that.lsSaveBtn(that.boxArr[that.selecIndex])
          }
        },500)
        that.$emit( 'getBoxArr',that.boxArr,that.boxArr[that.selecIndex],that.selecIndex )
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
      cancelFilter(){
        this.$refs.peopleFilter.cancelSet()
      },
      hideBtn() { // 隐藏保存按钮和确认按钮  (子组件会调用)
        var that = this
        that.toggleTag= false;
      },
      editShow() {  // 显示编辑,保存按钮隐藏,确认按钮显示 (子组件会调用)
        this.toggleTag= true
      },
      editHide() {
        this.toggleTag= false
      },
      // 会员分组
      handleDataTransferred(data) { // 右侧值
        this.boxArr[this.selecIndex].memberGroupTagList = data;
      },
      handleDataLeft(selectedData, selectionToRemove) { // selectedData 剔除后剩下的数据 selectionToRemove 剔除的数据
        this.boxArr[this.selecIndex].memberGroupTagList = selectedData;
      },
      memberGroupBtn(){ // 会员分组弹框的确定按钮
        var itemObj = this.boxArr[this.selecIndex];
        if(itemObj.visibleCondition==this.peopleMemberStyle){
          if(itemObj.memberGroupTagList && itemObj.memberGroupTagList.length<1){
            this.$message.error('请选择会员分组');
          }else{
            this.dialogMemberGroup = false;
          }
        }
        this.$emit( 'getBoxArr',this.boxArr,this.boxArr[this.selecIndex],this.selecIndex )
      },

      changeLine( val ) {
        this.refash=!this.refash
        this.row = val;
        let sum = 355 - (val-4);
        // this.boxHeigth = sum/val;
        this.boxHeigth = this.boxWidth;
        this.boxPosition = [];
        this.boxArr = [];
        setTimeout(()=>{
          this.changeBox1();
        },50)
        // this.changeBox1();
      },
      changeRow( val ) {
        this.refash=!this.refash
        this.column = val;
        let sum = 355 - (val-4);
        this.boxWidth = sum/val;
        this.boxPosition = [];
        this.boxArr = [];
        setTimeout(()=>{
          this.changeBox1();
        },50)
      },
      handleSelect(m,n) {
        this.isClick = !this.isClick;
        // this.boxArr.forEach((item,index)=>{
        //   if(item.pos == "0"){
        //     this.boxArr.splice(index,1)
        //   }
        // })
        if( this.isClick ) {//点击选择起点
          this.trueClick.x = n;
          this.trueClick.y = m;
          this.lineData[m].rowData[n].isSelect = true;
          this.isUse = false;
        }
        if( !this.isClick ) {//点击选择区域
          this.falseClick.x = n;
          this.falseClick.y = m;
          this.resetColor();
          let startX = this.trueClick.x < n?this.trueClick.x : n;
          let startY = this.trueClick.y < m?this.trueClick.y : m
          let endX = this.trueClick.x > n?this.trueClick.x : n;
          let endY = this.trueClick.y > m?this.trueClick.y : m;
          if( this.isUse ) {
            this.boxPosition.push({
              startX:this.trueClick.x,
              startY:this.trueClick.y,
              endX:this.trueClick.x,
              endY:this.trueClick.y,
            });
            this.boxArr.push({
              left:this.trueClick.x,
              top:this.trueClick.y,
              endLeft:this.trueClick.x+1,
              endTop:this.trueClick.y+1,
              height:0,
              width:0,
              qcloudImageUrl:'',
              imageFiledCode:'',
              link:'',
              // people:'',
              visibleCondition: "0",
              limitCondition: '',
              detailParams:'',
              limitMemberGroup:'',
              memberGroupTagList:[],
            });
            this.lineData[this.trueClick.y].rowData[this.trueClick.x].isUse = true;
          }else {
            this.boxArr.push({
              left:this.falseClick.x-this.trueClick.x>0?this.trueClick.x:this.falseClick.x,
              top:this.falseClick.y-this.trueClick.y>0?this.trueClick.y:this.falseClick.y,
              endLeft:this.trueClick.x>n?this.trueClick.x+1:n+1,
              endTop:this.trueClick.y>m?this.trueClick.y+1:m+1,
              height:Math.abs(this.falseClick.y-this.trueClick.y),
              width:Math.abs(this.falseClick.x-this.trueClick.x),
              qcloudImageUrl:'',
              imageFiledCode:'',
              link:'',
              // people:'',
              visibleCondition: "0",
              limitCondition: '',
              detailParams:'',
              limitMemberGroup:'',
              memberGroupTagList:[],
            });
            this.boxPosition.push({
              startX:this.trueClick.x<n?this.trueClick.x:n,
              startY:this.trueClick.y<m?this.trueClick.y:m,
              endX:this.trueClick.x>n?this.trueClick.x:n,
              endY:this.trueClick.y>m?this.trueClick.y:m,

            })
            for( let y = startY; y <= endY; y ++ ) {
              for(let x = startX; x <= endX; x ++ ) {
                this.lineData[y].rowData[x].isUse = true;
              }
            }

            let remArr = copy( this.boxArr )
            for( let item of remArr ) {
              let top = item.top;
              let endTop = item.endTop-1;
              let left = item.left;
              let endLeft = item.endLeft-1;
              for( let y = top; y <= endTop; y ++ ) {
                for(let x = left; x <= endLeft; x ++ ) {
                  this.lineData[y].rowData[x].isUse = true;
                  this.refash = !this.refash;
                }
              }
            }
          }

          this.selecIndex = this.boxArr.length -1;
          this.$emit( 'getBoxArr',this.boxArr,this.boxArr[this.selecIndex],this.selecIndex )
          this.$emit( 'getBoxIndex', this.selecIndex)
          let bol = this.lineData.map( i => {
            let arr = i.rowData.every( j => {
              return j.isUse === true;
            } )
            return arr;
          } ).every( k => {
            return k === true
          } )
          this.$emit( 'getSelectAll', bol )
        }
        this.refash = !this.refash;
      },
      mouseMove(m,n) {
        let startX = this.trueClick.x < n?this.trueClick.x : n;
        let startY = this.trueClick.y < m?this.trueClick.y : m
        let endX = this.trueClick.x > n?this.trueClick.x : n;
        let endY = this.trueClick.y > m?this.trueClick.y : m;
        if( this.isClick ) {
          let allBol = [];
          for( let y = startY; y <= endY; y ++ ) {
            for(let x = startX; x <= endX; x ++ ) {
              allBol.push(this.lineData[y].rowData[x].isUse)
            }
          }
          this.isUse = allBol.some( item => {
            return item === true;
          } );
          if( !this.isUse ) {
            for( let i in this.lineData ) {
              if( startY <= i && i <= endY ) {
                for( let j in this.lineData[i].rowData ) {
                  if( startX <= j && j <= endX ) {
                    this.lineData[i].rowData[j].isSelect = true;
                  }else {
                    this.lineData[i].rowData[j].isSelect = false;
                  }
                }
              }else {
                for( let j in this.lineData[i].rowData ) {
                  this.lineData[i].rowData[j].isSelect = false;
                }
              }
            }

          }

        }
        this.refash = !this.refash;
      },
      resetColor() {
        for( let i in this.lineData ) {
          for( let j in this.lineData[i].rowData ) {
            this.lineData[i].rowData[j].isSelect = false;
          }
        }
      },
      removeBox( index ) {
        let removeIndex = this.boxArr.splice( index, 1 );

        this.falseClick.x = removeIndex[0].left;
        this.falseClick.y = removeIndex[0].top;
        this.trueClick.x = removeIndex[0].endLeft;
        this.trueClick.y = removeIndex[0].endTop;

        let startX = this.trueClick.x < this.falseClick.x?this.trueClick.x : this.falseClick.x;
        let startY = this.trueClick.y < this.falseClick.y?this.trueClick.y : this.falseClick.y;
        let endX = (this.trueClick.x > this.falseClick.x?this.trueClick.x : this.falseClick.x)-1;
        let endY = (this.trueClick.y > this.falseClick.y?this.trueClick.y : this.falseClick.y)-1;
        if (removeIndex){
          for( let y = startY; y <= endY; y ++ ) {
            for(let x = startX; x <= endX; x ++ ) {

              this.lineData[y].rowData[x].isUse = false;
              this.refash = !this.refash;
            }
          }
        }

        // return
        let bol = this.lineData.map( i => {
          let arr = i.rowData.every( j => {
            return j.isUse === true;
          } )
          return arr;
        } ).every( k => {
          return k === true
        } )
        if(this.boxArr.length<1){
          this.peopleStyle = "0"
        }
        this.$emit( 'getSelectAll', bol )
        this.$emit( 'removeBoxArr',this.selecIndex )
      },
      changeBox() {
        this.lineData = [];
        for( let i = 0;i < this.row; i++ ) {
          this.lineData[i] = {};
          this.lineData[i].rowData = [];
          for( let j = 0;j < this.column; j++ ) {
            this.lineData[i].rowData[j] = {
              isSelect:false,
              isUse:false
            };
          }
        }

        let remArr = copy( this.boxArr )

        for( let item of remArr ) {

          let top = item.top;
          let endTop = item.endTop-1;
          let left = item.left;
          let endLeft = item.endLeft-1;
          for( let y = top; y <= endTop; y ++ ) {
            for(let x = left; x <= endLeft; x ++ ) {
              this.lineData[y].rowData[x].isUse = true;
              this.refash = !this.refash;
            }
          }
        }
        if (!remArr.length){
          for( let i = 0;i < this.row; i++ ) {
            this.lineData[i] = {};
            this.lineData[i].rowData = [];
            for( let j = 0;j < this.column; j++ ) {
              this.lineData[i].rowData[j] = {
                isSelect:false,
                isUse:!this.isNew
              };
            }
          }
        }
      },
      changeBox1() {
        this.lineData = [];
        for( let i = 0;i < this.row; i++ ) {
          this.lineData[i] = {};
          this.lineData[i].rowData = [];
          for( let j = 0;j < this.column; j++ ) {
            this.lineData[i].rowData[j] = {
              isSelect:false,
              isUse:false
            };
          }
        }
        let remArr = copy( this.boxArr )
        for( let item of remArr ) {

          let top = item.top;
          let endTop = item.endTop-1;
          let left = item.left;
          let endLeft = item.endLeft-1;
          for( let y = top; y <= endTop; y ++ ) {
            for(let x = left; x <= endLeft; x ++ ) {
              this.lineData[y].rowData[x].isUse = true;
              this.refash = !this.refash;
            }
          }
        }
        if (!remArr.length){
          for( let i = 0;i < this.row; i++ ) {
            this.lineData[i] = {};
            this.lineData[i].rowData = [];
            for( let j = 0;j < this.column; j++ ) {
              this.lineData[i].rowData[j] = {
                isSelect:false,
                isUse:false
              };
            }
          }
        }
      },
      selectBox( index ) {
        this.peopleStyle = null;
        this.selecIndex = index;
        this.$emit( 'getBoxArr',this.boxArr,this.boxArr[this.selecIndex],this.selecIndex )
        this.$emit( 'getBoxIndex' , this.selecIndex )
        let bol = this.lineData.map( i => {
          let arr = i.rowData.every( j => {
            return j.isUse === true;
          } )
          return arr;
        } ).every( k => {
          return k === true
        } )
        this.$emit( 'getSelectAll', bol )
      },
      getPic ( index , qcloudImageUrl ) {
        this.boxArr[index].qcloudImageUrl=qcloudImageUrl
      },
      // 上传图片之前
      cubeUploadBefore (file) {
        if( file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/gif' ) {
          this.$message.error("请上传jpg，png格式的图片")
          return false;
        }
        if( file.size > 3*1024*1024 ) {
          this.$message.error("图片大小请控制在3M内")
          return false
        }
        var that=this
        return new Promise(function(resolve, reject) {
          let reader = new FileReader();
          reader.onload = function(event) {
            let image = new Image();
            image.onload = function () {
              resolve();
            };
            image.src = event.target.result;
          };
          reader.readAsDataURL(file);
        });
      },
      cubeUploadSuccess( response, file, fileList ){
        if( response.errorCode === 0 ) {
          if ( this.selecIndex!==-1 ) {
            // console.log(this.boxArr);
            this.boxArr[this.selecIndex].qcloudImageUrl=response.result[0].qcloudImageUrl;
            this.boxArr[this.selecIndex].imageFiledCode=response.result[0].imageFiledCode;
            // this.$refs.mychild.getPic(this.selectCubeIndex,response.result[0].qcloudImageUrl)
            this.$message.success("上传成功")
            this.refash=!this.refash
          }
          this.$emit( 'getBoxArr',this.boxArr,this.boxArr[this.selecIndex],this.selecIndex )

        }else{
          this.$message.error(response.message)
        }
      },
    },
    components: {
      Linktools,
      peopleFilter,
    }
  }
</script>
<style lang="less" scoped>
  .cube-content{
    width: 360px;
  }
  .cube-content,div,.cube-item{
    box-sizing:content-box;
    padding: 0;
  }
  .cube-item{
    border:1px solid #dcdfe6;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    border-left: 0;
    border-bottom: 0;
    color:#1890ff;
    cursor: pointer;
  }
  .cube-ul .cube-item:first-child{
    border-left:1px solid #dcdfe6;
  }
  .cube-item:nth-child(4n+1){
  }
  .cube-ul:last-child .cube-item{
    border-bottom:1px solid #dcdfe6;
  }
  .click-box{
    position: absolute;
    background-color: #e8f7fd;
  }
  .upload-img{
    position: relative;
    padding: 0;
  }
  .img-size-text{
    width:100%;
    text-align: center;
    position:absolute;
    left:50%;
    top:50%;
    line-height:1;
    transform: translate(-50%,-50%);
    color:#909399;
  }
  .delete-cube-icon{
    position: absolute;
    top: -9px;
    right: -6px;
    z-index:3;
    color: #bbb;
    background: #fff;
    border-radius: 50%;
    display: inline-block;
    cursor: pointer;
    display:none;
  }
  /*上传图片*/
  .cube-content .avatar-uploader{
   /* background:#f5f5fa;*/
    margin-top:10px;
  }
  // 链接
  .form .imgedit{
    margin-top:-14px;
  }
  // 会员分组
  .member-group-wrap /deep/ .group-set-transfer{
    box-sizing: border-box;
  }
  // 自定义魔方
  .phone-cube{
    border: 10px solid #fff;
    background: #d9d9d9;
    position: relative;
  }
  .img-cube{
    position: absolute;
  }

  /*人群筛选器*/
  .select-people{
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .select-people /deep/ .marginLeft134{
    margin-left: 80px;
  }
  .select-people /deep/ .filter-content .member-templates-condition-title{
    text-align: left;
    font-size: 14px;
    line-height: 24px;
  }
  .select-people /deep/ .filter-content{
    margin-top: 0;
  }
  .people-btn-wrap{
    width: 100%;
    background: #f2f3f4;
    box-sizing: border-box;
    padding: 0 0 24px 100px;
  }
  .select-people /deep/ .detail{
    margin-top: 0;
  }
</style>

