<template>
  <div class="gift-list">
    <div class="links-tools-row">
      <el-select v-model="giftVal" style="width: 200px;" placeholder="礼品类型" clearable @change="handleChange">
        <el-option
          v-for="item in giftOptions"
          :key="item.integralMallCategoryId"
          :label="item.categoryName"
          :value="item.integralMallCategoryId"
        ></el-option>
      </el-select>
      <el-input v-model="giftName" style="width: 200px; margin-left: 20px;" placeholder="输入礼品名称" @keyup.native.enter="handleSearch"></el-input>
    </div>

    <div class="goods-link-content">
      <ul class="goods-link-list">
        <li
          class="goods-link-item"
          v-for="(item, index) in goodsList"
          :key="index"
          :class="activeIndex == index ? 'good-highlight' : ''"
          @click="selectGoodLinkItem(item, index)"
        >
          <img :src="item.mainImageUrl" class="img" alt="商品图片">
          <div class="inline-block goods-message">
            <p class="limit-2 pro-name">{{item.proName}}</p>
            <p class="gray-color pro-code pro-name">所需积分：{{item.integralCost}}</p>
            <p class="pro-price pro-name">所需现金：{{item.cashCost}}</p>
          </div>
        </li>
      </ul>
    </div>

    <div class="links-tools-page" v-if="total > 0">
      <el-pagination
        @current-change="handleChangePage"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import qs from "qs";

export default {
  name: "gift-list",

  props: {
    pname: String
  },

  data() {
    return {
      currentPage: 1,
      activeIndex: -1,
      pageSize: 6,
      total: 0,
      giftVal: null,
      giftOptions: [],
      goodsList: [],
      giftName: ""
    };
  },

  created() {
    const host = window.location.origin;
    this.baseUrl = host.indexOf('localhost') > -1 ? 'http://gicdev.demogic.com' : host;
  },

  methods: {
    // 分类
    getGiftList() {
      this.axios
        .get(`${this.baseUrl}/api-integral-mall/load-category?requestProject=gic-web`)
        .then(res => {
          const resData = res.data;
          if (resData.errorCode === 0) {
            if (!!resData.result && resData.result.length) {
              this.giftOptions = resData.result;
            }
          }
        });
    },
    // 分页换页
    handleChangePage(val) {
      this.currentPage = val;
      this.getData();
    },

    handleChange() {
      this.currentPage = 1;
      this.getData();
    },

    // 分页数据 integralCost积分费用 cashCost现金费用 proName
    getData() {
      const params = {
        requestProject: 'gic-web',
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        category: this.giftVal,
        giftName: this.giftName,
        changeType: -1,
        releaseType: -1,
        showStatus: 1,
        porHot: -1
      };

      this.axios.post(`${this.baseUrl}/api-integral-mall/page-gift`, qs.stringify(params))
        .then(res => {
        const data = res.data;
        if (data.errorCode == 0) {
          if (!!data.result && data.result.rows) {
            this.goodsList = data.result.rows;
          }
          this.total = data.result.total || 0;
        }
      });
    },

    selectGoodLinkItem(item, i) {
      this.activeIndex = i;
      this.$emit('pass-gift', item);
    },

    handleSearch() {
      this.currentPage = 1;
      this.getData();
    }
  },

  mounted() {
    this.getGiftList();
    this.getData();
  }
};
</script>

<style scoped>
.links-tools-row {
  margin-bottom: 10px;
}
.links-tools-row .goods-link-item {
  display: inline-block;
  vertical-align: middle;
  width: 307px;
  padding: 8px;
  margin-right: 7px;
  margin-bottom: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
}
.links-tools-row .goods-link-item .img{
  display: inline-block;
  vertical-align: middle;
  width: 80px;
  height: 80px;
}
.links-tools-page {
  text-align: right;
}
.links-tools-row .goods-link-item:hover {
  cursor: pointer;
  border-color: #1890ff;
}
.links-tools-row .goods-link-item .goods-message {
  margin-left: 10px;
  padding: 5px;
  width: 198px;
  box-sizing: border-box;
  font-size: 12px;
}
.links-tools-row .good-highlight {
  border-color: #1890ff;
}
.goods-link-item .goods-message .pro-name{
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin: 8px 0;
}
</style>
