# Especificação do Produto — Weather App

## Overview

### Visão geral

O Weather App permite consultar o clima atual e a previsão diária de curto prazo para uma cidade. Usa a Open-Meteo para geocoding e dados meteorológicos, não exige conta ou chave de API e apresenta a interface em português do Brasil.

A previsão de cinco dias corresponde ao dia atual e aos quatro dias seguintes. A unidade padrão é Celsius, com opção de alternância para Fahrenheit.

### Objetivos

- Localizar uma cidade e permitir a seleção correta entre resultados semelhantes.
- Exibir o clima atual e a previsão diária de cinco dias.
- Permitir alternar entre Celsius e Fahrenheit sem repetir a consulta meteorológica.
- Oferecer experiência utilizável em dispositivos móveis e computadores.
- Comunicar claramente carregamento, ausência de resultados e falhas.

### Público principal

Pessoas que precisam consultar rapidamente o clima de uma cidade, especialmente usuários de língua portuguesa do Brasil em dispositivos móveis ou telas maiores.

### Fonte de dados e idioma

- Geocoding e previsão: Open-Meteo.
- Idioma da interface: pt-BR.
- Unidade inicial: Celsius.
- Escopo: uma cidade consultada por vez.

### Definições de produto

- **Consulta de cidade válida:** texto após remoção de espaços nas extremidades, com 1 a 100 caracteres e pelo menos um caractere alfanumérico.
- **Resultado de localidade:** cidade, região/estado, país, coordenadas e fuso horário quando fornecidos pela fonte.
- **Campos mínimos meteorológicos:** temperatura atual e descrição atual; para cada dia, data, descrição, temperatura mínima e temperatura máxima.
- **Sessão:** período entre a abertura e o encerramento da página ou contexto do aplicativo. Nenhuma preferência é persistida entre sessões.
- **Dados atuais:** valores retornados pela fonte para o momento da consulta, acompanhados da data/hora local da cidade consultada quando fornecida.

## Functional Requirements

### RF-01 — Buscar cidades

O sistema deve permitir informar o nome de uma cidade e executar uma busca de localidades. Os resultados devem conter, quando fornecidos pela fonte, nome da cidade, região/estado e país para distinguir homônimos.

A busca deve rejeitar ou orientar a correção de uma consulta que, após remoção de espaços nas extremidades, esteja vazia, tenha mais de 100 caracteres ou não contenha caractere alfanumérico. Deve aceitar nomes com acentos e hífens, normalizar espaços excedentes, tratar a entrada como texto literal e ser iniciada somente por envio explícito.

O sistema deve exibir no máximo cinco resultados, ordenados pela relevância retornada pela fonte. Quando houver mais de um resultado, deve exibir cidade, região/estado e país sempre que disponíveis.

### RF-02 — Selecionar uma cidade e consultar o clima atual

O sistema deve permitir selecionar uma localidade entre os resultados. Após a seleção, deve consultar e exibir a temperatura atual e uma descrição não vazia do estado do tempo em pt-BR, baseada em uma condição meteorológica reconhecida pela fonte.

A tela deve identificar a cidade selecionada e sua região/país quando esses dados estiverem disponíveis. Deve exibir a data e a hora do dado atual no fuso horário da cidade consultada quando a fonte fornecer esse valor.

### RF-03 — Consultar previsão de cinco dias

Após a seleção de uma cidade, o sistema deve exibir cinco entradas diárias: o dia atual e os quatro dias seguintes, em ordem cronológica.

Cada entrada deve apresentar data identificável em pt-BR, descrição não vazia do estado do tempo e temperaturas mínima e máxima do dia. As cinco datas devem usar o fuso horário da cidade consultada, e não o fuso do dispositivo.

### RF-04 — Alternar unidade de temperatura

O sistema deve permitir alternar a apresentação entre Celsius e Fahrenheit. A unidade escolhida deve ser aplicada ao clima atual e a todas as temperaturas da previsão visível, sem nova seleção ou consulta meteorológica.

Ao iniciar uma nova sessão, a unidade padrão deve ser Celsius. A preferência escolhida vale somente durante a sessão atual e não é persistida.

### RF-05 — Informar estados da consulta

O sistema deve comunicar de forma identificável os estados de consulta em andamento, nenhum resultado, cidade sem dados meteorológicos utilizáveis, falha e consulta concluída com dados exibíveis.

Durante uma consulta, deve haver indicação de processamento. Ao iniciar uma nova consulta, o resultado anterior deve ser substituído pelo estado de carregamento. Respostas meteorológicas sem os campos mínimos devem ser tratadas como dados incompletos, não como resultado válido.

### RF-06 — Realizar nova consulta

Ao abrir a aplicação, a tela deve iniciar sem cidade selecionada e sem dados meteorológicos. Após uma consulta concluída, vazia ou malsucedida, a pessoa deve poder pesquisar e selecionar outra cidade sem reiniciar ou recarregar a aplicação. A nova consulta deve substituir o contexto anterior de forma consistente; respostas de consultas anteriores que chegarem depois devem ser ignoradas.

### RF-07 — Recuperar-se de falhas

Quando uma consulta falhar por indisponibilidade da rede, timeout ou erro do serviço externo, o sistema deve exibir uma mensagem clara, manter a interface utilizável e disponibilizar nova tentativa ou nova busca.

O timeout de cada consulta é de 10 segundos. A falha não deve ser apresentada como resultado meteorológico válido.

A recuperação é manual: o sistema não deve repetir automaticamente uma consulta que falhou.

## User Stories

### US-01 — Busca por cidade (RF-01)

Como pessoa que precisa consultar o clima, quero buscar uma cidade pelo nome para encontrar a localidade de interesse.

### US-02 — Desambiguação de localidades (RF-01)

Como pessoa que pesquisa uma cidade com possíveis homônimas, quero ver região/estado e país nos resultados para selecionar a localidade correta.

### US-03 — Clima atual (RF-02)

Como pessoa que precisa de uma informação rápida, quero ver a temperatura e o estado atual do tempo para entender as condições da cidade.

### US-04 — Planejamento de curto prazo (RF-03)

Como pessoa que planeja os próximos dias, quero ver a previsão de hoje e dos quatro dias seguintes para acompanhar a tendência meteorológica.

### US-05 — Preferência de unidade (RF-04)

Como pessoa acostumada a outra escala de temperatura, quero alternar entre Celsius e Fahrenheit para interpretar os valores com facilidade.

### US-06 — Feedback da consulta (RF-05)

Como pessoa usando o aplicativo, quero saber quando uma busca está carregando, vazia ou com erro para entender o que está acontecendo.

### US-07 — Nova tentativa (RF-06, RF-07)

Como pessoa que encontrou uma falha ou deseja consultar outra cidade, quero realizar uma nova busca ou tentativa sem reiniciar o aplicativo para continuar usando o serviço.

## Acceptance Criteria

Os critérios abaixo são verificáveis, seguem o formato Given/When/Then e cobrem todos os requisitos funcionais `RF-01` a `RF-07`.

### CA-01 — Busca válida retorna localidades identificáveis (RF-01)

Requisito coberto: RF-01.

- **Given** que a pessoa informa um nome de cidade não vazio e a fonte encontra localidades
- **When** executa a busca
- **Then** o sistema apresenta pelo menos um resultado
- **And** cada resultado contém nome da cidade e, quando fornecidos, região/estado e país.

### CA-02 — Busca vazia é tratada (RF-01)

Requisito coberto: RF-01.

- **Given** que o campo está vazio ou contém somente espaços
- **When** a pessoa tenta executar a busca
- **Then** o sistema não envia uma consulta de cidade
- **And** informa que o nome da cidade é obrigatório.

### CA-03 — Entrada com caracteres especiais (RF-01)

Requisito coberto: RF-01.

- **Given** que a pessoa informa uma cidade com acentos, hífens ou espaços excedentes
- **When** executa a busca
- **Then** o sistema envia o nome normalizado sem remover acentos ou hífens válidos
- **And** trata a entrada como texto literal.

### CA-13 — Limites e quantidade de resultados (RF-01)

Requisito coberto: RF-01.

- **Given** que a consulta tem mais de 100 caracteres ou não contém caractere alfanumérico
- **When** a pessoa tenta enviá-la
- **Then** o sistema não consulta o geocoding
- **And** informa como corrigir a consulta.

- **Given** que a fonte retorna mais de cinco localidades
- **When** a busca termina
- **Then** o sistema exibe exatamente os cinco primeiros resultados na ordem de relevância fornecida pela fonte.

### CA-04 — Seleção exibe o clima atual (RF-02)

Requisito coberto: RF-02.

- **Given** que uma localidade válida foi selecionada e os dados meteorológicos estão disponíveis
- **When** o carregamento termina
- **Then** o sistema identifica a cidade selecionada
- **And** exibe a temperatura atual
- **And** exibe uma descrição não vazia do estado do tempo em pt-BR.

### CA-14 — Data e hora usam o fuso da cidade (RF-02, RF-03)

Requisitos cobertos: RF-02 e RF-03.

- **Given** que a cidade selecionada está em fuso diferente do dispositivo
- **When** o clima atual e a previsão são exibidos
- **Then** a data/hora atual e as cinco datas diárias correspondem ao fuso da cidade consultada
- **And** as datas são apresentadas em formato pt-BR.

### CA-05 — Previsão contém cinco dias em ordem (RF-03)

Requisito coberto: RF-03.

- **Given** que uma localidade válida foi selecionada e a previsão está completa
- **When** o carregamento termina
- **Then** o sistema exibe exatamente cinco entradas diárias
- **And** a primeira representa o dia atual
- **And** as quatro seguintes representam os dias subsequentes
- **And** as entradas estão em ordem cronológica
- **And** cada entrada contém data, descrição, temperatura mínima e temperatura máxima.

### CA-06 — Alternância para Fahrenheit (RF-04)

Requisito coberto: RF-04.

- **Given** que o clima atual e a previsão estão visíveis em Celsius
- **When** a pessoa seleciona Fahrenheit
- **Then** o clima atual e todas as temperaturas da previsão passam a ser exibidos em Fahrenheit
- **And** a cidade e as datas permanecem inalteradas
- **And** a contagem de consultas meteorológicas não aumenta.

### CA-07 — Unidade padrão e escopo da preferência (RF-04)

Requisito coberto: RF-04.

- **Given** que uma nova sessão é iniciada sem preferência previamente definida
- **When** uma consulta meteorológica é exibida
- **Then** as temperaturas são apresentadas em Celsius
- **And** ao iniciar outra sessão, a unidade volta a ser Celsius.

### CA-08 — Estado de carregamento (RF-05)

Requisito coberto: RF-05.

- **Given** que uma busca de cidade ou consulta meteorológica foi iniciada
- **When** a resposta ainda não está disponível
- **Then** o sistema exibe um indicador ou mensagem de carregamento
- **And** não apresenta dados incompletos como resultado final.

### CA-15 — Consulta nova substitui dados anteriores (RF-05, RF-06)

Requisitos cobertos: RF-05 e RF-06.

- **Given** que existe um resultado meteorológico visível
- **When** a pessoa inicia uma nova busca
- **Then** o resultado anterior deixa de ser apresentado como resultado atual
- **And** o sistema exibe o estado de carregamento até concluir ou falhar a nova consulta.

### CA-09 — Geocoding sem resultados (RF-05)

Requisito coberto: RF-05.

- **Given** que a fonte de geocoding não retorna localidades
- **When** a busca termina
- **Then** o sistema informa que nenhuma cidade foi encontrada
- **And** não inicia consulta meteorológica
- **And** mantém disponível uma nova busca.

### CA-10 — Dados meteorológicos ausentes ou parciais (RF-05)

Requisito coberto: RF-05.

- **Given** que a cidade foi encontrada, mas faltam dados mínimos do clima atual ou das cinco entradas diárias
- **When** o sistema valida a resposta meteorológica
- **Then** não exibe a resposta como resultado válido
- **And** informa que os dados estão incompletos ou indisponíveis
- **And** permite nova tentativa ou busca.

### CA-11 — Falha e timeout são recuperáveis (RF-07)

Requisito coberto: RF-07.

- **Given** que a rede, o serviço externo ou o tempo máximo impede uma resposta válida
- **When** a consulta falha ou ultrapassa 10 segundos
- **Then** o sistema encerra o carregamento e exibe mensagem clara de erro ou timeout
- **And** a interface permanece utilizável
- **And** a pessoa pode tentar novamente ou pesquisar outra cidade.

### CA-12 — Nova consulta substitui o contexto com consistência (RF-06)

Requisito coberto: RF-06.

- **Given** que uma cidade já foi consultada
- **When** a pessoa busca e seleciona outra cidade
- **Then** o nome e a localização exibidos correspondem à nova cidade
- **And** o clima atual e a previsão correspondem à nova seleção
- **And** os dados anteriores não são apresentados como dados da nova cidade.

### CA-16 — Estado inicial e respostas obsoletas (RF-06)

Requisito coberto: RF-06.

- **Given** que a aplicação foi aberta
- **When** nenhum local foi selecionado
- **Then** a tela não exibe cidade, clima ou previsão.

- **Given** que uma nova consulta foi iniciada antes de a anterior terminar
- **When** a resposta da consulta anterior chega depois da nova consulta
- **Then** o sistema ignora a resposta anterior
- **And** mantém somente o resultado correspondente à consulta mais recente.

### CA-17 — Recuperação manual sem repetição automática (RF-07)

Requisito coberto: RF-07.

- **Given** que uma consulta falhou por erro, perda de rede ou timeout
- **When** o estado de erro é exibido
- **Then** o sistema não inicia outra consulta automaticamente
- **And** disponibiliza uma ação explícita para tentar novamente ou realizar nova busca.

## Traceability Matrix

A matriz relaciona cada User Story aos critérios de aceite que comprovam seu comportamento e aos requisitos não funcionais que devem ser considerados nas tarefas e nos testes.

| User Story | Requisitos funcionais | Acceptance Criteria | Requisitos não funcionais relevantes |
| --- | --- | --- | --- |
| US-01 — Busca por cidade | RF-01 | CA-01, CA-02, CA-03, CA-13 | RNF-01, RNF-02, RNF-03, RNF-04, RNF-08 |
| US-02 — Desambiguação de localidades | RF-01 | CA-01, CA-13 | RNF-01, RNF-02, RNF-03, RNF-08 |
| US-03 — Clima atual | RF-02 | CA-04, CA-14 | RNF-01, RNF-02, RNF-03, RNF-04, RNF-05, RNF-06, RNF-07, RNF-08, RNF-09 |
| US-04 — Planejamento de curto prazo | RF-03 | CA-05, CA-14 | RNF-01, RNF-02, RNF-03, RNF-04, RNF-05, RNF-06, RNF-07, RNF-10 |
| US-05 — Preferência de unidade | RF-04 | CA-06, CA-07 | RNF-01, RNF-02, RNF-03, RNF-06 |
| US-06 — Feedback da consulta | RF-05 | CA-08, CA-09, CA-10, CA-15 | RNF-02, RNF-03, RNF-04, RNF-05, RNF-06, RNF-09 |
| US-07 — Nova tentativa | RF-06, RF-07 | CA-11, CA-12, CA-16, CA-17 | RNF-01, RNF-02, RNF-03, RNF-05, RNF-06, RNF-09 |

### Uso da matriz

- Cada tarefa deve referenciar pelo menos uma User Story e seus critérios de aceite.
- Cada teste funcional deve validar um ou mais critérios `CA-*` identificados na matriz.
- Cada tarefa de interface ou integração deve verificar os `RNF-*` relevantes da linha correspondente.
- Uma alteração sem User Story, critério de aceite ou requisito não funcional associado deve ser tratada como escopo novo e revisada antes da implementação.

## Non-Functional Requirements

### RNF-01 — Responsividade

Todas as funcionalidades principais devem funcionar em larguras a partir de 320 px, sem rolagem horizontal, sobreposição ou perda de informações essenciais.

**Verificação:** executar busca, seleção, alternância e nova consulta em viewport de 320 px e desktop; não deve haver overflow horizontal nem controles inacessíveis.

### RNF-02 — Acessibilidade

A aplicação deve atender ao nível AA da WCAG 2.2 no que for aplicável, incluindo teclado, foco visível, nomes acessíveis, contraste AA e comunicação de carregamento e erro a tecnologias assistivas.

**Verificação:** completar a jornada somente com teclado, verificar nomes e estados com ferramenta de acessibilidade e confirmar contraste AA.

### RNF-03 — Usabilidade

Uma pessoa sem conhecimento técnico deve conseguir identificar o campo de busca, consultar uma cidade e localizar clima atual e previsão sem instruções externas. Mensagens de erro e vazio devem indicar uma ação possível.

**Verificação:** teste da jornada principal e das recuperações de vazio e erro.

### RNF-04 — Desempenho percebido

O sistema deve exibir feedback de carregamento antes de qualquer resposta de rede. Em condições normais de rede, pelo menos 95% das consultas devem apresentar resultado ou estado de erro em até três segundos após o envio, sem contar o tempo excedente causado pelo timeout de 10 segundos.

**Verificação:** executar no mínimo 20 consultas em rede normal, confirmar indicador antes da resposta e verificar que pelo menos 19 terminam em até três segundos.

### RNF-05 — Timeout e consistência

Toda consulta deve ser encerrada após 10 segundos sem resposta válida. A aplicação deve sair do carregamento, comunicar o timeout e não misturar dados de consultas diferentes.

**Verificação:** simular resposta atrasada e respostas fora de ordem; confirmar timeout e correspondência entre cidade e dados exibidos.

### RNF-06 — Confiabilidade

Falhas da Open-Meteo, respostas inválidas ou dados incompletos não devem encerrar a aplicação nem ser exibidos como dados válidos.

**Verificação:** simular falha de geocoding, falha de previsão, resposta vazia, resposta parcial e erro de rede.

### RNF-07 — Compatibilidade

A aplicação deve funcionar nas duas versões estáveis mais recentes de Chrome, Edge, Firefox e Safari, incluindo Chrome Mobile e Safari iOS nas versões correspondentes.

**Verificação:** executar a jornada principal na matriz de navegadores definida.

### RNF-08 — Segurança e privacidade

A aplicação não deve exigir autenticação, coletar dados pessoais desnecessários ou enviar dados além do nome da cidade e dos parâmetros necessários à consulta. Entradas devem ser tratadas como texto.

**Verificação:** revisar requisições e confirmar ausência de credenciais, dados pessoais e parâmetros não necessários.

### RNF-09 — Degradação controlada

Quando a Open-Meteo estiver indisponível, a aplicação deve permanecer utilizável, encerrar o carregamento e oferecer mensagem e recuperação. A disponibilidade da aplicação não deve ser apresentada como garantia de disponibilidade da fonte externa.

**Verificação:** simular indisponibilidade da dependência e confirmar estado de erro recuperável.

### RNF-10 — Atualização e identificação temporal

O sistema não deve atualizar automaticamente os dados durante a sessão. O usuário deve iniciar uma nova busca para obter novos dados. Quando a fonte fornecer data/hora, o sistema deve exibi-la no fuso da cidade consultada.

**Verificação:** manter a tela aberta além do horário da consulta e confirmar que não há nova requisição automática; verificar a exibição do horário retornado pela fonte.

## Edge Cases

### Cidade inexistente

- Exibir mensagem informando que a cidade não foi encontrada.
- Manter o campo de busca disponível.
- Não exibir clima ou previsão para uma cidade não selecionada.

### Input vazio

- Impedir o envio da consulta.
- Informar que o nome da cidade é obrigatório.
- Manter o campo disponível para correção.

### Caracteres especiais

- Aceitar acentos e hífens válidos.
- Normalizar espaços excedentes sem alterar indevidamente o nome.
- Orientar entradas compostas apenas por caracteres inválidos.
- Tratar a entrada como texto literal.

### Falha de API

- Encerrar o carregamento.
- Exibir mensagem clara de indisponibilidade.
- Não apresentar dados incompletos ou antigos como resultado atual.
- Oferecer nova tentativa ou nova busca.

### Timeout

- Encerrar a consulta após 10 segundos.
- Exibir mensagem específica de tempo excedido.
- Liberar a interface para nova tentativa ou pesquisa.

### Geocoding sem resultados

- Informar que nenhuma localidade corresponde à busca.
- Não iniciar consulta meteorológica.
- Orientar a revisão do nome ou nova busca.

### Resposta parcial

- Validar os campos mínimos do clima atual e das cinco entradas diárias.
- Rejeitar a resposta inteira se qualquer campo mínimo estiver ausente.
- Informar que os dados estão incompletos.
- Permitir nova tentativa.

### Outros casos

- Tratar cidades homônimas exibindo região/estado e país quando disponíveis.
- Impedir que respostas fora de ordem substituam dados da cidade atual.
- Tratar perda de conexão antes ou durante a consulta como falha recuperável.
- Manter controles acessíveis por teclado e em viewport de 320 px.
- Manter datas coerentes com o fuso horário da cidade consultada.

## Assumptions

- A Open-Meteo fornece geocoding e previsão sem chave de API para o MVP.
- Uma consulta exibe uma cidade por vez.
- A previsão de cinco dias significa hoje mais os quatro dias seguintes.
- Celsius e Fahrenheit são as únicas unidades necessárias.
- A unidade escolhida não é persistida entre sessões.
- A consulta depende de conectividade; funcionamento offline está fora do MVP.
- Não haverá autenticação, contas, favoritos, histórico ou persistência em servidor.
- A interface e as mensagens serão pt-BR.
- Os dados são informativos e não substituem alertas oficiais.

## Risks

| Risco | Impacto | Mitigação |
| --- | --- | --- |
| Open-Meteo indisponível, lenta ou limitada | Consultas não retornam dados | Timeout de 10 segundos, mensagens claras e nova tentativa. |
| Cidades homônimas | Seleção da localidade errada | Exibir região/estado e país nos resultados. |
| Dados meteorológicos incompletos | Previsão inválida ou insuficiente | Validar campos mínimos e rejeitar resposta parcial. |
| Dados interpretados como tempo real | Decisões com informação desatualizada | Exibir datas e contexto da consulta. |
| Erro de conversão de unidade | Valores inconsistentes | Verificar clima atual e previsão nas duas unidades. |
| Excesso de conteúdo em telas pequenas | Dificuldade de leitura | Validar viewport de 320 px e priorizar dados essenciais. |
| Respostas fora de ordem | Dados de uma cidade em outra | Aceitar somente a resposta correspondente à consulta atual. |
| Dependência de conectividade | Impossibilidade de novas consultas | Informar indisponibilidade sem travar a interface. |

## Out of Scope

- Autenticação, contas, perfis, favoritos e histórico.
- Persistência de dados em servidor ou funcionamento offline.
- Alertas meteorológicos oficiais e notificações push.
- Previsão horária, mapas, radar, satélite e dados históricos.
- Unidades além de Celsius e Fahrenheit.
- Internacionalização além de pt-BR.
- Integração com provedores diferentes da Open-Meteo no MVP.
- Garantia de precisão superior à fornecida pela fonte externa.

## Open Questions

Não há perguntas abertas para o escopo do MVP. As decisões de produto foram fechadas nesta especificação:

- A busca ocorre somente após envio explícito.
- São exibidos no máximo cinco resultados, na ordem de relevância da fonte.
- A desambiguação usa cidade, região/estado e país quando disponíveis.
- A aplicação inicia sem cidade ou dados meteorológicos.
- O resultado anterior é substituído pelo estado de carregamento durante uma nova consulta.
- A recuperação de erro é manual, sem retry automático.
- Não há atualização automática; uma nova busca obtém dados novos.
- A data/hora é exibida quando fornecida pela fonte, usando o fuso da cidade consultada.