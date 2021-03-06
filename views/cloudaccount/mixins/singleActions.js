import { mapGetters } from 'vuex'
import { changeToArr } from '@/utils/utils'
import expectStatus from '@/constants/expectStatus'
import { getEnabledSwitchActions } from '@/utils/common/tableActions'
import i18n from '@/locales'

const steadyStatus = {
  status: Object.values(expectStatus.cloudaccount).flat(),
  sync_status: Object.values(expectStatus.cloudaccountSyncStatus).flat(),
}

export default {
  computed: {
    ...mapGetters(['l3PermissionEnable']),
  },
  created () {
    this.singleActions = [
      {
        label: i18n.t('cloudenv.text_105'),
        permission: 'cloudaccounts_perform_sync',
        action: (obj) => {
          this.onManager('performAction', {
            id: obj.id,
            steadyStatus,
            managerArgs: {
              action: 'sync',
              data: {
                full_sync: true,
                force: true,
              },
            },
          })
        },
        meta: (obj) => this.syncPolicy(obj),
      },
      {
        label: i18n.t('cloudenv.text_311'),
        actions: obj => {
          const ownerDomain = this.$store.getters.isAdminMode || obj.domain_id === this.$store.getters.userInfo.projectDomainId
          return [
            {
              label: i18n.t('cloudenv.text_106'),
              permission: 'cloudaccounts_perform_enable_auto_sync,cloudaccounts_perform_disable_auto_sync',
              action: () => {
                this.createDialog('CloudaccountSetAutoSyncDialog', {
                  data: [obj],
                  columns: this.columns,
                  onManager: this.onManager,
                  steadyStatus,
                })
              },
              meta: () => this.setAutoSyncPolicy(obj, ownerDomain),
            },
            {
              label: i18n.t('cloudenv.text_298'),
              permission: 'cloudaccounts_perform_update_credential',
              action: obj => {
                this.createDialog('CloudaccountUpdateDialog', {
                  data: [obj],
                  columns: this.columns,
                  onManager: this.onManager,
                })
              },
              meta: obj => {
                let tooltip
                if (!obj.enabled) tooltip = i18n.t('cloudenv.text_312')
                return {
                  validate: obj.enabled && ownerDomain,
                  tooltip,
                }
              },
            },
            {
              label: i18n.t('cloudenv.text_168'),
              permission: 'cloudaccounts_perform_update_credential',
              action: obj => {
                this.$router.push({
                  name: 'CloudaccountUpdateBill',
                  query: {
                    id: obj.id,
                    provider: obj.provider,
                  },
                })
              },
              meta: obj => {
                return {
                  validate: this.$appConfig.isPrivate && ['Aws', 'Aliyun', 'Google', 'Huawei', 'Azure'].indexOf(obj.brand) > -1 && ownerDomain,
                }
              },
            },
            {
              label: i18n.t('cloudenv.text_107'),
              permission: 'cloudaccounts_perform_sync',
              action: () => {
                this.onManager('performAction', {
                  id: obj.id,
                  steadyStatus,
                  managerArgs: {
                    action: 'sync',
                  },
                })
              },
              meta: () => {
                let tooltip
                if (!obj.enabled) tooltip = i18n.t('cloudenv.text_312')
                if (obj.enable_auto_sync) tooltip = i18n.t('cloudenv.text_313')
                return {
                  validate: (obj.enabled && !obj.enable_auto_sync) && ownerDomain,
                  tooltip,
                }
              },
            },
            {
              label: i18n.t('cloudenv.text_281'),
              action: () => {
                this.createDialog('CloudaccountSetShareDialog', {
                  data: [obj],
                  columns: this.columns,
                  onManager: this.onManager,
                  steadyStatus,
                })
              },
              meta: () => {
                let tooltip = ''
                if (!this.l3PermissionEnable) {
                  tooltip = i18n.t('cloudenv.text_314')
                } else if (!this.$store.getters.isAdminMode) {
                  tooltip = i18n.t('cloudenv.text_315')
                }
                return {
                  validate: this.l3PermissionEnable && this.$store.getters.isAdminMode,
                  tooltip,
                }
              },
            },
            {
              label: i18n.t('cloudenv.text_316'),
              permission: 'proxysettings_list',
              action: () => {
                this.createDialog('UpdateProxySettingDialog', {
                  title: i18n.t('cloudenv.text_316'),
                  data: [obj],
                  columns: this.columns,
                  onManager: this.onManager,
                })
              },
              meta: () => {
                return {
                  validate: ownerDomain,
                }
              },
            },
            ...getEnabledSwitchActions(this, obj, ['cloudaccounts_perform_enable', 'cloudaccounts_perform_disable'], {
              metas: [
                () => {
                  return {
                    validate: !obj.enabled && ownerDomain,
                  }
                },
                () => {
                  return {
                    validate: obj.enabled && ownerDomain,
                  }
                },
              ],
            }),
            {
              label: i18n.t('cloudenv.text_108'),
              permission: 'cloudaccounts_delete',
              action: () => {
                this.createDialog('DeleteResDialog', {
                  vm: this,
                  data: [obj],
                  columns: this.columns,
                  title: i18n.t('cloudenv.text_109'),
                  name: this.$t('dictionary.cloudaccount'),
                  onManager: this.onManager,
                })
              },
              meta: () => {
                const deleteResult = this.$getDeleteResult(obj)
                if (!deleteResult.validate) {
                  return deleteResult
                }
                return {
                  validate: ownerDomain,
                }
              },
            },
          ]
        },
      },
    ]
  },
  methods: {
    syncPolicy (item) {
      let tooltip
      const items = changeToArr(item)
      if (!items.length) return { validate: false }
      const enabledValid = items.every(obj => {
        if (!obj.enabled) {
          tooltip = i18n.t('cloudenv.text_312')
          return false
        }
        return true
      })
      const autoSyncValid = items.every(obj => {
        if (obj.enable_auto_sync) {
          tooltip = i18n.t('cloudenv.text_313')
          return false
        }
        return true
      })
      const ownerDomain = this.$store.getters.isAdminMode || items.every(obj => obj.domain_id === this.$store.getters.userInfo.projectDomainId)
      return {
        validate: enabledValid && autoSyncValid && ownerDomain,
        tooltip,
      }
    },
    setAutoSyncPolicy (item, ownerDomain) {
      let tooltip
      const items = changeToArr(item)
      if (!items.length) return { validate: false }
      const enabledValid = items.every(obj => {
        if (!obj.enabled) {
          tooltip = i18n.t('cloudenv.text_312')
          return false
        }
        return true
      })
      return {
        validate: enabledValid && ownerDomain,
        tooltip,
      }
    },
  },
}
