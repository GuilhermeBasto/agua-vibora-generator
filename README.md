# Água Víbora Generator v2

Uma aplicação web moderna para gerar e gerenciar cronogramas de irrigação para o sistema de irrigação de Água de Víbora. Esta versão é construída com React Router e oferece uma interface interativa para criar cronogramas personalizados para as múltiplas aldeias nas regiões de Torre e Santo-António.

## Recursos

- **Interface Interativa**: Formulário intuitivo para criação de cronogramas personalizados
- **Suporte Multi-Aldeia**: Gerencia cronogramas para 11 aldeias diferentes em duas regiões
- **Múltiplos Formatos de Exportação**:
  - PDF
  - Excel (.xlsx)
  - CSV
  - iCalendar (.ics) para integração com Google Calendar
- **Seletor de Ano**: Ajusta automaticamente os cronogramas com base em anos pares/ímpares
- **Geração de Templates**: Cria templates em branco para agendamento manual
- **Design Responsivo**: Interface otimizada para desktop e mobile

## Aldeias Cobertas

### Região Torre

- Torre
- Crasto
- Passo
- Ramada
- Figueiredo
- Redondinho

### Região Santo-António

- Casa Nova
- Eirô
- Cimo de Aldeia
- Portela
- Casa de Baixo

## Estrutura do Projeto

```
agua-vibora-generator-v2/
├── app/
│   ├── components/
│   │   ├── ConfigurationForm.tsx        # Formulário de configuração
│   │   ├── DownloadSection.tsx          # Seção de download
│   │   ├── ScheduleInputGroup.tsx       # Grupo de entrada de agendamento
│   │   ├── WaterManagement.tsx          # Gerenciamento de água
│   │   ├── YearSelector.tsx             # Seletor de ano
│   │   ├── BackgroundGradient.tsx       # Componente de gradiente
│   │   ├── Footer.tsx                   # Rodapé
│   │   ├── Header.tsx                   # Cabeçalho
│   │   ├── PageHeader.tsx               # Cabeçalho de página
│   │   ├── InfoCard.tsx                 # Cartão de informação
│   │   ├── Icon.tsx                     # Componente de ícone
│   │   └── ui/                          # Componentes UI reutilizáveis
│   ├── lib/
│   │   ├── schedule.server.ts           # Lógica de geração de cronograma (servidor)
│   │   ├── types.ts                     # Definições de tipo TypeScript
│   │   ├── constants.ts                 # Constantes da aplicação
│   │   └── utils.ts                     # Funções utilitárias
│   ├── routes/
│   │   ├── api.create-schedule.ts       # Endpoint para criar cronograma
│   │   ├── api.$format.ts               # Endpoint para download de formatos
│   │   ├── create-custom-schedule.tsx   # Página de criação de cronograma
│   │   ├── schedule-display.tsx         # Página de exibição de cronograma
│   │   └── home.tsx                     # Página inicial
│   ├── entry.client.tsx                 # Entrada do cliente
│   ├── entry.server.tsx                 # Entrada do servidor
│   ├── root.tsx                         # Componente raiz
│   ├── routes.ts                        # Configuração de rotas
│   └── tailwind.css                     # Estilos globais
├── public/                              # Arquivos estáticos
├── package.json
├── tsconfig.json
├── tailwind.config.ts                   # Configuração do Tailwind CSS
├── vite.config.ts                       # Configuração do Vite
├── postcss.config.ts                    # Configuração do PostCSS
├── react-router.config.ts               # Configuração do React Router
└── README.md
```

## Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd agua-vibora-generator-v2
```

2. Instale as dependências:

```bash
npm install
```

## Uso

### Modo Desenvolvimento

Execute a aplicação em modo desenvolvimento com recarregamento automático:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta se essa estiver em uso).

### Modo Produção

1. Construa a aplicação:

```bash
npm run build
```

2. Inicie o servidor de produção:

```bash
npm run start
```

## Endpoints da API

### Criar Cronograma

Endpoint para criar um novo cronograma personalizado.

```
POST /api/create-schedule
```

**Corpo da Requisição:**

```json
{
  "name": "Cronograma 2025",
  "year": "2025",
  "schedules": {
    "Torre": ["1h30 da tarde", "12h até as 2h da tarde"],
    "Passo": ["10 da noite até ás 1h30/5h30 da tarde"]
  }
}
```

**Resposta:**

```json
{
  "data": [
    /* dados do cronograma gerado */
  ],
  "name": "Cronograma 2025",
  "year": "2025"
}
```

### Download de Cronograma

Baixa o cronograma em diferentes formatos.

```
GET /api/:format?year=2025
```

**Parâmetros:**

- `:format` (obrigatório): Formato do arquivo - `xlsx`, `pdf`, ou `ics`
- `year` (opcional): Ano do cronograma (padrão: ano atual)
- `template` (opcional): Define como `true` para baixar template sem horários

**Exemplos:**

- `/api/xlsx?year=2025` - Cronograma completo em Excel
- `/api/pdf?year=2025&template=true` - Template PDF vazio
- `/api/ics?year=2025` - Arquivo iCalendar para Google Calendar

## Lógica de Agendamento

O cronograma de irrigação segue estas regras:

- **Temporada**: Funciona de 25 de junho a 29 de setembro cada ano
- **Rotação**: As aldeias seguem um padrão específico de rotação que muda anualmente
- **Variações de Horário**: Diferentes cronogramas se aplicam a Torre, Passo e Figueiredo com base em anos pares/ímpares
- **Ano de Referência**: 2025 é usado como o ano base para calcular rotações

## Desenvolvimento

### Scripts

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Compila TypeScript e prepara para produção
- `npm run start` - Executa servidor de produção
- `npm run typecheck` - Valida tipos TypeScript

### Stack de Tecnologia

- **Runtime**: Node.js
- **Framework Frontend**: React com React Router v7
- **Linguagem**: TypeScript
- **Styling**: Tailwind CSS com animações
- **Build Tool**: Vite
- **Componentes UI**: Componentes customizados com padrões shadcn/ui
- **Exportação de Dados**:
  - PDFKit para geração de PDF
  - ExcelJS para geração de Excel
  - ICS para iCalendar

## Deployment

### Docker Deployment

Para construir e executar com Docker:

```bash
docker build -t agua-vibora-generator-v2 .

# Executar o container
docker run -p 3000:3000 agua-vibora-generator-v2
```

A aplicação containerizada pode ser implantada em qualquer plataforma que suporte Docker:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### Implantação DIY

Se está familiarizado com a implantação de aplicações Node, o servidor integrado está pronto para produção.

Certifique-se de implementar a saída de `npm run build`:

```
├── package.json
├── package-lock.json
├── build/
│   ├── client/    # Ativos estáticos
│   └── server/    # Código do servidor
```

## Tratamento de Erros

A aplicação inclui tratamento abrangente de erros:

- Validação de entrada nos endpoints da API
- Mensagens de erro estruturadas
- Tratamento de erros de JSON parsing
- Validação de campos obrigatórios

## Licença

Projeto privado - Todos os direitos reservados

## Contribuindo

Este é um projeto privado. Para contribuições, entre em contato com o mantedor do projeto.
