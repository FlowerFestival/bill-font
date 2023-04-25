<template>
  <a-modal
    title="新建"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="月份">
          <a-select placeholder="请选择" v-decorator="['billMonth', {rules: [{required: true}]}]">
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
        <a-form-item label="类型">
          <a-select placeholder="请选择" v-decorator="['category', {rules: [{required: true}]}]">
            <a-select-option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="金额">
          <a-input type="number" v-decorator="['amount', {rules: [{required: true}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import AdvancedForm from '@/views/form/advancedForm/AdvancedForm.vue'

// 表单字段
const fields = ['description', 'id']

export default {
  components: { AdvancedForm },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    },
    categories: {
      type: Array,
      default: () => []
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this)
    }
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
