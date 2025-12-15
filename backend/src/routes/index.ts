import { Router } from 'express';
import adminRoutes from './adminRoutes';
import apiConfigRoutes from './apiConfigRoutes';
import apiExternalRoutes from './apiExternalRoutes';
import authRoutes from './authRoutes';
import autoReplyRoutes from './autoReplyRoutes';
import campaignContactsRoutes from './campaignContactsRoutes';
import campaignRoutes from './campaignRoutes';
import chatFlowRoutes from './chatFlowRoutes';
import contactRoutes from './contactRoutes';
import contactSyncRoutes from './contactSyncRoutes';
import facebookRoutes from './facebookRoutes';
import fastReplyRoutes from './fastReplyRoutes';
import hubChannelRoutes from './hubChannelRoutes';
import hubMessageRoutes from './hubMessageRoutes';
import hubWebhookRoutes from './hubWebhookRoutes';
import messageRoutes from './messageRoutes';
import metricsRouter from './metrics';
import queueRoutes from './queueRoutes';
import settingRoutes from './settingRoutes';
import statisticsRoutes from './statisticsRoutes';
import tagRoutes from './tagRoutes';
import tenantRoutes from './tenantRoutes';
import ticketRoutes from './ticketRoutes';
import userRoutes from './userRoutes';
import whatsappRoutes from './whatsappRoutes';
import whatsappSessionRoutes from './whatsappSessionRoutes';
import whatsappWebhookRoutes from './whatsappWebhookRoutes';

const routes = Router();

// Health check já está no modules.ts

// Auth routes
routes.use('/auth', authRoutes);

// API routes
routes.use('/users', userRoutes);
routes.use('/tickets', ticketRoutes);
routes.use('/whatsapp', whatsappRoutes);
routes.use('/settings', settingRoutes);
routes.use('/queue', queueRoutes);
routes.use('/contacts', contactRoutes);
routes.use('/messages', messageRoutes);
routes.use('/api', tagRoutes);
routes.use('/fast-reply', fastReplyRoutes);
routes.use('/campaigns', campaignRoutes);
routes.use('/campaign-contacts', campaignContactsRoutes);
routes.use('/auto-reply', autoReplyRoutes);
routes.use('/chat-flow', chatFlowRoutes);
routes.use('/hub-webhooks', hubWebhookRoutes);
routes.use('/hub-messages', hubMessageRoutes);
routes.use('/hub-channels', hubChannelRoutes);
routes.use('/whatsapp-sessions', whatsappSessionRoutes);
routes.use('/whatsapp-webhooks', whatsappWebhookRoutes);
routes.use('/api-config', apiConfigRoutes);
routes.use('/api-external', apiExternalRoutes);
routes.use('/admin', adminRoutes);
routes.use('/tenants', tenantRoutes);
routes.use('/statistics', statisticsRoutes);
routes.use('/contact-sync', contactSyncRoutes);
routes.use('/facebook', facebookRoutes);
routes.use('/metrics', metricsRouter);

export default routes;
