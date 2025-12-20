<template>
  <div v-if="userProfile === 'super'">
    <q-card class="q-ma-lg">
      <q-card-section>
        <h6 class="q-my-none">Planos de Assinatura</h6>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-table
          flat
          bordered
          class="q-mt-md"
          title="Planos"
          :data="plans"
          :columns="columns"
          :loading="loading"
          row-key="id"
          :pagination.sync="pagination"
          :rows-per-page-options="[0]"
        >
          <template v-slot:body-cell-price="props">
            <q-td>
              <strong>R$ {{ props.row.price.toFixed(2) }}</strong>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'SuperPlans',
  data () {
    return {
      userProfile: 'user',
      plans: [
        { id: 1, name: 'Starter', price: 99.90 },
        { id: 2, name: 'Professional', price: 299.90 },
        { id: 3, name: 'Enterprise', price: 999.90 }
      ],
      pagination: {
        rowsPerPage: 40,
        rowsNumber: 0
      },
      loading: false,
      columns: [
        { name: 'id', label: 'ID', field: 'id', align: 'left' },
        { name: 'name', label: 'Nome', field: 'name', align: 'left' },
        { name: 'price', label: 'Preço', field: 'price', align: 'left' }
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
