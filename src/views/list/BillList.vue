<!--
 * @Author: szg
 * @Date: 2023-04-22 17:51:31
 * @LastEditors: szg
 * @LastEditTime: 2023-04-25 15:15:11
 * @FilePath: \bill-font\src\views\list\BillList.vue
-->
<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="月份">
                <a-select v-model="queryParam.billMonth" placeholder="请选择">
                  <a-select-option value="1">一月</a-select-option>
                  <a-select-option value="2">二月</a-select-option>
                  <a-select-option value="3">三月</a-select-option>
                  <a-select-option value="4">四月</a-select-option>
                  <a-select-option value="5">五月</a-select-option>
                  <a-select-option value="6">六月</a-select-option>
                  <a-select-option value="7">七月</a-select-option>
                  <a-select-option value="8">八月</a-select-option>
                  <a-select-option value="9">九月</a-select-option>
                  <a-select-option value="10">十月</a-select-option>
                  <a-select-option value="11">十一月</a-select-option>
                  <a-select-option value="12">十二月</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="类型">
                <a-select v-model="queryParam.category" placeholder="请选择">
                  <a-select-option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-button type="primary" @click="handleShow">分类统计</a-button>
      </div>

      <a-row>
        <a-col :span="12">
          <a-statistic title="收入" :precision="2" :value="expenditure || 0" style="margin-right: 50px" />
        </a-col>
        <a-col :span="12">
          <a-statistic title="支出" :precision="2" :value="income || 0" />
        </a-col>
      </a-row>

      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <span slot="category" slot-scope="text">
          <ellipsis length="20" tooltip>{{ categoryNameMap[text] }}</ellipsis>
        </span>
      </s-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        :categories="categories"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <count-list
        ref="createModal"
        :visible="countVisible"
        :countList="countList"
        @cancel="handleCountClose"
        @ok="handleCountClose"
      />
      <step-by-step-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-header-wrapper>
</template>

<script>
// import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getBillList, getCategoryList, createBill, getCountList } from '@/api/bill'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'
import CountList from './modules/CountList'

const columns = [
  {
    title: 'id',
    dataIndex: 'id'
  },
  {
    title: '账单类型',
    dataIndex: 'type',
    customRender: (text) => text === 1 ? '收入' : '支出'
  },
  {
    title: '账单时间',
    dataIndex: 'time'
  },
  {
    title: '账单分类',
    dataIndex: 'category',
    scopedSlots: { customRender: 'category' }
  },
  {
    title: '账单金额',
    dataIndex: 'amount'
  }
]

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal,
    CountList
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      countVisible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      categories: [],
      countList: [],
      categoryNameMap: {},
      categoryTypeMap: {},
      expenditure: 0,
      incomeSum: 0,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        this.handleGetCountList()
        return getBillList(requestParameters)
          .then(res => {
            if (res.errCode !== 0) return
            const obj = {
              data: res.billList,
              pageNo: res.pageNo,
              pageSize: res.pageSize,
              totalCount: res.count,
              totalPage: Math.ceil(res.count / 100)
            }
            this.expenditure = res.expenditureSum.sum
            this.income = res.incomeSum.sum
            return obj
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  async created () {
    const res = await getCategoryList()
    console.log('res', res)
    if (res.errCode === 0) {
      this.categories = res.categoryList
      res.categoryList.forEach(item => {
        this.categoryNameMap[item.id] = item.name
        this.categoryTypeMap[item.id] = item.type
      })
    }
    await this.handleGetCountList()
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    handleAdd () {
      this.mdl = null
      this.visible = true
    },

    handleShow () {
      this.countVisible = true
    },

    async handleGetCountList () {
      const res = await getCountList(this.queryParam)
      if (res.errCode === 0) {
        this.countList = res.billList.sort((a, b) => b.sum - a.sum).map(item => {
          const obj = {
            name: this.categoryNameMap[item.category],
            type: this.categoryTypeMap[item.category] === 0 ? '支出' : '收入',
            count: item.sum
          }
          return obj
        })
      }
    },

    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields(async (errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
              const time = Date.parse(new Date())
              const date = new Date()
              const month = date.getMonth() + 1
              values.time = time
              values.billMonth = month
              values.type = this.categoryTypeMap[values.category]
              delete values.id
              console.log('values---->', values)
              const res = await createBill(values)
              console.log('create res', res)
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
          }
        } else {
          this.confirmLoading = false
        }
      })
    },

    handleCountClose () {
      this.countVisible = false
    },

    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm () {
      this.queryParam = {}
    }
  }
}
</script>
