<template>
  <div class="q-pa-sm">
    <q-card class="q-my-md">
      <q-card-section class="row justify-between items-center">
        <div class="col-12 justify-center flex q-gutter-sm">
          <q-datetime-picker
            style="width: 200px"
            dense
            rounded
            hide-bottom-space
            outlined
            stack-label
            bottom-slots
            label="Data/Hora Agendamento"
            mode="date"
            color="primary"
            format24h
            v-model="params.startDate"
          />
          <q-datetime-picker
            style="width: 200px"
            dense
            rounded
            hide-bottom-space
            outlined
            stack-label
            bottom-slots
            label="Data/Hora Agendamento"
            mode="date"
            color="primary"
            format24h
            v-model="params.endDate"
          />
          <q-select
            style="width: 300px"
            dense
            rounded
            outlined
            hide-bottom-space
            emit-value
            map-options
            multiple
            options-dense
            use-chips
            label="Filas"
            color="primary"
            v-model="params.queuesIds"
            :options="filas"
            :input-debounce="700"
            option-value="id"
            option-label="queue"
            input-style="width: 280px; max-width: 280px;"
          />
          <q-btn
            rounded
            color="primary"
            icon="refresh"
            label="Atualizar"
            @click="getDashData"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-my-md q-pa-sm">
      <q-card-section class="q-pa-md">
        <div class="row q-gutter-md justify-center">
          <div class="col-xs-12 col-sm-shrink">
            <q-card flat bordered class="my-card full-height" style="min-width: 200px">
              <q-card-section class="text-center">
                <p class="text-h4 text-bold text-center">
                  {{ ticketsAndTimes.qtd_total_atendimentos }}
                </p>
                Total Atendimentos
              </q-card-section>
            </q-card>
          </div>

          <div class="col-xs-12 col-sm-shrink">
            <q-card flat bordered class="my-card full-height" style="min-width: 200px">
              <q-card-section class="text-center">
                <p class="text-h4 text-bold text-center">
                  {{ ticketsAndTimes.qtd_demanda_ativa }}
                </p>
                Ativo
              </q-card-section>
            </q-card>
          </div>

          <div class="col-xs-12 col-sm-shrink">
            <q-card flat bordered class="my-card full-height" style="min-width: 200px">
              <q-card-section class="text-center">
                <p class="text-h4 text-bold text-center">
                  {{ ticketsAndTimes.qtd_demanda_receptiva }}
                </p>
                Receptivo
              </q-card-section>
            </q-card>
          </div>

          <div class="col-xs-12 col-sm-shrink">
            <q-card flat bordered class="my-card full-height" style="min-width: 200px">
              <q-card-section class="text-center">
                <p class="text-h4 text-bold text-center">
                  {{ ticketsAndTimes.new_contacts }}
                </p>
                Novos Contatos
              </q-card-section>
            </q-card>
          </div>

          <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2">
            <q-card flat bordered class="my-card full-height">
              <q-card-section class="text-center">
                <p class="text-h5 text-bold text-center">
                  {{ cTmaFormat }}
                </p>
                Tempo Médio Atendimento (TMA)
              </q-card-section>
            </q-card>
          </div>

          <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2">
            <q-card flat bordered class="my-card full-height">
              <q-card-section class="text-center">
                <p class="text-h5 text-bold text-center">
                  {{ cTmeFormat }}
                </p>
                Tempo Médio 1º Resposta
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-6">
        <q-card>
          <q-card-section class="q-pa-md">
            <ApexChart
              type="donut"
              height="300"
              width="100%"
              :options="ticketsChannelsOptions"
              :series="ticketsChannelsOptions.series"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6">
        <q-card>
          <q-card-section class="q-pa-md">
            <ApexChart
              type="donut"
              height="300"
              width="100%"
              :options="ticketsQueueOptions"
              :series="ticketsQueueOptions.series"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card class="q-my-md">
      <q-card-section>
        <ApexChart
          type="bar"
          height="300"
          width="100%"
          :options="ticketsEvolutionChannelsOptions"
          :series="ticketsEvolutionChannelsOptions.series"
        />
      </q-card-section>
    </q-card>

    <q-card class="q-my-md">
      <q-card-section class="q-pa-md">
        <ApexChart
          type="line"
          height="300"
          width="100%"
          :options="ticketsEvolutionByPeriodOptions"
          :series="ticketsEvolutionByPeriodOptions.series"
        />
      </q-card-section>
    </q-card>

    <q-card class="q-my-md q-pa-sm">
      <q-card-section class="q-pa-md">
        <q-table
          title="Performance Usuários"
          :data="ticketsPerUsersDetail"
          :columns="TicketsPerUsersDetailColumn"
          row-key="email"
          :pagination.sync="paginationTableUser"
          :rows-per-page-options="[0]"
          bordered
          flat
          hide-bottom
        >
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div class="row col text-bold">
                {{ props.row.name || 'Não informado' }}
              </div>
              <div class="row col text-caption">
                {{ props.row.email }}
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { groupBy } from 'lodash'
import { ListarFilas } from 'src/service/filas'
import {
  GetDashTicketsAndTimes,
  GetDashTicketsChannels,
  GetDashTicketsEvolutionChannels,
  GetDashTicketsQueue,
  GetDashTicketsEvolutionByPeriod,
  GetDashTicketsPerUsersDetail
} from 'src/service/estatisticas'
import { subDays, format, formatDuration, differenceInDays } from 'date-fns'
import ApexChart from 'vue-apexcharts'

export default {
  name: 'IndexDashboard',
  components: { ApexChart },
  data () {
    return {
      configWidth: {
        horizontal: false,
        width: this.$q.screen.width
      },
      params: {
        startDate: format(subDays(new Date(), 6), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        queuesIds: []
      },
      paginationTableUser: {
        rowsPerPage: 40,
        rowsNumber: 0,
        lastIndex: 0
      },
      filas: [],
      ticketsChannels: [],
      ticketsChannelsOptions: {
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'vertical',
            shadeIntensity: 0.05,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },
        chart: {
          toolbar: {
            show: true
          }
        },
        legend: {
          position: 'bottom'
        },
        title: {
          text: 'Atendimento por canal'
        },
        noData: {
          text: 'Sem dados aqui!',
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: '14px',
            fontFamily: undefined
          }
        },
        series: [0],
        labels: ['Carregando...'],
        theme: {
          mode: 'light',
          palette: 'palette1'
        },
        plotOptions: {
          pie: {
            dataLabels: {
              offset: -10
            }
          }
        },
        dataLabels: {
          enabled: true,
          textAnchor: 'middle',
          style: {
            fontSize: '16px',
            offsetY: '150',
            fontFamily: 'Helvetica, Arial, sans-serif'
          },
          offsetX: 0
        }
      },
      ticketsQueue: [],
      ticketsQueueOptions: {
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'vertical',
            shadeIntensity: 0.05,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },
        chart: {
          toolbar: {
            show: true
          }
        },
        legend: {
          position: 'bottom'
        },
        title: {
          text: 'Atendimento por fila'
        },
        noData: {
          text: 'Sem dados aqui!',
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: '14px',
            fontFamily: undefined
          }
        },
        series: [0],
        labels: ['Carregando...'],
        theme: {
          mode: 'light',
          palette: 'palette1'
        },
        plotOptions: {
          pie: {
            dataLabels: {
              offset: -10
            }
          }
        },
        dataLabels: {
          enabled: true,
          textAnchor: 'middle',
          style: {
            fontSize: '16px',
            offsetY: '150',
            fontFamily: 'Helvetica, Arial, sans-serif'
          },
          offsetX: 0
        }
      },
      ticketsEvolutionChannels: [],
      ticketsEvolutionChannelsOptions: {
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000
        },
        chart: {
          type: 'bar',
          stacked: true,
          stackType: '100%',
          toolbar: {
            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false
            }
          }
        },
        theme: {
          mode: 'light',
          palette: 'palette1'
        },
        grid: {
          show: true,
          strokeDashArray: 0
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'vertical',
            shadeIntensity: 0.05,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },
        dataLabels: {
          enabled: true
        },
        title: {
          text: 'Evolução por canal',
          align: 'left'
        },
        stroke: {
          width: 0
        },
        xaxis: {
          type: 'category',
          categories: [],
          tickPlacement: 'on'
        },
        yaxis: {
          title: {
            text: 'Atendimentos',
            style: {
              color: '#FFF'
            }
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return Number(val).toFixed(0)
            }
          }
        },
        series: [{
          name: 'Carregando...',
          data: [0]
        }]
      },
      ticketsEvolutionByPeriod: [],
      ticketsEvolutionByPeriodOptions: {
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000
        },
        theme: {
          mode: 'light',
          palette: 'palette1'
        },
        chart: {
          toolbar: {
            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false
            }
          }
        },
        grid: {
          show: true,
          strokeDashArray: 0,
          xaxis: {
            lines: {
              show: true
            }
          }
        },
        stroke: {
          width: [4, 4, 4]
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'vertical',
            shadeIntensity: 0.05,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },
        title: {
          text: 'Evolução atendimentos',
          align: 'left'
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1]
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: 'Atendimentos'
          }
        },
        tooltip: {
          shared: false,
          x: {
            show: false
          },
          y: {
            formatter: function (val) {
              return Number(val).toFixed(0)
            }
          }
        },
        legend: {
          show: false
        },
        series: [{
          name: 'Carregando...',
          type: 'column',
          data: [0]
        },
        {
          type: 'line',
          data: [0]
        }]
      },
      ticketsAndTimes: {
        qtd_total_atendimentos: 0,
        qtd_demanda_ativa: 0,
        qtd_demanda_receptiva: 0,
        tma: null,
        tme: null,
        new_contacts: 0
      },
      ticketsPerUsersDetail: [],
      TicketsPerUsersDetailColumn: [
        {
          name: 'name',
          label: 'Usuário',
          field: 'name',
          align: 'left',
          style: 'width: 300px;',
          format: (v, r) => {
            return v ? `${r.name} | ${r.email}` : 'Não informado'
          }
        },
        {
          name: 'qtd_pendentes',
          label: 'Pendentes',
          field: 'qtd_pendentes'
        },
        {
          name: 'qtd_em_atendimento',
          label: 'Atendendo',
          field: 'qtd_em_atendimento'
        },
        {
          name: 'qtd_resolvidos',
          label: 'Finalizados',
          field: 'qtd_resolvidos'
        },
        {
          name: 'qtd_por_usuario',
          label: 'Total',
          field: 'qtd_por_usuario'
        },
        {
          name: 'tme',
          label: 'T.M.E',
          field: 'tme',
          align: 'center',
          headerStyle: 'text-align: center !important',
          format: v => formatDuration(v || {}) || ''
        },
        {
          name: 'tma',
          label: 'T.M.A',
          field: 'tma',
          align: 'center',
          headerStyle: 'text-align: center !important',
          format: v => formatDuration(v || {}) || ''
        }
      ]
    }
  },
  watch: {
    '$q.dark.isActive' () {
      this.$router.go()
    },
    '$q.screen.width' () {
      this.setConfigWidth()
    }
  },
  computed: {
    cTmaFormat () {
      const tma = this.ticketsAndTimes.tma || {}
      return formatDuration(tma) || ''
    },
    cTmeFormat () {
      const tme = this.ticketsAndTimes.tme || {}
      return formatDuration(tme) || ''
    }
  },
  methods: {
    async listarFilas () {
      try {
        const { data } = await ListarFilas()
        this.filas = Array.isArray(data) ? data : []
      } catch (e) {
        console.error(e)
        this.filas = []
      }
    },
    setConfigWidth () {
      const diffDays = differenceInDays(new Date(this.params.endDate), new Date(this.params.startDate))
      if (diffDays > 30) {
        this.configWidth = { horizontal: true, width: 2200 }
      } else {
        const actualWidth = this.$q.screen.width
        this.configWidth = {
          horizontal: true,
          width: actualWidth - (actualWidth < 768 ? 40 : 100)
        }
      }
    },
    getDashTicketsAndTimes () {
      GetDashTicketsAndTimes(this.params)
        .then(res => {
          const dados = Array.isArray(res.data) ? res.data : []
          this.ticketsAndTimes = dados[0] || {
            qtd_total_atendimentos: 0,
            qtd_demanda_ativa: 0,
            qtd_demanda_receptiva: 0,
            tma: null,
            tme: null,
            new_contacts: 0
          }
        })
        .catch(err => {
          console.error(err)
          this.ticketsAndTimes = {
            qtd_total_atendimentos: 0,
            qtd_demanda_ativa: 0,
            qtd_demanda_receptiva: 0,
            tma: null,
            tme: null,
            new_contacts: 0
          }
        })
    },
    getDashTicketsQueue () {
      GetDashTicketsQueue(this.params)
        .then(res => {
          const dados = Array.isArray(res.data) ? res.data : []
          let series = []
          let labels = []

          if (dados.length > 0) {
            dados.forEach(e => {
              series.push(+e.qtd || 0)
              labels.push(e.label || 'Sem label')
            })
          } else {
            series = [0]
            labels = ['Sem dados']
          }

          this.ticketsQueueOptions = {
            ...this.ticketsQueueOptions,
            series: series && series.length > 0 ? series : [0],
            labels: labels && labels.length > 0 ? labels : ['Sem dados']
          }
        })
        .catch(err => {
          console.error(err)
          this.ticketsQueueOptions = {
            ...this.ticketsQueueOptions,
            series: [0],
            labels: ['Erro ao carregar']
          }
        })
    },
    getDashTicketsChannels () {
      GetDashTicketsChannels(this.params)
        .then(res => {
          const dados = Array.isArray(res.data) ? res.data : []
          let series = []
          let labels = []

          if (dados.length > 0) {
            dados.forEach(e => {
              series.push(+e.qtd || 0)
              labels.push(e.label || 'Sem label')
            })
          } else {
            series = [0]
            labels = ['Sem dados']
          }

          this.ticketsChannelsOptions = {
            ...this.ticketsChannelsOptions,
            series: series && series.length > 0 ? series : [0],
            labels: labels && labels.length > 0 ? labels : ['Sem dados']
          }
        })
        .catch(err => {
          console.error(err)
          this.ticketsChannelsOptions = {
            ...this.ticketsChannelsOptions,
            series: [0],
            labels: ['Erro ao carregar']
          }
        })
    },
    getDashTicketsEvolutionChannels () {
      GetDashTicketsEvolutionChannels(this.params)
        .then(res => {
          const dados = Array.isArray(res.data) ? res.data : []
          if (!dados.length) {
            this.ticketsEvolutionChannelsOptions = {
              ...this.ticketsEvolutionChannelsOptions,
              series: [{
                name: 'Sem dados',
                data: [0]
              }],
              labels: ['Sem dados'],
              xaxis: {
                ...this.ticketsEvolutionChannelsOptions.xaxis,
                categories: ['Sem dados']
              }
            }
            return
          }

          const dataLabel = groupBy(dados, 'dt_referencia')
          const labels = Object.keys(dataLabel)

          const agrupadoPorLabel = groupBy(dados, 'label')
          let series = Object.keys(agrupadoPorLabel).map(chave => ({
            name: chave,
            data: agrupadoPorLabel[chave].map(d => d.qtd || 0)
          }))

          if (!series.length) {
            series = [{
              name: 'Sem dados',
              data: [0]
            }]
          }

          this.ticketsEvolutionChannelsOptions = {
            ...this.ticketsEvolutionChannelsOptions,
            series,
            labels: labels && labels.length > 0 ? labels : ['Sem dados'],
            xaxis: {
              ...this.ticketsEvolutionChannelsOptions.xaxis,
              categories: labels && labels.length > 0 ? labels : ['Sem dados']
            }
          }
        })
        .catch(error => {
          console.error(error)
          this.ticketsEvolutionChannelsOptions = {
            ...this.ticketsEvolutionChannelsOptions,
            series: [{
              name: 'Erro',
              data: [0]
            }],
            labels: ['Erro ao carregar'],
            xaxis: {
              ...this.ticketsEvolutionChannelsOptions.xaxis,
              categories: ['Erro ao carregar']
            }
          }
        })
    },
    getDashTicketsEvolutionByPeriod () {
      GetDashTicketsEvolutionByPeriod(this.params)
        .then(res => {
          const dados = Array.isArray(res.data) ? res.data : []
          let labels = []
          const series = [
            {
              name: 'Atendimentos',
              type: 'column',
              data: []
            },
            {
              type: 'line',
              data: []
            }
          ]

          if (dados.length > 0) {
            dados.forEach(e => {
              series[0].data.push(+e.qtd || 0)
              labels.push(e.label || 'Sem label')
            })
            series[1].data = [...series[0].data]
          } else {
            series[0].data = [0]
            series[1].data = [0]
            labels = ['Sem dados']
          }

          this.ticketsEvolutionByPeriodOptions = {
            ...this.ticketsEvolutionByPeriodOptions,
            labels: labels && labels.length > 0 ? labels : ['Sem dados'],
            series: series && series.length > 0 ? series : [{
              name: 'Atendimentos',
              type: 'column',
              data: [0]
            },
            {
              type: 'line',
              data: [0]
            }],
            xaxis: {
              ...this.ticketsEvolutionByPeriodOptions.xaxis,
              categories: labels && labels.length > 0 ? labels : ['Sem dados']
            }
          }
        })
        .catch(error => {
          console.error(error)
          this.ticketsEvolutionByPeriodOptions = {
            ...this.ticketsEvolutionByPeriodOptions,
            series: [{
              name: 'Atendimentos',
              type: 'column',
              data: [0]
            },
            {
              type: 'line',
              data: [0]
            }],
            labels: ['Erro ao carregar'],
            xaxis: {
              ...this.ticketsEvolutionByPeriodOptions.xaxis,
              categories: ['Erro ao carregar']
            }
          }
        })
    },
    getDashTicketsPerUsersDetail () {
      GetDashTicketsPerUsersDetail(this.params)
        .then(res => {
          this.ticketsPerUsersDetail = Array.isArray(res.data) ? res.data : []
        })
        .catch(error => {
          console.error(error)
          this.ticketsPerUsersDetail = []
        })
    },
    getDashData () {
      this.setConfigWidth()
      this.getDashTicketsAndTimes()
      this.getDashTicketsChannels()
      this.getDashTicketsEvolutionChannels()
      this.getDashTicketsQueue()
      this.getDashTicketsEvolutionByPeriod()
      this.getDashTicketsPerUsersDetail()
    }
  },
  beforeMount () {
    const mode = this.$q.dark.isActive ? 'dark' : 'light'
    const theme = {
      mode,
      palette: 'palette1',
      monochrome: {
        enabled: true,
        color: '#0288d1',
        shadeTo: mode,
        shadeIntensity: 0.95
      }
    }
    this.ticketsQueueOptions = { ...this.ticketsQueueOptions, theme }
    this.ticketsChannelsOptions = { ...this.ticketsChannelsOptions, theme }
    this.ticketsEvolutionChannelsOptions = { ...this.ticketsEvolutionChannelsOptions, theme }
    this.ticketsEvolutionByPeriodOptions = { ...this.ticketsEvolutionByPeriodOptions, theme }
  },
  mounted () {
    this.listarFilas()
    this.getDashData()
  }
}
</script>

<style lang="scss">
.apexcharts-theme-dark svg {
  background: none !important;
}
</style>
