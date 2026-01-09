# Água Víbora Generator v2

Uma aplicação web moderna para criar e gerir calendarios de rega para o sistema de rega de Água de Víbora. Esta versão é construída com React Router e oferece uma interface interativa para criar calendarios personalizados para as múltiplas aldeias nas regiões de Torre e Santo-António.

## Recursos

- **Interface Interativa**: Formulário intuitivo para criação de calendarios personalizados
- **Suporte Multi-Aldeia**: Gerencia calendarios para 11 aldeias diferentes em duas regiões
- **Múltiplos Formatos de Exportação**:
    - PDF
    - Excel (.xlsx)
    - CSV
    - iCalendar (.ics) para integração com Google Calendar
- **Seletor de Ano**: Ajusta automaticamente os calendarios com base em anos pares/ímpares
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
agua-vibora-generator/
├── app/
│   ├── components/
│   │   ├── BackgroundGradient.tsx       # Componente de gradiente de fundo
│   │   ├── ConfigurationForm.tsx        # Formulário de configuração
│   │   ├── DownloadSection.tsx          # Seção de download
│   │   ├── Footer.tsx                   # Rodapé da aplicação
│   │   ├── Icon.tsx                     # Componente de ícone
│   │   ├── InfoCard.tsx                 # Cartão de informação
│   │   ├── PageHeader.tsx               # Cabeçalho de página
│   │   ├── ScheduleInputGroup.tsx       # Grupo de entrada de agendamento
│   │   ├── ScheduleTable.tsx            # Tabela de cronograma
│   │   ├── YearSelector.tsx             # Seletor de ano
│   │   └── ui/                          # Componentes UI reutilizáveis
│   ├── lib/
│   │   ├── schedule.server.ts           # Lógica de geração de cronograma (servidor)
│   │   ├── types.ts                     # Definições de tipo TypeScript
│   │   ├── constants.ts                 # Constantes da aplicação
│   │   └── utils.ts                     # Funções utilitárias
│   ├── routes/
│   │   ├── api.$format.ts               # Endpoint para download de formatos
│   │   ├── api.create-schedule.ts       # Endpoint para criar cronograma
│   │   ├── create-custom-schedule.tsx   # Página de criação de cronograma
│   │   ├── home.tsx                     # Página inicial
│   │   ├── my-schedule.tsx              # Página de visualização do cronograma
│   │   └── template.tsx                 # Página de template
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
cd agua-vibora-generator
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
    "name": "Cronograma 2026",
    "year": "2026",
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
    "name": "Cronograma 2026",
    "year": "2026"
}
```

### Download de Cronograma

Baixa o cronograma em diferentes formatos.

```
GET /api/:format?year=2026
```

**Parâmetros:**

- `:format` (obrigatório): Formato do arquivo - `xlsx`, `pdf`, ou `ics`
- `year` (opcional): Ano do cronograma (padrão: ano atual)
- `template` (opcional): Define como `true` para baixar template sem horários

**Exemplos:**

- `/api/xlsx?year=2026` - Cronograma completo em Excel
- `/api/pdf?year=2026&template=true` - Template PDF vazio
- `/api/ics?year=2026` - Arquivo iCalendar para Google Calendar

## Lógica de Agendamento

O cronograma de rega segue estas regras:

- **Temporada**: Funciona de 25 de junho a 29 de setembro cada ano
- **Rotação**: As aldeias seguem um padrão específico de rotação que muda anualmente
- **Variações de Horário**: Diferentes calendarios se aplicam a Torre, Passo e Figueiredo com base em anos pares/ímpares
- **Ano de Referência**: 2026 é usado como o ano base para calcular rotações

## Utilitários Compartilhados (server)

- **[app/lib/utils.server.ts](app/lib/utils.server.ts)** fornece utilitários comuns usados pelos geradores:
    - `getOrder(list, year, referenceYear)`: calcula a rotação anual de uma lista.
    - `getYearScheduleDurations(year, schedule)`: seleciona configuração de horários para anos pares/ímpares.
    - `getDateRange(year, startCfg, endCfg)`: cria datas de início/fim da temporada.
    - `generateSchedulePointers(config)`: inicializa ponteiros por local para ciclagem de rótulos.
    - `buildScheduleData(...)`: constrói entradas diárias reutilizando a lógica de rotação e formatação.
    - `generatePDF(title, data)`: renderiza PDF com layout compacto (margens e espaçamento otimizados).

Ambos os ficheiros de servidor já usam estes helpers:

- [app/lib/schedule.server.ts](app/lib/schedule.server.ts)
- [app/lib/poolSchedule.server.ts](app/lib/poolSchedule.server.ts)

## Hook de Paginação (client)

- **[app/hooks/usePagination.ts](app/hooks/usePagination.ts)** encapsula paginação de listas:
    - Entrada: `data`, `currentPage`, `itemsPerPage` (padrão 20)
    - Saída: `paginatedData`, `totalPages`, `pageNumbers`
    - Uso exemplo: ver [app/routes/create-custom-schedule.tsx](app/routes/create-custom-schedule.tsx)

## Ajustes de UI

- Em [app/components/ScheduleInputGroup.tsx](app/components/ScheduleInputGroup.tsx), o seletor "Configurar horários de..." só aparece quando existem aldeias adicionadas.
- Em [app/components/Card.tsx](app/components/Card.tsx), as classes de hover foram fixas (sem template strings dinâmicas) para suportar cores como emerald com Tailwind.

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
docker build -t agua-vibora-generator .

# Executar o container
docker run -p 3000:3000 agua-vibora-generator
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
