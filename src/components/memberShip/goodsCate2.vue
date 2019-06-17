<template>
  <div class="goods-cate-content">
    <div class="goods-cate-title">
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
    </div> 
    <div class="goods-cate-list-content">
      <div class="goods-cate-box" v-for="(item,index) in allDate" :key='index'>
        <el-input 
          placeholder="请输入内容" 
          prefix-icon='el-icon-search'
          size="medium"
          clearable
          v-model="item.search"
          class="cate-search"
          @keyup.enter.native='searchCate(item.search,index,item)'
          > 
        </el-input>
        <div class="goods-cate-list">
          <div 
            class="goods-cate-item" 
            v-for="(i,ind) in item.arr"
            :class="i.classIndex===ind?'cate-item-active':''"
            :key='i.categoryId' 
            @click="getNextCateList(i,ind,item,index)">
            <span>{{i.categoryName}}</span>
            <i class="el-icon-arrow-right" v-if="i.isChildren"></i>
          </div>
        </div>
        <span style="display: none;">{{refreshStatus}}</span>
      </div>
    </div>
    <div class="goods-cate-footer">
      <el-button type="primary" class="confirm-cate" size="small" @click='handaleConfirmCate'>确认选择</el-button>
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
        // selectCateData:[]
      }
    },
    mounted(){ 
      this.getFirstCateList()
    },
    watch:{
      // selectCateType(newData,oldData){
      //   this.selectCateTypeStr = newData;
      // }
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
          i.selectBgcolor=false
        }
        i.classIndex = ind
        i.selectBgcolor=true//选中元素的标志
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
      searchCate(search, index, item){
        this.allDate.length = index+1
        if( index === 0 ) {
          this.axios.get('/api-mall/list-mall-goods-all-category',{
            params: {            
              requestProject:'gic-web',
              search:search
            }
          }).then(res => {
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
          this.axios.get('/api-mall/list-mall-goods-children-category',{
            params: {            
              requestProject:'gic-web',
              search:search,
              categoryId:categoryId
            }
          }).then(res => {
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
     
    },
    components: {
      
    }
  }
</script>
<style scoped>
  .goods-cate-content{
    width:900px;
    background: #fff;
  }
  .goods-cate-title{
    min-height:40px;
    border-radius:4px;
    border:1px solid #dcdfe6;
    padding:0 10px;
  }
  .select-tag{
    margin:0 5px;
  }
  .goods-cate-list-content{
    overflow-x:auto;
    border:1px solid #dcdfe6;
    border-radius:4px;
    border-top:none;
    padding:10px 0 0 0;
    white-space: nowrap;
    padding-left:10px;
  }
  .goods-cate-footer{
    width:100%;
    height:42px;
    padding:5px 0;
    border:1px solid #dcdfe6;
    border-top:none;
    position:relative;
  }
  .goods-cate-footer .confirm-cate{
    position:absolute;
    right:10px;
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
  .cate-item-active{
    background: #f5f5f6;
  }
  .goods-cate-item .el-icon-arrow-right{
    position:absolute;
    right:5px;
    top:9px;
    font-weight:600;
  }
</style>