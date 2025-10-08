# Deploy na Vercel

## 🚀 Configuração Completa

### ✅ Já Configurado:
- `vercel.json` - Configuração de deploy
- Funções serverless em `/api`
- Frontend otimizado para produção
- Dependências necessárias adicionadas

### 📋 Passos para Deploy:

1. **Acesse [vercel.com](https://vercel.com)**
2. **Conecte sua conta GitHub**
3. **Clique em "New Project"**
4. **Selecione o repositório `gymbuddy-improved`**
5. **Configure as variáveis de ambiente**:
   ```
   JWT_SECRET=seu_jwt_secret_super_seguro_aqui
   NODE_ENV=production
   ```
6. **Clique em "Deploy"**

### 🔧 Funcionalidades:
- ✅ Frontend React + Vite
- ✅ API Serverless (login/register)
- ✅ Roteamento SPA
- ✅ Autenticação JWT
- ✅ Build otimizado

### 🌐 URLs após deploy:
- **App**: `https://seu-projeto.vercel.app`
- **API**: `https://seu-projeto.vercel.app/api/auth/login`

### 🔐 Usuário Demo:
- **Email**: `demo@gymbuddy.com`
- **Senha**: `password`

### ⚡ Deploy automático configurado!
Qualquer push na branch `main` fará deploy automaticamente.