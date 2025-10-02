# Deploy no Render

## 🚀 Passos para Deploy

### 1. Preparação
- ✅ Projeto já configurado com `render.yaml`
- ✅ API com `package.json` próprio
- ✅ Frontend configurado para usar variável de ambiente

### 2. Deploy no Render

#### Opção A: Deploy Automático (Recomendado)
1. Acesse [render.com](https://render.com)
2. Conecte sua conta GitHub
3. Clique em "New" → "Blueprint"
4. Selecione o repositório `gymbuddy-improved`
5. O Render detectará automaticamente o `render.yaml`
6. Clique em "Apply" para criar os serviços

#### Opção B: Deploy Manual
1. **Backend (API)**:
   - New → Web Service
   - Conectar repositório
   - Root Directory: `api`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Adicionar variáveis de ambiente

2. **Frontend**:
   - New → Static Site
   - Conectar repositório
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Adicionar variável: `VITE_API_URL=https://sua-api.onrender.com`

3. **Banco de Dados**:
   - New → PostgreSQL
   - Nome: `gymbuddy-db`

### 3. Variáveis de Ambiente

#### Backend:
```
NODE_ENV=production
JWT_SECRET=seu_jwt_secret_aqui
DB_HOST=seu_db_host
DB_PORT=5432
DB_NAME=gymbuddy
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
```

#### Frontend:
```
VITE_API_URL=https://sua-api.onrender.com
```

### 4. Após o Deploy
1. Configure o banco de dados
2. Execute as migrações se necessário
3. Teste a aplicação

## 📝 Notas
- O Render oferece plano gratuito com limitações
- O banco PostgreSQL gratuito expira em 90 dias
- Para produção, considere planos pagos