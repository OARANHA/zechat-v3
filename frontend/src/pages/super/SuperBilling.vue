<template>
  <div v-if="userProfile === 'super'">
    <q-card class="q-ma-lg">
      <q-card-section>
        <h6 class="q-my-none">Faturamento</h6>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-gutter-md q-mb-lg">
          <q-card class="col-12 col-sm-6 col-md-3">
            <q-card-section>
              <div class="text-subtitle2 text-grey-7">MRR</div>
              <div class="text-h5 text-weight-bold text-primary">R$ 15.750,50</div>
            </q-card-section>
          </q-card>

          <q-card class="col-12 col-sm-6 col-md-3">
            <q-card-section>
              <div class="text-subtitle2 text-grey-7">Assinaturas Ativas</div>
              <div class="text-h5 text-weight-bold text-info">42</div>
            </q-card-section>
          </q-card>

          <q-card class="col-12 col-sm-6 col-md-3">
            <q-card-section>
              <div class="text-subtitle2 text-grey-7">Receita Este Mês</div>
              <div class="text-h5 text-weight-bold text-positive">R$ 18.900,00</div>
            </q-card-section>
          </q-card>

          <q-card class="col-12 col-sm-6 col-md-3">
            <q-card-section>
              <div class="text-subtitle2 text-grey-7">Taxa de Retenção</div>
              <div class="text-h5 text-weight-bold text-warning">95,2%</div>
            </q-card-section>
          </q-card>
        </div>

        <q-table
          flat
          bordered
          class="q-mt-md"
          title="Assinaturas"
          :data="subscriptions"
          :columns="columns"
          :loading="loading"
          row-key="id"
          :pagination.sync="pagination"
          :rows-per-page-options="[0]"
        >
          <template v-slot:body-cell-amount="props">
            <q-td>
              <strong>R$ {{ props.row.amount.toFixed(2) }}</strong>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'SuperBilling',
  data () {
    return {
      userProfile: 'user',
      subscriptions: [
        { id: 1, tenantName: 'Empresa Alpha', planName: 'Professional', amount: 299.90 },
        { id: 2, tenantName: 'Empresa Beta', planName: 'Enterprise', amount: 999.90 },
        { id: 3, tenantName: 'Empresa Gamma', planName: 'Starter', amount: 99.90 }
      ],
      pagination: {
        rowsPerPage: 40,
        rowsNumber: 0
      },
      loading: false,
      columns: [
        { name: 'id', label: 'ID', field: 'id', align: 'left' },
        { name: 'tenantName', label: 'Empresa', field: 'tenantName', align: 'left' },
        { name: 'planName', label: 'Plano', field: 'planName', align: 'left' },
        { name: 'amount', label: 'Valor', field: 'amount', align: 'left' }
      ]
    }
  },
  mounted () {
    this.userProfile = localStorage.getItem('profile')
  }
}
</script>

<style lang="scss" scoped>
</style>
