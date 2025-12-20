<template>
  <div v-if="userProfile === 'super'">
    <q-card class="q-ma-lg">
      <q-card-section>
        <div class="row items-center">
          <h6 class="col q-my-none">Gerenciar Empresas (Tenants)</h6>
          <q-btn
            class="col-auto"
            color="primary"
            label="+ Nova Empresa"
            rounded
            size="sm"
            @click="showNewDialog = true"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-table
          flat
          bordered
          class="q-mt-md"
          title="Empresas (Tenants)"
          :data="tenants"
          :columns="columns"
          :loading="loading"
          row-key="id"
          :pagination.sync="pagination"
          :rows-per-page-options="[0]"
        >
          <template v-slot:body-cell-name="props">
            <q-td>
              <div class="text-weight-bold">{{ props.row.name }}</div>
              <div class="text-caption text-grey-6">{{ props.row.cnpj || 'N/A' }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-owner="props">
            <q-td>
              <div class="text-weight-bold">{{ props.row.owner?.name || 'N/A' }}</div>
              <div class="text-caption text-grey-6">{{ props.row.owner?.email || 'N/A' }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-limits="props">
            <q-td>
              <div class="text-caption">👥 {{ props.row.maxUsers }} usuários</div>
              <div class="text-caption">📱 {{ props.row.maxConnections }} conexões</div>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td class="text-center">
              <q-badge
                :color="getStatusColor(props.row.status)"
                :label="getStatusLabel(props.row.status)"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td class="text-center">
              <q-btn
                flat
                round
                dense
                icon="mdi-pencil"
                size="sm"
                @click="editTenant(props.row)"
                color="primary"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                icon="mdi-delete"
                size="sm"
                @click="deleteTenant(props.row)"
                color="negative"
              >
                <q-tooltip>Deletar</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'SuperEmpresas',
  data () {
    return {
      userProfile: 'user',
      showNewDialog: false,
      tenants: [
        {
          id: 1,
          name: 'Empresa Alpha',
          description: 'Empresa de teste',
          cnpj: '12.345.678/0001-90',
          email: 'admin@alpha.com',
          status: 'active',
          maxUsers: 5,
          maxConnections: 1,
          owner: {
            id: 1,
            name: 'Admin Alpha',
            email: 'admin@alpha.com'
          },
          createdAt: new Date()
        },
        {
          id: 2,
          name: 'Empresa Beta',
          description: 'Empresa em trial',
          cnpj: '98.765.432/0001-10',
          email: 'admin@beta.com',
          status: 'trial',
          maxUsers: 10,
          maxConnections: 2,
          owner: {
            id: 2,
            name: 'Admin Beta',
            email: 'admin@beta.com'
          },
          createdAt: new Date()
        }
      ],
      pagination: {
        rowsPerPage: 40,
        rowsNumber: 0
      },
      loading: false,
      columns: [
        { name: 'id', label: 'ID', field: 'id', align: 'left', style: 'width: 50px' },
        { name: 'name', label: 'Empresa', field: 'name', align: 'left' },
        { name: 'owner', label: 'Admin (Owner)', field: 'owner', align: 'left' },
        { name: 'limits', label: 'Limites', field: 'maxUsers', align: 'left' },
        { name: 'status', label: 'Status', field: 'status', align: 'center' },
        { name: 'actions', label: 'Ações', field: 'id', align: 'center' }
      ]
    }
  },
  methods: {
    getStatusColor (status) {
      const colors = {
        active: 'positive',
        inactive: 'grey',
        suspended: 'warning',
        trial: 'info'
      }
      return colors[status] || 'grey'
    },
    getStatusLabel (status) {
      const labels = {
        active: 'Ativo',
        inactive: 'Inativo',
        suspended: 'Suspenso',
        trial: 'Trial'
      }
      return labels[status] || status
    },
    editTenant (tenant) {
      console.log('Edit tenant:', tenant)
      // TODO: implementar edição
    },
    deleteTenant (tenant) {
      this.$q.dialog({
        title: 'Deletar Empresa',
        message: `Tem certeza que deseja deletar "${tenant.name}"?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        console.log('Delete tenant:', tenant)
        // TODO: implementar deleção
      })
    }
  },
  mounted () {
    this.userProfile = localStorage.getItem('profile')
  }
}
</script>

<style lang="scss" scoped>
</style>
