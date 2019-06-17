<template>
  <div>
    <div class="filter-list">
      <el-select v-model="cardType" style="width: 200px;" placeholder="卡券类型" clearable @change="handleChange">
        <el-option
          v-for="item in cardOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input v-model="cardName" style="width: 200px; margin-left: 20px;" clear placeholder="输入卡券名称" @keyup.native.enter="handleSearch"></el-input>
    </div>

    <el-table
      ref="multipleTable"
      :data="cardData"
      class="card-table"
      tooltip-effect="dark"
      style="width: 100%"
      @row-click="handleCurrentChangeRow"
      >
      <el-table-column label width="55">
        <template slot-scope="scope">
          <el-radio class="radio-style" :label="scope.row.integralMallProId" v-model="radio">&nbsp;</el-radio>
        </template>
      </el-table-column>

      <el-table-column label="卡券名称" prop="cardName" >
      </el-table-column>
      <el-table-column prop="proSubName" label="备注名"></el-table-column>
      <el-table-column prop="integralCost" label="兑换限制"></el-table-column>
      <el-table-column prop="virtualStock" label="库存"></el-table-column>
    </el-table>
    <div class="pagination" v-if="total>0">
      <el-pagination
        @current-change="cardCurrentChange"
        :current-page="cardCurrentPage"
        small
        :page-size="cardPageSize"
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import qs from "qs";

export default {
  name: "card-list",

  props: {
    pname: String
  },

  data() {
    return {
      cardType: null, // 卡券类型
      cardOptions: [
        { value: 1, label: '折扣券' },
        { value: 0, label: '抵金券' }
      ],
      cardName: '',
      radio: null,
      cardCurrentPage: 1,
      cardPageSize: 5,
      cardLimitType: 1,
      cardData: [],
      total: 0
    };
  },

  methods: {
    // 当某行点击的时候
    handleCurrentChangeRow(row) {
      this.$nextTick(_ => {
        // if (row.integralMallProId == this.radio) {
          this.$emit('pass-id', row);
        // }
      });
    },
    getCardList() {
      var param = {
        currentPage: this.cardCurrentPage,
        pageSize: this.cardPageSize,
        requestProject: this.pname,
        cardType: this.cardType,
        proName: this.cardName
      };
      this.axios
        .get(this.baseUrl + "/api-integral-mall/page-cards-plug", {params: param})
        .then(res => {
          const resData = res.data;
          if (resData.errorCode == 0) {
            if (!!resData.result) {
              if (!!resData.result.rows) {
                this.cardData = resData.result.rows;
              } else {
                this.cardData = [];
              }
              this.total = resData.result.total;
            }
          } else {
            this.$message.error({ duration: 1000, message: resData.message });
          }
        })
        .catch(error => {
          this.$message.error({
            duration: 10000,
            message: error.message
          });
        });
    },
    // 当前切换分页
    cardCurrentChange(val) {
      this.cardCurrentPage = val;
      this.getCardList();
    },
    handleChange(val) {
      this.cardCurrentPage = 1;
      this.getCardList();
    },
    handleSearch() {
      this.cardCurrentPage = 1;
      this.getCardList();
    }
  },

  created() {
    const host = window.location.origin;
    this.baseUrl = host.indexOf('localhost') > -1 ? 'http://gicdev.demogic.com' : host;
  },

  mounted() {
    this.getCardList();
  }
};
</script>

<style scoped>
.filter-list {
  margin-bottom: 10px;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>

