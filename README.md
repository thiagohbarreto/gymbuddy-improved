# Gym Buddy - Versão Melhorada 🏋️‍♂️

Uma versão completamente melhorada do aplicativo Gym Buddy com recursos avançados, melhor performance e experiência do usuário aprimorada.

## 🚀 Principais Melhorias

### Frontend
- **React Query**: Gerenciamento de estado do servidor com cache inteligente
- **Zustand**: Estado global leve e performático
- **React Hook Form + Zod**: Formulários otimizados com validação
- **Framer Motion**: Animações fluidas e interativas
- **PWA**: Funcionalidade offline e instalação como app
- **Lazy Loading**: Carregamento sob demanda das páginas
- **Toast Notifications**: Feedback visual melhorado
- **Timer de Descanso**: Com notificações e controles avançados
- **Gráficos**: Visualização de progresso com Recharts
- **Sistema de Conquistas**: Gamificação para motivação
- **Tema Dark/Light**: Alternância de temas

### Backend
- **Rate Limiting**: Proteção contra spam
- **Helmet**: Segurança HTTP melhorada
- **Winston**: Sistema de logs estruturado
- **Zod**: Validação robusta de dados
- **Compressão**: Otimização de resposta
- **Middleware**: Arquitetura mais organizada

### Funcionalidades Novas
- 📊 **Estatísticas Avançadas**: Gráficos de progresso, volume total, streaks
- 🏆 **Sistema de Conquistas**: Badges e gamificação
- ⏱️ **Timer de Descanso**: Com presets e ajustes
- 📱 **PWA**: Instalável como app nativo
- 🌙 **Tema Escuro**: Alternância de temas
- 📈 **Gráficos**: Visualização de evolução
- 🔄 **Offline**: Funcionalidade básica offline
- 🎯 **Calculadoras**: 1RM, volume, intensidade

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- MySQL 8.0+
- npm ou yarn

### Frontend
```bash
cd gymbuddy-improved
npm install
npm run dev
```

### Backend
```bash
cd gymbuddy-improved/api
npm install
cp .env.example .env
# Configure as variáveis de ambiente
npm run dev
```

### Banco de Dados
```sql
CREATE DATABASE gymbuddy_improved;
```

## 🛠️ Scripts Disponíveis

### Frontend
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Verificar código
- `npm run format` - Formatar código

### Backend
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Compilar TypeScript
- `npm run start` - Executar em produção
- `npm run test` - Executar testes
- `npm run lint` - Verificar código

## 🏗️ Arquitetura

### Frontend
```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── hooks/         # Hooks customizados
├── store/         # Estado global (Zustand)
├── types/         # Tipos TypeScript
├── utils/         # Utilitários
└── styles/        # Estilos globais
```

### Backend
```
src/
├── controllers/   # Controladores
├── middleware/    # Middlewares
├── models/        # Modelos do banco
├── routes/        # Rotas da API
├── services/      # Lógica de negócio
├── utils/         # Utilitários
└── validators/    # Validações
```

## 🎯 Funcionalidades

### ✅ Implementadas
- [x] Gerenciamento de treinos
- [x] Timer de descanso
- [x] Sistema de temas
- [x] Estatísticas básicas
- [x] Conquistas
- [x] PWA
- [x] Gráficos de progresso
- [x] Validação de formulários
- [x] Loading states
- [x] Toast notifications

### 🚧 Em Desenvolvimento
- [ ] Autenticação JWT
- [ ] Histórico detalhado
- [ ] Backup/Export
- [ ] Compartilhamento
- [ ] Notificações push

### 🔮 Futuras
- [ ] IA para sugestões
- [ ] Integração com wearables
- [ ] Rede social
- [ ] Planos de treino

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- React Team pelo excelente framework
- Tanstack pelo React Query
- Framer Motion pelas animações
- Recharts pelos gráficos
- E toda a comunidade open source!

---

Feito com ❤️ para ajudar você a alcançar seus objetivos fitness! 💪