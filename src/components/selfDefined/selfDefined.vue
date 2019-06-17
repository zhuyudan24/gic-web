<template>
  <div>
    <el-form :model="cubeForm" class="self-defined-wrap">
      <el-form-item label="魔方列数">
        <el-select
          v-model="cubeForm.lineSetting.column"
          placeholder="请选择列数"
          @change="changeColumn">
          <el-option label="3" :value="3"></el-option>
          <el-option label="4" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="魔方行数">
        <el-select
          v-model="cubeForm.lineSetting.row"
          placeholder="请选择行数"
          @change="changeRow">
          <el-option label="1" :value="1"></el-option>
          <el-option label="2" :value="2"></el-option>
          <el-option label="3" :value="3"></el-option>
          <el-option label="4" :value="4"></el-option>
          <el-option label="5" :value="5"></el-option>
          <el-option label="6" :value="6"></el-option>
          <el-option label="7" :value="7"></el-option>
          <el-option label="8" :value="8"></el-option>
          <el-option label="9" :value="9"></el-option>
          <el-option label="10" :value="10"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="edit-item">
        <magicCube
          :column="cubeForm.lineSetting.column"
          :row="cubeForm.lineSetting.row"
          :boxMsg="boxMsg"
          :isNew="isNew"
          @getBoxIndex="getBoxIndex"
          @getBoxArr="getBoxArr"
          @removeBoxArr="removeBoxArr"
          @getSelectAll='getSelectAll'
        >
        </magicCube>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import magicCube from './magicCube.vue'
  import copy  from '../../common/js/clone.js'
  export default {
    name:'selfDefined',
    props:{
      selfData:{
        type:Object,
        default:{}
      },
      changeStatus:{
        type:Boolean,
        default:false
      }
    },
    data(){
      return{
        dialogVisible:true,
        // 魔方
        cubeForm:{
          key:"A3",
          templateType: 8,
          imageSpace: 0,  //图片间距
          customDensity: 1,
          elementIndex: 1,
          lineSetting:{
            row:4,
            column:4
          },
          data: [{
            title: "",
            link: {
              id: "",
              name: "",
              params: ""
            },
            visibleCondition: "0",
            limitCondition: '',
            detailParams:'',
            limitMemberGroup:'',
            memberGroupTagList:[],
            imageFiledCode: "",
            qcloudImageUrl: "",
            pos: "0" ,
          }],
        },
        selectCubeIndex:0,
        cubeLinkIndex:0,
        cubeLink:[],//魔方链接
        boxPosition:[],
        refash:false,
        selectAll:true,//是否选中全部
        boxMsg:[],
        isNew:true,
      }
    },
    watch:{
      changeStatus:{
        handler (){ // 初始化
          // console.log(this.selfData);
          if(this.selfData.templateType==8){
            this.cubeForm=copy(this.selfData);
            if(this.cubeForm.data.length>0 && this.cubeForm.data[0].qcloudImageUrl){//编辑
              this.isNew =false
              this.boxMsg = this.cubeForm.data.map( item => {
                // console.log(item);
                return {
                  left:item.pos?Number(item.pos[0]):item.left,
                  top:item.pos?Number(item.pos[2]):item.top,
                  endLeft:item.pos?Number(item.pos[4]):item.endLeft,
                  endTop:item.pos?item.pos[7]==0?10:Number(item.pos[6]):item.endTop,
                  qcloudImageUrl:item.qcloudImageUrl,
                  imageFiledCode:item.imageFiledCode,
                  visibleCondition:item.visibleCondition,
                  limitCondition:item.limitCondition,
                  detailParams:item.detailParams,
                  limitMemberGroup:item.limitMemberGroup,
                  memberGroupTagList:item.memberGroupTagList,
                  businessId:item.businessId,
                  link:item.link
                }
              });
              this.cubeLink = this.cubeForm.data.map( item => {
                return {
                  // hrefURL:item.hrefURL  // 没有
                }
              });
            }else {//新增
              this.boxMsg = []
              this.isNew = true
            }
          }else{
            this.boxMsg = []
            this.isNew = true
          }
        },
        immediate:true
      }
    },
    methods:{
      // 获取点击的div的index
      getBoxIndex( val ){
        this.selectCubeIndex = Number(val)
      },
      getBoxArr( boxArr,item, index ) {
        this.selectCubeIndex = index;
        this.cubeLinkIndex = index
        if(item){
          this.cubeForm.data[index] = item;
          this.refash =!this.refash
          if( ( item.endLeft-item.left ) && item.picURL === ''){
            this.getChangePutStatus(false)
          }
        }
        this.$emit('getEditMess',this.cubeForm,this.selectAll);
      },
      //删除事件
      removeBoxArr( index ) {
        this.cubeForm.data.splice(index,1)
        this.cubeLink.splice(index,1)
        let bol = this.cubeForm.data.some( item => {
          return item.hasOwnProperty('left')
        } )
        if(this.isNew&&!this.cubeForm.data.length){
          bol=true
        }
        this.$emit('getEditMess',this.cubeForm,this.selectAll);
        this.getChangePutStatus(bol)

      },
      // 魔方图片链接
      moreLink6 () {
        this.linkModal=true
      },
      //改变列
      changeColumn(){
        this.boxMsg=[]
        this.cubeForm.data = [];
        this.$emit('getEditMess',this.cubeForm,this.selectAll);
      },
      // 改变行
      changeRow(){
        this.boxMsg=[]
        this.cubeForm.data = [];
        this.$emit('getEditMess',this.cubeForm,this.selectAll);
      },
      //获取魔方是否选择全部的状态
      getSelectAll ( bol ) {
        this.selectAll=bol;
        // console.log(this.selectAll);
      },
      // 预览传参
      getChangePutStatus(bol){
        this.$emit('changePutStatus',bol)
      },
    },
    components: {
      magicCube
    }
  }
</script>

<style lang="less" scoped>
  /*魔方*/
  .edit-cube{
    padding:20px 0;
    padding-bottom:77px;
  }
  .img-text{
    margin-bottom:15px;
  }
  .img-text img{
    width:80px;
    height:80px;
  }
  .img-text .text{
    display:inline-block;
    vertical-align: top;
    width:70%;
    margin-left:3px;
    font-size:13px;
    line-height:14px;
  }
  .link-text{
    font-size:12px;
    width:295px;
    height:40px;
    display: inline-block;
    white-space: nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    padding-left:5px;
  }
  .height60{
    height:60px;
  }
  .bottom-btn{
    width:400px;
    background:#fff;
    height:50px;
    position:fixed;
    bottom:0px;
    font-size:0px;
    z-index:3;
  }
  .bottom-btn span{
    width:50%;
    height:50px;
    line-height:50px;
    color:red;
    font-size:14px;
    cursor: pointer;
    display:inline-block;
  }
  .bottom-btn span:first-child{
    background:#1890ff;
    color:#fff;

  }
   .bottom-btn span:last-child{
    background:#f4f4f5;
    color:#909399;

  }
  .self-defined-wrap /deep/ .el-form-item__label{
    color: #606266
  }
</style>
