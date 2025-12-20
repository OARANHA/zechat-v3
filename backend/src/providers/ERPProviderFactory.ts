/**
 * Factory para criar instâncias de providers ERP
 * Pattern: Factory Method
 */

import { IERPProvider } from "../interfaces/IERPProvider";
import VendaERPProvider from "./VendaERPProvider";
import AppError from "../errors/AppError";

export class ERPProviderFactory {
  static create(
    providerType: string,
    apiKey: string,
    webhookSecret: string
  ): IERPProvider {
    switch (providerType.toLowerCase()) {
      case 'vendaerp':
        return new VendaERPProvider(apiKey, webhookSecret);
      
      case 'bling':
        // return new BlingProvider(apiKey, webhookSecret);
        throw new AppError('Bling provider ainda não implementado');
      
      case 'omie':
        // return new OmieProvider(apiKey, webhookSecret);
        throw new AppError('Omie provider ainda não implementado');
      
      case 'mercadopago':
        // return new MercadoPagoProvider(apiKey, webhookSecret);
        throw new AppError('MercadoPago provider ainda não implementado');
      
      default:
        throw new AppError(`Provider '${providerType}' não suportado`);
    }
  }
}
