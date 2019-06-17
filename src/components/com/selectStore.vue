<template>
    <div>
      <el-row>
        <el-col style="width: 230px;">
          <el-select v-model="value"  @change="changeStore" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col style="width: 240px;" v-show="groupwrap">
          <div class="groupwrap" @click="showGroup">
            <div class="groupselect">
              {{groupvalue}}
              <i class="el-icon-arrow-down grouparrow" :class="{arrowrotate: showGroupTree}"></i>
            </div>
            <div class="grouptree" v-show="showGroupTree">
              <el-tree @check="checkedStore" :data="data" show-checkbox node-key="id" :default-expanded-keys="[1]" :props="defaultProps">
              </el-tree>
            </div>
          </div>
        </el-col>
        <el-col style="width: 240px;" v-show="partstore">
          <el-select v-model="partvalue"  @change="changePartStore"  multiple filterable remote reserve-keyword placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    export default {
        name: "store",
        data() {
          return {
            options: [{
              value: 'allstore',
              label: '所有门店'
            },{
              value: 'groupstore',
              label: '门店分组'
            },{
              value: 'partstore',
              label: '部分门店'
            }],
            value: '',
            groupvalue: '已选择0个门店分组',
            selectgroup: '',
            groupwrap: false,
            showGroupTree:false,
            data: [{
              id: 1,
              label: '一级 1',
              children: [{
                id: 4,
                label: '二级 1-1',
                children: [{
                  id: 9,
                  label: '三级 1-1-1'
                }, {
                  id: 10,
                  label: '三级 1-1-2'
                }]
              }]
            }],
            defaultProps: {
              children: 'children',
              label: 'label'
            },
            partstore: false,
            partvalue: '',
            options4: [],
            list: [],
            loading: false,
            states: ["Alabama", "Alaska", "Arizona","Arkansas"],
          }
        },
        methods: {
          changePartStore() {
            this.$emit('selectStore',{
              type: 'partstore',
              stores: this.partvalue
            })
          },
          remoteMethod(query) {
            this.list = this.states.map(item => {
              return { value: item, label: item };
            });
            if (query !== '') {
              this.loading = true;
              setTimeout(() => {
                this.loading = false;
                this.options4 = this.list.filter(item => {
                  return item.label.toLowerCase()
                    .indexOf(query.toLowerCase()) > -1;
                });
              }, 200);
            } else {
              this.options4 = [];
            }
          },
          checkedStore(Nodes,Keys) {
            let count = Keys.checkedKeys.length;
            this.groupvalue = `已选择${ count }个门店分组`;
            this.selectgroup =  Keys.checkedKeys;
            this.$emit('selectStore',{
              type: 'groupstore',
              stores: this.selectgroup
            })
          },
          getStore() {
            //获取门店树
          },
          changeStore() {
              if(this.value == 'allstore') {
                this.$emit('selectStore',{
                  type: 'allstore',
                  stores: ''
                })
                this.groupwrap = false;
                this.partstore = false;
              }else if(this.value == 'groupstore') {
                this.groupwrap = true;
                this.partstore = false;
                this.$emit('selectStore',{
                  type: 'groupstore',
                  stores: this.selectgroup
                })
              }else {
                if(this.value == 'partstore') {
                  this.partstore = true;
                  this.$emit('selectStore',{
                    type: 'partstore',
                    stores: this.options4
                  })
                }
                this.groupwrap = false;
              }
          },
          showGroup() {
              this.showGroupTree = !this.showGroupTree;
          }
        },
        created() {
           this.getStore();
        },
        mounted() {
        }
    }
</script>

<style lang="less" scoped>
   .groupselect{
     position: relative;
     width: 240px;
     height: 40px;
     line-height: 40px;
     font-size: 14px;
     border: 1px solid #ddd;
     box-sizing: border-box;
     border-radius: 4px;
     text-indent: 10px;
     background-color: #fff;
     cursor: pointer;
     color: #606266;
   }
   .grouparrow{
     position: absolute;
     right: 10px;
     bottom: 12px;
     transition: all .3s;
   }
   .arrowrotate{
     transform-origin: 65% 50%;
     transform: rotateZ(-180deg);
   }
   .grouptree{
     min-height: 100px;
     margin-top: 12px;
     padding: 10px 20px;
     box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);;
     background-color: #fff;
     border: 1px solid #eee;
     color: #606266;
   }
</style>
