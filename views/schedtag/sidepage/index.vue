<template>
  <base-side-page
    @cancel="cancelSidePage"
    :title="$t('cloudenv.text_18')"
    icon="res-schedtag"
    :res-name="detailData.name"
    :actions="params.actions"
    :current-tab="params.windowData.currentTab"
    :loaded="loaded"
    :tabs="detailTabs"
    @tab-change="handleTabChange">
    <template v-slot:actions>
      <actions :options="singleActions" :row="detailData" button-type="link" button-size="small" />
    </template>
    <component :is="params.windowData.currentTab" :data="detailData" :on-manager="onManager" :res-id="data.id" :getParams="getParams" />
  </base-side-page>
</template>

<script>
import SingleActionsMixin from '../mixins/singleActions'
import ColumnsMixin from '../mixins/columns'
import SchedtagDetail from './Detail'
import Dashboard from './Dashboard'
import HostList from '@Compute/views/host/components/List'
import PhysicalmachineList from '@Compute/views/physicalmachine/components/List'
import storageList from '@Storage/views/blockstorage/components/List'
import networkList from '@Network/views/network/components/List'
import SidePageMixin from '@/mixins/sidePage'
import WindowsMixin from '@/mixins/windows'
import Actions from '@/components/PageList/Actions'

export default {
  name: 'SchedtagSidePage',
  components: {
    Actions,
    SchedtagDetail,
    HostList,
    Dashboard,
    PhysicalmachineList,
    storageList,
    networkList,
  },
  mixins: [SidePageMixin, WindowsMixin, SingleActionsMixin, ColumnsMixin],
  data () {
    return {
      detailTabs: [
        { label: this.$t('cloudenv.text_237'), key: 'schedtag-detail' },
        { label: this.$t('cloudenv.text_424'), key: 'physicalmachine-list' },
        { label: this.$t('cloudenv.text_101'), key: 'host-list' },
        { label: this.$t('cloudenv.text_6'), key: 'storage-list' },
        { label: this.$t('cloudenv.text_7'), key: 'network-list' },
        { label: this.$t('cloudenv.text_319'), key: 'dashboard' },
        { label: this.$t('cloudenv.text_15'), key: 'event-drawer' },
      ],
    }
  },
  computed: {
    getParams () {
      const params = {
        'physicalmachine-list': {
          details: true,
          schedtag: this.data.id,
          baremetal: true,
        },
        'host-list': {
          detail: true,
          schedtag: this.data.id,
          baremetal: false,
        },
      }
      return params[this.params.windowData.currentTab] || {
        details: true,
        schedtag: this.data.id,
      }
    },
  },
}
</script>
