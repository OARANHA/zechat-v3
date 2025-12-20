/**
 * Service para chamar APIs de integração ERP e assinaturas
 */

import service from './request'

// ============== INTEGRAÇÕES ERP ==============

export const GetERPIntegration = async () => {
  return service({
    url: '/api/integrations/erp',
    method: 'get'
  })
}

export const ConfigureERPIntegration = async (data) => {
  return service({
    url: '/api/integrations/erp/configure',
    method: 'post',
    data
  })
}

export const TestERPIntegration = async () => {
  return service({
    url: '/api/integrations/erp/test',
    method: 'post'
  })
}

export const DisableERPIntegration = async () => {
  return service({
    url: '/api/integrations/erp/disable',
    method: 'post'
  })
}

// ============== ASSINATURAS ==============

export const CreateSubscription = async (data) => {
  return service({
    url: '/api/subscriptions',
    method: 'post',
    data
  })
}

export const GetSubscriptions = async () => {
  return service({
    url: '/api/subscriptions',
    method: 'get'
  })
}

export const GetSubscription = async (subscriptionId) => {
  return service({
    url: `/api/subscriptions/${subscriptionId}`,
    method: 'get'
  })
}

export const CancelSubscription = async (subscriptionId, reason) => {
  return service({
    url: `/api/subscriptions/${subscriptionId}/cancel`,
    method: 'post',
    data: { reason }
  })
}

export const UpgradeSubscription = async (subscriptionId, newPlanId) => {
  return service({
    url: `/api/subscriptions/${subscriptionId}/upgrade`,
    method: 'post',
    data: { newPlanId }
  })
}
