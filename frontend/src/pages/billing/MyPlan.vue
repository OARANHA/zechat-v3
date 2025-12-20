<template>
  <div class="q-pa-md">
    <!-- HEADER -->
    <q-card class="q-mb-lg">
      <q-card-section class="bg-primary text-white">
        <div class="text-h5 text-bold">Meu Plano e Consumo</div>
        <div class="text-caption">Acompanhe seu uso do serviço</div>
      </q-card-section>
    </q-card>

    <!-- LOADING -->
    <q-linear-progress v-if="loading" indeterminate color="primary" />

    <!-- PLANO ATUAL -->
    <q-card class="q-mb-lg" v-if="!loading && planInfo">
      <q-card-section>
        <div class="text-h6 text-bold q-mb-md">📋 Plano Atual</div>
        <div class="row q-gutter-md">
          <div class="col-xs-12 col-sm-6">
            <div class="text-bold text-primary">{{ planInfo.planName }}</div>
            <div class="text-caption text-grey">Plano</div>
          </div>
          <div class="col-xs-12 col-sm-6">
            <div class="text-bold text-primary">R$ {{ formatPrice(planInfo.price) }}/mês</div>
            <div class="text-caption text-grey">Preço</div>
          </div>
          <div class="col-xs-12 col-sm-6">
            <div class="text-bold" :class="planInfo.status === 'active' ? 'text-positive' : 'text-negative'">
              ✅ {{ planInfo.status === 'active' ? 'Ativo' : 'Inativo' }}
            </div>
            <div class="text-caption text-grey">Status</div>
          </div>
          <div class="col-xs-12 col-sm-6">
            <div class="text-bold text-primary">{{ formatDate(planInfo.currentPeriodEnd) }}</div>
            <div class="text-caption text-grey">Próxima Renovação</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- CONSUMO -->
    <q-card class="q-mb-lg" v-if="!loading && consumption">
      <q-card-section>
        <div class="text-h6 text-bold q-mb-md">📊 Consumo do Seu Plano</div>

        <!-- USUÁRIOS -->
        <div class="q-mb-lg">
          <div class="row items-center q-mb-sm">
            <div class="col">
              <div class="text-bold">👥 Usuários</div>
              <div class="text-caption text-grey">{{ consumption.consumption.users.current }} / {{ consumption.consumption.users.max }}</div>
            </div>
            <div class="col-auto">
              <q-badge :color="getStatusColor(consumption.consumption.users.status)">
                {{ consumption.consumption.users.percentage }}%
              </q-badge>
            </div>
          </div>
          <q-linear-progress
            :value="consumption.consumption.users.percentage / 100"
            :color="getStatusColor(consumption.consumption.users.status)"
            size="8px"
          />
        </div>

        <!-- CANAIS -->
        <div class="q-mb-lg">
          <div class="row items-center q-mb-sm">
            <div class="col">
              <div class="text-bold">📱 Canais WhatsApp/Telegram/Instagram</div>
              <div class="text-caption text-grey">{{ consumption.consumption.connections.current }} / {{ consumption.consumption.connections.max }}</div>
            </div>
            <div class="col-auto">
              <q-badge :color="getStatusColor(consumption.consumption.connections.status)">
                {{ consumption.consumption.connections.percentage }}%
              </q-badge>
            </div>
          </div>
          <q-linear-progress
            :value="consumption.consumption.connections.percentage / 100"
            :color="getStatusColor(consumption.consumption.connections.status)"
            size="8px"
          />
        </div>

        <!-- MENSAGENS -->
        <div class="q-mb-lg">
          <div class="row items-center q-mb-sm">
            <div class="col">
              <div class="text-bold">💬 Mensagens (Este Mês)</div>
              <div class="text-caption text-grey">{{ consumption.consumption.messages.current }} / {{ consumption.consumption.messages.max }}</div>
            </div>
            <div class="col-auto">
              <q-badge :color="getStatusColor(consumption.consumption.messages.status)">
                {{ consumption.consumption.messages.percentage }}%
              </q-badge>
            </div>
          </div>
          <q-linear-progress
            :value="consumption.consumption.messages.percentage / 100"
            :color="getStatusColor(consumption.consumption.messages.status)"
            size="8px"
          />
        </div>

        <!-- ARMAZENAMENTO -->
        <div>
          <div class="row items-center q-mb-sm">
            <div class="col">
              <div class="text-bold">🗄️ Armazenamento</div>
              <div class="text-caption text-grey">{{ consumption.consumption.storage.current }}GB / {{ consumption.consumption.storage.max }}GB</div>
            </div>
            <div class="col-auto">
              <q-badge :color="getStatusColor(consumption.consumption.storage.status)">
                {{ consumption.consumption.storage.percentage }}%
              </q-badge>
            </div>
          </div>
          <q-linear-progress
            :value="consumption.consumption.storage.percentage / 100"
            :color="getStatusColor(consumption.consumption.storage.status)"
            size="8px"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- ALERTAS -->
    <div v-if="!loading && consumption && consumption.alerts.length > 0" class="q-mb-lg">
      <div v-for="(alert, index) in consumption.alerts" :key="index" class="q-mb-sm">
        <q-banner class="bg-warning text-white" v-if="alert.includes('80%')" dense>
          <template v-slot:avatar>
            <q-icon name="warning" />
          </template>
          ⚠️ {{ alert }}
        </q-banner>
        <q-banner class="bg-negative text-white" v-else-if="alert.includes('LIMITE')" dense>
          <template v-slot:avatar>
            <q-icon name="error" />
          </template>
          🔴 {{ alert }}
        </q-banner>
      </div>
    </div>

    <!-- HISTÓRICO DE PAGAMENTO (placeholder) -->
    <q-card v-if="!loading">
      <q-card-section>
        <div class="text-h6 text-bold q-mb-md">💰 Histórico de Pagamentos</div>
        <div class="text-caption text-grey">Em breve: histórico de faturas e pagamentos</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { GetTenantConsumption, GetTenantPlanInfo } from 'src/service/tenant-plan'

export default {
  name: 'MyPlan',
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

        this.consumption = consumptionRes.data
        this.planInfo = planRes.data
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Erro ao carregar informações do plano',
          caption: error.message
        })
      } finally {
        this.loading = false
      }
    },
    formatPrice (price) {
      return price.toFixed(2).replace('.', ',')
    },
    formatDate (date) {
      return format(new Date(date), 'dd MMM yyyy', { locale: ptBR })
    },
    getStatusColor (status) {
      if (status === 'critical') return 'negative'
      if (status === 'warning') return 'warning'
      return 'positive'
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>

<style scoped>
.q-linear-progress {
  border-radius: 4px;
}
</style>
