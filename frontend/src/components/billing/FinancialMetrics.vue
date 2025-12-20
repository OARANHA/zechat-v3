<template>
  <div class="financial-metrics">
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Receita Mensal -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="metric-card metric-card--revenue" flat bordered>
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6 text-grey-8">Receita Mensal</div>
                <div class="text-h4 text-positive text-weight-bold">
                  R$ {{ formatCurrency(metrics.monthlyRevenue) }}
                </div>
                <div class="text-caption text-grey-6">
                  <q-icon
                    :name="metrics.revenueGrowth >= 0 ? 'trending_up' : 'trending_down'"
                    :color="metrics.revenueGrowth >= 0 ? 'positive' : 'negative'"
                    size="xs"
                  />
                  {{ Math.abs(metrics.revenueGrowth) }}% vs mês anterior
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="mdi-currency-usd" color="positive" size="48px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Assinantes Ativos -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="metric-card metric-card--subscribers" flat bordered>
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6 text-grey-8">Assinantes Ativos</div>
                <div class="text-h4 text-primary text-weight-bold">
                  {{ metrics.activeSubscribers }}
                </div>
                <div class="text-caption text-grey-6">
                  <q-icon
                    :name="metrics.subscriberGrowth >= 0 ? 'trending_up' : 'trending_down'"
                    :color="metrics.subscriberGrowth >= 0 ? 'positive' : 'negative'"
                    size="xs"
                  />
                  {{ Math.abs(metrics.subscriberGrowth) }}% vs mês anterior
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="mdi-account-group" color="primary" size="48px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- ARPU (Average Revenue Per User) -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="metric-card metric-card--arpu" flat bordered>
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6 text-grey-8">ARPU</div>
                <div class="text-h4 text-info text-weight-bold">
                  R$ {{ formatCurrency(metrics.arpu) }}
                </div>
                <div class="text-caption text-grey-6">
                  Receita por usuário
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="mdi-account-star" color="info" size="48px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Churn Rate -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="metric-card metric-card--churn" flat bordered>
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6 text-grey-8">Churn Rate</div>
                <div class="text-h4 text-warning text-weight-bold">
                  {{ metrics.churnRate }}%
                </div>
                <div class="text-caption text-grey-6">
                  Taxa de cancelamento
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="mdi-account-remove" color="warning" size="48px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Gráfico de Receita -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-lg-8">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6 q-mb-md">Evolução da Receita</div>
            <div class="revenue-chart">
              <!-- Aqui seria inserido um gráfico real -->
              <div class="chart-placeholder">
                <q-icon name="mdi-chart-line" size="80px" color="grey-5" />
                <div class="text-grey-6">Gráfico de Receita (a implementar)</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Distribuição por Plano -->
      <div class="col-12 col-lg-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6 q-mb-md">Distribuição por Plano</div>
            <div class="plan-distribution">
              <div
                v-for="plan in metrics.planDistribution"
                :key="plan.name"
                class="plan-dist-item q-mb-sm"
              >
                <div class="row items-center">
                  <div class="col-auto q-mr-sm">
                    <q-icon
                      :name="getPlanIcon(plan.name)"
                      :color="getPlanColor(plan.name)"
                      size="24px"
                    />
                  </div>
                  <div class="col">
                    <div class="text-subtitle2">{{ plan.name }}</div>
                    <q-linear-progress
                      :value="plan.percentage / 100"
                      :color="getPlanColor(plan.name)"
                      size="8px"
                      rounded
                    />
                  </div>
                  <div class="col-auto text-right">
                    <div class="text-subtitle2 text-weight-bold">
                      {{ plan.count }}
                    </div>
                    <div class="text-caption text-grey-6">
                      {{ plan.percentage }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinancialMetrics',
  props: {
    metrics: {
      type: Object,
      required: true,
      default: () => ({
        monthlyRevenue: 0,
        revenueGrowth: 0,
        activeSubscribers: 0,
        subscriberGrowth: 0,
        arpu: 0,
        churnRate: 0,
        planDistribution: []
      })
    }
  },
  methods: {
    formatCurrency (value) {
      return (value || 0).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },

    getPlanIcon (planName) {
      const icons = {
        starter: 'mdi-seed',
        professional: 'mdi-rocket-launch',
        enterprise: 'mdi-crown'
      }
      return icons[planName.toLowerCase()] || 'mdi-package'
    },

    getPlanColor (planName) {
      const colors = {
        starter: 'positive',
        professional: 'primary',
        enterprise: 'warning'
      }
      return colors[planName.toLowerCase()] || 'grey'
    }
  }
}
</script>

<style scoped>
.metric-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.revenue-chart {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
}

.plan-dist-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.plan-dist-item:last-child {
  border-bottom: none;
}
</style>
