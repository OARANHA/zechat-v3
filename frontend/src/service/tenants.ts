/**
 * Service layer para Tenants (Empresas)
 * SuperAdmin API calls
 */

import service from './request'

/**
 * Listar todos os tenants
 */
export const ListTenants = async (params?: any) => {
  return service({
    url: '/tenants',
    method: 'get',
    params
  })
}

/**
 * Obter detalhes de um tenant
 */
export const GetTenant = async (tenantId: number) => {
  return service({
    url: `/tenants/${tenantId}`,
    method: 'get'
  })
}

/**
 * Criar novo tenant
 */
export const CreateTenant = async (data: any) => {
  return service({
    url: '/api/tenants',
    method: 'post',
    data
  })
}

/**
 * Atualizar tenant
 */
export const UpdateTenant = async (tenantId: number, data: any) => {
  return service({
    url: `/api/tenants/${tenantId}`,
    method: 'patch',
    data
  })
}

/**
 * Deletar tenant
 */
export const DeleteTenant = async (tenantId: number) => {
  return service({
    url: `/api/tenants/${tenantId}`,
    method: 'delete'
  })
}

/**
 * Suspender tenant
 */
export const SuspendTenant = async (tenantId: number, reason?: string) => {
  return service({
    url: `/api/tenants/${tenantId}/suspend`,
    method: 'post',
    data: { reason }
  })
}

/**
 * Reativar tenant
 */
export const ReactivateTenant = async (tenantId: number) => {
  return service({
    url: `/api/tenants/${tenantId}/reactivate`,
    method: 'post'
  })
}
