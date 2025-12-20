import request from 'src/service/request'

export function CriarEtiqueta (data) {
  return request({
    url: '/tags/',
    method: 'post',
    data
  })
}

export function ListarEtiquetas (isActive = null) {
  const params = {}
  if (isActive !== null) {
    params.isActive = isActive
  }
  return request({
    url: '/tags/',
    method: 'get',
    params
  })
}

export function AlterarEtiqueta (data) {
  return request({
    url: `/tags/${data.id}`,
    method: 'put',
    data
  })
}

export function DeletarEtiqueta (data) {
  return request({
    url: `/tags/${data.id}`,
    method: 'delete'
  })
}
