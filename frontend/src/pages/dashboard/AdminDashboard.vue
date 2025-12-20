<template>
  <div class="q-pa-md">
    <!-- HEADER -->
    <q-card class="q-mb-lg">
      <q-card-section class="bg-primary text-white">
        <div class="text-h5 text-bold">Dashboard - Sua Empresa</div>
        <div class="text-caption">Visão de consumo e desempenho</div>
      </q-card-section>
    </q-card>

    <!-- LOADING -->
    <q-linear-progress v-if="loading" indeterminate color="primary" />

    <!-- MÉTRICAS PRINCIPAIS -->
    <div class="row q-gutter-md q-mb-lg" v-if="!loading && consumption">
      <!-- Usuários -->
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card>
          <q-card-section class="text-center">
            <div class="text-h4 text-bold text-primary">
              {{ consumption.users.current }}/{{ consumption.users.max }}
            </div>
            <div class="text-caption text-grey">Usuários</div>
            <q-linear-progress
              :value="consumption.users.percentage / 100"
              :color="getProgressColor(consumption.users.percentage)"
              class="q-mt-sm"
            />
            <div class="text-caption q-mt-xs">{{ consumption.users.percentage }}% utilizado</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Canais -->
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card>
          <q-card-section class="text-center">
            <div class="text-h4 text-bold text-info">
              {{ consumption.connections.current }}/{{ consumption.connections.max }}
            </div>
            <div class="text-caption text-grey">Canais Conectados</div>
            <q-linear-progress
              :value="consumption.connections.percentage / 100"
              :color="getProgressColor(consumption.connections.percentage)"
              class="q-mt-sm"
            />
            <div class="text-caption q-mt-xs">{{ consumption.connections.percentage }}% utilizado</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Mensagens -->
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card>
          <q-card-section class="text-center">
            <div class="text-h4 text-bold text-positive">
              {{ consumption.messages.current }}
            </div>
            <div class="text-caption text-grey">Mensagens este mês</div>
            <q-linear-progress
              :value="consumption.messages.percentage / 100"
              :color="getProgressColor(consumption.messages.percentage)"
              class="q-mt-sm"
            />
            <div class="text-caption q-mt-xs">Limite: {{ consumption.messages.max }}</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Armazenamento -->
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card>
          <q-card-section class="text-center">
            <div class="text-h4 text-bold text-warning">
              {{ formatStorage(consumption.storage.current) }}/{{ formatStorage(consumption.storage.max) }}
            </div>
            <div class="text-caption text-grey">Armazenamento</div>
            <q-linear-progress
              :value="consumption.storage.percentage / 100"
              :color="getProgressColor(consumption.storage.percentage)"
              class="q-mt-sm"
            />
            <div class="text-caption q-mt-xs">{{ consumption.storage.percentage }}% utilizado</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- RESUMO DO PLANO -->
    <q-card class="q-mb-lg" v-if="!loading && planInfo">
      <q-card-section>
        <div class="text-h6 text-bold q-mb-md">Seu Plano</div>
        <div class="row q-gutter-md">
          <div class="col-auto">
            <div class="text-bold">{{ planInfo.planName || 'Plano' }}</div>
            <div class="text-caption text-grey">Plano Ativo</div>
          </div>
          <div class="col-auto" v-if="planInfo.price">
            <div class="text-bold">R$ {{ planInfo.price }}/mês</div>
            <div class="text-caption text-grey">Valor mensal</div>
          </div>
          <div class="col-auto" v-if="planInfo.currentPeriodEnd">
            <div class="text-bold">{{ formatDate(planInfo.currentPeriodEnd) }}</div>
            <div class="text-caption text-grey">Próxima renovação</div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { GetTenantConsumption, GetTenantPlanInfo } from 'src/service/tenant-plan'

export default {
  name: 'AdminDashboard',
  data () {
    return {
      loading: true,
      consumption: null,
      planInfo: null
    }
  },
  methods: {
    async loadData () {
      try {
        this.loading = true

        const [consumptionRes, planRes] = await Promise.all([
          GetTenantConsumption(),
          GetTenantPlanInfo()
        ])

        this.consumption = consumptionRes.data.consumption
        this.planInfo = planRes.data
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
    getProgressColor (percentage) {
      if (percentage < 70) return 'positive'
      if (percentage < 85) return 'warning'
      return 'negative'
    },
    formatStorage (bytes) {
      if (!bytes) return '0 GB'
      const gb = bytes / 1073741824
      return gb.toFixed(2) + ' GB'
    },
    formatDate (date) {
      if (!date) return ''
      const d = new Date(date)
      return d.toLocaleDateString('pt-BR')
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
