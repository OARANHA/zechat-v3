import request from 'src/service/request'

/**
 * Serviços para integração com Facebook
 * Backend: routes.use('/api/facebook', facebookRoutes)
 */

/**
 * Busca páginas do Facebook
 * Endpoint: POST /api/facebook/fb/register-pages
 */
export function FetchFacebookPages (data) {
  return request({
    url: '/facebook/fb/register-pages',
    method: 'post',
    data
  })
}

/**
 * Desconecta páginas do Facebook
 * Endpoint: POST /api/facebook/fb/logout-pages
 */
export function LogoutFacebookPages (data) {
  return request({
    url: '/facebook/fb/logout-pages',
    method: 'post',
    data
  })
}
