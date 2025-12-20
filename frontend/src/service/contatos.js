import request from 'src/service/request'

/**
 * Serviços para gerenciamento de Contatos
 * Backend: routes.use('/api/contacts', contactRoutes)
 */

/**
 * Lista todos os contatos
 * Endpoint: GET /api/contacts
 */
export function ListarContatos (params) {
  return request({
    url: '/contacts/',
    method: 'get',
    params
  })
}

/**
 * Obtém um contato específico
 * Endpoint: GET /api/contacts/:contactId
 */
export function ObterContato (contactId) {
  return request({
    url: `/contacts/${contactId}`,
    method: 'get'
  })
}

/**
 * Cria um novo contato
 * Endpoint: POST /api/contacts
 */
export function CriarContato (data) {
  return request({
    url: '/contacts',
    method: 'post',
    data
  })
}

/**
 * Importa contatos via arquivo
 * Endpoint: POST /api/contacts/upload
 */
export function ImportarArquivoContato (data) {
  return request({
    url: '/contacts/upload',
    method: 'post',
    data,
    timeout: 120000
  })
}

/**
 * Exporta contatos para arquivo
 * Endpoint: POST /api/contacts/export
 */
export function ExportarArquivoContato (data) {
  return request({
    url: '/contacts/export',
    method: 'post',
    data,
    timeout: 120000
  })
}

/**
 * Sincroniza contatos
 * Endpoint: POST /api/contacts/sync
 */
export function SyncronizarContatos () {
  return request({
    url: '/contacts/sync',
    method: 'post'
  })
}

/**
 * Edita um contato existente
 * Endpoint: PUT /api/contacts/:contactId
 */
export function EditarContato (contactId, data) {
  return request({
    url: `/contacts/${contactId}`,
    method: 'put',
    data
  })
}

/**
 * Deleta um contato
 * Endpoint: DELETE /api/contacts/:contactId
 */
export function DeletarContato (contactId) {
  return request({
    url: `/contacts/${contactId}`,
    method: 'delete'
  })
}

/**
 * Edita etiquetas de um contato
 * Endpoint: PUT /api/contacts/contact-tags/:contactId
 */
export function EditarEtiquetasContato (contactId, tags) {
  const data = {
    tags
  }
  return request({
    url: `/contacts/contact-tags/${contactId}`,
    method: 'put',
    data
  })
}

/**
 * Edita carteira de um contato
 * Endpoint: PUT /api/contacts/contact-wallet/:contactId
 */
export function EditarCarteiraContato (contactId, wallets) {
  const data = {
    wallets
  }
  return request({
    url: `/contacts/contact-wallet/${contactId}`,
    method: 'put',
    data
  })
}
