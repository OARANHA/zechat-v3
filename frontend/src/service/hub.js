import request from 'src/service/request'

/**
 * Serviços para integração com Hub
 * Backend:
 * - routes.use('/api/hub-channels', hubChannelRoutes) - para hub-channel
 * - routes.use('/api/hub-messages', hubMessageRoutes) - para hub-message
 */

/**
 * Adiciona um canal ao Hub
 * Endpoint: POST /api/hub-channels/hub-channel/
 */
export function AdicionarHub (data) {
  return request({
    url: '/hub-channel/',
    method: 'post',
    data
  })
}

/**
 * Lista canais do Hub
 * Endpoint: GET /api/hub-channels/hub-channel/
 */
export function ListarHub () {
  return request({
    url: '/hub-channel/',
    method: 'get'
  })
}

/**
 * Envia mensagem via Hub
 * Endpoint: POST /api/hub-messages/hub-message/:ticketId
 */
export function EnviarMensagemHub (ticketId, data) {
  return request({
    url: `/hub-message/${ticketId}`,
    method: 'post',
    data
  })
}
