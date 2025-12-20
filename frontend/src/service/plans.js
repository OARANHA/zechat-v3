/**
 * Plan Service - Comunicação com API de planos
 * Backend: routes.use('/api/billing', billingRoutes)
 *
 * © 2024 28web. Todos os direitos reservados.
 */

import request from 'src/service/request'

/**
 * Lista todos os planos disponíveis
 * Endpoint: GET /api/billing/plans
 */
export function ListarPlanos () {
  return request({
    url: '/billing/plans',
    method: 'get'
  })
}

/**
 * Busca um plano por ID
 * Endpoint: GET /api/billing/plans/:id
 */
export function BuscarPlanoPorId (planId) {
  return request({
    url: `/billing/plans/${planId}`,
    method: 'get'
  })
}

/**
 * Busca um plano por nome
 * Endpoint: GET /api/billing/plans/by-name/:name
 */
export function BuscarPlanoPorNome (name) {
  return request({
    url: `/billing/plans/by-name/${name}`,
    method: 'get'
  })
}

/**
 * Cria um novo plano
 * Endpoint: POST /api/billing/plans
 */
export function CriarPlano (data) {
  return request({
    url: '/billing/plans',
    method: 'post',
    data
  })
}

/**
 * Atualiza um plano existente
 * Endpoint: PUT /api/billing/plans/:id
 */
export function AtualizarPlano (planId, data) {
  return request({
    url: `/billing/plans/${planId}`,
    method: 'put',
    data
  })
}

/**
 * Remove um plano
 * Endpoint: DELETE /api/billing/plans/:id
 */
export function RemoverPlano (planId) {
  return request({
    url: `/billing/plans/${planId}`,
    method: 'delete'
  })
}

/**
 * Ativa/desativa um plano
 * Endpoint: PUT /api/billing/plans/:id/status
 */
export function AlternarStatusPlano (planId, status) {
  return request({
    url: `/billing/plans/${planId}/status`,
    method: 'put',
    data: { status }
  })
}

/**
 * Lista planos com contagem de tenants
 * Endpoint: GET /api/billing/plans/with-stats
 */
export function ListarPlanosComEstatisticas () {
  return request({
    url: '/billing/plans/with-stats',
    method: 'get'
  })
}

/**
 * Duplica um plano existente
 * Endpoint: POST /api/billing/plans/:id/duplicate
 */
export function DuplicarPlano (planId, novoNome) {
  return request({
    url: `/billing/plans/${planId}/duplicate`,
    method: 'post',
    data: { name: novoNome }
  })
}
