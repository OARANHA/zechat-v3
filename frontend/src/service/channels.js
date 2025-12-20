import request from 'src/service/request'

/**
 * Serviços para gerenciamento de Canais e Sessões WhatsApp
 * Backend: routes.use('/api/admin', adminRoutes) - para rotas administrativas
 * Backend: routes.use('/api/whatsapp', whatsappRoutes) - para gerenciamento de WhatsApp
 * Backend: routes.use('/api/whatsapp-sessions', whatsappSessionRoutes) - para sessões WhatsApp
 */

/**
 * Lista todos os canais (apenas admin)
 * Endpoint: GET /api/admin/channels
 */
export function AdminListarChannels (whatsAppId) {
  return request({
    url: '/admin/channels/',
    method: 'get'
  })
}

/**
 * Inicia uma sessão WhatsApp
 * Endpoint: POST /api/whatsapp-sessions/whatsappsession/:whatsappId
 */
export function StartWhatsappSession (whatsAppId) {
  return request({
    url: `/whatsapp-sessions/whatsappsession/${whatsAppId}`,
    method: 'post'
  })
}

/**
 * Deleta uma sessão WhatsApp
 * Endpoint: DELETE /api/whatsapp-sessions/whatsappsession/:whatsappId
 */
export function DeleteWhatsappSession (whatsAppId) {
  return request({
    url: `/whatsapp-sessions/whatsappsession/${whatsAppId}`,
    method: 'delete'
  })
}

/**
 * Solicita novo QR Code para sessão WhatsApp
 * Endpoint: PUT /api/whatsapp-sessions/whatsappsession/:whatsappId
 */
export function RequestNewQrCode (whatsAppId) {
  return request({
    url: `/whatsapp-sessions/whatsappsession/${whatsAppId}`,
    method: 'put'
  })
}

/**
 * Obtém informações de uma sessão WhatsApp
 * Endpoint: GET /api/whatsapp/whatsapp/:whatsappId
 */
export function GetWhatSession (whatsAppId) {
  return request({
    url: `/whatsapp/whatsapp/${whatsAppId}`,
    method: 'get'
  })
}

/**
 * Atualiza um canal WhatsApp
 * Endpoint: PUT /api/whatsapp/whatsapp/:whatsappId
 */
export function UpdateChannel (channelId, data) {
  return request({
    url: `/whatsapp/whatsapp/${channelId}`,
    method: 'put',
    data
  })
}

/**
 * Cria um novo canal (apenas admin)
 * Endpoint: POST /api/admin/channels
 */
export function CriarChannel (data) {
  return request({
    url: '/admin/channels',
    method: 'post',
    data
  })
}

/**
 * Deleta um WhatsApp/canal
 * Endpoint: DELETE /api/whatsapp/whatsapp/:whatsappId
 */
export function DeletarWhatsapp (whatsAppId) {
  return request({
    url: `/whatsapp/whatsapp/${whatsAppId}`,
    method: 'delete'
  })
}

/**
 * Sincroniza contatos de um WhatsApp
 * Endpoint: POST /api/whatsapp/sync-contacts/:whatsappId
 */
export function SincronizarContatosWhatsapp (whatsAppId) {
  return request({
    url: `/whatsapp/sync-contacts/${whatsAppId}`,
    method: 'post',
    timeout: false
  })
}

// api.put(`/api/whatsapp/whatsapp/${whatsAppId}`, {
//   name: values.name,
//   isDefault: values.isDefault,
// });
