<template>
  <q-card
    class="plan-card"
    :class="[`plan-card--${plan.name}`, { 'plan-card--active': isActive }]"
    flat
    bordered
  >
    <q-card-section class="text-center">
      <div class="text-h5 text-weight-bold q-mb-sm">{{ plan.name }}</div>
      <div class="text-h3 text-weight-bold text-primary q-mb-md">
        R$ {{ formatPrice(plan.price) }}
        <span class="text-subtitle2 text-grey-6">/mês</span>
      </div>

      <!-- Indicador de Popular -->
      <q-chip
        v-if="isPopular"
        color="orange"
        text-color="white"
        icon="star"
        class="q-mb-md"
      >
        Mais Popular
      </q-chip>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="q-mb-md">
        <div class="text-subtitle1 text-weight-medium q-mb-sm">Recursos Incluídos:</div>
        <q-list dense>
          <q-item v-for="(value, key) in plan.limits" :key="key" class="q-px-none">
            <q-item-section avatar>
              <q-icon
                :name="getLimitIcon(key)"
                :color="getLimitColor(key)"
                size="sm"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ formatLimitLabel(key, value) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="q-mb-md">
        <div class="text-subtitle1 text-weight-medium q-mb-sm">Funcionalidades:</div>
        <div class="row q-col-gutter-sm">
          <div
            v-for="(enabled, feature) in plan.features"
            :key="feature"
            class="col-6"
          >
            <q-chip
              :color="enabled ? 'positive' : 'grey-5'"
              :text-color="enabled ? 'white' : 'grey-7'"
              :icon="enabled ? 'check' : 'close'"
              size="sm"
              class="full-width"
            >
              {{ formatFeatureLabel(feature) }}
            </q-chip>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="center" class="q-pa-md">
      <q-btn
        v-if="!isActive"
        color="primary"
        outline
        label="Selecionar Plano"
        class="full-width"
        @click="$emit('select-plan', plan)"
      />
      <q-btn
        v-else
        color="positive"
        label="Plano Atual"
        icon="check_circle"
        class="full-width"
        flat
      />

      <q-btn
        v-if="canEdit"
        color="primary"
        flat
        icon="edit"
        round
        class="q-ml-sm"
        @click="$emit('edit-plan', plan)"
      >
        <q-tooltip>Editar Plano</q-tooltip>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: 'PlanCard',
  props: {
    plan: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
    isPopular: {
      type: Boolean,
      default: false
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    formatPrice (price) {
      return price.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },

    formatLimitLabel (key, value) {
      const labels = {
        whatsappSessions: value === 999 ? 'Sessões WhatsApp Ilimitadas' : `${value} Sessões WhatsApp`,
        messagesPerMonth: `${value.toLocaleString('pt-BR')} mensagens/mês`,
        storageGB: `${value} GB de armazenamento`,
        users: `${value} usuários`
      }
      return labels[key] || `${key}: ${value}`
    },

    formatFeatureLabel (feature) {
      const labels = {
        whatsapp: 'WhatsApp',
        instagram: 'Instagram',
        telegram: 'Telegram',
        messenger: 'Messenger',
        api: 'API REST',
        webhooks: 'Webhooks',
        support: 'Suporte prioritário',
        sla: 'SLA 99.9%'
      }
      return labels[feature] || feature
    },

    getLimitIcon (key) {
      const icons = {
        whatsappSessions: 'mdi-whatsapp',
        messagesPerMonth: 'mdi-message-text',
        storageGB: 'mdi-database',
        users: 'mdi-account-group'
      }
      return icons[key] || 'mdi-information'
    },

    getLimitColor (key) {
      const colors = {
        whatsappSessions: 'positive',
        messagesPerMonth: 'primary',
        storageGB: 'info',
        users: 'warning'
      }
      return colors[key] || 'grey'
    }
  }
}
</script>

<style scoped>
.plan-card {
  transition: all 0.3s ease;
  min-height: 400px;
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.plan-card--active {
  border: 2px solid var(--q-primary);
}

.plan-card--starter {
  border-left: 4px solid #4CAF50;
}

.plan-card--professional {
  border-left: 4px solid #2196F3;
}

.plan-card--enterprise {
  border-left: 4px solid #FF9800;
}
</style>
