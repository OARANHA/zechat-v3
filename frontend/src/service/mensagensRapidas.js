import request from 'src/service/request'

/**
 * Serviços para mensagens rápidas (Fast Reply)
 * Backend: routes.use('/api/fast-reply', fastReplyRoutes)
 */

export function CriarMensagemRapida (data) {
  return request({
    url: '/fast-reply/',
    method: 'post',
    data
  })
}

export function ListarMensagensRapidas () {
  return request({
    url: '/fast-reply/',
    method: 'get'
  })
}

export function AlterarMensagemRapida (data) {
  return request({
    url: `/fast-reply/${data.id}`,
    method: 'put',
    data
  })
}

export function DeletarMensagemRapida (data) {
  return request({
    url: `/fast-reply/${data.id}`,
    method: 'delete'
  })
}
