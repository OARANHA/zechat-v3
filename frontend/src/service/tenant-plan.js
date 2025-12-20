import service from './request'

export const GetTenantConsumption = async () => {
  return service({
    url: '/tenant-plan/consumption',
    method: 'get'
  })
}

export const GetTenantPlanInfo = async () => {
  return service({
    url: '/tenant-plan/info',
    method: 'get'
  })
}
