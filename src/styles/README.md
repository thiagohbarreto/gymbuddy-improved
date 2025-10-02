# Sistema de Estilos - Gym Buddy

## Padrão de Design

Todas as páginas seguem o mesmo padrão visual baseado no design da página de login:

### 🎨 Estrutura Base

```tsx
<div className="page-container">
  <div className="glass-card fade-in">
    <div className="page-header">
      <h1>Título da Página</h1>
      <p>Descrição da página</p>
    </div>
    
    {/* Conteúdo da página */}
  </div>
</div>
```

### 📦 Classes Disponíveis

#### Containers
- `page-container` - Container principal com background animado
- `glass-card` - Card com efeito glassmorphism

#### Headers
- `page-header` - Header padrão das páginas

#### Botões
- `btn-primary` - Botão principal (azul com gradiente)
- `btn-secondary` - Botão secundário (branco com borda)
- `btn-danger` - Botão de perigo (vermelho)

#### Inputs
- `input-group` - Container do input
- `input-label` - Label do input
- `input-field` - Campo de input estilizado

#### Layout
- `grid cols-1/2/3/4` - Grid responsivo
- `stat-card` - Cards de estatísticas com gradiente

#### Animações
- `fade-in` - Animação de entrada suave
- `slide-up` - Animação de deslizar para cima

### 🚀 Como Usar em Novas Páginas

1. Importe os estilos globais (já incluído no global.scss)
2. Use a estrutura base mostrada acima
3. Aplique as classes conforme necessário

### 🎯 Exemplo Completo

```tsx
const MinhaNovaPage = () => {
  return (
    <div className="page-container">
      <div className="glass-card fade-in">
        <div className="page-header">
          <h1>Minha Nova Página</h1>
          <p>Descrição da funcionalidade</p>
        </div>
        
        <div className="grid cols-2">
          <div className="stat-card">
            <h3>Estatística 1</h3>
            <p>Valor</p>
          </div>
          <div className="stat-card success">
            <h3>Estatística 2</h3>
            <p>Valor</p>
          </div>
        </div>
        
        <div className="input-group">
          <label className="input-label">Campo</label>
          <input className="input-field" placeholder="Digite aqui..." />
        </div>
        
        <button className="btn-primary">Ação Principal</button>
      </div>
    </div>
  );
};
```

Este padrão garante consistência visual em todo o projeto!