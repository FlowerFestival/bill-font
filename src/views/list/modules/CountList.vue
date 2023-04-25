
<template>
  <a-modal
    title="分类统计"
    :width="640"
    :visible="visible"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-table :dataSource="countList" :columns="columns" :pagination="false" />
  </a-modal>
</template>

<script>
const columns = [
  {
    title: '账单类型',
    dataIndex: 'name'
  },
  {
    title: '类型',
    dataIndex: 'type'
  },
  {
    title: '总计',
    dataIndex: 'count'
  }
]
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    countList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    this.columns = columns
    return {

    }
  }
}
</script>
