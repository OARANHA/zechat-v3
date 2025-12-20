import request from 'src/service/request'

/**
 * Serviços para gerenciamento de Fluxos de Chat (Chat Flow)
 * Backend: routes.use('/api/chat-flow', chatFlowRoutes)
 */

/**
 * Cria um novo fluxo de chat
 * Endpoint: POST /api/chat-flow
 */
export function CriarChatFlow (data) {
  return request({
    url: '/chat-flow',
    method: 'post',
    data
  })
}

/**
 * Lista todos os fluxos de chat
 * Endpoint: GET /api/chat-flow
 */
export function ListarChatFlow (params) {
  return request({
    url: '/chat-flow',
    method: 'get',
    params
  })
}

/**
 * Atualiza um fluxo de chat existente
 * Endpoint: PUT /api/chat-flow/:chatFlowId
 */
export function UpdateChatFlow (data) {
  return request({
    url: `/chat-flow/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * Deleta um fluxo de chat
 * Endpoint: DELETE /api/chat-flow/:chatFlowId
 */
export function DeletarChatFlow (data) {
  return request({
    url: `/chat-flow/${data.id}`,
    method: 'delete'
  })
}
