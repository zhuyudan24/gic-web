<!--
/**
 * 链接小工具组件(弹窗) by fairyly on 2018/06/15
 * 组件调用
 */
<linktools :showType="showType" :linkToolsVisible="linkToolsVisible" @linkSelect="linkSelect"/>

import Linktools from 'components/linktools/linktools.vue'

// 链接小工具参数
linkToolsVisible: false, //显示参数
showType: 0, // 显示类型,插件默认0:显示全部 ,1: (底部导航);2: (公众号菜单:只有小程序的,没有h5)

// methods
// linktools
showLinkDialog() {
  this.linkToolsVisible = true;
},

linkSelect(val) {
  console.log(val)
  // 关闭时隐藏
  this.linkToolsVisible = false;
}

components: {linkId
  Linktools
} coupCardId 
 
 -->

<template>
  <!-- 链接小工具 -->
  <div class="link-tools-contain">
    <el-dialog :class="activeName == 'first'? 'min-1026':'min-720'"
    title="链接小工具"
    :close-on-click-modal="false"
    :visible.sync="mylinkToolsVisible"
    @close="changeVisible"
    :modal-append-to-body="false">
      <!-- 链接类型 -->
      <div class="links-types">
        <label class="types-title">链接类型</label>
        <el-select v-model="linksType" class="w200" placeholder="请选择" @change="linksTypeChange">
          <el-option
            v-for="item in linksTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <!-- 二级下拉 -->
        <el-select v-model="twoLevelValue" class="w200"  placeholder="请选择" v-if="twoLevelVisible" @change="twoLevelValueChange">
          <el-option
            v-for="item in twoLevelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <!-- 三级下拉 -->
        <div class="three-level-wrap w200" v-if="threeLevelVisible">
          <!-- 三级单选 -->
          <el-select v-model="threeLevelValue" placeholder="请选择" v-if="threeLeveloneVisible" @change="threeSingleValueChange">
            <el-option
              v-for="item in threeLevelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <goods-tree v-if="goodsTreeVisible" @pass-mall="getMallId" :tree-data="treeData"></goods-tree>

          <!-- 商品分类链接 -->
          <!-- <treeselect
            v-if="threeLevelTreeVisible"
            v-model="threeLevelValue"
            :options="goodsCategoryOptions"
            :normalizer="normalizer"
            :default-expand-level="1"
            placeholder="所有分类"
            noOptionsText="暂无数据"
            noResultsText="无数据"
            @select="goodsCategorySelect"
            /> -->
          <!-- 搜索后出现下列 -->
          <el-select
            v-if="threeLevelSearchVisible"
            v-model="threeLevelValue"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            @change="threeLevelValueChange"
            >
            <el-option
              v-for="item in threeLevelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>

      <!-- h5 -->
      <div class="h5link-contain" v-if="h5linkVisible">
        <div class="h5link-row">
          <label class="h5link-title">进入条件</label>
          <el-select class="conditionType-select w200" v-model="h5linkObj.conditionType"  placeholder="请选择进入条件">
            <el-option
              v-for="item in h5linkObj.conditionTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="h5link-row">
          <label class="h5link-title">名称</label>
          <el-input v-model="h5linkObj.name" placeholder="请输入名称"></el-input>
        </div>
        <div class="h5link-row">
          <label class="h5link-title">网址</label>
          <el-input v-model="h5linkObj.url" placeholder="请输入网址"></el-input><a class="h5link-help" href="http://doc.demogic.com/doc/index.php?s=/41&page_id=441" target="_blank">【帮助文档】请联系公司技术人员查看文档配置标准链接</a>
        </div>
        <div class="h5link-row" v-if="false">
          <label class="h5link-title h5link-dynamic-title">动态参数（选填）</label>
          <div class="h5-table">
            <table cellspacing="0" cellpadding="0" border="0" class=" el-table el-table__header">
              <colgroup>
                <col name="el-table_1_column_1" width="359">
                <col name="el-table_1_column_2" width="359">
                <col name="el-table_1_column_3" width="359">
                <col name="gutter" width="0">
              </colgroup>
              <thead class="has-gutter">
                <tr class="">
                  <th colspan="1" rowspan="1" class="el-table_1_column_1     is-leaf">
                    <div class="cell">GIC参数</div>
                  </th>
                  <th colspan="1" rowspan="1" class="el-table_1_column_2     is-leaf">
                    <div class="cell">第三方H5</div>
                  </th>
                  <th colspan="1" rowspan="1" class="el-table_1_column_3     is-leaf">
                    <div class="cell">操作</div>
                  </th>
                  <th class="gutter" style="width: 0px; display: none;"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <el-select size="small" class="dynamic-param-select" v-model="dynamicRow.key" clearable placeholder="请选择参数" @change="dynamicChange($event)">
                      <el-option
                      v-for="item in h5linkObj.dynamicParaOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      </el-option>
                    </el-select>
                  </td>
                  <td>
                    <el-input size="small" class="h5-el-input" v-model="dynamicRow.value" clearable type="text" @keyup.native="(value) => dynamicBlur(value)" placeholder="请输入参数"></el-input>
                  </td>
                  <td><el-button type="text" @click.stop="addDynamic()">添加</el-button></td>
                </tr>
                <template v-for="(dynamicItem,index) in dynamicList">
                  <tr>
                    <td>
                      <template v-if="!dynamicItem.editAble">{{dynamicItem.key}}</template>
                      <template v-if="dynamicItem.editAble">
                        <el-select size="small" class="dynamic-param-select" v-model="dynamicItem.selectKey" placeholder="请选择参数">
                          <el-option
                          v-for="item in h5linkObj.dynamicParaOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                          </el-option>
                        </el-select>
                      </template>
                    </td>
                    <td>
                      <template v-if="!dynamicItem.editAble">{{dynamicItem.value}}</template>
                      <template v-if="dynamicItem.editAble">
                         <el-input size="small" class="h5-el-input" v-model="dynamicItem.inputValue" type="text" placeholder="请输入参数"></el-input>
                      </template>
                    </td>
                    <td>
                      <template v-if="dynamicItem.editAble">
                        <el-button type="text" @click.stop="confirmDynamic(index,dynamicItem)">确认</el-button>
                        <el-button type="text" @click.stop="cancleDynamic(index,dynamicItem)">取消</el-button>
                      </template>
                      <template v-if="!dynamicItem.editAble">
                        <el-button type="text" @click.stop="editDynamic(index,dynamicItem)">编辑</el-button>
                        <el-button type="text" @click.stop="delDynamic(index)">删除</el-button>
                      </template>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        <div class="h5link-row">
          <label class="h5link-title">分享开关</label>
          <el-switch v-model="h5linkObj.share" @change="shareSwitch($event,h5linkObj.share)"></el-switch>
        </div>
        <div class="h5link-row" v-if="h5linkObj.share">
          <label class="h5link-title">分享页面</label>
          <el-radio v-model="h5linkObj.shareWebType" label="0">当前页</el-radio>
        </div>
        <div class="h5link-row" v-if="h5linkObj.share">
          <label class="h5link-title"> </label>
          <el-radio class="p-l-7" v-model="h5linkObj.shareWebType" label="1">其他链接网址</el-radio><el-input class="p-l-47" v-model="h5linkObj.shareUrl" placeholder="请输入网址"></el-input>
        </div>
      </div>

      <!-- 第三方小程序 -->
      
      <div class="h5link-contain" v-if="thirdlinkVisible">
        <!-- <div class="h5link-row">
          <label class="h5link-title">名称</label>
          <el-input v-model="thirdObj.name" placeholder="请输入名称"></el-input>
        </div>
        -->
        <div class="h5link-row">
          <label class="h5link-title">跳转路径(非必填)</label>
          <el-input v-model="thirdObj.pagePath" placeholder="输入跳转路径"></el-input>
        </div>
<!--         
        <div class="h5link-row">
          <label class="h5link-title h5link-dynamic-title">动态参数（选填）</label>
          <div class="h5-table">
            <table cellspacing="0" cellpadding="0" border="0" class=" el-table el-table__header">
              <colgroup>
                <col name="el-table_1_column_1" width="359">
                <col name="el-table_1_column_2" width="359">
                <col name="el-table_1_column_3" width="359">
                <col name="gutter" width="0">
              </colgroup>
              <thead class="has-gutter">
                <tr class="">
                  <th colspan="1" rowspan="1" class="el-table_1_column_1     is-leaf">
                    <div class="cell">GIC参数</div>
                  </th>
                  <th colspan="1" rowspan="1" class="el-table_1_column_2     is-leaf">
                    <div class="cell">第三方H5</div>
                  </th>
                  <th colspan="1" rowspan="1" class="el-table_1_column_3     is-leaf">
                    <div class="cell">操作</div>
                  </th>
                  <th class="gutter" style="width: 0px; display: none;"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <el-select size="small" class="dynamic-param-select" v-model="dynamicRow.key" clearable placeholder="请选择参数" @change="dynamicChange($event)">
                      <el-option
                      v-for="item in h5linkObj.dynamicParaOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      </el-option>
                    </el-select>
                  </td>
                  <td>
                    <el-input size="small" class="h5-el-input" v-model="dynamicRow.value" clearable type="text" @keyup.native="(value) => dynamicBlur(value)" placeholder="请输入参数"></el-input>
                  </td>
                  <td><el-button type="text" @click.stop="addDynamic()">添加</el-button></td>
                </tr>
                <template v-for="(dynamicItem,index) in dynamicList">
                  <tr>
                    <td>
                      <template v-if="!dynamicItem.editAble">{{dynamicItem.key}}</template>
                      <template v-if="dynamicItem.editAble">
                        <el-select size="small" class="dynamic-param-select" v-model="dynamicItem.selectKey" placeholder="请选择参数">
                          <el-option
                          v-for="item in h5linkObj.dynamicParaOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                          </el-option>
                        </el-select>
                      </template>
                    </td>
                    <td>
                      <template v-if="!dynamicItem.editAble">{{dynamicItem.value}}</template>
                      <template v-if="dynamicItem.editAble">
                         <el-input size="small" class="h5-el-input" v-model="dynamicItem.inputValue" type="text" placeholder="请输入参数"></el-input>
                      </template>
                    </td>
                    <td>
                      <template v-if="dynamicItem.editAble">
                        <el-button type="text" @click.stop="confirmDynamic(index,dynamicItem)">确认</el-button>
                        <el-button type="text" @click.stop="cancleDynamic(index,dynamicItem)">取消</el-button>
                      </template>
                      <template v-if="!dynamicItem.editAble">
                        <el-button type="text" @click.stop="editDynamic(index,dynamicItem)">编辑</el-button>
                        <el-button type="text" @click.stop="delDynamic(index)">删除</el-button>
                      </template>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div> -->
      </div>

      <!-- 商品链接 -->
      <div class="goods-links-contian" v-if="goodsLinksVisible">
        <div class="links-tools-row">
          <!-- 品类 :always-open="true"-->
          <treeselect
            v-model="category"
            :options="categoryOptions"
            :normalizer="normalizer"
            :default-expand-level="1"
            :flat="true"
            placeholder="所有品类"
            noOptionsText="暂无数据"
            noResultsText="无数据"
            no-children-text="无数据"
            :load-options="loadOptions"
            :beforeClearAll = "beforeClearCategory"
            @select="categorySelect"
            />
          <!-- 分类树形结构 -->
          <treeselect
            v-model="classify"
            :options="classifyOptions"
            :normalizer="normalizer"
            :default-expand-level="1"
            placeholder="所有分类"
            noOptionsText="暂无数据"
            noResultsText="无数据"
            noChildrenText="无数据"
            :beforeClearAll = "beforeClearClassify"

            @select="classifySelect"
            />
          <el-input class="links-tools-input"
            placeholder="请输入商品名称/货号"
            v-model="searchGoods" @keyup.native="(value) => toSearchInput(value)" clearable  @clear="clearInput">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <!-- 商品列表 -->
        <div class="goods-link-content">
          <ul class="goods-link-list">
            <li :class="item.mallProId == selectGoodId? 'goods-link-item goodSelect': 'goods-link-item'"
              v-for="(item, index) in goodsList"
              :key="index"
              @click="selectGoodLinkItem(item)">
              <img :src="item.mallProImageUrl" alt="商品图片" />
              <div class="inline-block goods-message">
                <p class="limit-2 pro-name">{{item.proName}}</p>
                <p class="gray-color pro-code">货号：{{item.proCode}}</p>
                <span class="pro-price">￥{{item.mallProSpuPrice}}</span>
              </div>
            </li>
          </ul>
        </div>
        <!-- 分页 -->
        <div class="links-tools-page">
          <el-pagination
            @size-change="linkSizeChange"
            @current-change="linkCurrentChange"
            :current-page="currentPage"
            :page-sizes="[9]"
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </div>

      <!-- 积分商城下的礼品和卡券 -->
      <div class="goods-links-contian" v-if="cardLinksVisible">
        <div class="links-tools-row" v-if="cardType">
          <card-list :pname="pname" @pass-id="handlePassId"></card-list>
        </div>
        
        <div class="links-tools-row" v-else>
          <gift-list :pname="pname" @pass-gift="handlePaddGift"></gift-list>
        </div>
      </div>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="cancelLinkSelect">取 消</el-button> -->
        <el-button type="primary" @click="confirmLinkSelect">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

// 使用树形插件
// import the component
import Treeselect from '@riophae/vue-treeselect';
import CardList from './card-list';
import GiftList from './gift-list';
import GoodsTree from './goods-tree';

// import axios from 'axios'
import qs from 'qs';
import { setTimeout } from 'timers';

export default {
  name: 'links-tool',
  
  props: ['linkVisible','showType','projectName'],

  data () {
    return {
      treeData: [],
      goodsTreeVisible: false,
      // 项目名
      cardLimit: 1,
      disabledList:[],
      pname: 'member',
      repProjectName: 'member', // 项目名
      linkShowType: 0, //传参数判断显示类型
      activeName: 'first',
      // ---------------------------
      twoLevelVisible: false, // 二级下拉
      threeLevelVisible: false, // 三级整个

      cardLinksVisible: false, // 积分商城礼品或卡券
      cardType: '', // 积分商城礼品或卡券 true 表示卡券 否则就是礼品
      giftName: '', // 礼品名称
      cardName: '', // 卡券名称
      cardOptions: [], // 卡券分类
      giftOptions: [], // 礼品分类
      cardVal: '',
      giftVal: '',
      cardList: [], // 优惠券

      // 链接类型
      linksType: '',
      linksTypeOptions: [
        // {
        //   id: '1',
        //   value: 'shoplink',
        //   label: '商城链接'
        // },
        // {
        //   id: '2',
        //   value: 'memberlink',
        //   label: '会员功能链接'
        // },
        // {
        //   id: '3',
        //   value: 'definelink',
        //   label: '自定义页面'
        // },
        // {
        //   id: '4',
        //   value: 'h5link',
        //   label: 'H5页面'
        // },
        // {
        //   id: '5',
        //   value: 'otherlink',
        //   label: '其他小程序'
        // }
      ],
      // 二级数据
      twoLevelValue: '',
      twoLevelOptions: [
        // {
        //   id: '1',
        //   value: 'shoplink',
        //   label: '商城链接'
        // },
      ],
      // 三级数据
      threeLeveloneVisible: false, // 三级中第一个下拉单选
      threeLevelTreeVisible: false, // 三级中第二个下拉树形结构
      threeLevelSearchVisible: false, // 三级中第三个搜索下拉
      threeLevelValue: '',
      threeLevelOptions: [
        // {
        //   id: '1',
        //   value: 'shoplink',
        //   label: '商城链接'
        // },
      ],
      // h5link
      h5linkVisible: false,
      h5linkObj: {
        name: '',
        url: '',
        fixParam: '',
        share: false, // 分享开关默认false->0: 关闭; true->1: 开启
        shareWebType: '0', // 0：当前展示的页面, 1：分享出去的页面
        shareUrl: '', // 分享的页面链接
        dynamicPara:'',
        dynamicParaOptions: [ // 2018.6.12 动态参数目前让写页面
          {
            value: 'openid',
            label: 'openid'
          },
          {
            value: 'unionid',
            label: 'unionid'
          },
          {
            value: 'wxOpenid',
            label: 'wxOpenid'
          },
          {
            value: 'appkey',
            label: 'appkey'
          },
          {
            value: 'enterpriseId',
            label: 'enterpriseId'
          },
          {
            value: 'appid',
            label: 'appid'
          },
          {
            value: 'memberId',
            label: 'memberId'
          },
        ],
        // 进入条件
        conditionType: '0',
        conditionTypeOptions:[
           {
            value: '0',
            label: '不限'
          },
          {
            value: '1',
            label: '开卡会员'
          },
          {
            value: '2',
            label: '认证会员'
          },
        ]
      },

      dynamicRow: {
        key: '',
        value: '',
        selectKey: '',
        inputValue: '',
        editAble: false
      },

      dynamicList: [],


      // ---------------------------
      //第三方小程序
      thirdlinkVisible: false,
      thirdObj:{
        name: '',
        pagePath: '',
        appid: '',
      },

      // ---------------------------
      // 父组件传递的 props
      mylinkToolsVisible: false,

      // 商品链接
      goodsLinksVisible: false,
      searchGoods: '',
      category: null,
      // 品类
      categoryOptions: [
        // {
        //   key: 'a',
        //   name: 'a',
        //   subOptions: [ {
        //     key: 'aa',
        //     name: 'aa',
        //   } ],
        // }
      ],
      normalizer(node/*, id */) {
        // there is an extra `id` argument,
        // which could be useful if you have multiple instances
        // of vue-treeselect that share the same `normalizer` function
        return {
          id: node.key,
          label: node.name,
          children: node.subOptions,
        }
      },

      // 商品列表数据
      selectGoodId: '',
      goodsList: [
        // {
        //   id:'111',
        //   proName: '美商海盗船Gaming系列 K70 RGB Rapidfire',
        //   proCode: "errerr",
        //   mallProImageUrl: 'https://pic01-10001430.image.myqcloud.com/adb6387e-a3f4-4b7f-a7dd-1b7fe242f9f7',
        //   mallProSpuPrice: 567
        // }
      ],
      // 分页
      currentPage: 1, // 当前页
      pageSize: 9, // 一页显示的个数
      total: 0, // 总数

      // 分类
      classify: null,
      classifyOptions: [
        // {
        //   key: 'b',
        //   name: 'b',
        //   subOptions: [ {
        //     key: 'bb',
        //     name: 'bb',
        //   } ],
        // }
      ],

      // 商品分类
      goodsCategory: null,
      goodsCategoryOptions: [
        // {
        //   key: 'a',
        //   name: 'a',
        //   subOptions: [
        //     {
        //       key: 'aa',
        //       name: 'aa',
        //     }
        //   ],
        // }
      ],

      // 保存需要的参数
      oneLevelTypeValue: '',
      twoLevelSelectValue: '',
      threeLevelSelectValue: '',

      // 触发传递的对象
      selectLinkObj: {
        id:'',
        name: '',
        url: '',
        params: '',
        share: 0,
        pagePath: ''
      },
      // 获取 location origin
      baseUrl: '',

    }
  },
  beforeMount() {
    this.chooseFlag = false;
    this.giftFlag = false;
    var that = this
    var host = window.location.origin;
    this.baseUrl = host.indexOf('localhost') != '-1' ? 'http://gicdev.demogic.com' : host;
  },
  methods: {
    changeVisible() {
      // 因为确认之后弹窗关闭也是会触发close事件
      // 如果直接close会有id 如果确认之后是没有id
      if ('id' in this.selectLinkObj) {
        this.$emit('linkSelect', {});
      }
      this.$emit('update:linkVisible', false);
      this.resetAll();
    },
    handlePaddGift(list) { 
      // 拼接id
      this.giftFlag = true;
      this.giftName = list.proName;
      this.giftUrl = list.integralMallProId;
    },

    handlePassId(row) {
      this.chooseFlag = true;
      // 先保存下来
      this.cardName = row.cardName;
      this.cardUrl = row.integralMallProId;
    },
    // --------------------------------------------------
    // 选择类型改变 (一级选择,保存选择类型)
    linksTypeChange: function(e) {
      this.linkId = e;
      var that = this
      var selectOneItem = '';
      that.linksTypeOptions.forEach(function(ele,inde){
        if (ele.linkId == e) {
          selectOneItem = ele
        }
      })
       // 保存选择的类型
      that.oneLevelTypeValue = selectOneItem.type;

      // 判断出现下拉内容/h5部分

      // 每次修改选择类型,清空已选择的值
      that.dynamicRow = {
        key: '',
        value: '',
        selectKey: '',
        inputValue: '',
        editAble: false
      }
      that.dynamicList = [];

      this.thirdObj = {
        name: '',
        appid: '',
        pagePath: ''
      };
      that.selectLinkObj.name = '';
      that.selectLinkObj.url = '';
      that.selectLinkObj.params = '';

      that.twoLevelSelectValue = '';
      that.threeLevelSelectValue = '';
      this.goodType = '';

      // 如果是 h5,二级,三级隐藏,
      var type = selectOneItem.type == 5 ? true:false;
      if (this.linkId !== 'yueshi') {
        this.setOneLevelVisible(type,selectOneItem);
      } else {
        this.twoLevelVisible = false;
        this.thirdlinkVisible = false;
        this.h5linkVisible = false;
      }
    },

    // set onelevel visible
    setOneLevelVisible(type,selectOneItem) {
      var that = this;
      this.visibleType = null;
      this.cardLinksVisible = false;
      // 设置选择的 id
      that.selectLinkObj.id = selectOneItem.linkId;
      if (type) {
        if (selectOneItem.type ==5 ) {
          that.h5linkVisible = true;  // h5 链接参数输入部分显示
          that.thirdlinkVisible = false; // 第三方小程序
        }
        if (selectOneItem.type ==7 ) {
          that.h5linkVisible = false;  // h5 链接参数输入部分显示
          that.thirdlinkVisible = true; // 第三方小程序
        }

        that.twoLevelVisible = false; // 二级部分隐藏
        that.threeLevelVisible = false; // 三级部分隐藏
        that.goodsLinksVisible = false; // 商品链接列表部分
      }else {
        // 不是 h5,显示二级,隐藏三级
        that.h5linkVisible = false; // h5 链接参数输入部分隐藏
        that.thirdlinkVisible = false; // 第三方小程序
        that.twoLevelVisible = true; // 二级部分显示
        that.twoLevelOptions = [];
        that.threeLevelVisible = false; // 三级部分隐藏
        that.goodsLinksVisible = false; // 商品链接列表部分
        that.twoLevelValue = ''; // 清空二级数据
        that.threeLevelValue = ''; // 清空三级数据

        // 如果是自定义
        if (selectOneItem.type == 6) {
          that.selectLinkObj.id = selectOneItem.linkId;
          // that.selectLinkObj.name = selectOneItem.label;
          that.selectLinkObj.url = selectOneItem.content;
          that.getDefinePage();
          return false;
        } else if (selectOneItem.type == 7){
          that.h5linkVisible = false;  // h5 链接参数输入部分显示
          that.thirdlinkVisible = true; // 第三方小程序
          that.threeLevelVisible = false; // 三级部分隐藏
          this.getAppList();
        }
        // 清空设置选择的 id
        if(that.oneLevelTypeValue !== 7) {
          that.selectLinkObj.id = '';
        }

        // 获取二级列表数据
        that.getLinksList(selectOneItem.linkId, 2)

      }
    },

    // twoLevelValueChange (二级选择,保存选择类型)
    twoLevelValueChange(e) {
      console.log(e);
      if (e == 'product_category_link') { // 商品分类链接
        this.middleGoodId = e;
        this.goodType = 10;
        this.threeLevelVisible = true;
        this.threeLeveloneVisible = false;
        this.goodsTreeVisible = true;
        this.cardUrl = null;
      } else if (e == 'mall_customize_page') { // 自定义页面
        this.middleGoodId = e;
        this.goodType = 11;
        this.threeLevelVisible = true;
        this.threeLeveloneVisible = true;
        this.goodsTreeVisible = false;
        this.pageId = null;
      } else if (e == 1) {
        this.goodType = 1;
        this.threeLevelVisible = false;
        this.goodsTreeVisible = false;
        this.threeLeveloneVisible = true;
      } else {
        this.threeLevelVisible = false;
        this.threeLeveloneVisible = true;
        this.goodsTreeVisible = false;
      } 

      var that = this
      this.goodsLinksVisible = false;
      this.visibleType = null;
      // 清空已经选择
      that.selectLinkObj.name = '';
      that.selectLinkObj.url = '';
      this.cardLinksVisible = false;
      // 判断自定义
      if (that.oneLevelTypeValue == 6) {
        var selectDefineItem = ''
        that.twoLevelOptions.forEach(function(ele,index){
          if (e == ele.id) {
            selectDefineItem = ele;
          }
        })
        that.selectLinkObj.name = selectDefineItem.label;
        that.selectLinkObj.params = {
          pageId: e
        }
        return;
      }
      var selectTwoItem = '';
      that.twoLevelOptions.forEach(function(ele,index){
        if (e == ele.linkId) {
          selectTwoItem = ele;
        }
      })
      // 每次选择清空原有选择参数
      that.selectLinkObj.params = '';
      // 设置选择的 id
      if(that.oneLevelTypeValue !== 7) {
        that.selectLinkObj.id = e;
      }

      // 判断是否结束, 1:结束;
      if (selectTwoItem.type == 1 || selectTwoItem.type == 4 || selectTwoItem.type == 6 || that.oneLevelTypeValue == 7) {
        that.threeLevelVisible = false; // 三级部分隐藏
        that.threeLevelValue = ''; // 清空三级数据
        that.twoLevelSelectValue = ''; // 清空门店签到
        that.threeLevelSelectValue = ''; //清空商品分类
        // 清空已经选择
        that.selectLinkObj.name = '';
        that.selectLinkObj.url = '';
        // 如果选择商品链接
        if(selectTwoItem.type == 4) {
          this.currentPage = 1;
          that.getGoodsList(); // 获取商品列表
          that.getGoodsCategory();// 获取商品品类
          that.getGoodsClassify(); // 获取商品分类

          // this.getGoodsType(); // 商品分类链接
          // this.getGoodsPage(); // 商品自定义页面

          that.threeLevelVisible = false; // 三级部分隐藏
          that.goodsLinksVisible = true; // 商品链接列表部分显示
          return false;
        }

        that.twoLevelOptions.forEach(function(ele,index){
          if (e== ele.value) {
            that.selectLinkObj.name = ele.label;
            that.selectLinkObj.url = ele.content;
          }
        })
      } else if (this.goodType == 10) {
        // 商品分类链接
        this.getGoodsLink();
      } else if (this.goodType == 11) {
        // 商品自定义页面
        this.threeLevelVisible = true;
        this.getGoodsPage();
      } else {
        // 判断三级中下拉/下拉树形/搜索下拉
        that.goodsLinksVisible = false; // 商品列表隐藏
        that.threeLevelVisible = true; // 三级部分显示
        that.threeLevelValue = ''; // 清空三级数据
        that.twoLevelSelectValue = '';
        that.threeLevelSelectValue = '';
        var twoType = selectTwoItem.type;
        // 判断三级显示的下拉组件
        that.setThreeVisible(twoType, selectTwoItem)


        // 如果是门店,直接返回,需要输入后搜索出现下拉列表
        if (twoType == 2) {
          that.twoLevelSelectValue = 'sign';
          return false;
        }
        if (twoType == 3) {
          that.twoLevelSelectValue = 'goodsCate';
          that.getGoodsClassify();
          return false;
        }
        // 获取三级列表数据
        that.getLinksList(selectTwoItem.linkId,3,twoType)
      }
    },

    // sy 商品分类链接
    getGoodsLink() {
      this.axios.get(`${this.baseUrl}/api-plug/list-mall-product-tag?requestProject=gic-web`)
        .then(res => {
          if (res.data.errorCode === 0) {
            const data = res.data.result;
            if (data && data.length) {
              this.treeData = data;
            } else {
              this.treeData = [];
            }
          }
        }).catch(err => {
          console.log(err);
        });
    },
    // sy 商品自定义页面
    getGoodsPage() {
      this.axios.get(`${this.baseUrl}/api-plug/list-mall-page?requestProject=gic-web`)
        .then(res => {
          if (res.data.errorCode === 0) {
            const data = res.data.result;
            if (data && data.length) {
              // definePage 自定义页面
              this.threeLevelOptions = data.map(val => ({
                ...val,
                label: val.pageName,
                value: val.pageId
              }));
            } else {
              this.threeLevelOptions = [];
            }
          }
        }).catch(err => {
          console.log(err);
        });
    },

    // set threelevel visible
    setThreeVisible(type,selectTwoItem) {
      var that = this
      switch(type) {
        // 如果下拉显示
        case 0: // 单选
          that.threeLeveloneVisible = true; // 三级中第一个下拉单选
          that.threeLevelTreeVisible = false; // 三级中第二个下拉树形结构
          that.threeLevelSearchVisible = false; // 三级中第三个搜索下拉
        break;
        case 2: // 搜索下拉
          that.threeLeveloneVisible = false; // 三级中第一个下拉单选
          that.threeLevelTreeVisible = false; // 三级中第二个下拉树形结构
          that.threeLevelSearchVisible = true; // 三级中第三个搜索下拉
          // 设置链接 门店签到
          that.selectLinkObj.name = selectTwoItem.name;
          that.selectLinkObj.url = selectTwoItem.content;
        break;
        case 3: // 树形结构
          that.threeLevelValue = null;
          that.threeLeveloneVisible = false; // 三级中第一个下拉单选
          that.threeLevelTreeVisible = true; // 三级中第二个下拉树形结构
          that.threeLevelSearchVisible = false; // 三级中第三个搜索下拉
          // 设置链接 商品分类
          that.selectLinkObj.name = selectTwoItem.name;
          that.selectLinkObj.url = selectTwoItem.content;
        break;
      }
    },

    // 获取商品品类
    getGoodsCategory() {
      var that = this
      var para = {
        filterGoods: 1,
        parentId: '',
        requestProject: that.repProjectName
      }
      that.axios.post(that.baseUrl+'/api-mall/list_mall_goods_category',qs.stringify(para))
      .then((res) => {
        var resData = res.data;
        var onelevelCategory = '';
        if (resData.errorCode == 0) {
          resData.result.forEach(function(ele,index){
            if (ele.parentId == '-1') {
              ele.subOptions = [];
              ele.key = ele.mallCategoryId
              onelevelCategory = ele;
              resData.result.splice(index,1);
            }
          })
          var list = resData.result, lists = resData.result;

          list.forEach(function(ele,index) {
            if (ele.isLeaf == 0) {
              ele.subOptions = null;
            }
            ele.key = ele.mallCategoryId;
            lists.forEach(function(el,ind) {
                el.key = el.mallCategoryId;
                if(el.parentId == ele.mallCategoryId ){
                  ele.subOptions = []
                  ele.subOptions.push(el)
                  list.splice(ind,1)
                }
            })

          })

          list.forEach(function(ele,index){
            onelevelCategory.subOptions.push(ele)
          })
          that.categoryOptions = [];
          that.categoryOptions.push(onelevelCategory);

          return false;
        }

        that.$message.error({
          duration: 1000,
          message: resData.message
        })
      })
      .catch(function (error) {
        // that.toLogin()
        that.$message.error({
          duration: 1000,
          message: error.message
        })
      });
    },

    // 获取商品分类
    getGoodsClassify() {
      var that = this
      var para = {
        requestProject: that.repProjectName
      }
      that.axios.post(that.baseUrl+'/api-mall/list_mall_goods_tag_tree',qs.stringify(para))
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {
          var list = [resData.result],lists = resData.result;


          // list.forEach(function(ele,index) {
          //    ele.subOptions = [];
          //    ele.name = ele.tagName;
          //    ele.key = ele.mallProTagId;
          //    lists.forEach(function(el,ind) {
          //       ele.name = ele.tagName;
          //       ele.key = ele.mallProTagId;
          //       if(el.parentId == ele.mallProTagId ){
          //         ele.subOptions.push(el)
          //       }
          //    })
          // })
          // that.goodsCategoryOptions = [];
          // that.classifyOptions = [];
          // list.forEach(function(ele,index){
          //   if (ele.parentId == '-1') {
          //     that.goodsCategoryOptions.push(ele);
          //     that.classifyOptions.push(ele);
          //   }
          // })

          list.forEach(function(ele,index) {
            ele.name = ele.tagName;
            ele.key = ele.mallProTagId;
            if (!!ele.childTagList) {
              ele.subOptions = that.checkChildren(ele.childTagList)
            }
          })

          that.goodsCategoryOptions = list;
          that.classifyOptions = list;
          // that.classifyOptions = list;
          return;
        }

        that.$message.error({
          duration: 1000,
          message: resData.message
        })
      })
      .catch(function (error) {
        console.log(error);
        // that.toLogin()
        that.$message.error({
          duration: 1000,
          message: error.message
        })
      });
    },

    checkChildren(childTagList) {
      var that = this
      if (!!childTagList) {
        childTagList.forEach(function(ele,index){
          ele.name = ele.tagName;
          ele.key = ele.mallProTagId;
          if (!!ele.childTagList) {
            ele.subOptions = that.checkChildren(ele.childTagList)
          }

        })
      }
      return childTagList;
    },

    // threeLevelValueChange
    threeLevelValueChange(e) {
      var that = this
    },


    // threeSingleValueChange
    threeSingleValueChange(e) {
      // 是那个类型的
      if (this.linkId == 16) {
        this.pageId = e;
        let item = '';
        this.threeLevelOptions.forEach(function(ele,index){
          if (e == ele.pageId) {
            item = ele;
          }
        });
        this.pageName = item.pageName;
      }
      this.giftType = e;
      if (this.giftType == 'coup') {
        this.visibleType = 8;
      } else if (this.giftType == 'gift') {
        this.visibleType = 9;
      }
      var that = this
      var selThreeItem = '';
      that.threeLevelOptions.forEach(function(ele,index){
        if (e == ele.linkId) {
          selThreeItem = ele;
        }
      })
      // 非门店签到
      that.selectLinkObj.id = e;
      that.selectLinkObj.url = selThreeItem.content;
      that.selectLinkObj.name =  selThreeItem.name;
      // #sy 三级下拉
      // 卡券
      if (this.visibleType == 8) {
        this.cardLinksVisible = true;
        this.cardType = true;
      } else if (this.visibleType == 9) {
        // 礼品
        this.cardLinksVisible = true;
        this.cardType = false;
      }
    },
    // 卡券列表
    // 礼品列表

    // 获取自定义列表
    getDefinePage() {
      var that = this;
      var para = {
        pageType: 1,
        title: '',
        currentPage: 1,
        pageSize: 50,
        status: 1,
        requestProject: that.repProjectName
      }
      that.axios.post(that.baseUrl+'/api-admin/list-page',qs.stringify(para))
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {
          resData.result.result.forEach(function(ele,index){
            ele.id = ele.pageId;
            ele.label = ele.title;
            ele.value = ele.pageId
          })
          that.twoLevelOptions = resData.result.result
          return;
        }
        that.$message.error({
          duration: 1000,
          message: error.message
        })

      })
      .catch(function (error) {
        console.log(error);
        // that.toLogin()
        that.$message.error({
          duration: 1000,
          message: error.message
        })
      });
    },

    // 查询第三方小程序列表
    getAppList() {
      this.axios.post(this.baseUrl+'/api-plug/applet-app-search?requestProject=gic-web')
      .then((res) => {
        var resData = res.data;
        let list = [];
        if (resData.errorCode == 0) {
          resData.result.forEach(v => {
            if (v.appStatus === 1) {
              list.push({
                id:v.appletAppId,
                label:v.appName,
                value:v.appId
              })
            }
          })
          this.twoLevelOptions = list;
        } else {
          this.$message.error({
            duration: 1000,
            message: error.message
          })
        }
      })
      .catch( error => {
        this.$message.error({
          duration: 1000,
          message: error.message
        })
      });
    },

    // --------------------------------------------------


    // -------------------------------------------
    // 选择树形节点方法

    // 商品链接部分 categorySelect
    categorySelect(node, id) {
      var that = this
      that.category = node.key
      // 重新获取商品列表
      // that.getGoodsList();
      if (that.currentPage == 1) {
        that.getGoodsList();
      }else {
        that.currentPage = 1;
        that.getGoodsList();
      }
    },
    beforeClearCategory(node,id) {
      var that = this
      that.category = null;
      // 重新获取商品列表
      // that.getGoodsList();
      if (that.currentPage == 1) {
        that.getGoodsList();
      }else {
        that.currentPage = 1;
        that.getGoodsList();
      }
    },

    loadOptions({ action, parentNode, callback }) {
      // Typically, do the AJAX stuff here.
      // Once the server has responded,
      // assign children options to the parent node & call the callback.
      // We just use `setTimeout()` here to simulate an async operation
      // instead of requesting a real API server for demo purpose.
      var that = this
      console.log(action,parentNode,callback)
      if (action === "LOAD_CHILDREN_OPTIONS") {
        if (parentNode.key) {
          that.getChildrenNode(parentNode,parentNode.key)
        }

      }
    },

    // 获取子节点方法
    getChildrenNode(parentNode,parentId) {
      var that = this
      var para = {
        filterGoods: 1,
        parentId: parentId,
        requestProject: that.repProjectName
      }
      that.axios.post(that.baseUrl+'/api-mall/list_mall_goods_category', qs.stringify(para))
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {
          resData.result.forEach(function(ele,index){
            if (ele.isLeaf == 0) {
              ele.subOptions = null;
            }else{
              ele.subOptions = []
            }
            ele.key = ele.mallCategoryId
          })
          parentNode.subOptions = resData.result
          return;
        }
        that.$message.error({
          duration: 1000,
          message: error.message
        })

      })
      .catch(function (error) {
        console.log(error);
        // that.toLogin()
        that.$message.error({
          duration: 1000,
          message: error.message
        })
      });
    },

    // classifySelect  分类
    classifySelect(node, id) {
      var that = this
      that.classify = node.key
      // 重新获取商品列表
      // that.getGoodsList();
      if (that.currentPage == 1) {
        that.getGoodsList();
      }else {
        that.currentPage = 1;
        that.getGoodsList();
      }
    },
    beforeClearClassify(node, id) {
      var that = this
      console.log(node, id,that.classify)
      that.classify = null;
       // 重新获取商品列表
      // that.getGoodsList();
      if (that.currentPage == 1) {
        that.getGoodsList();
      }else {
        that.currentPage = 1;
        that.getGoodsList();
      }
    },

    // 商品分类 goodsCategorySelect
    goodsCategorySelect(node, id) {
      var that = this
      // 调用
      // that.selectLinkItem()
    },

    // --------------------------------------------

    // 分页
    linkSizeChange(val) {
      var that = this
      that.pageSize = val;
      // 请求商品列表
      that.getGoodsList();
    },

    // 页码变化触发
    linkCurrentChange(val) {
      this.currentPage = val;
      // 请求商品列表
      this.getGoodsList();
    },

    // 选择商品链接
    selectGoodLinkItem(item){
      var that = this
      that.selectGoodId = item.mallProId;
      // 调用函数传递链接/名字
      that.selectLinkItem(item)
    },

    // 选择链接以后调用函数
    selectLinkItem(item) {
      var that = this
      that.selectLinkObj.name = item.proName;
      that.selectLinkObj.url = item.url;
      that.selectLinkObj.params = {"proId": item.mallProId};// 2018.6.28修改参数 proId
      // that.$emit('linkSelect')
    },

    // 搜索输入
    toSearchInput: function(value) {
      var that = this;
      // 搜索重置当前页 为 1

      if (that.currentPage == 1) {
        that.getGoodsList();
      }else {
        that.currentPage = 1;
        that.getGoodsList();
      }
    },
    // 清空输入
    clearInput: function(e) {
      var that = this;
      // 搜索重置当前页 为 1

      if (that.currentPage == 1) {
        that.getGoodsList();
      }else {
        that.currentPage = 1;
        that.getGoodsList();
      }
    },

    // 获取商品列表
    getGoodsList() {
      var that = this;

      var para = {
          pageNum : this.currentPage,
          searchparams: this.searchGoods || '',
          pageSize: this.pageSize,
          mallCategoryId: this.category || '',
          tagId: this.classify || '',// 分类
          requestProject: this.repProjectName
        };

        // that.currentPage = 1;
        // that.pageSize = 10;
        // that.total = 50;

      this.axios.post(that.baseUrl+'/api-mall/page-mall-goods', qs.stringify(para)).then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {
          that.goodsList  = resData.result.result
          that.total = resData.result.totalCount
          return;
        }

        that.$message.error({
          duration: 1000,
          message: resData.message
        })
      })
      .catch(function (error) {
        that.$message.error({
          duration: 1000,
          message: error.message
        })
      });
    },

    // 搜索后出现下拉列表
    // 搜索
    remoteMethod(query) {
      var that = this;
      var that = this;
      if (query !== '') {
        // 获取搜索列表数据
        that.getStoreList(query,that.threeLevelValue);
      }else {
        that.threeLevelOptions = [];
      }

    },

     // h5 分享开关
    shareSwitch(e,obj) {
      var that = this
      console.log(e,obj)
    },


    // // 取消操作
    // cancelLinkSelect() {
    //   var that = this
    //   this.$confirm('确认关闭?', '', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: ''
    //     }).then(() => {
    //       that.$emit('linkSelect')
    //     }).catch(() => {
    //     });
    // },

    // 确认操作
    confirmLinkSelect() {
      setTimeout(_ => {

        var that = this;
        
        // 如果选择 h5 判断选择的链接
        if (that.oneLevelTypeValue == 5) {
          if (!that.h5linkObj.name.trim() || !that.h5linkObj.url.trim()) {
            that.$message.error({
              duration: 1000,
              message: "请填写链接内容"
            })
            return;
          }
          if (!!that.h5linkObj.share && that.h5linkObj.shareWebType == 1 && !that.h5linkObj.shareUrl) {
            that.$message.error({
              duration: 1000,
              message: "请填写分享链接"
            })
            return;
          }
          that.selectLinkObj.conditionType = that.h5linkObj.conditionType;
          that.selectLinkObj.name = that.h5linkObj.name;
          that.selectLinkObj.url = that.h5linkObj.url;// +'?'+that.h5linkObj.fixParam+'&'+that.h5linkObj.dynamicPara;
          // 去掉固定参数 20180912 that.h5linkObj.fixParam
          that.selectLinkObj.params = '';
          if (!!that.dynamicList.length) {
            let h5DataList = JSON.parse(JSON.stringify(that.dynamicList))
            h5DataList.forEach(function(ele,index){
              delete ele.editAble;
              delete ele.selectKey;
              delete ele.inputValue;
            })
            that.selectLinkObj.params = h5DataList
          }

          that.selectLinkObj.share = (that.h5linkObj.share== true? 1:0)
          if (!!that.h5linkObj.share) {
            that.selectLinkObj.shareWebType = that.h5linkObj.shareWebType;
            if (that.h5linkObj.shareWebType == 1) {
              that.selectLinkObj.shareUrl = that.h5linkObj.shareUrl
            }
          }
          // that.selectLinkObj.fixParam = that.h5linkObj.fixParam;
          // that.selectLinkObj.dynamicPara = that.h5linkObj.dynamicPara;
          // 触发父组件方法,传递参数
          that.transData();
          return;
        }

        // 如果是第三方小程序
        if (that.oneLevelTypeValue == 7) {
          if (!this.twoLevelValue) {
            that.$message.error({
              duration: 1000,
              message: "请选择第三方小程序"
            })
          }
          // const reg = /^(http|https|www)(:\/\/)?.[A-Za-z]+.[A-Za-z]+.*/;
          // if (!reg.test(this.thirdObj.pagePath)) {
          //   this.$message.error({
          //     duration: 1000,
          //     message: "输入的网址不合法!"
          //   })
          //   return;
          // }
          this.twoLevelOptions.forEach(v => {
            if (v.value === this.twoLevelValue) {
              that.selectLinkObj.name = v.label;
              that.selectLinkObj.appid = v.value;
              // that.selectLinkObj.id = selectOneItem.linkId;
              // that.selectLinkObj.id = v.id;
            }
          })
          this.selectLinkObj.pagePath = this.thirdObj.pagePath;
          that.selectLinkObj.params = ''
          if (!!that.dynamicList.length) {
            let thirdDataList = JSON.parse(JSON.stringify(that.dynamicList))
            thirdDataList.forEach(function(ele,index){
              delete ele.editAble;
              delete ele.selectKey;
              delete ele.inputValue;
            })
            that.selectLinkObj.params = thirdDataList
          }
          // 触发父组件方法,传递参数
          that.transData();
          return;
        }

        // 如果选择的自定义页面
        if (that.oneLevelTypeValue == 6) {
          if (!that.twoLevelValue.trim()) {
            that.$message.error({
              duration: 1000,
              message: "请选择自定义页面"
            })
            return;
          }
          // 触发父组件方法,传递参数
          that.transData();
          return;
        }
        // 确定是会员功能 然后看是那个类型的
        if (this.linkId == 27) {
          if (this.visibleType == 8) {
            // 优惠券
            if (this.chooseFlag) {
              this.selectLinkObj.name = '积分商城/' + this.cardName;
              this.selectLinkObj.id = this.giftType;
              this.selectLinkObj.params = {
                integralMallProId: this.cardUrl
              };
              this.transData();
              return;
            } else {
              this.$message.warning({
                duration: 1000,
                message: "请选择卡券！"
              })
              return false;
            }
          } else if (this.visibleType == 9) {
            // 礼品
            if (this.giftFlag) {
              this.selectLinkObj.name = '积分商城/' + this.giftName;
              this.selectLinkObj.id = this.giftType;
              this.selectLinkObj.params = {
                integralMallProId: this.giftUrl
              };
              this.transData();
              return;
            } else {
              this.$message.warning({
                duration: 1000,
                message: "请选择礼品！"
              })
              return false;
            }
          }
        }

        if (this.linkId == 16) {
          if ( this.goodType == 10) {
            // 商品分类链接
            this.selectLinkObj.name = '商品分类链接/' + this.tagName;
            this.selectLinkObj.id = this.middleGoodId;
            this.selectLinkObj.params = {
              tagid: this.cardUrl,
              title: this.tagName
            };
            console.log(this.cardUrl);
            if (this.cardUrl) {
              this.transData();
            } else {
              this.$message.error({
                duration: 1000,
                message: "请选择链接"
              });
            }
            return false;
          } else if (this.goodType == 11) {
            this.selectLinkObj.name = '商城自定义页面/' + this.pageName;
            this.selectLinkObj.id = this.middleGoodId;
            this.selectLinkObj.params = {
              pageId: this.pageId,
              title: this.pageName
            };
            if (this.pageId) {
              this.transData();
            } else {
              this.$message.error({
                duration: 1000,
                message: "请选择链接"
              });
            }
            return false;
          }
          if (!this.twoLevelValue) {
            this.$message.error({
              duration: 1000,
              message: "请选择链接"
            });
          }
        }
        // 如果门店签到
        if(that.twoLevelSelectValue == 'sign'){
          if(!that.checkTwoLevel(that.twoLevelSelectValue)){
            return false;
          }
          return false;
        }
        // 如果是商品分类
        if(that.twoLevelSelectValue == 'goodsCate'){
          if(!that.checkTwoLevel(that.twoLevelSelectValue)){
            return false;
          }
          return false;
        }
        // 分享有赏
        if (this.linkId === 'yueshi') {
          this.selectLinkObj.id = this.linkId;
          this.selectLinkObj.name = '分享有赏';
          this.$emit('linkSelect', this.selectLinkObj);
          this.$emit('update:linkVisible', false);
          this.resetAll();
          return;
        }

        if (!!this.selectLinkObj.name && !!this.selectLinkObj.id) {
          // 触发父组件方法,传递参数
          this.transData();
        } else {
          this.$message.error({
            duration: 1000,
            message: "请选择链接"
          })
        }
      });
    },

    getMallId(item) {
      this.tagName = item.tagName;
      this.cardUrl = item.mallProTagId;
    },

    checkTwoLevel(v) {
      var that = this
      if (!that.threeLevelValue|| !that.threeLevelValue.length) {
        that.$message.error({
          duration: 1000,
          message: "请选择"+(v=='sign'?'门店':'商品分类')
        })
        return false;
      }
      that.selectLinkObj.url = that.selectLinkObj.url;// +'?'+that.threeLevelValue
      that.selectLinkObj.params = {
        "storeId": that.threeLevelValue
      }
      // 触发父组件方法,传递参数
      that.transData();
    },

    // 重置所有组件
    resetAll() {
      var that = this
      this.cardLinksVisible = false;
      this.visibleType = null;
      that.h5linkVisible = false;
      that.thirdlinkVisible = false; // 第三方小程序
      that.linksType = '';
      that.twoLevelVisible = false; // 二级下拉
      that.threeLevelVisible = false; // 三级整个
      that.goodsLinksVisible = false; // 商品列表隐藏
      that.twoLevelValue = ''; // 清空所有选择的
      that.twoLevelSelectValue = '';
      that.threeLevelValue = ''; // 清空所有选择的

      // h5新增部分
      that.dynamicRow = {
        key: '',
        value: '',
        selectKey: '',
        inputValue: '',
        editAble: false
      }
      that.dynamicList = [];

      // 第三方小程序
      this.thirdObj = {
        name: '',
        pagePath: '',
        appid: ''
      }

      that.selectLinkObj = {
        url: '',
        name: '',
        pagePath: ''
      }
      that.currentPage = 1;
      that.total = 0;
      that.pageSize = 9;
      that.searchGoods = '';
      that.classify = null;
      that.category = null;

      that.h5linkObj.name = '';
      that.h5linkObj.url = '';
      that.h5linkObj.fixParam = '';
      that.h5linkObj.dynamicPara ='';
      that.h5linkObj.share = false;
      that.h5linkObj.shareWebType = '0'; // 0：当前展示的页面, 1：分享出去的页面
      that.h5linkObj.shareUrl = ''; // 分享的页面链接
    },

    // 触发父组件方法,传递参数
    transData() {
      this.$emit('linkSelect', this.selectLinkObj);
      this.$emit('update:linkVisible', false);
      this.resetAll();
    },

    // 获取一级列表
    getLinksList(parentId, num, twoType) {
      var that = this;
      // 如果不传传的显示类型,设置
      twoType = twoType ? twoType : '';

      var para = {
        parentId: parentId,
        requestProject: that.repProjectName,
        linkScene: that.linkShowType
      }

      that.axios.post(that.baseUrl+'/api-plug/list-link-data',qs.stringify(para))
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {
          that.setLevelListOptions(parentId,resData.result,num,twoType)
          return;
        }

        that.$message.error({
          duration: 1000,
          message: resData.message
        })
      })
      .catch(function (error) {
            // that.toLogin()
            that.$message.error({
              duration: 1000,
              message: error.message
            })
          });
    },

    setLevelListOptions(parentId,result,num,twoType) {
      var that = this
      // 设置一级
      if (parentId == 0) {
        result.forEach(function(ele,index){
          ele.id = ele.linkId;
          ele.label = ele.name;
          ele.value = ele.linkId;
        })

        that.linksTypeOptions = result
        return;
      }
      // 设置二级
      if (num == 2 && result[0]) {
        result.forEach(function(ele,index){
          ele.id = ele.linkId;
          ele.label = ele.name;
          ele.value = ele.linkId
        })
        that.twoLevelOptions = result
        return;
      }

      // 设置三级
      if (num == 3 && result[0]) {
        // 如果是分类
        // if (twoType == 3) {
        //   return false;
        // }
        // 如果是单选下拉
        if (twoType == 0) {
          result.forEach(function(ele,index){
            ele.id = ele.linkId;
            ele.label = ele.name;
            ele.value = ele.linkId
          })
          that.threeLevelOptions = result
        }

        return;
      }
    },

    // 获取门店列表
    getStoreList(query,threeLevelValue) {
      var that = this
      var para = {
        searchParam: query,
        selectedIds: threeLevelValue.toString(),
        flag: null,
        requestProject: that.repProjectName
      }

      that.axios.post(that.baseUrl+'/api-plug/query-store-by-code-name',qs.stringify(para))
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {
          resData.result.forEach(function(ele,index){
            ele.id = ele.storeId;
            ele.label = ele.storeName;
            ele.value = ele.storeId
          })
          that.threeLevelOptions = resData.result
          return;
        }

        that.$message.error({
          duration: 1000,
          message: resData.message
        })
      })
      .catch(function (error) {
            that.$message.error({
              duration: 1000,
              message: error.message
            })
          });
    },


    toLogin() {
      var that = this;
      var para = {
        loginName: 'damogic',
        password: '1',
        eid: 'ff808081593917d90159398ec6340012'
      }

      that.axios.post(that.baseUrl+'/api-auth/do-login',qs.stringify(para))
      .then((res) => {
        that.getLinksList(0,1)
      })
      .catch(function (error) {
      })
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

    // dynamicChange
    dynamicChange(e) {
      var that = this
      that.dynamicRow.selectKey = e
    },
    dynamicBlur(e) {
      var that = this
      that.dynamicRow.inputValue = e.target.value
    },

    // 添加参数
    addDynamic() {
      var that = this
      if (!that.dynamicRow.key||!String(that.dynamicRow.value).trim()) {
        that.$message.error({
          duration: 1000,
          message: "请完善参数"
        })
        return
      }
      that.dynamicList.push(JSON.parse(JSON.stringify(that.dynamicRow)))
      var arrKeys = that.dynamicList.map(ite=>ite.key) // 返回对象中键值集合的数组
      var arrValues = that.dynamicList.map(ite=>ite.value)
      if (that.isRepeat(arrKeys) || that.isRepeat(arrValues)) {
        that.dynamicList.splice(that.dynamicList.length-1,1)
        // arrKeys.splice(that.dynamicList.length-1,1)
        that.$message.error({
          duration: 1000,
          message: "选项不能重复"
        })
        return;
      }

      // 添加对象到数组中
      // that.dynamicList.push(that.dynamicRow)

      // 删除一下
      this.dynamicRow.value = '';
      this.dynamicRow.key = null;
    },

    //  点击编辑
    editDynamic(index,obj) {
      var that = this
      obj.editAble = true
    },

    // 删除参数
    delDynamic(index) {
      var that = this
      that.dynamicList.splice(index,1)
    },

    // 确认编辑
    confirmDynamic(index,obj) {
      var that = this
      if (!obj.selectKey||!String(obj.inputValue).trim()) {
        that.$message.error({
          duration: 1000,
          message: "请完善参数"
        })
        return
      }

      // 判断重复字段
      var copyList = JSON.parse(JSON.stringify(that.dynamicList))
      copyList[index].key = obj.selectKey
      copyList[index].value = obj.inputValue
      var copyKeys = copyList.map(ite=>ite.key) // 返回对象中键值集合的数组
      var copyValues = copyList.map(ite=>ite.value)
      if (that.isRepeat(copyKeys) || that.isRepeat(copyValues)) {
        copyList.splice(copyList.length-1,1)
        // copyKeys.splice(copyList.length-1,1)
        that.$message.error({
          duration: 1000,
          message: "选项不能重复"
        })
        return;
      }

      obj.key = obj.selectKey;
      obj.value = obj.inputValue;
      // return;
      // 隐藏编辑部分
      obj.editAble = false;
    },

    // 取消编辑
    cancleDynamic(index,obj) {
      var that = this
      // 恢复原值
      obj.selectKey = obj.key
      obj.inputValue = obj.value
      // 隐藏编辑部分
      obj.editAble = false;
    }

  },

  watch: {
      linkVisible(val) {
        console.log(val);
        this.mylinkToolsVisible = val; // 新增linkToolsVisible的watch，监听变更并同步到linkToolsVisible上
      },
      // isWx(val) {
      //   var that = this
      //   that.isWxapp = val;
      // },
      showType(val) {
        var that = this
        that.linkShowType = val || 0;
      },
      projectName: function(newData,oldData){
        var that = this;
        that.repProjectName = newData || 'gic-web';
      },
  },

  mounted(){
    this.repProjectName = this.projectName || 'gic-web';
    // 获取 showType
    this.linkShowType = this.showType || 0;
    this.pageName = '';
    this.getLinksList(0,1)
  },

  components: {
    Treeselect,
    CardList,
    GiftList,
    GoodsTree
  }
}
</script>


<style lang="scss" scoped>
  .w200 {
    width:200px;
  }

  .p-l-7 {
    padding-left: 7px;
  }

  .p-l-47 {
    padding-left: 47px;
  }

  .el-tab-pane {
    min-height: 200px;
  }

  .vue-treeselect {
    display: inline-block;
    vertical-align: top;
  }

 /*  .vue-treeselect /deep/ .vue-treeselect__single-value {
    color: #ff0000;
   }*/

  .inline-block {
    display: inline-block;
  }

  .goods-link-content {
    padding: 15px 0 20px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    .goods-link-list {
      font-size: 0;
      li:nth-child(3n+3) {
        margin-right: 0;
      }
    }
  }
  .goods-link-item {
    display: inline-block;
    vertical-align: middle;
    width: 310px;
    padding: 10px 10px;
    height: 110px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-right: 7px;
    margin-bottom: 10px;
    cursor: pointer;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .goods-link-item img {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    display: inline-block;
    /*margin-top: 10px;*/
  }

  .goods-message{
    width: 65%;
    /*margin-top: 10px;*/
    vertical-align: top;
    margin-left: 8px;
    white-space: normal;
    word-break: break-all;
    font-size: 14px;
  }



  .links-tools-row /deep/ {
    /*overflow: hidden;*/
    font-size: 0;
    .vue-treeselect+.vue-treeselect{
      margin-left: 10px;
    }
  }

  .links-tools-row{
    /*overflow: hidden;*/
    font-size: 0;
    .vue-treeselect+.vue-treeselect{
      margin-left: 10px;
    }
  }

  /* 分页 */
  .links-tools-page {
    text-align: right;
  }

  .goods-category {
    height: 300px;
    overflow: auto;
  }

  /* 自定义 */
  .definepage {
    height: 300px;
    overflow: auto;
    .definepage-ul {
      li {
        height: 50px;
        line-height: 50px;
        cursor: pointer;
        &:hover {
          background: #f5f5f8;
        }

      }
    }
  }

  /************************************************/
  .links-types {
    font-size: 0;

    .types-title {
      display: inline-block;
      width: 72px;
      text-align: right;
      font-size: 14px;
      padding-right: 10px;
      vertical-align: middle;
    }

    .el-select+.el-select {
      margin-left: 10px;
    }

    .el-select.el-select--large+.el-select.el-select--large {
      margin-left: 10px;
    }

    /* 三级 wrap */
    .three-level-wrap {
      display: inline-block;
      vertical-align: top;
      margin-left: 10px;
    }

  }

  /* 商品链接 */
  .goods-links-contian {
    margin-top: 30px;
    padding: 20px;
    border: 1px solid #e8e8e8;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    .links-tools-row {
      font-size: 0;
    }

    .goods-link-item{
      &:hover {
        border: 1px solid #1890ff;
      }

      &.goodSelect {
        border: 1px solid #1890ff;
      }

      .limit-2 {
        width: 100%;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        white-space: pre-wrap;
        word-break: break-all;
        overflow: hidden;
        line-height: 18px;
        max-height: 36px;
      }

      .pro-name {
        color: #303133;
      }

      .pro-code {
        margin: 5px 0;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .gray-color {
        color: #909399;
        font-size: 14px;
        line-height: 18px;
      }

      .pro-price {
        display: inline-block;
        width: 100%;
        color: #303133;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  /* h5链接 */
  .h5link-row {
    width: 100%;
    margin-top: 22px;

    label {
      display: inline-block;
      vertical-align: middle;
      width: 71px;
      margin-right: 7px;
      text-align: right;
      &.h5link-dynamic-title {
        height: 48px;
        line-height: 48px;
      }
    }

    .el-input,.el-textarea {
      width: 450px;
    }

    .h5-el-input {
      width: 150px;
    }

    .el-textarea {
      vertical-align: top;
    }

    .h5link-help {
      padding-left: 10px;
      font-size: 10px;
      color: #5073FD;
    }

    .h5-table {
      width: calc(100% - 86px);
      display: inline-block;
      vertical-align: top;

      .el-table {
        width: auto;
        thead th, thead tr {
          background: #f1f3f7;
        }

        th {
          padding: 12px 0;
          min-width: 0;
          text-align: center;
          box-sizing: border-box;
          text-overflow: ellipsis;
          vertical-align: middle;
          position: relative;
        }
        td {
          text-align: center;
          padding: 5px 0;
        }

        .el-select {
          width: 150px;
        }
      }

      .el-table th {
          padding: 12px 0;
          min-width: 0;
          box-sizing: border-box;
          text-overflow: ellipsis;
          vertical-align: middle;
          position: relative;
      }
    }

    .dynamic-param-select {
      vertical-align: top;
    }
  }

  /* tab linktools*/

  .link-tools-contain /deep/ {
    .vue-treeselect-helper-zoom-effect-off {
      transform: none !important;
    }
    /**
     * Animations
     */
    @keyframes vue-treeselect-animation-fade-in {
      0% {
        opacity: 0;
      }
    }
    @keyframes vue-treeselect-animation-bounce {
      0%,
      100% {
        transform: scale(0);
      }
      50% {
        transform: scale(1);
      }
    }
    @keyframes vue-treeselect-animation-rotate {
      100% {
        transform: rotate(360deg);
      }
    }


    .vue-treeselect__menu  .vue-treeselect__option {
      padding-top: 4px;
      padding-bottom: 4px;
    }

    .vue-treeselect__menu .vue-treeselect__option--selected {
        background: #f0f7ff;
        font-weight: 600;
        padding-top: 4px;
        padding-bottom: 4px;
    }

    .vue-treeselect__menu .vue-treeselect__option--selected:hover {
        background: #f0f7ff;
    }

    .vue-treeselect__menu .vue-treeselect__option--highlight {
        background: #f5f7fa;
    }

    .vue-treeselect__menu .vue-treeselect__label-container {
      color: #606266;
    }

    .link-tools-contain .vue-treeselect__menu .vue-treeselect__option-arrow {
      color: #c0c4cc;
    }

    .link-tools-contain .vue-treeselect__option .vue-treeselect--branch-nodes-disabled .vue-treeselect__option:hover .vue-treeselect__option-arrow, .link-tools-contain .vue-treeselect__option .vue-treeselect__option-arrow-container:hover .vue-treeselect__option-arrow {
        color: #c0c4cc;
    }
    /**
     * Transitions
     */
    .vue-treeselect__multi-value-item--transition-enter-active,
    .vue-treeselect__multi-value-item--transition-leave-active {
      transition-duration: 200ms;
      transition-property: transform, opacity;
    }
    .vue-treeselect__multi-value-item--transition-enter-active {
      transition-timing-function: ease-out-circ;
    }
    .vue-treeselect__multi-value-item--transition-leave-active {
      transition-timing-function: ease-out-cubic;
      position: absolute;
    }
    .vue-treeselect__multi-value-item--transition-enter,
    .vue-treeselect__multi-value-item--transition-leave-to {
      transform: scale(0.7);
      opacity: 0;
    }
    .vue-treeselect__multi-value-item--transition-move {
      transition: 200ms transform ease-out-quart;
    }
    .vue-treeselect__menu--transition-enter-active,
    .vue-treeselect__menu--transition-leave-active {
      /* to be overriden */
    }
    .vue-treeselect__menu--transition-enter,
    .vue-treeselect__menu--transition-leave-to {
      /* to be overriden */
    }
    .vue-treeselect__list--transition-enter-active,
    .vue-treeselect__list--transition-leave-active {
      /* to be overriden */
    }
    .vue-treeselect__list--transition-enter,
    .vue-treeselect__list--transition-leave-to {
      /* to be overriden */
    }
    /**
     * Namespace
     */
    .vue-treeselect {
      position: relative;
      text-align: left;
    }
    .vue-treeselect div,
    .vue-treeselect span {
      box-sizing: border-box;
    }
    .vue-treeselect svg {
      fill: currentColor;
    }
    /**
     * Control
     */
    .vue-treeselect__control {
      padding-left: 5px;
      padding-right: 5px;
      display: table;
      table-layout: fixed;
      width: 100%;
      height: 36px;
      border: 1px solid #dcdfe6;
      border-radius: 5px;
      background: #fff;
      transition-duration: 200ms;
      transition-property: border-color, box-shadow, width, height, background-color, opacity;
      transition-timing-function: ease-out-cubic;
    }
    .vue-treeselect:not(.vue-treeselect--disabled):not(.vue-treeselect--focused) .vue-treeselect__control:hover {
      border-color: #dcdfe6;
    }
    .vue-treeselect--focused:not(.vue-treeselect--open) .vue-treeselect__control {
      border-color: #dcdfe6;
      box-shadow: none;
      /*box-shadow: 0 0 0 3px rgba(3, 155, 229, 0.1);*/
    }
    .vue-treeselect--disabled .vue-treeselect__control {
      background-color: #f9f9f9;
    }
    .vue-treeselect--open .vue-treeselect__control,
    .vue-treeselect__control:hover {
      border-color: #cfcfcf;
    }
    .vue-treeselect--open.vue-treeselect--open-below .vue-treeselect__control {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
    .vue-treeselect--open.vue-treeselect--open-above .vue-treeselect__control {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
    .vue-treeselect__value-container,
    .vue-treeselect__multi-value {
      width: 100%;
      vertical-align: middle;
    }
    .vue-treeselect__value-container {
      display: table-cell;
      position: relative;
    }
    .vue-treeselect--searchable:not(.vue-treeselect--disabled) .vue-treeselect__value-container {
      cursor: text;
    }
    .vue-treeselect__multi-value {
      display: inline-block;
    }
    .vue-treeselect--has-value .vue-treeselect__multi-value {
      margin-bottom: 5px;
    }
    .vue-treeselect__placeholder,
    .vue-treeselect__single-value {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-left: 5px;
      padding-right: 5px;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      line-height: 34px;
      user-select: none;
      pointer-events: none;
    }
    .vue-treeselect__placeholder {
      color: #BDBDBD;
    }
    .vue-treeselect__single-value {
      color: #333;
    }
    .vue-treeselect--focused.vue-treeselect--searchable .vue-treeselect__single-value {
      color: #BDBDBD;
    }
    .vue-treeselect__multi-value-item-container {
      display: inline-block;
      padding-top: 5px;
      padding-right: 5px;
      vertical-align: top;
    }
    .vue-treeselect__multi-value-item {
      display: inline-table;
      background: #E3F2FD;
      padding: 2px 0;
      border: 1px solid transparent;
      border-radius: 2px;
      color: #039BE5;
      font-size: 12px;
      vertical-align: top;
    }
    .vue-treeselect:not(.vue-treeselect--disabled) .vue-treeselect__multi-value-item:not(.vue-treeselect__multi-value-item-disabled):hover {
      cursor: pointer;
      background: #E3F2FD;
      color: #039BE5;
    }
    .vue-treeselect__multi-value-item.vue-treeselect__multi-value-item-disabled {
      cursor: default;
      background: #F5F5F5;
      color: #757575;
    }
    .vue-treeselect--disabled .vue-treeselect__multi-value-item {
      cursor: default;
      background: #fff;
      border-color: #e5e5e5;
      color: #555;
    }
    .vue-treeselect__value-remove,
    .vue-treeselect__multi-value-label {
      display: table-cell;
      padding: 0 5px;
      vertical-align: middle;
    }
    .vue-treeselect__value-remove {
      cursor: pointer;
      color: #039BE5;
      padding-left: 5px;
      border-left: 1px solid #fff;
      line-height: 0;
    }
    .vue-treeselect__multi-value-item:hover .vue-treeselect__value-remove {
      color: #E53935;
    }
    .vue-treeselect--disabled .vue-treeselect__value-remove,
    .vue-treeselect__multi-value-item-disabled .vue-treeselect__value-remove {
      display: none;
    }
    .vue-treeselect__value-remove > svg {
      width: 6px;
      height: 6px;
    }
    .vue-treeselect__multi-value-label {
      padding-right: 5px;
      white-space: pre-line;
      user-select: none;
    }
    .vue-treeselect__limit-tip {
      display: inline-block;
      padding-top: 5px;
      padding-right: 5px;
      vertical-align: top;
    }
    .vue-treeselect__limit-tip-text {
      cursor: default;
      display: block;
      margin: 2px 0;
      padding: 1px 0;
      color: #BDBDBD;
      font-size: 12px;
      font-weight: 600;
    }
    .vue-treeselect__input-container {
      display: block;
      max-width: 100%;
      outline: none;
    }
    .vue-treeselect--single .vue-treeselect__input-container {
      font-size: inherit;
      height: 100%;
    }
    .vue-treeselect--multi .vue-treeselect__input-container {
      display: inline-block;
      font-size: 12px;
      vertical-align: top;
    }
    .vue-treeselect--searchable .vue-treeselect__input-container {
      padding-left: 5px;
      padding-right: 5px;
    }
    .vue-treeselect--searchable.vue-treeselect--multi.vue-treeselect--has-value .vue-treeselect__input-container {
      padding-top: 5px;
      padding-left: 0;
    }
    .vue-treeselect--disabled .vue-treeselect__input-container {
      display: none;
    }
    .vue-treeselect__input,
    .vue-treeselect__sizer {
      margin: 0;
      line-height: inherit;
      font-family: inherit;
      font-size: inherit;
    }
    .vue-treeselect__input {
      max-width: 100%;
      margin: 0;
      padding: 0;
      border: 0;
      outline: none;
      box-sizing: content-box;
      box-shadow: none;
      background: none transparent;
      line-height: 1;
      vertical-align: middle;
    }
    .vue-treeselect__input::-ms-clear {
      display: none;
    }
    .vue-treeselect--single .vue-treeselect__input {
      width: 100%;
      height: 100%;
    }
    .vue-treeselect--multi .vue-treeselect__input {
      padding-top: 3px;
      padding-bottom: 3px;
    }
    .vue-treeselect--has-value .vue-treeselect__input {
      line-height: inherit;
      vertical-align: top;
    }
    .vue-treeselect__sizer {
      position: absolute;
      top: 0;
      left: 0;
      visibility: hidden;
      height: 0;
      overflow: scroll;
      white-space: pre;
    }
    .vue-treeselect__x-container {
      display: table-cell;
      vertical-align: middle;
      width: 20px;
      text-align: center;
      line-height: 0;
      cursor: pointer;
      color: #ccc;
      animation: 200ms vue-treeselect-animation-fade-in ease-out-circ;
    }
    .vue-treeselect__x-container:hover {
      color: #E53935;
    }
    .vue-treeselect__x {
      width: 8px;
      height: 8px;
    }
    .vue-treeselect__control-arrow-container {
      display: table-cell;
      vertical-align: middle;
      width: 20px;
      text-align: center;
      line-height: 0;
      cursor: pointer;
    }
    .vue-treeselect--disabled .vue-treeselect__control-arrow-container {
      cursor: default;
    }
    .vue-treeselect__control-arrow {
      width: 9px;
      height: 9px;
      color: #ccc;
    }
    .vue-treeselect:not(.vue-treeselect--disabled) .vue-treeselect__control-arrow-container:hover .vue-treeselect__control-arrow {
      color: #c0c4cc;
    }
    .vue-treeselect--disabled .vue-treeselect__control-arrow {
      opacity: 0.35;
    }
    .vue-treeselect__control-arrow--rotated {
      transform: rotateZ(180deg);
    }
    /**
     * Menu
     */
    .vue-treeselect__menu {
      cursor: default;
      padding-top: 5px;
      padding-bottom: 5px;
      display: block;
      position: absolute;
      right: 0;
      left: 0;
      z-index: 999;
      overflow-x: hidden;
      overflow-y: auto;
      border: 1px solid #dcdfe6;
      background: #fff;
      line-height: 180%;
      -webkit-overflow-scrolling: touch;
    }
    .vue-treeselect--open-below .vue-treeselect__menu {
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      top: 100%;
      margin-top: -1px;
      border-top-color: #dcdfe6;
      -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }
    .vue-treeselect--open-above .vue-treeselect__menu {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      bottom: 100%;
      margin-bottom: -1px;
      border-bottom-color: #f2f2f2;
    }
    .vue-treeselect__indent-level-0 .vue-treeselect__option {
      padding-left: 5px;
    }
    .vue-treeselect__indent-level-0 .vue-treeselect__tip {
      padding-left: 25px;
    }
    .vue-treeselect__indent-level-1 .vue-treeselect__option {
      padding-left: 25px;
    }
    .vue-treeselect__indent-level-1 .vue-treeselect__tip {
      padding-left: 45px;
    }
    .vue-treeselect__indent-level-2 .vue-treeselect__option {
      padding-left: 45px;
    }
    .vue-treeselect__indent-level-2 .vue-treeselect__tip {
      padding-left: 65px;
    }
    .vue-treeselect__indent-level-3 .vue-treeselect__option {
      padding-left: 65px;
    }
    .vue-treeselect__indent-level-3 .vue-treeselect__tip {
      padding-left: 85px;
    }
    .vue-treeselect__indent-level-4 .vue-treeselect__option {
      padding-left: 85px;
    }
    .vue-treeselect__indent-level-4 .vue-treeselect__tip {
      padding-left: 105px;
    }
    .vue-treeselect__indent-level-5 .vue-treeselect__option {
      padding-left: 105px;
    }
    .vue-treeselect__indent-level-5 .vue-treeselect__tip {
      padding-left: 125px;
    }
    .vue-treeselect__indent-level-6 .vue-treeselect__option {
      padding-left: 125px;
    }
    .vue-treeselect__indent-level-6 .vue-treeselect__tip {
      padding-left: 145px;
    }
    .vue-treeselect__indent-level-7 .vue-treeselect__option {
      padding-left: 145px;
    }
    .vue-treeselect__indent-level-7 .vue-treeselect__tip {
      padding-left: 165px;
    }
    .vue-treeselect__indent-level-8 .vue-treeselect__option {
      padding-left: 165px;
    }
    .vue-treeselect__indent-level-8 .vue-treeselect__tip {
      padding-left: 185px;
    }
    .vue-treeselect__option {
      padding-left: 5px;
      padding-right: 5px;
      display: table;
      table-layout: fixed;
      width: 100%;
    }
    .vue-treeselect__option--highlight {
      background: #f5f7fa;
    }
    .vue-treeselect--single .vue-treeselect__option--selected {
      background: #f0f7ff;
      font-weight: 600;
    }
    .vue-treeselect--single .vue-treeselect__option--selected:hover {
      background: #f0f7ff;
    }
    .vue-treeselect__option--hide {
      display: none;
    }
    .vue-treeselect__option-arrow-container,
    .vue-treeselect__option-arrow-placeholder {
      display: table-cell;
      vertical-align: middle;
      width: 20px;
      text-align: center;
      line-height: 0;
    }
    .vue-treeselect__option-arrow-container {
      cursor: pointer;
    }
    .vue-treeselect__option-arrow {
      display: inline-block;
      width: 9px;
      height: 9px;
      color: #ccc;
      vertical-align: middle;
      transition: 200ms transform ease-out-expo;
      transform: rotateZ(-90deg);
    }
    .vue-treeselect__option-arrow-container:hover .vue-treeselect__option-arrow,
    .vue-treeselect--branch-nodes-disabled .vue-treeselect__option:hover .vue-treeselect__option-arrow {
      color: #c0c4cc;
    }
    .vue-treeselect__option-arrow--rotated {
      transform: rotateZ(0);
    }
    .vue-treeselect__option-arrow--rotated.vue-treeselect__option-arrow--prepare-enter {
      transform: rotateZ(-90deg) !important;
    }
    .vue-treeselect__label-container {
      display: table-cell;
      vertical-align: middle;
      cursor: pointer;
      display: table;
      width: 100%;
      table-layout: fixed;
      color: inherit;
    }
    .vue-treeselect__option--disabled .vue-treeselect__label-container {
      cursor: not-allowed;
      color: rgba(0, 0, 0, 0.25);
    }
    .vue-treeselect__checkbox-container {
      display: table-cell;
      width: 20px;
      min-width: 20px;
      height: 100%;
      text-align: center;
      vertical-align: middle;
    }
    .vue-treeselect__checkbox {
      display: block;
      margin: auto;
      width: 12px;
      height: 12px;
      border-width: 1px;
      border-style: solid;
      border-radius: 2px;
      position: relative;
      transition: 200ms all ease-out-circ;
    }
    .vue-treeselect__check-mark,
    .vue-treeselect__minus-mark {
      display: block;
      position: absolute;
      left: 1px;
      top: 1px;
      background-repeat: no-repeat;
      opacity: 0;
      transition: 200ms all ease;
    }

    .vue-treeselect__checkbox--unchecked {
      border-color: #E0E0E0;
      background: #fff;
    }
    .vue-treeselect__label-container:hover .vue-treeselect__checkbox--unchecked {
      border-color: #039BE5;
      background: #fff;
    }
    .vue-treeselect__checkbox--indeterminate {
      border-color: #039BE5;
      background: #039BE5;
    }
    .vue-treeselect__label-container:hover .vue-treeselect__checkbox--indeterminate {
      border-color: #039BE5;
      background: #039BE5;
    }
    .vue-treeselect__checkbox--checked {
      border-color: #039BE5;
      background: #039BE5;
    }
    .vue-treeselect__label-container:hover .vue-treeselect__checkbox--checked {
      border-color: #039BE5;
      background: #039BE5;
    }
    .vue-treeselect__checkbox--disabled {
      border-color: #E0E0E0;
      background-color: #f7f7f7;
    }
    .vue-treeselect__label-container:hover .vue-treeselect__checkbox--disabled {
      border-color: #E0E0E0;
      background-color: #f7f7f7;
    }
    .vue-treeselect__label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: table-cell;
      padding-left: 5px;
      max-width: 100%;
      vertical-align: middle;
      cursor: inherit;
    }
    .vue-treeselect__count {
      font-weight: 400;
      opacity: 0.6;
    }
    .vue-treeselect__tip {
      padding-left: 5px;
      padding-right: 5px;
      display: table;
      table-layout: fixed;
      width: 100%;
      color: #757575;
    }
    .vue-treeselect__tip-text {
      display: table-cell;
      vertical-align: middle;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      padding-left: 5px;
      font-size: 12px;
    }
    .vue-treeselect__error-tip .vue-treeselect__retry {
      cursor: pointer;
      font-style: normal;
      font-weight: 600;
      text-decoration: none;
      color: #039BE5;
    }
    .vue-treeselect__icon-container {
      display: table-cell;
      vertical-align: middle;
      width: 20px;
      text-align: center;
      line-height: 0;
    }
    .vue-treeselect--single .vue-treeselect__icon-container {
      padding-left: 5px;
    }
    .vue-treeselect__icon-warning {
      display: block;
      margin: auto;
      border-radius: 50%;
      position: relative;
      width: 12px;
      height: 12px;
      background: #FB8C00;
    }
    .vue-treeselect__icon-warning::after {
      display: block;
      position: absolute;
      content: "";
      left: 5px;
      top: 2.5px;
      width: 2px;
      height: 1px;
      border: 0 solid #fff;
      border-top-width: 5px;
      border-bottom-width: 1px;
    }
    .vue-treeselect__icon-error {
      display: block;
      margin: auto;
      border-radius: 50%;
      position: relative;
      width: 12px;
      height: 12px;
      background: #E53935;
    }
    .vue-treeselect__icon-error::before,
    .vue-treeselect__icon-error::after {
      display: block;
      position: absolute;
      content: "";
      background: #fff;
      transform: rotate(45deg);
    }
    .vue-treeselect__icon-error::before {
      width: 6px;
      height: 2px;
      left: 3px;
      top: 5px;
    }
    .vue-treeselect__icon-error::after {
      width: 2px;
      height: 6px;
      left: 5px;
      top: 3px;
    }
    .vue-treeselect__icon-loader {
      display: block;
      margin: auto;
      position: relative;
      width: 12px;
      height: 12px;
      text-align: center;
      animation: 1.6s vue-treeselect-animation-rotate linear infinite;
    }
    .vue-treeselect__icon-loader::before,
    .vue-treeselect__icon-loader::after {
      border-radius: 50%;
      position: absolute;
      content: "";
      left: 0;
      top: 0;
      display: block;
      width: 100%;
      height: 100%;
      opacity: 0.6;
      animation: 1.6s vue-treeselect-animation-bounce ease-in-out infinite;
    }
    .vue-treeselect__icon-loader::before {
      background: #039BE5;
    }
    .vue-treeselect__icon-loader::after {
      background: #B3E5FC;
      animation-delay: -0.8s;
    }

    .vue-treeselect {
      display: inline-block;
      vertical-align: top;
    }
    .el-tabs__content {
      overflow: auto;
    }

    .el-dialog__body {
      border-bottom: 1px solid #e7e7eb;
    }

    .el-dialog__footer {
      padding: 10px 20px;
    }

    .el-tree {
      .el-tree-node {
        padding: 8px 0;
      }
    }

    .el-dialog {
      /*min-width: 1051px;*/

      .el-dialog__header {
        border-bottom: 1px solid #e7e7eb;
      }
    }

    .min-720 {
      .el-dialog {
        min-width: 720px;
      }
    }

    .min-1026 {
      .el-dialog {
        min-width: 1026px;
      }
    }

    .links-tools-input {
      width: 217px;
      vertical-align: top;
      float: right;

      /*/deep/ .el-input__inner{
        height: 36px;
        line-height: 36px;
      }*/
    }


    .vue-treeselect__single-value {
      line-height: 32px;
    }

    /* 不显示每页显示几个 */
    .el-pagination__sizes {
      display: none;
    }

    .vue-treeselect {
      width: 217px;
      font-size: 14px;

      .vue-treeselect__control {
        height: 32px;
        /*line-height: 36px;*/
        cursor: pointer;
      }

      .vue-treeselect__placeholder {
        line-height: 32px;
        font-size: 13.3333px;
      }

      .vue-treeselect--searchable:not(.vue-treeselect--disabled) .vue-treeselect__value-container {
        cursor: pointer;
      }
    }

    .vue-treeselect__control-arrow {
      display: none;
    }

    .vue-treeselect__control-arrow-container {
      position: relative;
    }

    .vue-treeselect__control-arrow-container:after, .vue-treeselect__control-arrow-container:before {
      border: 6px solid transparent;
      border-left: 6px solid #fff;
      width: 0;
      height: 0;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -6px;
      content: ' ';
      margin-top: -3px;
      -webkit-transform: rotate(90deg);
      -moz-transform: rotate(90deg);
      -o-transform: rotate(90deg);
      transform: rotate(90deg);
      -webkit-transition: -webkit-transform .3s;
      transition: -webkit-transform .3s;
      transition: transform .3s;
      transition: transform .3s, -webkit-transform .3s;
      transition: transform .3s,-webkit-transform .3s;
    }

    .vue-treeselect__control-arrow-container:before {
      border-left-color: #c0c4cc;
      top: 52%;
    }

    .vue-treeselect--focused .vue-treeselect__control-arrow-container:after, .vue-treeselect--focused .vue-treeselect__control-arrow-container:before {
      margin-top: -6px;
      -webkit-transform: rotateZ(-90deg);
      -moz-transform: rotateZ(-90deg);
      -o-transform: rotateZ(-90deg);
      transform: rotateZ(-90deg);
      -webkit-transition: -webkit-transform .3s;
      transition: -webkit-transform .3s;
      transition: transform .3s;
      transition: transform .3s, -webkit-transform .3s;
      transition: transform .3s,-webkit-transform .3s;
    }

    .vue-treeselect--focused .vue-treeselect__control-arrow-container:before {
      border-left-color: #c0c4cc;
      top: 47%;
    }

    .vue-treeselect--has-value .vue-treeselect__multi-value {
      margin-bottom: 0;
    }
  }
</style>
