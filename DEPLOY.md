# 🚀 Guia de Deploy - Gym Buddy

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Servidor com suporte a Node.js (Vercel, Netlify, Railway, etc.)

## 🔧 Configuração para Produção

### Frontend

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
# Editar .env com a URL da API de produção
```

3. **Build para produção:**
```bash
npm run build
```

4. **Deploy:**
- **Vercel:** `vercel --prod`
- **Netlify:** Fazer upload da pasta `dist`
- **Outros:** Servir arquivos da pasta `dist`

### Backend

1. **Instalar dependências:**
```bash
cd api
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
# Configurar PORT e outras variáveis
```

3. **Iniciar servidor:**
```bash
npm start
```

## 🌐 Opções de Deploy

### Frontend
- **Vercel** (Recomendado)
- **Netlify**
- **GitHub Pages**

### Backend
- **Railway** (Recomendado)
- **Heroku**
- **DigitalOcean**
- **AWS EC2**

## 🔒 Segurança

- Alterar URLs de desenvolvimento para produção
- Configurar CORS adequadamente
- Usar HTTPS em produção
- Implementar rate limiting (já configurado)

## 📊 Monitoramento

- Logs do servidor disponíveis via console
- Health check em `/health`
- Dados persistidos em arquivos JSON

## 🐛 Troubleshooting

### Problemas Comuns:
1. **CORS Error:** Verificar configuração de CORS no backend
2. **404 na API:** Verificar URL da API no frontend
3. **Dados perdidos:** Verificar permissões de escrita no servidor

### Logs Úteis:
```bash
# Backend
npm run dev

# Frontend
npm run dev
```

## 📝 Checklist de Deploy

- [ ] Frontend buildado sem erros
- [ ] Backend funcionando em produção
- [ ] URLs de API configuradas
- [ ] CORS configurado
- [ ] Health check funcionando
- [ ] Dados persistindo corretamente
- [ ] Autenticação funcionando
- [ ] Responsividade testada

## 🎯 Performance

- Lazy loading implementado
- Compressão ativada no backend
- Cache de queries configurado
- Imagens otimizadas

---

**Projeto pronto para produção! 🚀**