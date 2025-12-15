# Plano de Correções de Conectividade Docker - 28web Hub

## Objetivo

Este documento detalha o plano para corrigir problemas de conectividade Docker no projeto 28web Hub. O foco é resolver inconsistências de porta, configuração de PROXY_PORT e integrar o processo de configuração de SSL.

## Problemas Identificados

1. **Inconsistências de porta do backend**
   - O backend está sendo exposto na porta 8080 no docker-compose, mas a configuração do nginx aponta para a porta 3100 internamente.

2. **Configuração incorreta do frontend**
   - A configuração do nginx aponta para `frontend-dev:8080`, mas o serviço está configurado para expor a porta 3000:3000.

3. **Configuração de PROXY_PORT**
   - Não há uma definição clara para PROXY_PORT no arquivo .env, o que causa inconsistências.

4. **Integração de SSL**
   - O documento sobre problemas com SSL mostra instruções para configurar certificados, mas não está integrado ao docker-compose.yml.

## Soluções Propostas

### 1. Definir a configuração padrão da PROXY_PORT no arquivo .env

**Arquivo**: `.env`

**Alterações**:
```diff
+ PROXY_PORT=8080
```

**Justificativa**: Definir um valor padrão para PROXY_PORT evita inconsistências e facilita a configuração.

### 2. Ajustar a configuração do nginx para apontar corretamente para a porta do frontend

**Arquivo**: `frontend/nginx.conf`

**Alteração**:
```diff
- upstream frontend_app {
-     server frontend-dev:8080;
- }

+ upstream frontend_app {
+     server frontend-dev:3000;
+ }
```

**Justificativa**: Ajustar o upstream para refletir a porta correta do serviço frontend-dev (3000).

### 3. Verificar a porta interna do backend no docker-compose.yml

**Arquivo**: `docker-compose.yml`

**Verificação**:
```diff
ports:
- - "8080:3100"
+ - "8080:3100" # Manter esta configuração, pois está correta
```

**Justificativa**: Manter a porta 3100 interna do backend no docker-compose.yml, pois já está correta e coincide com a configuração do nginx.

### 4. Integrar o processo de configuração de SSL ao docker-compose.yml

**Arquivo**: `docker-compose.yml`

**Alterações**:
```diff
services:
+ # Serviço de Certbot para SSL
+ certbot:
+   image: certbot/certbot
+   container_name: 28web-certbot
+   volumes:
+     - ./certbot/conf:/etc/letsencrypt
+     - ./certbot/www:/var/www/certbot
+     - ./nginx/nginx.conf:/etc/nginx/nginx.conf
+   entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
+   restart: unless-stopped

  # Nginx Proxy Server (comum a dev/prod)
  nginx:
    image: nginx:alpine
    container_name: 28web-nginx
    restart: unless-stopped
    ports:
      - "${PROXY_PORT:-8080}:80"
+     - "443:443" # Adicionar porta 443 para HTTPS
    volumes:
      - ./frontend/nginx.conf:/etc/nginx/nginx.conf:ro
      - nginx_logs:/var/log/nginx
+     - ./certbot/conf:/etc/letsencrypt # Adicionar volume para certificados
+     - ./certbot/www:/var/www/certbot  # Adicionar volume para challenge HTTP

    # Configuração de saúde
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 30s

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:
  rabbitmq_data:
  nginx_logs:
+ certbot_conf: # Adicionar volume para certificados
+ certbot_www:  # Adicionar volume para challenge HTTP
```

**Justificativa**: Adicionar um serviço de Certbot automatizado e volumes para certificados SSL, preparando o sistema para HTTPS.

### 5. Configurar o nginx para usar SSL

**Arquivo**: `frontend/nginx.conf`

**Alteração**:
```diff
server {
+   listen 80;
+   server_name _;
+   return 301 https://$host$request_uri;
+ }
+
+ server {
+   listen 443 ssl http2;
+   server_name _;

    # Configurações SSL
+   ssl_certificate /etc/letsencrypt/live/seudominio.com.br/fullchain.pem;
+   ssl_certificate_key /etc/letsencrypt/live/seudominio.com.br/privkey.pem;
+   include /etc/letsencrypt/options-ssl-nginx.conf;
+   ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
+
    # Segurança adicional
+   ssl_protocols TLSv1.2 TLSv1.3;
+   ssl_prefer_server_ciphers on;
+   ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
+
    # Cabeçalhos de segurança
+   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
+   add_header X-Frame-Options "SAMEORIGIN" always;
+   add_header X-XSS-Protection "1; mode=block" always;
+   add_header X-Content-Type-Options "nosniff" always;
+   add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

**Justificativa**: Configurar o nginx para forçar HTTPS e adicionar cabeçalhos de segurança.

### 6. Criar script de inicialização para certificado SSL

**Arquivo**: `scripts/init-ssl.sh`

**Conteúdo**:
```bash
#!/bin/bash

# Script para obter certificado SSL inicial
# Uso: ./init-ssl.sh seu.dominio.com

DOMAIN=$1
EMAIL="seu-email@example.com"

if [ -z "$DOMAIN" ]; then
  echo "Uso: $0 <dominio>"
  echo "Exemplo: $0 28web.com.br"
  exit 1
fi

# Criar diretórios
mkdir -p certbot/conf
mkdir -p certbot/www

# Obter certificado inicial
docker run --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  -d $DOMAIN \
  --d backend.$DOMAIN

# Copiar arquivos de configuração SSL
docker run --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  certbot/certbot \
  show_config
```

**Justificativa**: Criar um script para facilitar a obtenção do certificado SSL inicial.

## Plano de Implementação

1. **Atualizar arquivo .env** com a definição de PROXY_PORT
2. **Corrigir nginx.conf** para apontar corretamente para a porta do frontend
3. **Atualizar docker-compose.yml** para adicionar serviço de Certbot e volumes SSL
4. **Criar script de inicialização** para certificado SSL
5. **Testar conectividade** entre os serviços
6. **Documentar mudanças** para referência futura

## Impacto Esperado

- Resolução dos problemas de conectividade Docker
- Preparação para uso de SSL/HTTPS
- Melhoria da segurança da aplicação
- Facilitar a configuração de ambiente de desenvolvimento e produção

## Próximos Passos

- Implementar as correções listadas
- Executar testes de conectividade
- Avaliar a necessidade de ajustes adicionais
- Documentar o processo para facilitar futuras implementações