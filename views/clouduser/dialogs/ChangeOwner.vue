<template>
  <base-dialog @cancel="cancelDialog">
    <div slot="header">{{ $t('cloudenv.clouduser_list_a2') }}</div>
    <div slot="body">
      <dialog-selected-tips :name="$t('dictionary.clouduser')" :count="params.data.length" :action="$t('cloudenv.clouduser_list_a2')" />
      <dialog-table class="mb-2" :data="params.data" :columns="params.columns.slice(0, 3)" />
      <a-form
        :form="form.fc"
        v-bind="formItemLayout">
        <a-form-item :label="$t('cloudenv.clouduser_list_t4')">
          <template v-if="userLoading">
            <a-spin />
          </template>
          <template v-else>
            <user-select
              v-decorator="decorators.user_id"
              :project.sync="form.fi.project"
              :cloudaccount-id="params.cloudaccount.id"
              :default-domain-id="defaultDomain"
              :default-domain-name="defaultDomainName"
              :default-user-id="defaultUser"
              :default-project-id="defaultProject"
              :cloudprovider-id="params.data[0].cloudprovider_id" />
          </template>
        </a-form-item>
      </a-form>
    </div>
    <div slot="footer">
      <a-button type="primary" @click="handleConfirm" :loading="loading">{{ $t('dialog.ok') }}</a-button>
      <a-button @click="cancelDialog">{{ $t('dialog.cancel') }}</a-button>
    </div>
  </base-dialog>
</template>

<script>
import UserSelect from '../components/UserSelect'
import DialogMixin from '@/mixins/dialog'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'ClouduserChangeOwnerDialog',
  components: {
    UserSelect,
  },
  mixins: [DialogMixin, WindowsMixin],
  data () {
    return {
      loading: false,
      userLoading: false,
      defaultDomain: '',
      defaultUser: '',
      defaultDomainName: '',
      form: {
        fc: this.$form.createForm(this),
        fi: {
          project: {},
        },
      },
      decorators: {
        user_id: [
          'user_id',
          {
            rules: [
              { required: true, message: this.$t('common.select') },
            ],
          },
        ],
      },
      formItemLayout: {
        wrapperCol: {
          span: 20,
        },
        labelCol: {
          span: 4,
        },
      },
    }
  },
  destroyed () {
    this.um = null
  },
  created () {
    this.um = new this.$Manager('users', 'v1')
    if (this.params.data[0].owner_id) {
      this.getOwnerInfo()
    }
  },
  methods: {
    async getOwnerInfo () {
      this.userLoading = true
      try {
        const { data } = await this.um.get({ id: this.params.data[0].owner_id })
        this.defaultDomain = data.domain_id
        this.defaultUser = data.id
        this.defaultProject = data.tenant_id
        this.defaultDomainName = data.project_domain
      } finally {
        this.userLoading = false
      }
    },
    async handleConfirm () {
      this.loading = true
      try {
        const values = await this.form.fc.validateFields()
        values.project_id = this.form.fi.project.id
        await this.params.onManager('performAction', {
          id: this.params.data[0].id,
          steadyStatus: 'available',
          managerArgs: {
            action: 'change-owner',
            data: values,
          },
        })
        this.cancelDialog()
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
