<script>
export default {
  name: 'CreatePrepareNets',
  props: {
    type: {
      type: String,
      default: 'hosts',
    },
    prepareNetData: {
      type: Object,
      required: true,
    },
  },
  computed: {
    listData () {
      const _ = this.prepareNetData[`${this.type}s`]
      const networks = this.prepareNetData[`${this.type}_suggested_networks`]
      const _listData = []
      if (!_ || _.length === 0) return []
      const formatIps = (row) => {
        if (row.ip_nets && row.ip_nets.length > 0) {
          return row.ip_nets.map(item => item.ip)
        }
        return row.ip ? [row.ip] : []
      }
      const formatSuitable = (row) => {
        const { ips } = row
        // ip为空 默认为true
        if (!ips || !ips.length) return true
        for (let i = 0; i < networks.length; i++) {
          const { guest_ip_start, guest_ip_end } = networks[i]
          if (ips.indexOf(guest_ip_start) > -1 || ips.indexOf(guest_ip_end) > -1) {
            return true
          }
        }
        return false
      }
      let items = []
      let j = 0
      for (let i = 0; i < _.length; i++) {
        const row = _[i]
        row.ips = formatIps(row)
        this.$set(row, 'isSuitable', formatSuitable(row))
        items.push(_[i])
        if (_.length === 1) {
          _listData.push(items)
          return _listData
        }
        if (j >= 1) {
          _listData.push(items)
          items = []
          j = 0
        } else {
          ++j
        }
      }
      return _listData
    },
  },
  methods: {
    formatStatus (status) {
      return (
        <div style="display: inline-block;">
          {status
            ? <a-icon class="success-color" type="check-circle" style="font-size: 19px" />
            : <a-icon class="error-color" type="close-circle" style="font-size: 19px" />
          }
        </div>
      )
    },
  },
  render () {
    const Thead = () => {
      const tds = [<td>序号</td>, <td> 名称 </td>, <td> { this.type === 'host' ? '宿主机IP' : '虚拟机IP' }</td>, <td>网络是否满足</td>]
      return (
        <tr class="thead">
          { (this.listData && this.listData.length > 0) ? this.listData[0].map(() => tds) : null }
        </tr>
      )
    }
    const Tbody = () => {
      let index = 0
      const trs = this.listData.map(rows => {
        return <tr>
          {
            rows.map(row => {
              const tds = []
              const o = {
                index: ++index,
                name: row.name,
                ips: row.ips,
                status: this.formatStatus(row.isSuitable),
              }
              Object.keys(o).forEach(k => {
                if (k === 'ips') {
                  tds.push(
                    <td>{ o.ips.map(ip => ip) }</td>,
                  )
                } else {
                  tds.push(
                    <td>
                      {o[k]}
                    </td>,
                  )
                }
              })
              return tds
            })
          }
        </tr>
      })
      return trs
    }
    return (
      <div class="prepare-content">
        <table class="prepare-table">
          <tbody>
            <Thead />
            <Tbody />
          </tbody>
        </table>
      </div>
    )
  },
}
</script>

<style lang="scss" scoped>
  .prepare-content{
    max-height: 300px;
    overflow: auto;
  }
  .prepare-table{
    width: 100%;
    margin-top: 30px;
    .thead{
      td {
        padding: 5px;
        font-weight: 600;
      }
    }
    td {
      font-size: 12px;
      color: #60626E;
      padding: 7px;
      border: 1px solid #e8eaec;
      text-align: center
    }
  }
</style>