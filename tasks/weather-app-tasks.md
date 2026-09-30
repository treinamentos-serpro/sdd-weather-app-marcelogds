# Tarefas de Implementação — Weather App

As tarefas estão ordenadas por dependência e agrupadas por entrega. Cada tarefa é uma unidade testável, com uma responsabilidade principal e sem misturar implementação com testes.

## Entrega 1 — Fundação e contratos

### T-01 — Definir tipos de domínio

- **Descrição:** criar os contratos `Unit`, `City`, `CurrentWeather`, `ForecastDay`, `WeatherData` e estados do domínio.
- **Critérios de aceite:** temperaturas internas são Celsius; `WeatherData` representa cidade, clima atual e cinco dias; TypeScript strict não acusa erros.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `src/types/weather.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** Data Model, `RF-02`, `RF-03`, `RF-04`, `RF-05`.

### T-02 — Definir DTOs da Open-Meteo

- **Descrição:** criar contratos mínimos separados para respostas de geocoding e forecast.
- **Critérios de aceite:** DTOs representam `results` com `id`, `name`, `admin1`, `country`, `country_code`, coordenadas, timezone e elevation; forecast representa `current`, `daily`, timezone e unidades; não dependem de React.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/types/openMeteo.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** External APIs, `RF-01`, `RF-02`, `RF-03`.

### T-03 — Validar e normalizar consultas

- **Descrição:** implementar validação da entrada de busca.
- **Critérios de aceite:** rejeita vazio, mais de 100 caracteres e ausência de alfanuméricos; remove espaços nas extremidades e normaliza espaços sem remover acentos ou hífens.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/validation.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** `RF-01`, `CA-02`, `CA-03`, `CA-13`.

### T-04 — Validar payloads meteorológicos

- **Descrição:** implementar validação dos campos mínimos e dos cinco arrays diários.
- **Critérios de aceite:** rejeita campos ausentes, JSON incompatível, arrays diferentes de cinco e códigos sem descrição; retorna erro `invalid-data` sem dados parciais.
- **Dependências:** T-01, T-02.
- **Arquivos prováveis:** `src/lib/validation.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** `RF-05`, `CA-10`, `RNF-06`.

### T-05 — Implementar conversão de temperatura

- **Descrição:** criar conversão e formatação pura de Celsius/Fahrenheit.
- **Critérios de aceite:** mantém valores internos em Celsius; converte valores positivos, zero e negativos; não muta `WeatherData`.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/temperature.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** `RF-04`, `CA-06`, `CA-07`.

### T-06 — Implementar formatação temporal

- **Descrição:** criar funções de data e hora no fuso da cidade em formato pt-BR.
- **Critérios de aceite:** formata data diária e horário atual usando timezone fornecido; não depende do timezone local do dispositivo.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/dateTime.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** `RF-02`, `RF-03`, `CA-14`, `RNF-10`.

### T-07 — Mapear códigos meteorológicos

- **Descrição:** criar a tabela pura de códigos WMO para descrições pt-BR.
- **Critérios de aceite:** os códigos WMO `0`, `1`, `2`, `3`, `45`, `48`, `51`, `53`, `55`, `56`, `57`, `61`, `63`, `65`, `66`, `67`, `71`, `73`, `75`, `77`, `80`, `81`, `82`, `85`, `86`, `95`, `96` e `99` produzem descrição não vazia; código fora da tabela produz erro controlado; não acessa rede ou React.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/weatherCodes.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** `RF-02`, `RF-03`, `CA-04`, `CA-05`, `RNF-06`.

### T-08 — Criar transporte HTTP com timeout

- **Descrição:** encapsular `fetch`, status HTTP, JSON e timeout de 10 segundos.
- **Critérios de aceite:** classifica falhas como `api`, `network` ou `timeout`; não implementa retry automático; não depende de React.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/services/http.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** `RF-07`, `CA-11`, `CA-17`, `RNF-05`.

## Entrega 2 — Serviços de dados

### T-09 — Implementar busca de geocoding

- **Descrição:** integrar o endpoint de geocoding e mapear resultados para `City`.
- **Critérios de aceite:** usa `name`, `count=5`, `language=pt` e `format=json`; mapeia localização, país, região e timezone; limita a cinco resultados; resposta vazia retorna `empty`.
- **Dependências:** T-01, T-02, T-03, T-08.
- **Arquivos prováveis:** `src/services/openMeteo.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** `RF-01`, `RF-05`, `CA-01`, `CA-09`, `CA-13`.

### T-10 — Implementar consulta de forecast

- **Descrição:** integrar o endpoint de forecast e mapear uma resposta completa para `WeatherData`.
- **Critérios de aceite:** usa coordenadas, `current`, `daily`, `forecast_days=5`, `timezone=auto` e Celsius; mapeia clima atual e cinco dias; converte `is_day` para booleano.
- **Dependências:** T-01, T-02, T-04, T-06, T-07, T-08.
- **Arquivos prováveis:** `src/services/openMeteo.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** `RF-02`, `RF-03`, `CA-04`, `CA-05`, `CA-10`, `CA-14`.

## Entrega 3 — Orquestração

### T-20 — Implementar estado inicial e busca no hook

- **Descrição:** criar `useWeather` com estado inicial, busca de cidade e transições de geocoding.
- **Critérios de aceite:** inicia em `idle`; valida antes do request; transita para `loading`, `success`, `empty` ou `error`; limpa o contexto anterior em nova busca.
- **Dependências:** T-03, T-09.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** `RF-01`, `RF-05`, `RF-06`, `CA-08`, `CA-09`, `CA-15`, `CA-16`.

### T-21 — Implementar seleção, forecast e retry no hook

- **Descrição:** adicionar seleção de cidade, consulta meteorológica, retry manual e transições de forecast.
- **Critérios de aceite:** seleção limpa dados anteriores e inicia loading; sucesso salva `WeatherData`; erro limpa dados e preserva busca; retry não é automático.
- **Dependências:** T-04, T-10, T-20.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** `RF-02`, `RF-03`, `RF-05`, `RF-07`, `CA-04`, `CA-10`, `CA-11`, `CA-17`.

### T-22 — Proteger contra respostas obsoletas

- **Descrição:** controlar `requestId` para ignorar respostas de operações anteriores.
- **Critérios de aceite:** uma resposta antiga não substitui a cidade ou os dados da consulta mais recente; o estado permanece consistente em consultas concorrentes.
- **Dependências:** T-20, T-21.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** `RF-06`, `CA-16`, `RNF-05`.

## Entrega 4 — Componentes de UI

### T-11 — Criar layout base responsivo

- **Descrição:** estruturar a tela inicial e estilos globais para 320 px ou mais.
- **Critérios de aceite:** inicia sem cidade, clima ou previsão; não cria rolagem horizontal em viewport de 320 px; usa classes Tailwind e os estilos globais definidos pelo projeto.
- **Dependências:** T-01, T-20.
- **Arquivos prováveis:** `src/App.tsx`, `src/styles/globals.css`.
- **Tipo:** UI.
- **Rastreabilidade:** `RF-06`, `CA-16`, `RNF-01`.

### T-12 — Criar formulário de busca

- **Descrição:** criar campo, label, submissão explícita e feedback de entrada inválida.
- **Critérios de aceite:** suporta teclado; bloqueia consulta inválida; emite somente a consulta normalizada válida; possui nome acessível.
- **Dependências:** T-03, T-11, T-20.
- **Arquivos prováveis:** `src/components/SearchForm.tsx`.
- **Tipo:** UI.
- **Rastreabilidade:** `RF-01`, `CA-02`, `CA-03`, `CA-13`, `RNF-02`.

### T-13 — Criar lista de resultados de cidade

- **Descrição:** apresentar resultados de geocoding e seleção por teclado ou ponteiro.
- **Critérios de aceite:** mostra no máximo cinco resultados; exibe cidade, região/estado e país quando disponíveis; emite a cidade selecionada.
- **Dependências:** T-01, T-11, T-20.
- **Arquivos prováveis:** `src/components/LocationResults.tsx`.
- **Tipo:** UI.
- **Rastreabilidade:** `RF-01`, `US-02`, `CA-01`, `CA-13`, `RNF-02`.

### T-14 — Criar componente de loading

- **Descrição:** apresentar o estado de carregamento para busca e forecast.
- **Critérios de aceite:** renderiza texto ou indicador com `role="status"`/`aria-live`; não mostra resultado anterior como atual; o estado é anunciado a tecnologia assistiva.
- **Dependências:** T-11, T-20.
- **Arquivos prováveis:** `src/components/states/LoadingState.tsx`.
- **Tipo:** UI.
- **Rastreabilidade:** `RF-05`, `CA-08`, `RNF-02`.

### T-15 — Criar componente de estado vazio

- **Descrição:** apresentar ausência de resultados e ação de nova busca.
- **Critérios de aceite:** informa que nenhuma cidade foi encontrada; mantém o formulário disponível; a mensagem possui nome acessível e pode ser alcançada por teclado.
- **Dependências:** T-11, T-20.
- **Arquivos prováveis:** `src/components/states/EmptyState.tsx`.
- **Tipo:** UI.
- **Rastreabilidade:** `RF-05`, `CA-09`, `RNF-03`.

### T-16 — Criar componente de erro

- **Descrição:** apresentar erro, timeout, resposta parcial e retry manual.
- **Critérios de aceite:** mostra mensagem em pt-BR dentro de região com `role="alert"` ou `aria-live`; oferece retry ou nova busca; não inicia retry automaticamente; a ação é alcançável por teclado.
- **Dependências:** T-11, T-20, T-21.
- **Arquivos prováveis:** `src/components/states/ErrorState.tsx`.
- **Tipo:** UI.
- **Rastreabilidade:** `RF-07`, `CA-10`, `CA-11`, `CA-17`, `RNF-02`.

### T-17 — Criar apresentação do clima atual

- **Descrição:** apresentar cidade, temperatura, descrição e horário atual.
- **Critérios de aceite:** mostra dados de `CurrentWeather`; usa `dateTime` para o fuso da cidade; formata a unidade recebida por callback.
- **Dependências:** T-01, T-05, T-06, T-11, T-21.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`.
- **Tipo:** UI.
- **Rastreabilidade:** `RF-02`, `CA-04`, `CA-14`, `US-03`.

### T-18 — Criar apresentação da previsão

- **Descrição:** apresentar os cinco `ForecastDay` em ordem cronológica.
- **Critérios de aceite:** mostra exatamente cinco dias; exibe data, descrição, mínima e máxima; não reordena nem altera os dados recebidos.
- **Dependências:** T-01, T-05, T-06, T-11, T-21.
- **Arquivos prováveis:** `src/components/ForecastList.tsx`.
- **Tipo:** UI.
- **Rastreabilidade:** `RF-03`, `CA-05`, `CA-14`, `US-04`.

### T-19 — Criar alternador de unidade

- **Descrição:** criar controle de Celsius/Fahrenheit derivado na renderização.
- **Critérios de aceite:** inicia em Celsius; alterna `Unit`; não muta `WeatherData`; não dispara request; é acessível por teclado.
- **Dependências:** T-01, T-05, T-11, T-21.
- **Arquivos prováveis:** `src/components/TemperatureUnitToggle.tsx`.
- **Tipo:** UI.
- **Rastreabilidade:** `RF-04`, `CA-06`, `CA-07`, `US-05`, `RNF-02`.

## Entrega 5 — Integração

### T-23 — Compor a tela com o hook

- **Descrição:** conectar `useWeather` aos componentes e renderizar os estados do fluxo.
- **Critérios de aceite:** UI não acessa services diretamente; loading, vazio, erro e sucesso são selecionados pelos status; erro de forecast não altera resultados de geocoding.
- **Dependências:** T-12, T-13, T-14, T-15, T-16, T-17, T-18, T-19, T-21, T-22.
- **Arquivos prováveis:** `src/App.tsx`.
- **Tipo:** UI.
- **Rastreabilidade:** `RF-05`, `RF-06`, `RF-07`, `US-06`, `US-07`.

## Entrega 6 — Testes unitários e de componentes

### T-24 — Testar validação de entrada

- **Descrição:** testar normalização e limites da consulta.
- **Critérios de aceite:** cobre vazio, espaços, 100/101 caracteres, ausência de alfanumérico, acentos e hífens.
- **Dependências:** T-03.
- **Arquivos prováveis:** `tests/unit/lib/validation.test.ts`.
- **Tipo:** Test.
- **Rastreabilidade:** `CA-02`, `CA-03`, `CA-13`.

### T-25 — Testar conversão de temperatura

- **Descrição:** testar conversão e formatação Celsius/Fahrenheit.
- **Critérios de aceite:** cobre valores positivos, zero, negativos e arredondamento; confirma que a entrada não é mutada.
- **Dependências:** T-05.
- **Arquivos prováveis:** `tests/unit/lib/temperature.test.ts`.
- **Tipo:** Test.
- **Rastreabilidade:** `CA-06`, `CA-07`, `RF-04`.

### T-26 — Testar datas e códigos meteorológicos

- **Descrição:** testar fuso/formato temporal e tabela WMO.
- **Critérios de aceite:** datas usam timezone da cidade; cada código da tabela WMO definida em T-07 tem descrição; código desconhecido gera erro controlado.
- **Dependências:** T-06, T-07.
- **Arquivos prováveis:** `tests/unit/lib/dateTime.test.ts`, `tests/unit/lib/weatherCodes.test.ts`.
- **Tipo:** Test.
- **Rastreabilidade:** `CA-04`, `CA-05`, `CA-14`, `RNF-06`.

### T-27 — Testar transporte HTTP

- **Descrição:** testar `fetch` mockado, status, rede e timeout.
- **Critérios de aceite:** verifica timeout de 10 segundos, erros `api`/`network`/`timeout` e ausência de retry automático.
- **Dependências:** T-08.
- **Arquivos prováveis:** `tests/unit/services/http.test.ts`.
- **Tipo:** Test.
- **Rastreabilidade:** `CA-11`, `CA-17`, `RNF-05`.

### T-28 — Testar service de geocoding

- **Descrição:** testar request, parâmetros, mapeamento e resposta vazia do geocoding.
- **Critérios de aceite:** afirma URL/parâmetros, limite de cinco, mapeamento para `City` e estado vazio.
- **Dependências:** T-09, T-27.
- **Arquivos prováveis:** `tests/unit/services/openMeteo.geocoding.test.ts`.
- **Tipo:** Test.
- **Rastreabilidade:** `CA-01`, `CA-09`, `CA-13`.

### T-29 — Testar service de forecast

- **Descrição:** testar request, parâmetros, mapeamento e validação de forecast.
- **Critérios de aceite:** afirma `current`, `daily`, cinco dias, timezone, Celsius, `is_day` e rejeição de resposta parcial.
- **Dependências:** T-04, T-07, T-10, T-27.
- **Arquivos prováveis:** `tests/unit/services/openMeteo.forecast.test.ts`.
- **Tipo:** Test.
- **Rastreabilidade:** `CA-04`, `CA-05`, `CA-10`, `CA-14`.

### T-30 — Testar hook de estado

- **Descrição:** testar transições, retry e concorrência do `useWeather` com services mockados.
- **Critérios de aceite:** cobre `idle`, `loading`, `success`, `empty`, `error`, retry manual e descarte de resposta obsoleta.
- **Dependências:** T-20, T-21, T-22.
- **Arquivos prováveis:** `tests/unit/hooks/useWeather.test.ts`.
- **Tipo:** Test.
- **Rastreabilidade:** `CA-08`, `CA-09`, `CA-11`, `CA-15`, `CA-16`, `CA-17`.

### T-31 — Testar formulário e resultados

- **Descrição:** testar interação e acessibilidade dos componentes de busca.
- **Critérios de aceite:** input inválido é bloqueado; consulta válida é emitida; até cinco resultados são mostrados e selecionáveis por teclado.
- **Dependências:** T-12, T-13.
- **Arquivos prováveis:** `tests/components/SearchForm.test.tsx`, `tests/components/LocationResults.test.tsx`.
- **Tipo:** Test.
- **Rastreabilidade:** `CA-01`, `CA-02`, `CA-03`, `CA-13`, `RNF-02`.

### T-32 — Testar estados visuais

- **Descrição:** testar loading e empty.
- **Critérios de aceite:** loading oculta resultado anterior e empty informa ausência com nova busca disponível; ambos têm nomes/estados acessíveis.
- **Dependências:** T-14, T-15.
- **Arquivos prováveis:** `tests/components/LoadingState.test.tsx`, `tests/components/EmptyState.test.tsx`.
- **Tipo:** Test.
- **Rastreabilidade:** `CA-08`, `CA-09`, `RNF-02`, `RNF-03`.

### T-33 — Testar erro visual e retry

- **Descrição:** testar ErrorState para falha, timeout, resposta parcial e retry.
- **Critérios de aceite:** mensagem em pt-BR dentro de região com `role="alert"` ou `aria-live`; ação manual disponível por teclado; nenhum retry automático.
- **Dependências:** T-16.
- **Arquivos prováveis:** `tests/components/ErrorState.test.tsx`.
- **Tipo:** Test.
- **Rastreabilidade:** `CA-10`, `CA-11`, `CA-17`, `RNF-02`.

### T-34 — Testar apresentação meteorológica

- **Descrição:** testar clima atual e lista de previsão com dados controlados.
- **Critérios de aceite:** clima atual e cinco dias são exibidos com campos mínimos, ordem e fuso esperados.
- **Dependências:** T-17, T-18.
- **Arquivos prováveis:** `tests/components/CurrentWeather.test.tsx`, `tests/components/ForecastList.test.tsx`.
- **Tipo:** Test.
- **Rastreabilidade:** `CA-04`, `CA-05`, `CA-14`.

### T-35 — Testar alternância de unidade

- **Descrição:** testar controle e derivação Celsius/Fahrenheit.
- **Critérios de aceite:** alternância atualiza todos os valores, não muta dados e não chama fetch; controle funciona por teclado.
- **Dependências:** T-19, T-25.
- **Arquivos prováveis:** `tests/components/TemperatureUnitToggle.test.tsx`.
- **Tipo:** Test.
- **Rastreabilidade:** `CA-06`, `CA-07`, `RNF-02`.

## Entrega 7 — E2E e hardening

### T-36 — Testar jornada E2E principal

- **Descrição:** validar abertura, busca, seleção e visualização com Playwright e rede controlada.
- **Critérios de aceite:** com respostas mockadas para geocoding e forecast, a jornada abrir → enviar cidade válida → selecionar resultado → exibir clima atual e cinco dias termina sem erro; a tela contém a cidade selecionada, temperatura atual e cinco entradas diárias.
- **Dependências:** T-23, T-28, T-29, T-30, T-34.
- **Arquivos prováveis:** `tests/e2e/weather-app.spec.ts`.
- **Tipo:** Test.
- **Rastreabilidade:** `US-01`, `US-02`, `US-03`, `US-04`, `CA-01`, `CA-04`, `CA-05`.

### T-37 — Testar E2E de falhas e recuperação

- **Descrição:** validar vazio, input inválido, API, timeout, parcial, retry e nova consulta.
- **Critérios de aceite:** cada falha mostra ação correta; retry é manual; nova cidade substitui dados anteriores; resposta obsoleta não aparece.
- **Dependências:** T-23, T-30, T-33, T-36.
- **Arquivos prováveis:** `tests/e2e/weather-app-errors.spec.ts`.
- **Tipo:** Test.
- **Rastreabilidade:** `US-06`, `US-07`, `CA-02`, `CA-09`, `CA-10`, `CA-11`, `CA-12`, `CA-16`, `CA-17`.

### T-38 — Validar mobile e acessibilidade E2E

- **Descrição:** executar jornada por teclado e em viewport mobile e desktop.
- **Critérios de aceite:** viewport de 320 px não tem overflow horizontal; controles são alcançáveis por teclado; estados de loading/erro têm comunicação acessível.
- **Dependências:** T-36, T-37.
- **Arquivos prováveis:** `tests/e2e/weather-app-accessibility.spec.ts`, `playwright.config.ts`.
- **Tipo:** Test.
- **Rastreabilidade:** `RNF-01`, `RNF-02`, `RNF-07`.

### T-39 — Executar lint, build e testes unitários

- **Descrição:** executar as validações estáticas, o build e os testes unitários/componentes.
- **Critérios de aceite:** `pnpm lint`, `pnpm build` e `pnpm test` passam sem erros.
- **Dependências:** T-23, T-24 a T-35.
- **Arquivos prováveis:** `package.json`, `biome.json`.
- **Tipo:** Infra.
- **Rastreabilidade:** qualidade do projeto, `RNF-04`, `RNF-07`.

### T-40 — Executar E2E e validação final

- **Descrição:** executar os testes Playwright e confirmar os critérios de qualidade da entrega.
- **Critérios de aceite:** `pnpm test:e2e` retorna código 0 quando o ambiente Playwright estiver disponível; os fluxos principal, de erro, mobile e acessibilidade estão verdes no relatório do Playwright.
- **Dependências:** T-36, T-37, T-38, T-39.
- **Arquivos prováveis:** `tests/e2e/`, `playwright.config.ts`.
- **Tipo:** Test.
- **Rastreabilidade:** `US-01` a `US-07`, `RNF-01`, `RNF-02`, `RNF-07`.

## Resumo de dependências

```text
T-01 → T-02/T-03/T-05/T-06/T-07/T-08/T-11
T-02 + T-03 + T-08 → T-09
T-01 + T-02 + T-04 + T-06 + T-07 + T-08 → T-10
T-03 + T-09 + T-11 → T-20
T-04 + T-10 + T-20 → T-21
T-20 + T-21 → T-22
T-12 + T-13 + T-14 + T-15 + T-16 + T-17 + T-18 + T-19 + T-21 + T-22 → T-23
T-03 → T-24
T-05 → T-25
T-06 + T-07 → T-26
T-08 → T-27
T-09 + T-27 → T-28
T-04 + T-07 + T-10 + T-27 → T-29
T-20 + T-21 + T-22 → T-30
T-12 + T-13 → T-31
T-14 + T-15 → T-32
T-16 → T-33
T-17 + T-18 → T-34
T-19 + T-25 → T-35
T-23 + T-28 + T-29 + T-30 + T-34 → T-36
T-23 + T-30 + T-33 + T-36 → T-37
T-36 + T-37 → T-38
T-23 + T-24 a T-35 → T-39
T-36 + T-37 + T-38 + T-39 → T-40
```

## Matriz de rastreabilidade funcional

| Requisito funcional | Tarefas de implementação | Tarefas de teste relacionadas |
| --- | --- | --- |
| RF-01 — Buscar cidades | T-03, T-09, T-12, T-13, T-20 | T-24, T-28, T-31, T-36, T-37 |
| RF-02 — Consultar clima atual | T-06, T-07, T-10, T-17, T-21 | T-26, T-29, T-34, T-36 |
| RF-03 — Consultar previsão de cinco dias | T-06, T-07, T-10, T-18, T-21 | T-26, T-29, T-34, T-36 |
| RF-04 — Alternar unidade de temperatura | T-05, T-19 | T-25, T-35, T-36 |
| RF-05 — Informar estados da consulta | T-04, T-14, T-15, T-16, T-20, T-21, T-23 | T-27, T-30, T-32, T-33, T-37 |
| RF-06 — Realizar nova consulta | T-20, T-22, T-23 | T-30, T-36, T-37 |
| RF-07 — Recuperar-se de falhas | T-08, T-16, T-21 | T-27, T-30, T-33, T-37, T-40 |

### Requisitos sem tarefa correspondente

Nenhum requisito funcional está sem tarefa de implementação ou teste correspondente. Cada `RF-01` a `RF-07` possui pelo menos uma tarefa de implementação e uma tarefa de teste relacionada.

## Prioridade e tamanho

**Legenda:** `P0` é necessário para a primeira entrega funcional; `P1` é necessário para hardening, acessibilidade ou cobertura complementar antes do release; `P2` representa melhoria posterior. Tamanho `S` cabe em uma unidade pequena, `M` envolve uma unidade com mais cenários ou até dois arquivos relevantes, e `G` exige coordenação de múltiplos contratos ou etapas. Nenhuma tarefa atual foi classificada como `G`.

| Tarefa | Prioridade | Tamanho |
| --- | --- | --- |
| T-01 | P0 | S |
| T-02 | P0 | S |
| T-03 | P0 | S |
| T-04 | P0 | M |
| T-05 | P0 | S |
| T-06 | P0 | S |
| T-07 | P0 | M |
| T-08 | P0 | M |
| T-09 | P0 | M |
| T-10 | P0 | M |
| T-20 | P0 | M |
| T-21 | P0 | M |
| T-22 | P0 | S |
| T-11 | P0 | M |
| T-12 | P0 | S |
| T-13 | P0 | S |
| T-14 | P0 | S |
| T-15 | P0 | S |
| T-16 | P0 | S |
| T-17 | P0 | S |
| T-18 | P0 | S |
| T-19 | P0 | S |
| T-23 | P0 | M |
| T-24 | P0 | S |
| T-25 | P0 | S |
| T-26 | P0 | S |
| T-27 | P0 | M |
| T-28 | P0 | M |
| T-29 | P0 | M |
| T-30 | P0 | M |
| T-31 | P0 | S |
| T-32 | P0 | S |
| T-33 | P0 | S |
| T-34 | P0 | S |
| T-35 | P0 | S |
| T-36 | P0 | M |
| T-37 | P0 | M |
| T-38 | P1 | M |
| T-39 | P0 | S |
| T-40 | P1 | M |

Não há tarefas `P2` neste backlog: melhorias posteriores devem ser adicionadas como novas tarefas sem atrasar o caminho P0.

## Sequência de entrega em fatias verticais

As fatias abaixo priorizam um resultado observável cedo e mantêm cada fatia executável de ponta a ponta. As tarefas listadas continuam sujeitas às dependências individuais do backlog.

### Fatia 1 — Busca visível

**Objetivo:** permitir abrir a aplicação, informar uma cidade, ver até cinco resultados e receber estados vazio/erro.

**Tarefas:** T-01, T-02, T-03, T-08, T-09, T-20, T-11, T-12, T-13, T-14, T-15, T-23.

**Entrega observável:** fluxo de busca funcionando com dados reais de geocoding e UI de loading, vazio e erro.

### Fatia 2 — Clima atual e previsão

**Objetivo:** após selecionar uma cidade, exibir clima atual e cinco dias.

**Tarefas:** T-04, T-06, T-07, T-10, T-17, T-18, T-21, T-22.

**Entrega observável:** cidade selecionada, temperatura atual, descrição, datas no fuso correto e cinco entradas diárias, sem dados obsoletos.

### Fatia 3 — Unidade e recuperação completa

**Objetivo:** completar a interação principal com Celsius/Fahrenheit e recuperação manual.

**Tarefas:** T-05, T-16, T-19, T-23.

**Entrega observável:** alternância sem novo request, erros com retry manual e dados internos preservados em Celsius.

### Fatia 4 — Confiança automatizada

**Objetivo:** proteger as três fatias com testes unitários, de services, hook e componentes.

**Tarefas:** T-24, T-25, T-26, T-27, T-28, T-29, T-30, T-31, T-32, T-33, T-34, T-35.

**Entrega observável:** regras puras, contratos externos, estados da tela e acessibilidade básica cobertos sem depender da API real.

### Fatia 5 — Release e hardening

**Objetivo:** validar os fluxos reais compostos, mobile, acessibilidade e qualidade do projeto.

**Tarefas:** T-36, T-37, T-38, T-39, T-40.

**Entrega observável:** jornada principal e falhas passam em Playwright, viewport de 320 px não tem overflow e lint/build/testes estão verdes.