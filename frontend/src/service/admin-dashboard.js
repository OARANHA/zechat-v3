import service from './request'

export const GetDashboardMetrics = async () => {
  return service({
    url: '/admin/dashboard/metrics',
    method: 'get'
  })
}

export const GetTenantsWithConsumption = async () => {
  return service({
    url: '/admin/dashboard/tenants',
    method: 'get'
  })
}
