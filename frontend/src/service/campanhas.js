import request from 'src/service/request'

/**
 * Serviços para gerenciamento de Campanhas
 * Backend: routes.use('/api/campaigns', campaignRoutes)
 * Backend: routes.use('/api/campaign-contacts', campaignContactsRoutes)
 */

/**
 * Cria uma nova campanha
 * Endpoint: POST /api/campaigns
 */
export function CriarCampanha (data) {
  return request({
    url: '/campaigns/',
    method: 'post',
    data
  })
}

/**
 * Inicia uma campanha
 * Endpoint: POST /api/campaigns/start/:campaignId
 */
export function IniciarCampanha (campaignId) {
  return request({
    url: `/campaigns/start/${campaignId}/`,
    method: 'post',
    data: {
      campaignId
    }
  })
}

/**
 * Cancela uma campanha
 * Endpoint: POST /api/campaigns/cancel/:campaignId
 */
export function CancelarCampanha (campaignId) {
  return request({
    url: `/campaigns/cancel/${campaignId}/`,
    method: 'post',
    data: {
      campaignId
    }
  })
}

/**
 * Lista todas as campanhas
 * Endpoint: GET /api/campaigns
 */
export function ListarCampanhas () {
  return request({
    url: '/campaigns/',
    method: 'get'
  })
}

/**
 * Altera uma campanha existente
 * Endpoint: PUT /api/campaigns/:campaignId
 */
export function AlterarCampanha (data, id) {
  return request({
    url: `/campaigns/${id}`,
    method: 'put',
    data
  })
}

/**
 * Deleta uma campanha
 * Endpoint: DELETE /api/campaigns/:campaignId
 */
export function DeletarCampanha (data) {
  return request({
    url: `/campaigns/${data.id}`,
    method: 'delete'
  })
}

/**
 * Adiciona contatos a uma campanha
 * Endpoint: POST /api/campaign-contacts/campaigns/contacts/:campaignId
 */
export function AdicionarContatosCampanha (data, campaignId) {
  return request({
    url: `/campaign-contacts/campaigns/contacts/${campaignId}/`,
    method: 'post',
    data
  })
}

/**
 * Lista contatos de uma campanha
 * Endpoint: GET /api/campaign-contacts/campaigns/contacts/:campaignId
 */
export function ListarContatosCampanha (campaignId) {
  return request({
    url: `/campaign-contacts/campaigns/contacts/${campaignId}/`,
    method: 'get',
    params: {
      campaignId
    }
  })
}

/**
 * Deleta um contato específico de uma campanha
 * Endpoint: DELETE /api/campaign-contacts/campaigns/contacts/:campaignId/:contactId
 */
export function DeletarContatoCampanha (campaignId, contactId) {
  return request({
    url: `/campaign-contacts/campaigns/contacts/${campaignId}/${contactId}/`,
    method: 'delete',
    params: {
      campaignId,
      contactId
    }
  })
}

/**
 * Deleta todos os contatos de uma campanha
 * Endpoint: DELETE /api/campaign-contacts/campaigns/deleteall/contacts/:campaignId
 */
export function DeletarTodosContatosCampanha (campaignId) {
  return request({
    url: `/campaign-contacts/campaigns/deleteall/contacts/${campaignId}/`,
    method: 'delete',
    params: {
      campaignId
    }
  })
}
