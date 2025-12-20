<template>
  <q-page class="billing-dashboard">
    <div class="page-header q-mb-lg">
      <div class="row items-center justify-between">
        <div>
          <h4 class="text-h4 text-weight-bold q-my-none">Billing & Planos</h4>
          <p class="text-grey-6 q-mt-sm">Gestão financeira e controle de assinaturas</p>
        </div>
        <div class="header-actions">
          <q-btn
            color="primary"
            icon="refresh"
            label="Atualizar"
            @click="carregarDados"
            :loading="loading"
          />
          <q-btn
            color="primary"
            icon="add"
            label="Novo Plano"
            class="q-ml-sm"
            @click="abrirModalNovoPlano"
          />
        </div>
      </div>
    </div>

    <!-- Métricas Financeiras -->
    <financial-metrics :metrics="metrics" class="q-mb-xl" />

    <!-- Tabs de Navegação -->
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="overview" label="Visão Geral" icon="dashboard" />
      <q-tab name="plans" label="Planos" icon="mdi-package-variant" />
      <q-tab name="subscriptions" label="Assinaturas" icon="mdi-account-group" />
      <q-tab name="reports" label="Relatórios" icon="mdi-chart-box" />
    </q-tabs>

    <q-separator />

    <!-- Conteúdo das Tabs -->
    <q-tab-panels v-model="tab" animated>
      <!-- Visão Geral -->
      <q-tab-panel name="overview">
        <div class="q-pa-md">
          <div class="row q-col-gutter-lg">
            <!-- Últimas Assinaturas -->
            <div class="col-12 col-lg-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-h6 q-mb-md">Últimas Assinaturas</div>
                  <q-list separator>
                    <q-item v-for="subscription in recentSubscriptions" :key="subscription.id">
                      <q-item-section avatar>
                        <q-avatar
                          :color="getSubscriptionStatusColor(subscription.status)"
                          text-color="white"
                        >
                          <q-icon :name="getSubscriptionIcon(subscription.status)" />
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ subscription.tenantName }}</q-item-label>
                        <q-item-label caption>{{ subscription.planName }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <div class="text-right">
                          <div class="text-weight-bold">R$ {{ formatPrice(subscription.price) }}</div>
                          <div class="text-caption text-grey-6">{{ formatDate(subscription.createdAt) }}</div>
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn
                    flat
                    color="primary"
                    label="Ver Todas"
                    @click="tab = 'subscriptions'"
                  />
                </q-card-actions>
              </q-card>
            </div>

            <!-- Alertas e Notificações -->
            <div class="col-12 col-lg-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-h6 q-mb-md">Alertas Importantes</div>
                  <q-list separator>
                    <q-item v-if="expiringSubscriptions.length === 0">
                      <q-item-section>
                        <q-item-label class="text-positive">
                          <q-icon name="check_circle" class="q-mr-sm" />
                          Nenhum alerta pendente
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item v-for="alert in alerts" :key="alert.id" :class="`alert-item--${alert.type}`">
                      <q-item-section avatar>
                        <q-icon
                          :name="getAlertIcon(alert.type)"
                          :color="getAlertColor(alert.type)"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ alert.title }}</q-item-label>
                        <q-item-label caption>{{ alert.description }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          v-if="alert.action"
                          flat
                          color="primary"
                          size="sm"
                          :label="alert.action.label"
                          @click="handleAlertAction(alert.action)"
                        />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </q-tab-panel>

      <!-- Planos -->
      <q-tab-panel name="plans">
        <div class="q-pa-md">
          <div class="row q-col-gutter-xl">
            <div
              v-for="plan in plans"
              :key="plan.id"
              class="col-12 col-sm-6 col-lg-4"
            >
              <plan-card
                :plan="plan"
                :is-popular="plan.name === 'professional'"
                :can-edit="true"
                @edit-plan="editarPlano"
                @select-plan="selecionarPlano"
              />
            </div>
          </div>
        </div>
      </q-tab-panel>

      <!-- Assinaturas -->
      <q-tab-panel name="subscriptions">
        <div class="q-pa-md">
          <div class="q-mb-md">
            <div class="row items-center justify-between">
              <div class="text-h6">Gestão de Assinaturas</div>
              <div class="row q-gutter-sm">
                <q-input
                  v-model="filtros.search"
                  placeholder="Buscar tenant..."
                  dense
                  outlined
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
                <q-select
                  v-model="filtros.status"
                  :options="statusOptions"
                  label="Status"
                  dense
                  outlined
                  emit-value
                  map-options
                />
              </div>
            </div>
          </div>

          <q-table
            :columns="subscriptionColumns"
            :data="subscriptions"
            :loading="loading"
            :pagination="pagination"
            @request="onRequest"
            row-key="id"
          >
            <template v-slot:body-cell-tenant="props">
              <q-td :props="props">
                <div>
                  <div class="text-weight-bold">{{ props.row.tenant.name }}</div>
                  <div class="text-caption text-grey-6">{{ props.row.tenant.email }}</div>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-plan="props">
              <q-td :props="props">
                <q-chip
                  :color="getPlanColor(props.row.plan.name)"
                  text-color="white"
                  size="sm"
                >
                  {{ props.row.plan.name }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-price="props">
              <q-td :props="props">
                <div class="text-weight-bold">R$ {{ formatPrice(props.row.price) }}</div>
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  :color="getSubscriptionStatusColor(props.row.status)"
                  text-color="white"
                  size="sm"
                >
                  {{ formatSubscriptionStatus(props.row.status) }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-period="props">
              <q-td :props="props">
                <div>
                  <div>{{ formatDate(props.row.currentPeriodStart) }}</div>
                  <div class="text-caption text-grey-6">até {{ formatDate(props.row.currentPeriodEnd) }}</div>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn-group flat>
                  <q-btn
                    flat
                    dense
                    icon="edit"
                    color="primary"
                    @click="editarAssinatura(props.row)"
                  >
                    <q-tooltip>Editar</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="props.row.status === 'active'"
                    flat
                    dense
                    icon="pause"
                    color="warning"
                    @click="cancelarAssinatura(props.row)"
                  >
                    <q-tooltip>Cancelar</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    dense
                    icon="refresh"
                    color="positive"
                    @click="renovarAssinatura(props.row)"
                  >
                    <q-tooltip>Renovar</q-tooltip>
                  </q-btn>
                </q-btn-group>
              </q-td>
            </template>
          </q-table>
        </div>
      </q-tab-panel>

      <!-- Relatórios -->
      <q-tab-panel name="reports">
        <div class="q-pa-md">
          <div class="text-h6 q-mb-md">Relatórios Financeiros</div>
          <div class="text-grey-6">Funcionalidade em desenvolvimento...</div>
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Modal de Novo Plano -->
    <q-dialog v-model="modalPlano" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ planoEdicao ? 'Editar Plano' : 'Novo Plano' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="salvarPlano" class="q-gutter-md">
            <q-input
              v-model="planoForm.name"
              label="Nome do Plano"
              outlined
              required
            />
            <q-input
              v-model.number="planoForm.price"
              label="Preço Mensal (R$)"
              type="number"
              outlined
              required
            />
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-input
                  v-model.number="planoForm.limits.whatsappSessions"
                  label="Sessões WhatsApp"
                  type="number"
                  outlined
                  required
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model.number="planoForm.limits.messagesPerMonth"
                  label="Mensagens/Mês"
                  type="number"
                  outlined
                  required
                />
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-input
                  v-model.number="planoForm.limits.storageGB"
                  label="Armazenamento (GB)"
                  type="number"
                  outlined
                  required
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model.number="planoForm.limits.users"
                  label="Usuários"
                  type="number"
                  outlined
                  required
                />
              </div>
            </div>

            <div class="text-subtitle2 q-mt-md">Funcionalidades:</div>
            <div class="row q-col-gutter-sm">
              <div v-for="(value, key) in planoForm.features" :key="key" class="col-6">
                <q-toggle
                  v-model="planoForm.features[key]"
                  :label="formatFeatureLabel(key)"
                />
              </div>
            </div>

            <div class="row justify-end q-gutter-sm">
              <q-btn
                flat
                label="Cancelar"
                @click="fecharModalPlano"
              />
              <q-btn
                type="submit"
                color="primary"
                :label="planoEdicao ? 'Atualizar' : 'Criar'"
                :loading="saving"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ObterMetricasFinanceiras,
  ListarAssinaturas,
  ListarPlanos,
  CriarPlano,
  AtualizarPlano
} from 'src/service/billing'
import FinancialMetrics from 'src/components/billing/FinancialMetrics.vue'
import PlanCard from 'src/components/billing/PlanCard.vue'

export default {
  name: 'BillingDashboard',
  components: {
    FinancialMetrics,
    PlanCard
  },
  data () {
    return {
      tab: 'overview',
      loading: false,
      saving: false,
      modalPlano: false,
      planoEdicao: null,
      metrics: {},
      plans: [],
      subscriptions: [],
      recentSubscriptions: [],
      alerts: [],
      filtros: {
        search: '',
        status: null
      },
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      planoForm: {
        name: '',
        price: 0,
        limits: {
          whatsappSessions: 1,
          messagesPerMonth: 1000,
          storageGB: 5,
          users: 2
        },
        features: {
          whatsapp: true,
          instagram: false,
          telegram: false,
          messenger: false,
          api: false,
          webhooks: false
        }
      },
      statusOptions: [
        { label: 'Ativas', value: 'active' },
        { label: 'Canceladas', value: 'cancelled' },
        { label: 'Suspensas', value: 'suspended' }
      ],
      subscriptionColumns: [
        { name: 'tenant', label: 'Tenant', field: 'tenant', align: 'left', sortable: true },
        { name: 'plan', label: 'Plano', field: 'plan', align: 'center', sortable: true },
        {
          name: 'price',
          label: 'Preço',
          field: 'price',
          align: 'center',
          sortable: true
        },
        { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true },
        { name: 'period', label: 'Período', field: 'period', align: 'center', sortable: true },
        { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
      ]
    }
  },
  computed: {
    ...mapGetters(['userProfile']),
    expiringSubscriptions () {
      return this.alerts.filter(alert => alert.type === 'expiring')
    }
  },
  async mounted () {
    await this.carregarDados()
  },
  methods: {
    async carregarDados () {
      this.loading = true
      try {
        const [metricsRes, plansRes, subscriptionsRes] = await Promise.all([
          ObterMetricasFinanceiras(),
          ListarPlanos(),
          ListarAssinaturas()
        ])

        this.metrics = metricsRes.data?.data || {}
        this.plans = plansRes.data?.data || []
        this.subscriptions = subscriptionsRes.data?.data?.subscriptions || []
        this.recentSubscriptions = subscriptionsRes.data?.data?.recent || []

        // Gerar alertas baseados nos dados
        this.gerarAlertas()

        this.pagination.rowsNumber = this.subscriptions.length
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        this.$q.notify({
          type: 'negative',
          message: 'Erro ao carregar dados do billing'
        })
      } finally {
        this.loading = false
      }
    },

    gerarAlertas () {
      this.alerts = []

      // Adicionar exemplo de alerta
      this.alerts.push({
        id: 1,
        type: 'expiring',
        title: 'Assinatura vencendo',
        description: '3 assinaturas vencem nos próximos 7 dias',
        action: {
          label: 'Ver detalhes',
          handler: () => { this.tab = 'subscriptions' }
        }
      })
    },

    formatPrice (value) {
      return (value || 0).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },

    formatDate (date) {
      return new Date(date).toLocaleDateString('pt-BR')
    },

    formatFeatureLabel (feature) {
      const labels = {
        whatsapp: 'WhatsApp',
        instagram: 'Instagram',
        telegram: 'Telegram',
        messenger: 'Messenger',
        api: 'API REST',
        webhooks: 'Webhooks'
      }
      return labels[feature] || feature
    },

    getPlanColor (planName) {
      const colors = {
        starter: 'positive',
        professional: 'primary',
        enterprise: 'warning'
      }
      return colors[planName.toLowerCase()] || 'grey'
    },

    getSubscriptionStatusColor (status) {
      const colors = {
        active: 'positive',
        cancelled: 'negative',
        suspended: 'warning'
      }
      return colors[status] || 'grey'
    },

    getSubscriptionIcon (status) {
      const icons = {
        active: 'check_circle',
        cancelled: 'cancel',
        suspended: 'pause_circle'
      }
      return icons[status] || 'help'
    },

    formatSubscriptionStatus (status) {
      const statusMap = {
        active: 'Ativa',
        cancelled: 'Cancelada',
        suspended: 'Suspensa'
      }
      return statusMap[status] || status
    },

    getAlertIcon (type) {
      const icons = {
        expiring: 'warning',
        payment: 'credit_card',
        churn: 'trending_down'
      }
      return icons[type] || 'info'
    },

    getAlertColor (type) {
      const colors = {
        expiring: 'warning',
        payment: 'negative',
        churn: 'negative'
      }
      return colors[type] || 'info'
    },

    handleAlertAction (action) {
      if (action.handler) {
        action.handler()
      }
    },

    abrirModalNovoPlano () {
      this.planoEdicao = null
      this.resetarFormularioPlano()
      this.modalPlano = true
    },

    editarPlano (plan) {
      this.planoEdicao = plan
      this.planoForm = JSON.parse(JSON.stringify(plan))
      this.modalPlano = true
    },

    resetarFormularioPlano () {
      this.planoForm = {
        name: '',
        price: 0,
        limits: {
          whatsappSessions: 1,
          messagesPerMonth: 1000,
          storageGB: 5,
          users: 2
        },
        features: {
          whatsapp: true,
          instagram: false,
          telegram: false,
          messenger: false,
          api: false,
          webhooks: false
        }
      }
    },

    async salvarPlano () {
      this.saving = true
      try {
        if (this.planoEdicao) {
          await AtualizarPlano(this.planoEdicao.id, this.planoForm)
          this.$q.notify({
            type: 'positive',
            message: 'Plano atualizado com sucesso'
          })
        } else {
          await CriarPlano(this.planoForm)
          this.$q.notify({
            type: 'positive',
            message: 'Plano criado com sucesso'
          })
        }

        this.fecharModalPlano()
        await this.carregarDados()
      } catch (error) {
        console.error('Erro ao salvar plano:', error)
        this.$q.notify({
          type: 'negative',
          message: 'Erro ao salvar plano'
        })
      } finally {
        this.saving = false
      }
    },

    fecharModalPlano () {
      this.modalPlano = false
      this.planoEdicao = null
      this.resetarFormularioPlano()
    },

    async onRequest (props) {
      const { page, rowsPerPage } = props.pagination
      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage

      await this.carregarDados()
    },

    editarAssinatura (subscription) {
      // Implementar modal de edição de assinatura
      this.$q.notify({
        type: 'info',
        message: 'Funcionalidade em desenvolvimento'
      })
    },

    async cancelarAssinatura (subscription) {
      this.$q.dialog({
        title: 'Confirmar Cancelamento',
        message: `Deseja cancelar a assinatura de ${subscription.tenant.name}?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          // await CancelarAssinaturaTenant(subscription.tenantId)
          this.$q.notify({
            type: 'positive',
            message: 'Assinatura cancelada com sucesso'
          })
          await this.carregarDados()
        } catch (error) {
          this.$q.notify({
            type: 'negative',
            message: 'Erro ao cancelar assinatura'
          })
        }
      })
    },

    async renovarAssinatura (subscription) {
      try {
        // await RenovarAssinaturaTenant(subscription.tenantId)
        this.$q.notify({
          type: 'positive',
          message: 'Assinatura renovada com sucesso'
        })
        await this.carregarDados()
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Erro ao renovar assinatura'
        })
      }
    },

    selecionarPlano (plan) {
      this.$q.notify({
        type: 'info',
        message: `Plano ${plan.name} selecionado - Funcionalidade em desenvolvimento`
      })
    }
  }
}
</script>

<style scoped>
.billing-dashboard {
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.alert-item--expiring {
  border-left: 3px solid #ff9800;
}

.alert-item--payment {
  border-left: 3px solid #f44336;
}

.alert-item--churn {
  border-left: 3px solid #e91e63;
}
</style>
