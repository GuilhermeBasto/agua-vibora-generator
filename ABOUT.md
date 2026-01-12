# 💧 Como Funciona a Água de Víbora

## 📖 Contexto Histórico

A **Levada da Víbora** é um sistema secular de gestão comunitária de água em **Abadim, Cabeceiras de Basto**. Este sistema divide o fluxo de água proveniente da Serra da Cabreira por "horas" e "casais" (lugares) entre os regantes da aldeia da Torre e de Santo António.

## 🔄 O Sistema de Rotação

### Princípios Fundamentais

O sistema baseia-se em **3 pilares principais**:

1. **Rotação Anual** - A ordem dos casais muda todos os anos
2. **Anos Pares vs Ímpares** - Horários diferentes conforme o ano
3. **Alternância Regional** - Torre e Santo António alternam a prioridade

### Estrutura dos Casais (Lugares)

#### 🏘️ Torre

- Torre
- Crasto
- Passo
- Ramada
- Figueiredo
- Redondinho

#### 🏘️ Santo António

- Casa Nova
- Eirô
- Cimo de Aldeia
- Portela
- Casas de Baixo

**Total: 11 casais** que recebem água numa ordem rotativa.

---

## 🎯 Como a Ordem é Determinada

### Ano de Referência: 2025

O sistema usa **2025 como ano de referência** para calcular todas as rotações.

### Fórmula de Rotação

```typescript
offset = (ano_atual - 2025) % número_de_casais
```

**Exemplo para 2026:**

- Offset Torre: (2026 - 2025) % 6 = 1
- A lista roda 1 posição

**Ordem original (2025):**

```
Torre, Crasto, Passo, Ramada, Figueiredo, Redondinho
```

**Ordem em 2026:**

```
Crasto, Passo, Ramada, Figueiredo, Redondinho, Torre
```

### Anos Pares vs Ímpares

A prioridade regional alterna:

| Tipo de Ano                 | Quem Começa Primeiro  |
| --------------------------- | --------------------- |
| **Ímpar** (2025, 2027, ...) | Torre → Santo António |
| **Par** (2026, 2028, ...)   | Santo António → Torre |

---

## ⏰ Sistema de Horários

### Casais com Horários Específicos

Apenas **3 casais** têm horários atribuídos que alternam entre si:

#### 🌟 **Torre**

- **Anos Ímpares**: "1h30 da tarde" / "12h até as 2h da tarde"
- **Anos Pares**: "12h" / "13h30"

#### 🌟 **Passo**

- **Anos Ímpares**:
    - "10 da noite até ás 1h30/5h30 da tarde"
    - "9h30 até 10h30/13h30 até 17h"
- **Anos Pares**:
    - "9h30 até 10h30 da Noite/13h30 até 17h"
    - "10 da noite até á 1h30/5h30 da tarde"

#### 🌟 **Figueiredo**

- **Anos Ímpares**:
    - "Ao pôr do sol até à meia noite"
    - "3h da tarde até ao pôr do sol"
- **Anos Pares**:
    - "Nascer do sol às 12h"
    - "3h até ao Nascer do sol"

### Como os Horários Alternam

Cada casal tem uma **lista de horários** que vai rodando:

```
Dia 1: Torre -> Horário A
Dia 12: Torre -> Horário B
Dia 23: Torre -> Horário A (volta ao início)
```

Os outros 8 casais **não têm horários específicos** - apenas têm o seu dia de rega.

---

## 📅 Período de Rega

O sistema opera **anualmente** entre:

- **Início**: 25 de Junho
- **Fim**: 29 de Setembro

**Total: ~97 dias** de ciclo de rega.

---

## 🔢 Algoritmo de Geração

### Passo 1: Determinar a Ordem Anual

```typescript
function getYearSchedule(year) {
    // Rodar listas com base no ano
    torrePlaces = rotate(TORRE_PLACES, year - 2025)
    santoPlaces = rotate(SANTO_PLACES, year - 2025)

    // Alternar ordem conforme par/ímpar
    if (year % 2 === 0) {
        return [...santoPlaces, ...torrePlaces] // Par: Santo António primeiro
    } else {
        return [...torrePlaces, ...santoPlaces] // Ímpar: Torre primeiro
    }
}
```

### Passo 2: Atribuir Dias

O sistema percorre cada dia do período (25 Jun - 29 Set):

```typescript
currentDay = 0
for (date from June 25 to September 29) {
    casal = yearSchedule[currentDay % 11]  // 11 casais no total

    if (casal tem horários específicos) {
        horário = próximo horário da lista do casal
    } else {
        horário = vazio
    }

    adicionar ao calendário
    currentDay++
}
```

### Passo 3: Geração de Ficheiros

O sistema pode gerar:

1. **📄 PDF** - Documento formatado com tabela
2. **📊 Excel** - Folha de cálculo editável
3. **📆 ICS** - Calendário para Google/Apple Calendar

---

## 🌅 Regra Ancestral: O Dia Começa ao Pôr do Sol

### O Sistema Tradicional

No sistema ancestral da Água de Víbora, o **"dia" começava ao pôr do sol**, não à meia-noite como no calendário moderno.

Isto significa que qualquer horário que vai **da noite para a madrugada** (overnight) na realidade começa no **dia ANTERIOR** ao que aparece na tabela.

### Regra de Conversão

O sistema calcula o **pôr do sol exato** para Abadim, Cabeceiras de Basto (41.5167°N, 7.9167°W) usando cálculos astronómicos.

**Horários Noturnos (Após Pôr do Sol):**

- Começam ao pôr do sol ou depois
- **→ Evento inicia no dia ANTERIOR** (pois pertencem ao "dia seguinte" ancestral)

**Horários Diurnos (Antes do Pôr do Sol):**

- Começam antes do pôr do sol
- **→ Evento no mesmo dia**

**Pôr do Sol em Abadim varia ao longo do ano:**

- **Verão (Junho-Julho)**: ~21:30h
- **Outono (Setembro)**: ~20:00h
- **Inverno (Dezembro)**: ~17:00h

### Exemplos Práticos

#### Exemplo 1: Evento Noturno

**Tabela mostra:**

```
25 de agosto | Passo | 10 da noite até ás 1h30
```

**No calendário ICS:**

- ✅ Evento inicia: **24 de agosto às 22:00** (10 da noite)
- ✅ Evento termina: **25 de agosto às 01:30**
- 📅 Duração: 3h30

**Explicação:** Em agosto, o pôr do sol é ~20:30h. Como o evento começa às 22h (depois do pôr do sol), inicia no dia **anterior** (24 de agosto).

#### Exemplo 2: Até à Meia Noite

**Tabela mostra:**

```
25 de julho | Figueiredo | Ao pôr do sol até à meia noite
```

**No calendário ICS:**

- ✅ Evento inicia: **24 de julho às 20:30** (pôr do sol)
- ✅ Evento termina: **25 de julho às 00:00** (meia noite)
- 📅 Duração: 3h30

**Explicação:** Em julho, o pôr do sol é ~21:30h. O evento começa às 20:30h (antes do pôr do sol), mas como vai "até à meia noite", atravessa o pôr do sol. O sistema deteta que é um horário noturno e inicia no dia **anterior** (24 de julho).

#### Exemplo 3: Evento da Noite (Curto)

**Tabela mostra:**

```
15 de agosto | Passo | 9h30 até 10h30 da Noite
```

**No calendário ICS:**

- ✅ Evento inicia: **14 de agosto às 21:30**
- ✅ Evento termina: **14 de agosto às 22:30**
- 📅 Duração: 1h

**Explicação:** Em agosto, o pôr do sol é ~20:30h. Como o evento começa às 21:30h (depois do pôr do sol), inicia no dia **anterior** (14 de agosto), mesmo que termine na mesma noite.

#### Exemplo 4: Evento Diurno

**Tabela mostra:**

```
10 de julho | Torre | 12h até as 2h da tarde
```

**No calendário ICS:**

- ✅ Evento inicia: **10 de julho às 12:00**
- ✅ Evento termina: **10 de julho às 14:00**
- 📅 Duração: 2h

**Explicação:** Em julho, o pôr do sol é ~21:30h. Como o evento começa às 12h (muito antes do pôr do sol), o evento é no **mesmo dia** (10 de julho).

### Como o Sistema Deteta (com Precisão Astronómica)

```typescript
// Coordenadas de Abadim, Cabeceiras de Basto
const ABADIM_COORDINATES = {
    latitude: 41.5167, // 41°31'N
    longitude: -7.9167, // 7°55'W
}

function getSunsetHour(date) {
    // Usa biblioteca SunCalc para cálculo astronómico preciso
    const times = SunCalc.getTimes(
        date,
        ABADIM_COORDINATES.latitude,
        ABADIM_COORDINATES.longitude
    )

    const sunsetDate = times.sunset
    const sunsetHour = sunsetDate.getHours() + sunsetDate.getMinutes() / 60

    return sunsetHour
}

function startsAfterSunset(startTime, date) {
    const sunsetHour = getSunsetHour(date) // Calcula para data específica
    const startHourDecimal = startTime.hour + startTime.minute / 60

    // Se começa ao pôr do sol ou depois,
    // pertence ao "dia seguinte" no sistema ancestral
    // Logo, no calendário moderno usa o dia ANTERIOR
    return startHourDecimal >= sunsetHour
}
```

O sistema agora usa **cálculos astronómicos reais** para determinar o pôr do sol exato em cada dia do ano!

### Resumo Visual (Exemplos de Verão - Junho/Julho)

| Horário na Tabela                | Hora Início | Pôr do Sol | Dia Real no ICS         |
| -------------------------------- | ----------- | ---------- | ----------------------- |
| "10 da noite até ás 1h30"        | 22:00       | ~21:30     | **Dia anterior** (após) |
| "9h30 até 10h30 da Noite"        | 21:30       | ~21:30     | **Dia anterior** (após) |
| "Ao pôr do sol até à meia noite" | 20:30       | ~21:30     | Mesmo dia (antes)       |
| "3h da tarde até ao pôr do sol"  | 15:00       | ~21:30     | Mesmo dia (antes)       |
| "12h até as 2h da tarde"         | 12:00       | ~21:30     | Mesmo dia (antes)       |
| "1h30 da tarde"                  | 13:30       | ~21:30     | Mesmo dia (antes)       |

**Nota:** No inverno (dezembro), o pôr do sol é ~17:00h, então horários como "18h" já seriam considerados noturnos (dia anterior).

### 🌍 Precisão Geográfica

O sistema usa as **coordenadas exatas de Abadim**:

- **Latitude:** 41.5167°N (41°31' Norte)
- **Longitude:** 7.9167°W (7°55' Oeste)

Isto garante que os cálculos do pôr do sol são **precisos ao minuto** para a localização específica, não valores aproximados genéricos.

**Variação Anual do Pôr do Sol em Abadim:**

| Mês      | Pôr do Sol Aproximado | Horas de Luz |
| -------- | --------------------- | ------------ |
| Janeiro  | 17:30                 | ~9h          |
| Março    | 19:00                 | ~11h30       |
| Junho    | 21:30                 | ~15h         |
| Julho    | 21:30                 | ~15h         |
| Agosto   | 20:30                 | ~14h         |
| Setembro | 19:30                 | ~12h30       |
| Dezembro | 17:00                 | ~8h30        |

---

## 🧮 Exemplo Completo: Ano 2026

### Configuração Inicial

- **Ano**: 2026 (Par)
- **Offset**: (2026 - 2025) % 6 = 1
- **Ordem**: Santo António → Torre

### Rotação Aplicada

**Torre rotada (offset=1):**

```
Crasto, Passo, Ramada, Figueiredo, Redondinho, Torre
```

**Santo António rotada (offset=1):**

```
Eirô, Cimo de Aldeia, Portela, Casas de Baixo, Casa Nova
```

### Ordem Final 2026 (Par)

```
1. Eirô
2. Cimo de Aldeia
3. Portela
4. Casas de Baixo
5. Casa Nova
6. Crasto
7. Passo          → "9h30 até 10h30 da Noite/13h30 até 17h"
8. Ramada
9. Figueiredo     → "Nascer do sol às 12h"
10. Redondinho
11. Torre         → "12h"
```

### Ciclo Completo

O ciclo de 11 casais repete-se ~9 vezes entre 25 Junho e 29 Setembro.

```
Dia 1  (25 Jun): Eirô
Dia 2  (26 Jun): Cimo de Aldeia
...
Dia 11 (5 Jul):  Torre
Dia 12 (6 Jul):  Eirô (recomeça)
```

---

## 📊 Dados Técnicos

### Constantes do Sistema

```typescript
REFERENCE_YEAR = 2025
SCHEDULE_START = { month: 5, date: 25 } // 25 Junho
SCHEDULE_END = { month: 8, date: 29 } // 29 Setembro
DATE_FORMAT = "dd 'de' MMMM" // "25 de junho"
```

### Estrutura de Dados

```typescript
interface ScheduleEntry {
    date: Date // Data do dia
    dateFormatted: string // "25 de junho"
    location: string // Nome do casal
    schedule: string // Horário (se aplicável)
    isBold: boolean // Se tem horário específico
}
```

---

## 🎨 Funcionalidades do Gerador

### 1. Calendário Normal

Gera o calendário oficial com todos os horários atribuídos.

### 2. Template Vazio

Gera a estrutura sem horários para preenchimento manual.

### 3. Calendário Personalizado

Permite criar horários customizados para cada casal.

### 4. Múltiplos Formatos

| Formato   | Uso                | Características                   |
| --------- | ------------------ | --------------------------------- |
| **PDF**   | Imprimir           | Visual, formatado, pronto a usar  |
| **Excel** | Editar             | Editável, pode modificar horários |
| **ICS**   | Calendário Digital | Integra com Google/Apple Calendar |

---

## 🔍 Parsing de Horários Portugueses

O sistema entende expressões em português natural:

### Expressões Especiais

| Expressão       | Hora  |
| --------------- | ----- |
| "nascer do sol" | 06:00 |
| "pôr do sol"    | 18:30 |
| "meia noite"    | 00:00 |

### Padrões de Tempo

| Formato          | Exemplo         | Resultado |
| ---------------- | --------------- | --------- |
| Hora simples     | "12h"           | 12:00     |
| Hora com minutos | "9h30"          | 09:30     |
| Número apenas    | "10"            | 10:00     |
| Tarde            | "1h30 da tarde" | 13:30     |
| Noite            | "10 da noite"   | 22:00     |

### Rangos de Tempo

```
"12h até as 2h da tarde"
→ Início: 12:00, Fim: 14:00, Duração: 2h

"10 da noite até ás 1h30"
→ Início: 22:00, Fim: 01:30, Duração: 3h30 (overnight)
```

---

## 🎯 Casos de Uso

### Para Agricultores

- Consultar rapidamente o seu dia de rega
- Adicionar ao calendário do telemóvel
- Receber notificações 2h antes

### Para a Comunidade

- Transparência na gestão da água
- Histórico acessível de todos os anos
- Facilita planeamento agrícola

### Para Administração

- Gerar calendários anuais automaticamente
- Criar templates personalizados
- Exportar para diferentes formatos

---

## 🚀 Tecnologia

O sistema é construído com:

- **React Router v7** - Framework web moderno
- **TypeScript** - Tipagem e segurança
- **PDFKit** - Geração de PDFs
- **ExcelJS** - Geração de ficheiros Excel
- **ICS** - Geração de calendários
- **date-fns** - Manipulação de datas em português
- **SunCalc** - Cálculos astronómicos precisos (nascer/pôr do sol)

---

## 📱 PWA (Progressive Web App)

A aplicação pode ser:

- ✅ Instalada no telemóvel como app nativa
- ✅ Funciona offline após primeira visita
- ✅ Recebe atualizações automáticas
- ✅ Aparece no ecrã inicial

---

## 🌍 Preservação Cultural

Este sistema digital:

- 📚 **Documenta** tradições seculares
- 🔄 **Mantém viva** a gestão comunitária
- 🚀 **Moderniza** sem perder a essência
- 🤝 **Facilita** a participação das novas gerações

---

## 🎓 Para Desenvolvedores

### Adicionar Novo Casal

```typescript
// Em VILLAGES
Torre: [..., 'NovoLugar'],

// Se tiver horários específicos:
YEAR_SCHEDULE: {
    odd: {
        NovoLugar: ['horário 1', 'horário 2']
    },
    even: {
        NovoLugar: ['horário 3', 'horário 4']
    }
}
```

### Alterar Período de Rega

```typescript
const SCHEDULE_START = { month: 4, date: 15 } // 15 Maio
const SCHEDULE_END = { month: 9, date: 30 } // 30 Outubro
```

### Mudar Ano de Referência

```typescript
const REFERENCE_YEAR = 2026 // Novo ano base
```

---

## 📞 Manutenção

O sistema é **auto-suficiente** e gera calendários para qualquer ano futuro baseado nas regras estabelecidas. Não requer manutenção anual.

### Quando Atualizar

Apenas se:

- 🔄 As regras de rotação mudarem
- ⏰ Os horários dos casais mudarem
- 🏘️ Novos casais forem adicionados
- 📅 O período de rega for alterado

---

**Desenvolvido com ❤️ para a comunidade de Abadim, Cabeceiras de Basto**
