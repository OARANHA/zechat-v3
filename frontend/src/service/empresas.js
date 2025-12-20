import request from 'src/service/request'

/**
 * Serviços para gerenciamento de Empresas/Tenants
 * Backend: routes.use('/api/tenants', tenantRoutes) - para business-hours
 * Backend: routes.use('/api/admin', adminRoutes) - para operações administrativas de tenants
 */

/**
 * Mostra horários de atendimento da empresa
 * Endpoint: GET /api/tenants/:tenantId/business-hours
 */
export function MostrarHorariosAtendiemento () {
  let tenantId = localStorage.getItem('tenantId')

  // Fallback: se não tiver tenantId, tentar obter do usuário logado
  if (!tenantId) {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
    tenantId = usuario.tenantId
  }

  if (!tenantId) {
    console.error('tenantId não encontrado no localStorage')
    return Promise.reject(new Error('tenantId não encontrado'))
  }

  return request({
    url: `/tenants/${tenantId}/business-hours`,
    method: 'get'
  })
}

/**
 * Atualiza horários de atendimento da empresa
 * Endpoint: PUT /api/tenants/:tenantId/business-hours
 */
export function AtualizarHorariosAtendiemento (data) {
  let tenantId = localStorage.getItem('tenantId')

  // Fallback: se não tiver tenantId, tentar obter do usuário logado
  if (!tenantId) {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
    tenantId = usuario.tenantId
  }

  if (!tenantId) {
    console.error('tenantId não encontrado no localStorage')
    return Promise.reject(new Error('tenantId não encontrado'))
  }

  return request({
    url: `/tenants/${tenantId}/business-hours`,
    method: 'put',
    data
  })
}

/**
 * Atualiza mensagem de horários de atendimento
 * Endpoint: PUT /api/tenants/:tenantId/message-business-hours
 */
export function AtualizarMensagemHorariosAtendiemento (data) {
  let tenantId = localStorage.getItem('tenantId')

  // Fallback: se não tiver tenantId, tentar obter do usuário logado
  if (!tenantId) {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
    tenantId = usuario.tenantId
  }

  if (!tenantId) {
    console.error('tenantId não encontrado no localStorage')
    return Promise.reject(new Error('tenantId não encontrado'))
  }

  return request({
    url: `/tenants/${tenantId}/message-business-hours`,
    method: 'put',
    data
  })
}

/**
 * Lista empresas (administração)
 * Endpoint: GET /api/admin/tenants
 */
export function AdminListarEmpresas () {
  return request({
    url: '/admin/tenants/',
    method: 'get'
  })
}

/**
 * Cria um novo tenant (administração)
 * Endpoint: POST /api/admin/tenants
 */
export function CriarTenant (data) {
  return request({
    url: '/admin/tenants/',
    method: 'post',
    data
  })
}

/**
 * Altera um tenant (administração)
 * Endpoint: PUT /api/admin/tenantsUpdate/:tenantId
 */
export function AlterarTenant (data) {
  return request({
    url: `/admin/tenantsUpdate/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * Lista todos os tenants (administração)
 * Endpoint: GET /api/admin/tenants
 */
export function ListarTenants () {
  return request({
    url: '/admin/tenants/',
    method: 'get'
  })
}

/**
 * Deleta um tenant (administração)
 * Endpoint: DELETE /api/admin/tenants/:tenantId
 */
export function DeletarTenant (data) {
  return request({
    url: `/admin/tenants/${data.id}`,
    method: 'delete'
  })
}
