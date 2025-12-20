import request from 'src/service/request'

/**
 * Serviços para tickets e mensagens
 *
 * Backend:
 * - routes.use('/api/tickets', ticketRoutes)
 *   -> GET    /api/tickets
 *   -> GET    /api/tickets/:ticketId
 *   -> POST   /api/tickets
 *   -> PUT    /api/tickets/:ticketId
 *   -> DELETE /api/tickets/:ticketId
 *   -> GET    /api/tickets/:ticketId/logs
 *
 * - routes.use('/api/messages', messageRoutes)
 *   (confira se os paths abaixo batem com messageRoutes)
 */

/**
 * Lista tickets com filtros
 * GET /api/tickets
 */
export function ConsultarTickets (params) {
  return request({
    url: '/tickets',
    method: 'get',
    params
  })
}

/**
 * Detalhes de um ticket
 * GET /api/tickets/:id
 */
export function ConsultarDadosTicket (params) {
  return request({
    url: `/tickets/${params.id}`,
    method: 'get',
    params
  })
}

/**
 * Logs de um ticket
 * GET /api/tickets/:ticketId/logs
 */
export function ConsultarLogsTicket (params) {
  return request({
    url: `/tickets/${params.ticketId}/logs`,
    method: 'get',
    params
  })
}

/**
 * Atualiza status de um ticket
 * PUT /api/tickets/:ticketId
 */
export function AtualizarStatusTicket (ticketId, status, userId) {
  return request({
    url: `/tickets/${ticketId}`,
    method: 'put',
    data: { status, userId }
  })
}

/**
 * Atualiza dados gerais de um ticket
 * PUT /api/tickets/:ticketId
 */
export function AtualizarTicket (ticketId, data) {
  return request({
    url: `/tickets/${ticketId}`,
    method: 'put',
    data
  })
}

/**
 * Lista mensagens de um ticket
 * (confira se no backend está /api/messages/:ticketId ou /api/messages/messages/:ticketId)
 */
export function LocalizarMensagens (params) {
  return request({
    url: `/messages/${params.ticketId}`,
    method: 'get',
    params
  })
}

/**
 * Envia mensagem de texto em um ticket
 */
export function EnviarMensagemTexto (ticketId, data) {
  return request({
    url: `/messages/${ticketId}`,
    method: 'post',
    data
  })
}

/**
 * Encaminha mensagens para outro contato
 * (confira se a rota no backend é /api/messages/forward-messages)
 */
export function EncaminharMensagem (messages, contato) {
  const data = {
    messages,
    contact: contato
  }
  return request({
    url: '/forward-messages/',
    method: 'post',
    data
  })
}

/**
 * Deleta uma mensagem
 */
export function DeletarMensagem (mensagem) {
  return request({
    url: `/messages/${mensagem.messageId}`,
    method: 'delete',
    data: mensagem
  })
}

/**
 * Cria um novo ticket
 * POST /api/tickets
 */
export function CriarTicket (data) {
  return request({
    url: '/tickets',
    method: 'post',
    data
  })
}

/**
 * Edita o conteúdo de uma mensagem
 */
export function EditarMensagem (mensagem) {
  return request({
    url: `/messages/edit/${mensagem.messageId}`,
    method: 'post',
    data: mensagem
  })
}
