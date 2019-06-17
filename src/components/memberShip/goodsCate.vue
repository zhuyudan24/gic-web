<template>
  <div class="goods-cate-content">
    <div class="goods-cate-title" @click.stop="showDragClick">
      <el-tag
        :key="index"
        v-for="(tag,index) in selectCateData"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
        class='select-tag'
        size="small">
        {{tag.categoryName}}
      </el-tag>
      <i :class="showDrag?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
    </div>
    <div class="goods-cate-list-container" v-show="showDrag" @click.stop="searchBlur">
      <div class="goods-cate-list-content" @click.stop="searchBlur">
        <div class="goods-cate-box" v-for="(item,index) in allDate" :key='index' @click.stop="searchBlur">
          <el-input
            placeholder="请输入内容"
            prefix-icon='el-icon-search'
            size="small"
            clearable
            v-model="item.search"
            class="cate-search"
            @keyup.enter.native='$event => searchCate(item.search,index,item,$event)'
            >
          </el-input>

          <div class="goods-cate-list">
            <div
              class="goods-cate-item"
              v-for="(i,ind) in item.arr"
              :class="i.classIndex===ind?'cate-item-active':''"
              :key='i.categoryId'
              @click.stop="getNextCateList(i,ind,item,index)">
              <span>{{i.categoryName}}</span>
              <i class="el-icon-arrow-right" v-if="i.isChildren"></i>
            </div>
          </div>
          <span style="display: none;">{{refreshStatus}}</span>
        </div>
      </div>
      <div class="goods-cate-footer">
        <el-row>
          <el-button type="text" size="small" class="cancel-cate" @click="cancelConfirmCate">取消</el-button>
          <el-button type="text" size="small" class="confirm-cate" @click.stop='handaleConfirmCate'>确认</el-button>
        </el-row>
      </div>
    </div>

  </div>
</template>

<script>
  let qs = require('qs');
  export default {
    props:{
      selectCateData:{
        type:Array,
        default:[]
      },
      selectCateType:{
        type:String,
        default:''
      }
    },
    data() {
      return {
        allDate:[],
        firstCate:[],
        classIndex1:0,
        refreshStatus:false,
        seceltIndex1:'',
        seceltIndex2:'',
        showDrag:false,
        showCateDrag:true,
        // selectCateData:[]
      }
    },
    mounted(){
    },
    created(){
      this.getFirstCateList()
    },
    methods: {
      //获取一级品类列表
      getFirstCateList(){
        this.axios.get('/api-mall/list-mall-goods-all-category',{            
          params: {            
            requestProject:'gic-web'
          }
        }).then(res => {
          if(res.data.errorCode===0){
            this.allDate=[]
            this.allDate.push({
              search:'',
              arr:res.data.result
            })
          }else{
            this.$message.error(res.data.message)
          }
        })
      },
      // 获取子级品类
      getNextCateList(i,ind,item,index){
        this.seceltIndex1 = index;
        this.seceltIndex2 = ind;
        this.allDate.length = index + 1
        this.refreshStatus = !this.refreshStatus
        for( let j of item.arr  ) {
          j.classIndex = -1
          // i.selectBgcolor=false
        }
        i.classIndex = ind
        // i.selectBgcolor=true//选中元素的标志
        let params = {
          categoryId:i.categoryId
        }
        this.axios.get('/api-mall/list-mall-goods-children-category',{
          params: {            
            requestProject:'gic-web',
            categoryId:i.categoryId
          }
        }).then(res => {
          if(res.data.errorCode===0){
            if(res.data.result.length){
              this.allDate[index+1] = ({
                search:'',
                arr:res.data.result
              })
              this.refreshStatus = !this.refreshStatus
            }
          }else{
            this.$message.error(res.data.message)
          }
        })
      },
      // 确认选择子级
      handaleConfirmCate(){
        console.log(this.allDate)
        if(this.seceltIndex1===''||this.seceltIndex2===''){
         this.showDrag=false
          return false
        }
        // for(let i in this.selectCateData){   // 限制是否为同一组下
        //   if(this.allDate[this.seceltIndex1].arr[this.seceltIndex2].categoryGroupId===this.selectCateData[i].categoryGroupId){
        //     this.selectCateData.splice(i,1)
        //   }
        // }
         
        var allIds = [];
        this.selectCateData.forEach((item)=>{ 
          allIds.push(item.categoryId);
        })
        if(allIds.indexOf(this.allDate[this.seceltIndex1].arr[this.seceltIndex2].categoryId)!=-1){
          this.$message.error('请勿重复添加');
          return;
        }

        this.selectCateData.push(this.allDate[this.seceltIndex1].arr[this.seceltIndex2]);
        let cateIdsList=[]
        for(let j in this.selectCateData){
          cateIdsList.push(this.selectCateData[j].categoryId)//得到选中的品类列表集合
        }
        var obj = {};
        obj.cateIdsList = cateIdsList;
        obj.selectCateType = this.selectCateType;
        this.$emit("getCateIds",obj)
      },
      // //取消选择
      cancelConfirmCate(){
        console.log("取消")
        for( let i in this.allDate ){
          for( let j in this.allDate[i].arr ) {
            this.allDate[i].arr[j].classIndex = -1
          }
        }
        this.getFirstCateList()//获取第一列
        this.showDrag=false;
        var obj = {};
        obj.cateIdsList = [];
        obj.selectCateType = this.selectCateType;
        this.$emit("getCateIds",obj)

      },
      handleClose(tag) {
        this.selectCateData.splice(this.selectCateData.indexOf(tag), 1);
        let cateIdsList=[]
        for(let j in this.selectCateData){
          cateIdsList.push(this.selectCateData[j].categoryId)//得到选中的品类列表集合
        }
        var obj = {};
        obj.cateIdsList = cateIdsList;
        obj.selectCateType = this.selectCateType;
        this.$emit("getCateIds",obj)
      },
      // 搜索
      searchCate(search, index, item,e){
        e.cancelBubble = true
        this.allDate.length = index+1
        if( index === 0 ) {
          let params = {
            search
          }
          request.get('/api-mall/list-mall-goods-all-category',{params}).then(res => {
            if(res.data.errorCode===0){
              this.allDate=[]
              this.allDate.push({
                search:search!==''?search:'',
                arr:res.data.result
              })
            }else{
              this.$message.error(res.data.message)
            }
          })
        }else {
          let categoryId=''
          for(let ind in this.allDate[index-1].arr){
            if(this.allDate[index-1].arr[ind].classIndex!==-1){
              categoryId=this.allDate[index-1].arr[ind].categoryId
            }
          }
          let params = {
            search:search,
            categoryId:categoryId
          }
          request.get('/api-mall/list-mall-goods-children-category',{params}).then(res => {
            if(res.data.errorCode===0){

                this.allDate[index] = ({
                  search:search!==''?search:'',
                  arr:res.data.result
                })
              this.refreshStatus = !this.refreshStatus
            }else{
              this.$message.error(res.data.message)
            }
          })
        }
      },
      searchBlur(e){
      },
      showDragClick(){
        this.showDrag=!this.showDrag
      },
      hideDragClick(){
        this.showDrag=false
      },

    },
    components: {

    }
  }
</script>
<style scoped>
  .goods-cate-content{
    /*width:900px;*/
    position: relative;
  }
  .goods-cate-title{
    min-height:32px;
    border-radius:4px;
    border:1px solid #dcdfe6;
    padding:0 10px;
    cursor: pointer;
    position:relative;
    background: #fff;
  }
  .goods-cate-title i{
    position:absolute;
    right:10px;
    top:9px;
    color:#c0c4cc;
  }
  
  .select-tag{
    margin:0 5px;
  }
  .goods-cate-list-content{
    overflow-x:auto;
    border:1px solid #dcdfe6;
    border-radius:4px;
    border-top:none;
    padding:10px 0 20px 0;
    white-space: nowrap;
    padding-left:10px;
    width: 642px;
    background:#fff;
  }
  .goods-cate-list-container{
    position:absolute;
    left:0px;
    z-index:2;
    margin-top: 10px;
  }
  .goods-cate-footer{
    height:32px;
    padding-right: 10px;
    border:1px solid #dcdfe6;
    border-top:none;
    background:#fff;
    text-align: right;
  }
  .goods-cate-box{
    width:200px;
    border:1px solid #dcdfe6;
    border-radius:4px;
    display:inline-block;
    margin-right:10px;
  }
  .cate-search{
    margin:10px;
    width:180px;
  }
  .goods-cate-list{
    height:200px;
    overflow-y:auto;
  }
  .goods-cate-item{
    height:32px;
    line-height: 32px;
    position: relative;
    color:#909399;
    cursor: pointer;
    padding-left:10px;
  }
  .goods-cate-item:hover{
    background: #f5f5f6;
  }
  .cate-item-active{
    color: #1890ff;
  }
  .goods-cate-item .el-icon-arrow-right{
    position:absolute;
    right:5px;
    top:9px;
    font-weight:600;
  }
</style>
