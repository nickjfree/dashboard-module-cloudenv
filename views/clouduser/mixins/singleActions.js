export default {
  created () {
    this.singleActions = [
      {
        label: this.$t('cloudenv.clouduser_list_a2'),
        permission: 'clouduser_perform_change_owner',
        action: (obj) => {
          this.createDialog('ClouduserChangeOwnerDialog', {
            data: [obj],
            onManager: this.onManager,
            columns: this.columns,
            cloudaccount: this.cloudaccount,
          })
        },
      },
      {
        label: this.$t('common.text00109'),
        actions: obj => {
          return [
            {
              label: this.$t('cloudenv.clouduser_list_a1'),
              permission: 'clouduser_perform_set_groups',
              action: () => {
                this.createDialog('ClouduserSetGroupsDialog', {
                  data: [obj],
                  onManager: this.onManager,
                  columns: this.columns,
                  cloudaccount: this.cloudaccount,
                  success: () => {
                    this.$bus.$emit('CloudgroupListForClouduserSidepageRefresh')
                  },
                })
              },
            },
            {
              label: this.$t('common.delete'),
              permission: 'clouduser_delete',
              action: () => {
                this.createDialog('DeleteResDialog', {
                  vm: this,
                  data: [obj],
                  columns: this.columns,
                  title: this.$t('common.delete'),
                  name: this.$t('dictionary.clouduser'),
                  onManager: this.onManager,
                })
              },
              meta: () => this.$getDeleteResult(obj),
            },
          ]
        },
      },
    ]
  },
}