import request from 'src/service/request'

/**
 * Serviços para gerenciamento de Auto-Respostas
 * Todas as rotas usam prefixo /api/ conforme definido no nginx e backend
 * Backend: routes.use('/api/auto-reply', autoReplyRoutes)
 */

/**
 * Cria uma nova auto-resposta
 * Endpoint: POST /api/auto-reply
 */
export function CriarAutoResposta (data) {
  return request({
    url: '/auto-reply',
    method: 'post',
    data
  })
}

/**
 * Lista todas as auto-respostas
 * Endpoint: GET /api/auto-reply
 */
export function ListarAutoResposta (params) {
  return request({
    url: '/auto-reply',
    method: 'get',
    params
  })
}

/**
 * Edita uma auto-resposta existente
 * Endpoint: PUT /api/auto-reply/:autoReplyId
 */
export function EditarAutoResposta (data) {
  return request({
    url: `/auto-reply/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * Deleta uma auto-resposta
 * Endpoint: DELETE /api/auto-reply/:autoReplyId
 */
export function DeletarAutoResposta (autoRepostaId) {
  return request({
    url: `/auto-reply/${autoRepostaId}`,
    method: 'delete'
  })
}

/**
 * Cria uma nova etapa para uma auto-resposta
 * Endpoint: POST /api/auto-reply/:idAutoReply/steps
 */
export function CriarEtapaResposta (data) {
  return request({
    url: `/auto-reply/${data.idAutoReply}/steps`,
    method: 'post',
    data
  })
}

/**
 * Edita uma etapa de auto-resposta
 * Endpoint: PUT /api/auto-reply/:idAutoReply/steps/:stepsReplyId
 */
export function EditarEtapaResposta (data) {
  return request({
    url: `/auto-reply/${data.idAutoReply}/steps/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * Deleta uma etapa de auto-resposta
 * Endpoint: DELETE /api/auto-reply/:idAutoReply/steps/:stepsReplyId
 */
export function DeletarEtapaResposta (data) {
  return request({
    url: `/auto-reply/${data.idAutoReply}/steps/${data.id}`,
    method: 'delete'
  })
}

/**
 * Cria uma nova ação para etapa de auto-resposta
 * Endpoint: POST /api/auto-reply-action
 */
export function CriarAcaoEtapa (data) {
  return request({
    url: '/auto-reply-action',
    method: 'post',
    data
  })
}

/**
 * Edita uma ação de etapa de auto-resposta
 * Endpoint: PUT /api/auto-reply-action/:stepsReplyActionId
 */
export function EditarAcaoEtapa (data) {
  return request({
    url: `/auto-reply-action/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * Deleta uma ação de etapa de auto-resposta
 * Endpoint: DELETE /api/auto-reply-action/:stepsReplyActionId
 */
export function DeletarAcaoEtapa (data) {
  return request({
    url: `/auto-reply-action/${data.id}`,
    method: 'delete'
  })
}
