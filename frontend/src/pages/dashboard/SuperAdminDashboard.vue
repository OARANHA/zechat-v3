<template>
  <div class="q-pa-md">
    <!-- HEADER -->
    <q-card class="q-mb-lg">
      <q-card-section class="bg-deep-orange text-white">
        <div class="text-h5 text-bold">🎛️ Dashboard SuperAdmin</div>
        <div class="text-caption">Controle granular de todas as empresas</div>
      </q-card-section>
    </q-card>

    <!-- LOADING -->
    <q-linear-progress v-if="loading" indeterminate color="deep-orange" />

    <!-- MÉTRICAS PRINCIPAIS -->
    <div class="row q-gutter-md q-mb-lg" v-if="!loading && metrics">
      <!-- Total de Empresas -->
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card class="bg-blue-1">
          <q-card-section class="text-center">
            <div class="text-h4 text-bold text-primary">
              {{ metrics.totalTenants }}
            </div>
            <div class="text-caption text-grey">Total de Empresas</div>
            <div class="text-caption text-positive">
              {{ metrics.activeTenants }} ativas
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Total de Usuários -->
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card class="bg-green-1">
          <q-card-section class="text-center">
            <div class="text-h4 text-bold text-positive">
              {{ metrics.totalUsers }}
            </div>
            <div class="text-caption text-grey">Usuários Ativos</div>
            <div class="text-caption">
              {{ metrics.metrics.avgUsersPerTenant.toFixed(1) }} por empresa
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Total de Canais -->
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card class="bg-cyan-1">
          <q-card-section class="text-center">
            <div class="text-h4 text-bold text-info">
              {{ metrics.totalConnections }}
            </div>
            <div class="text-caption text-grey">Canais Conectados</div>
            <div class="text-caption">
              {{ metrics.metrics.avgConnectionsPerTenant.toFixed(1) }} por empresa
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Receita Estimada -->
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card class="bg-amber-1">
          <q-card-section class="text-center">
            <div class="text-h5 text-bold text-amber">
              R$ {{ formatCurrency(metrics.estimatedRevenue.monthly) }}
            </div>
            <div class="text-caption text-grey">Receita Mensal</div>
            <div class="text-caption">
              R$ {{ formatCurrency(metrics.estimatedRevenue.estimatedYearly) }}/ano
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- GRÁFICOS -->
    <div class="row q-gutter-md q-mb-lg" v-if="!loading && metrics">
      <!-- Empresas por Status -->
      <div class="col-xs-12 col-md-6">
        <q-card>
          <q-card-section class="q-pa-md">
            <div class="text-bold q-mb-md">📊 Status das Empresas</div>
            <ApexChart
              type="donut"
              height="300"
              width="100%"
              :options="tenantsStatusChart"
              :series="tenantsStatusChart.series"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Tickets por Status -->
      <div class="col-xs-12 col-md-6">
        <q-card>
          <q-card-section class="q-pa-md">
            <div class="text-bold q-mb-md">🎫 Tickets</div>
            <ApexChart
              type="donut"
              height="300"
              width="100%"
              :options="ticketsChart"
              :series="ticketsChart.series"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- FILTROS E TABELA DE EMPRESAS -->
    <q-card>
      <q-card-section>
        <div class="text-h6 text-bold q-mb-md">📋 Empresas</div>
        <div class="row q-gutter-md q-mb-md">
          <q-input
            v-model="filterName"
            outlined
            dense
            placeholder="Pesquisar por nome..."
            class="col-grow"
            @input="filterTenants"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-select
            v-model="filterStatus"
            outlined
            dense
            emit-value
            map-options
            :options="statusOptions"
            option-value="value"
            option-label="label"
            class="col-auto"
            style="min-width: 150px"
            @input="filterTenants"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-table
          :data="filteredTenants"
          :columns="tenantsColumns"
          row-key="id"
          dense
          flat
          bordered
          :pagination.sync="pagination"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge
                :color="props.row.status === 'active' ? 'positive' : 'negative'"
              >
                {{ props.row.status === 'active' ? '✅ Ativa' : '❌ Inativa' }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-consumption="props">
            <q-td :props="props">
              <div class="text-caption">
                <div>👥 {{ props.row.consumption.users.current }}/{{ props.row.consumption.users.max }} usuários</div>
                <div>📱 {{ props.row.consumption.connections.current }}/{{ props.row.consumption.connections.max }} canais</div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <q-btn
                flat
                round
                dense
                icon="eye"
                size="sm"
                color="primary"
                @click="viewTenant(props.row)"
              >
                <q-tooltip>Ver detalhes</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- MODAL DE DETALHES DA EMPRESA -->
    <q-dialog v-model="showTenantDetails" size="lg">
      <q-card style="min-width: 500px" v-if="selectedTenant">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ selectedTenant.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <!-- Informações Básicas -->
          <div class="q-mb-md">
            <div class="text-bold q-mb-sm">Informações Básicas</div>
            <div class="row q-gutter-md">
              <div class="col-auto">
                <div class="text-caption text-grey">ID</div>
                <div class="text-body2">{{ selectedTenant.id }}</div>
              </div>
              <div class="col-auto">
                <div class="text-caption text-grey">Status</div>
                <q-badge :color="selectedTenant.status === 'active' ? 'positive' : 'negative'">
                  {{ selectedTenant.status === 'active' ? 'Ativa' : 'Inativa' }}
                </q-badge>
              </div>
              <div class="col-auto">
                <div class="text-caption text-grey">Proprietário</div>
                <div class="text-body2">{{ selectedTenant.owner.name }}</div>
              </div>
              <div class="col-auto">
                <div class="text-caption text-grey">Email</div>
                <div class="text-body2">{{ selectedTenant.owner.email }}</div>
              </div>
            </div>
          </div>

          <!-- Consumo -->
          <q-separator class="q-my-md" />
          <div class="text-bold q-mb-sm">Consumo</div>
          <div class="row q-gutter-md">
            <!-- Usuários -->
            <div class="col-xs-12 col-sm-6">
              <div class="text-caption text-grey">Usuários</div>
              <div class="text-h6 text-bold">{{ selectedTenant.consumption.users.current }}/{{ selectedTenant.consumption.users.max }}</div>
              <q-linear-progress
                :value="selectedTenant.consumption.users.percentage / 100"
                :color="getProgressColor(selectedTenant.consumption.users.percentage)"
              />
              <div class="text-caption q-mt-xs">{{ selectedTenant.consumption.users.percentage }}% utilizado</div>
            </div>

            <!-- Canais -->
            <div class="col-xs-12 col-sm-6">
              <div class="text-caption text-grey">Canais</div>
              <div class="text-h6 text-bold">{{ selectedTenant.consumption.connections.current }}/{{ selectedTenant.consumption.connections.max }}</div>
              <q-linear-progress
                :value="selectedTenant.consumption.connections.percentage / 100"
                :color="getProgressColor(selectedTenant.consumption.connections.percentage)"
              />
              <div class="text-caption q-mt-xs">{{ selectedTenant.consumption.connections.percentage }}% utilizado</div>
            </div>

            <!-- Mensagens -->
            <div class="col-xs-12 col-sm-6">
              <div class="text-caption text-grey">Mensagens (este mês)</div>
              <div class="text-h6 text-bold">{{ selectedTenant.consumption.messages.current }}</div>
              <q-linear-progress
                :value="selectedTenant.consumption.messages.percentage / 100"
                :color="getProgressColor(selectedTenant.consumption.messages.percentage)"
              />
              <div class="text-caption q-mt-xs">Limite: {{ selectedTenant.consumption.messages.max }}</div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import ApexChart from 'vue-apexcharts'
import { GetDashboardMetrics, GetTenantsWithConsumption } from 'src/service/admin-dashboard'

export default {
  name: 'SuperAdminDashboard',
  components: { ApexChart },
  data () {
    return {
      loading: true,
      metrics: null,
      allTenants: [],
      filteredTenants: [],
      filterName: '',
      filterStatus: 'all',
      showTenantDetails: false,
      selectedTenant: null,
      statusOptions: [
        { label: 'Todas', value: 'all' },
        { label: 'Ativas', value: 'active' },
        { label: 'Inativas', value: 'inactive' }
      ],
      tenantsStatusChart: {
        series: [],
        labels: [],
        colors: ['#21BA45', '#DB2828']
      },
      ticketsChart: {
        series: [],
        labels: [],
        colors: ['#F2711C', '#00B4D8']
      },
      tenantsColumns: [
        {
          name: 'name',
          label: 'Empresa',
          field: 'name',
          align: 'left'
        },
        {
          name: 'status',
          label: 'Status',
          field: 'status',
          align: 'center',
          style: 'width: 100px'
        },
        {
          name: 'consumption',
          label: 'Consumo',
          field: 'consumption',
          align: 'left'
        },
        {
          name: 'actions',
          label: 'Ações',
          field: 'actions',
          align: 'center',
          style: 'width: 80px'
        }
      ],
      pagination: {
        sortBy: 'name',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      }
    }
  },
  methods: {
    async loadData () {
      try {
        this.loading = true

        const [metricsRes, tenantsRes] = await Promise.all([
          GetDashboardMetrics(),
          GetTenantsWithConsumption()
        ])

        this.metrics = metricsRes.data
        this.allTenants = tenantsRes.data
        this.filteredTenants = this.allTenants
        this.pagination.rowsNumber = this.allTenants.length

        this.setupCharts()
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Erro ao carregar dashboard',
          caption: error.message
        })
      } finally {
        this.loading = false
      }
    },
    setupCharts () {
      // Gráfico de Status
      this.tenantsStatusChart = {
        series: [
          this.metrics.tenantsByStatus.active,
          this.metrics.tenantsByStatus.inactive
        ],
        labels: ['Ativas', 'Inativas'],
        colors: ['#21BA45', '#DB2828']
      }

      // Gráfico de Tickets
      this.ticketsChart = {
        series: [
          this.metrics.totalTickets.open,
          this.metrics.totalTickets.closed
        ],
        labels: ['Abertos', 'Fechados'],
        colors: ['#F2711C', '#00B4D8']
      }
    },
    filterTenants () {
      let filtered = this.allTenants

      if (this.filterName) {
        filtered = filtered.filter(t =>
          t.name.toLowerCase().includes(this.filterName.toLowerCase())
        )
      }

      if (this.filterStatus !== 'all') {
        filtered = filtered.filter(t => t.status === this.filterStatus)
      }

      this.filteredTenants = filtered
      this.pagination.rowsNumber = filtered.length
    },
    viewTenant (tenant) {
      this.selectedTenant = tenant
      this.showTenantDetails = true
    },
    getProgressColor (percentage) {
      if (percentage < 70) return 'positive'
      if (percentage < 85) return 'warning'
      return 'negative'
    },
    formatCurrency (value) {
      return value.toFixed(2).replace('.', ',')
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>

<style scoped>
.q-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
