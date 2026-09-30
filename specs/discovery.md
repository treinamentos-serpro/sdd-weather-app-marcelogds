# Análise de Discovery

## Contexto

A empresa solicitou uma aplicação de previsão do tempo para permitir que
usuários consultem as condições meteorológicas de cidades de seu interesse.

O produto deve atender a dois contextos principais de uso:

- consulta rápida do clima atual de uma cidade;
- acompanhamento da previsão para os próximos cinco dias.

A aplicação também precisa atender usuários que preferem diferentes unidades
de temperatura e usuários que acessam o serviço por dispositivos móveis.

O objetivo desta análise é organizar o problema de negócio e explicitar os
principais pontos que deverão ser detalhados na especificação do produto.

## Decisões

### D-01 — Fonte de dados: Open-Meteo

- **Decisão:** utilizar a Open-Meteo para geocoding e dados meteorológicos.
- **Justificativa:** a API atende ao escopo inicial sem exigir uma chave de API,
  reduzindo a barreira de configuração e o risco de exposição de credenciais.
- **Resolve:** define a fonte externa de dados e elimina a dúvida sobre a
  necessidade de autenticação ou contratação de um provedor nesta versão.

### D-02 — Período da previsão: hoje + quatro dias

- **Decisão:** a previsão de cinco dias inclui o dia atual e os quatro dias
  seguintes.
- **Justificativa:** oferece uma janela de planejamento de curto prazo mantendo
  o escopo alinhado ao briefing original.
- **Resolve:** elimina a ambiguidade sobre se os cinco dias começam hoje ou no
  dia seguinte.

### D-03 — Unidade padrão: Celsius

- **Decisão:** exibir temperaturas em Celsius por padrão, permitindo alternância
  para Fahrenheit.
- **Justificativa:** Celsius é a unidade mais adequada ao público inicial em
  português do Brasil.
- **Resolve:** define o comportamento inicial da interface e mantém a
  conversão para Fahrenheit como uma preferência opcional do usuário.

### D-04 — Sem autenticação e persistência de servidor

- **Decisão:** a primeira versão não terá contas de usuário nem armazenamento de
  dados em servidor.
- **Justificativa:** reduz o escopo, a complexidade operacional e as
  responsabilidades relacionadas a dados pessoais.
- **Resolve:** elimina, para o MVP, as dúvidas sobre login, favoritos,
  histórico sincronizado e banco de dados de usuários.

### D-05 — Idioma da interface: pt-BR

- **Decisão:** todos os textos da interface serão apresentados em português do
  Brasil.
- **Justificativa:** mantém a experiência consistente com o público inicial e
  com o contexto do produto.
- **Resolve:** define o idioma da UI e adia a necessidade de
  internacionalização para uma decisão futura.

## Requisitos Funcionais

### RF-01 — Buscar cidades

O usuário deve poder informar o nome de uma cidade e executar uma busca.

O sistema deve apresentar resultados que permitam identificar a cidade
consultada, especialmente quando existirem cidades com nomes iguais ou
semelhantes.

### RF-02 — Consultar o clima atual

Após a seleção de uma cidade, o sistema deve exibir as condições meteorológicas
atuais, incluindo pelo menos a temperatura e uma descrição do estado do tempo.

### RF-03 — Consultar previsão de cinco dias

Após a seleção de uma cidade, o sistema deve exibir a previsão do tempo para os
cinco dias seguintes, com informações suficientes para acompanhar a variação
das condições meteorológicas ao longo do período.

### RF-04 — Alternar unidade de temperatura

O usuário deve poder alternar a exibição da temperatura entre Celsius e
Fahrenheit.

As temperaturas exibidas no clima atual e na previsão devem respeitar a unidade
selecionada.

### RF-05 — Tratar estados da consulta

O sistema deve informar ao usuário quando:

- uma busca está em andamento;
- nenhuma cidade ou dado meteorológico foi encontrado;
- ocorreu uma falha ao buscar ou carregar os dados.

### RF-06 — Permitir nova consulta

O usuário deve poder realizar uma nova busca por outra cidade sem precisar
reiniciar a aplicação.

## Requisitos Não-Funcionais

### RNF-01 — Responsividade

A aplicação deve ser utilizável em dispositivos móveis e em telas maiores,
adaptando layout, controles e conteúdo ao tamanho disponível.

### RNF-02 — Usabilidade

O fluxo de busca e consulta deve ser simples e compreensível para usuários sem
conhecimento técnico. As informações principais devem ser facilmente
identificáveis.

### RNF-03 — Acessibilidade

Os controles e informações devem ser acessíveis por teclado e compatíveis com
tecnologias assistivas, utilizando nomes e estados compreensíveis.

### RNF-04 — Desempenho percebido

O sistema deve fornecer feedback visual durante o carregamento e evitar que o
usuário fique sem indicação sobre o estado da consulta.

### RNF-05 — Confiabilidade

Falhas de rede, indisponibilidade do serviço meteorológico e respostas sem dados
devem ser tratadas de forma clara, sem interromper ou deixar a interface em um
estado inconsistente.

### RNF-06 — Compatibilidade

A aplicação deve funcionar nos navegadores modernos usados em computadores e
dispositivos móveis.

## Revisão da Classificação dos Requisitos

| Item | Classificação | Avaliação |
| --- | --- | --- |
| RF-01 — Buscar cidades | Funcional | Correto: descreve uma ação do usuário. |
| RF-02 — Consultar o clima atual | Funcional | Correto: define dados que o sistema deve exibir. |
| RF-03 — Consultar previsão de cinco dias | Funcional | Correto: descreve uma capacidade do produto. |
| RF-04 — Alternar unidade de temperatura | Funcional | Correto: define uma interação do usuário. |
| RF-05 — Tratar estados da consulta | Funcional | Correto: loading, vazio e erro são comportamentos observáveis. |
| RF-06 — Permitir nova consulta | Funcional | Correto: descreve uma ação disponível ao usuário. |
| RNF-01 — Responsividade | Não funcional | Correto: define uma característica de qualidade da interface. |
| RNF-02 — Usabilidade | Não funcional | Correto: trata da facilidade de uso. |
| RNF-03 — Acessibilidade | Não funcional | Correto: define qualidade de acesso e interação. |
| RNF-04 — Desempenho percebido | Misto | O feedback visual de carregamento é funcional; tempo de carregamento e resposta são não funcionais. |
| RNF-05 — Confiabilidade | Misto | Mensagem e retry após falha são funcionais; disponibilidade e consistência são não funcionais. |
| RNF-06 — Compatibilidade | Não funcional | Correto: define ambientes e navegadores suportados. |

### Correções recomendadas

- **RNF-04 funcional:** o sistema deve exibir um indicador enquanto a consulta
  estiver em andamento.
- **RNF-04 não funcional:** o resultado deve ser exibido em até um tempo
  definido, por exemplo, três segundos em condições normais.
- **RNF-05 funcional:** após uma falha, o sistema deve exibir uma mensagem clara
  e permitir uma nova tentativa.
- **RNF-05 não funcional:** a aplicação deve permanecer consistente e utilizável
  após falhas de rede ou do serviço meteorológico.

### Requisitos não funcionais adicionais

#### RNF-07 — Performance da consulta

A aplicação deve apresentar o resultado de uma consulta em até três segundos
em condições normais de rede.

#### RNF-08 — Performance da carga inicial

O conteúdo inicial deve carregar rapidamente e não provocar mudanças bruscas de
layout durante a renderização.

#### RNF-09 — Acessibilidade verificável

A aplicação deve atender ao nível AA da WCAG 2.2, incluindo navegação por
teclado, foco visível, contraste adequado e suporte a leitores de tela.

#### RNF-10 — Responsividade mensurável

Todas as funcionalidades principais devem funcionar em telas a partir de 320
px de largura, sem rolagem horizontal ou sobreposição de conteúdo.

#### RNF-11 — Disponibilidade

O serviço deve manter disponibilidade mensal mínima de 99,5%, desconsiderando
manutenções planejadas.

#### RNF-12 — Timeout e recuperação

As requisições devem ser encerradas após um tempo máximo definido, sem deixar a
interface travada.

#### RNF-13 — Segurança e privacidade

A aplicação deve coletar apenas os dados necessários e validar entradas antes de
enviá-las a serviços externos.

#### RNF-14 — Compatibilidade de navegadores

A aplicação deve suportar as versões definidas dos principais navegadores para
desktop e dispositivos móveis.

## Riscos

- **Dados meteorológicos indisponíveis:** a API ou o serviço de localização pode
  apresentar indisponibilidade, lentidão ou limite de requisições.
- **Ambiguidade na busca:** diferentes cidades podem compartilhar o mesmo nome,
  dificultando a identificação correta pelo usuário.
- **Dados incompletos:** uma cidade pode não possuir todos os dados necessários
  para o clima atual ou para a previsão de cinco dias.
- **Expectativa sobre atualização:** o usuário pode interpretar os dados como
  atualizados em tempo real, embora exista um intervalo entre a coleta e a
  exibição.
- **Conversão de unidades:** arredondamentos ou conversões incorretas podem
  gerar valores inconsistentes entre o clima atual e a previsão.
- **Limitações em telas pequenas:** excesso de informações pode prejudicar a
  leitura e a interação em dispositivos móveis.
- **Dependência de conectividade:** sem acesso à rede, a aplicação pode não
  conseguir realizar novas consultas.

## Perguntas em Aberto

- Quais campos devem ser exibidos no clima atual além da temperatura e da
  descrição do tempo, como sensação térmica, umidade, vento e ícone?
- Quais informações devem aparecer para cada dia da previsão de cinco dias,
  como temperaturas mínima e máxima, precipitação e probabilidade de chuva?
- A busca deve iniciar apenas após uma ação explícita do usuário ou também deve
  sugerir resultados enquanto ele digita?
- Como o sistema deve diferenciar cidades com o mesmo nome: estado, país,
  coordenadas ou outro identificador?
- Deve existir uma cidade padrão ou a aplicação deve iniciar sem dados até a
  primeira busca?
- A unidade de temperatura escolhida deve ser mantida entre sessões ou apenas
  durante a sessão atual?
- O sistema deve permitir favoritar ou manter um histórico de cidades?
- Qual é o tempo máximo aceitável para uma consulta antes de exibir uma
  mensagem de timeout?
- Qual comportamento deve ser adotado quando a API retornar dados parciais?
- Quais navegadores e versões são oficialmente suportados?
- Existe algum requisito de idioma, localização, formato de data ou fuso
  horário além do público principal da aplicação?
- Há metas de disponibilidade, desempenho ou acessibilidade que devam ser
  formalmente atendidas?

## Suposições

- O usuário consulta uma cidade por vez.
- A aplicação terá acesso a um serviço externo de geocoding e previsão do
  tempo.
- O serviço externo fornecerá dados suficientes para o clima atual e para uma
  previsão de cinco dias.
- Celsius e Fahrenheit são as únicas unidades de temperatura necessárias nesta
  primeira versão.
- A consulta depende de conexão com a internet; funcionamento offline não faz
  parte do escopo inicial.
- A previsão de cinco dias inclui o dia atual ou representa exclusivamente os
  cinco dias posteriores à consulta ainda precisa ser confirmado.
- A interface será responsiva, com prioridade para a leitura e a interação em
  telas pequenas.
- O produto inicial não exige autenticação ou criação de conta.
- O produto inicial não exige persistência de cidades, favoritos ou histórico.
- O idioma inicial da interface será o português do Brasil, salvo decisão
  diferente do negócio.
- Os dados exibidos serão informativos e não substituirão alertas oficiais ou
  recomendações de segurança meteorológica.

## Revisão Cética de Discovery

As decisões já fechadas reduzem o escopo, mas os pontos abaixo ainda precisam
ser respondidos antes do detalhamento completo da especificação.

| # | Pergunta em aberto | Impacto de seguir sem resposta |
| --- | --- | --- |
| 1 | Quais campos devem aparecer no clima atual: temperatura, sensação térmica, umidade, vento, precipitação e ícone? | O modelo de dados e o layout podem ser refeitos depois. |
| 2 | Quais dados devem aparecer em cada dia da previsão? | A equipe pode implementar uma previsão insuficiente ou incompatível com a expectativa. |
| 3 | “Hoje + quatro dias” será exibido como previsão diária ou horária? | Altera chamadas à API, volume de dados e desenho da interface. |
| 4 | Como diferenciar cidades com o mesmo nome? | O usuário pode consultar a localidade errada. |
| 5 | A busca será exata, parcial, por sugestões ou apenas após envio do formulário? | Impacta UX, número de requisições e complexidade do componente de busca. |
| 6 | Quantos resultados de cidade devem ser exibidos? | Pode gerar listas confusas ou ocultar resultados relevantes. |
| 7 | Quais identificadores serão mostrados: estado, país, região ou coordenadas? | Sem isso, a desambiguação de cidades fica inconsistente. |
| 8 | O app deve iniciar vazio ou com uma cidade padrão? | Define a primeira experiência e o estado inicial da aplicação. |
| 9 | A preferência Fahrenheit deve ser mantida entre sessões no armazenamento local? | Afeta estado, persistência local e critérios de teste. |
| 10 | A cidade pesquisada deve ser mantida localmente, mesmo sem persistência de servidor? | Pode alterar privacidade, experiência de retorno e comportamento offline. |
| 11 | Qual é o fuso horário usado para “hoje” e para as datas da previsão? | Pode exibir datas incorretas para cidades fora do fuso do usuário. |
| 12 | Qual será o formato de data e hora em pt-BR? | Pode gerar inconsistência entre API, interface e testes. |
| 13 | Com que frequência os dados devem ser atualizados? | Sem política definida, os dados podem ficar desatualizados ou gerar requisições excessivas. |
| 14 | Deve haver atualização automática ou apenas nova busca manual? | Impacta consumo da API, desempenho e comportamento da tela. |
| 15 | Qual timeout deve ser aplicado às requisições? | A interface pode ficar travada em redes lentas. |
| 16 | Deve haver retry automático ou um botão “Tentar novamente”? | Define recuperação de erro e pode evitar requisições duplicadas. |
| 17 | O que acontece quando a API retorna dados parciais? | A aplicação pode exibir dados incompletos sem explicação ou falhar totalmente. |
| 18 | Dados anteriores permanecem visíveis durante uma nova busca? | Afeta percepção de consistência e risco de o usuário confundir dados antigos com novos. |
| 19 | O app funcionará offline ou exibirá apenas uma mensagem de indisponibilidade? | Define a necessidade de cache, service worker e armazenamento local. |
| 20 | Quais navegadores e versões serão oficialmente suportados? | Sem uma matriz de suporte, testes e compatibilidade ficam indefinidos. |
| 21 | Quais metas objetivas de performance devem ser cumpridas? | Não será possível determinar se o produto está rápido o suficiente. |
| 22 | Qual nível de acessibilidade será exigido, como WCAG 2.2 AA? | Acessibilidade não poderá ser validada de forma objetiva. |
| 23 | Quais larguras de tela e breakpoints precisam ser suportados? | O layout pode funcionar em um dispositivo e quebrar em outro. |
| 24 | Qual disponibilidade mínima é esperada? | Não há critério para monitoramento, incidentes ou avaliação operacional. |
| 25 | Qual comportamento ocorre quando a Open-Meteo está indisponível ou limita requisições? | O produto pode ficar sem resposta e sem estratégia de contingência. |
| 26 | A localização atual do usuário será oferecida como alternativa à busca por cidade? | Pode alterar permissões, privacidade e escopo do MVP. |
| 27 | O app exibirá alertas meteorológicos oficiais? | Usuários podem interpretar uma previsão comum como alerta de segurança. |
| 28 | Existe algum requisito de analytics ou métrica de sucesso? | Será difícil avaliar adoção, buscas concluídas e valor real do produto. |
| 29 | Favoritos, histórico e notificações estão explicitamente fora do MVP? | O escopo pode crescer durante a implementação. |
| 30 | Há requisitos visuais de marca, identidade e aprovação de design? | Pode haver retrabalho significativo na interface após a implementação. |
| 31 | Quem será responsável por monitorar a API e manter o app? | Incidentes, mudanças do provedor e limites de uso podem ficar sem responsável. |
| 32 | O app precisa exibir aviso de que os dados são informativos e não substituem alertas oficiais? | Reduz o risco de uso indevido da previsão em situações críticas. |

### Decisões já resolvidas

- Fonte de dados: **Open-Meteo**.
- Período: **hoje + quatro dias**.
- Unidade padrão: **Celsius**.
- Autenticação: **não haverá**.
- Persistência em servidor: **não haverá**.
- Idioma da interface: **pt-BR**.

## Matriz de Riscos

| Risco | Tipo | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- | --- |
| Indisponibilidade da Open-Meteo | Técnico | Média | Consultas indisponíveis para os usuários. | Implementar timeout, tratamento de erro, retry controlado e mensagens claras. |
| Limite de requisições da API | Técnico | Média | O serviço pode bloquear consultas ou limitar o uso. | Usar cache, evitar buscas automáticas desnecessárias e monitorar consumo. |
| Dados meteorológicos desatualizados | Produto | Média | Usuários podem tomar decisões com informações antigas. | Exibir horário da atualização e definir uma política de atualização. |
| Cidade ambígua nos resultados | Produto | Alta | O usuário pode consultar a cidade errada. | Exibir cidade, região, país e outros identificadores nos resultados. |
| Cobertura insuficiente de cidades | Produto | Média | Algumas localidades não poderão ser encontradas. | Validar a cobertura do geocoding e informar claramente quando não houver resultado. |
| Dados parciais ou inválidos | Técnico | Média | A interface pode mostrar campos vazios ou inconsistentes. | Validar respostas, tratar campos opcionais e definir estados para dados incompletos. |
| Conversão incorreta de Celsius para Fahrenheit | Técnico | Baixa | Temperaturas erradas reduzem a confiança no produto. | Centralizar a conversão em função testável e validar arredondamentos. |
| Interpretação incorreta dos cinco dias | Produto | Média | A previsão exibida pode não corresponder à expectativa. | Documentar que o período é “hoje + quatro dias” e exibir datas completas. |
| Desempenho ruim em redes móveis | Técnico | Média | Usuários podem abandonar a consulta. | Reduzir o bundle, otimizar carregamento, usar cache e definir metas de resposta. |
| Layout inadequado em telas pequenas | Produto | Média | Conteúdo pode ficar ilegível ou exigir rolagem horizontal. | Testar a partir de 320 px e validar diferentes orientações e dispositivos. |
| Falhas de acessibilidade | Produto | Média | Usuários com deficiência podem não conseguir usar o app. | Adotar WCAG 2.2 AA, HTML semântico, teclado, foco visível e testes assistivos. |
| Timeout ou perda de conexão sem recuperação | Técnico | Alta | A interface pode parecer travada ou ficar inconsistente. | Definir timeout, cancelar requisições obsoletas e oferecer ação de retry. |
| Compatibilidade limitada entre navegadores | Técnico | Média | Parte dos usuários pode enfrentar erros visuais ou funcionais. | Definir navegadores suportados e executar testes cross-browser. |
| Ausência de suporte offline | Produto | Média | O app não funcionará em redes instáveis ou sem conexão. | Definir explicitamente o escopo offline; se necessário, implementar cache local. |
| Confusão entre previsão e alerta oficial | Produto | Baixa/Média | Usuários podem tomar decisões de segurança inadequadas. | Exibir aviso de caráter informativo e indicar fontes oficiais de alertas. |
| Exposição indevida de dados de localização | Técnico | Baixa/Média | Pode criar riscos de privacidade e conformidade. | Solicitar apenas permissões necessárias e minimizar dados armazenados. |
| Crescimento de escopo | Produto | Alta | Favoritos, histórico e alertas podem atrasar o MVP. | Definir backlog, escopo mínimo e itens explicitamente fora da primeira versão. |
| Ausência de métricas de sucesso | Produto | Alta | Não será possível avaliar adoção ou valor entregue. | Definir métricas como buscas concluídas, tempo até o resultado e retorno de usuários. |
| Falta de monitoramento operacional | Técnico | Média | Incidentes e degradações podem permanecer invisíveis. | Monitorar disponibilidade, erros, latência e falhas da API externa. |
| Falta de critérios objetivos de aceite | Produto | Alta | A equipe pode considerar a entrega pronta sem atender às expectativas. | Criar critérios verificáveis para funcionalidade, performance, acessibilidade e erros. |

## Personas

### Persona 1 — Ana, usuária em deslocamento diário

- **Objetivo principal:** verificar rapidamente se precisa levar guarda-chuva,
  casaco ou ajustar o horário de saída.
- **Contexto de uso:** principalmente **mobile**, pela manhã e durante
  deslocamentos, usando redes móveis.
- **Métrica de sucesso:** consegue buscar sua cidade e compreender o clima atual
  em menos de 30 segundos.

### Persona 2 — Carlos, planejador de atividades ao ar livre

- **Objetivo principal:** comparar a previsão dos próximos cinco dias para
  escolher o melhor dia para corrida, ciclismo ou trilha.
- **Contexto de uso:** **desktop** para planejar com calma e **mobile** para
  conferir a previsão antes de sair.
- **Métrica de sucesso:** encontra uma previsão de cinco dias clara e decide o
  dia da atividade sem precisar consultar outra fonte.

### Persona 3 — Mariana, profissional que viaja a trabalho

- **Objetivo principal:** consultar rapidamente diferentes cidades e preparar-se
  para compromissos externos.
- **Contexto de uso:** **desktop** antes da viagem e **mobile** durante o
  deslocamento.
- **Métrica de sucesso:** localiza a cidade correta, alterna entre Celsius e
  Fahrenheit e obtém a previsão sem confundir localidades semelhantes.

## Resumo Executivo

A empresa terá um aplicativo de previsão do tempo simples, responsivo e em português do Brasil.
Usuários poderão buscar cidades e consultar o clima atual e a previsão de cinco dias.
A previsão considerará o dia atual e os quatro dias seguintes, usando a Open-Meteo como fonte de dados.
As temperaturas serão exibidas inicialmente em Celsius, com opção de alternar para Fahrenheit.
O MVP não terá autenticação nem armazenamento em servidor, priorizando rapidez, acessibilidade e uso em dispositivos móveis.

## Crítica Arquitetural

### Inconsistências que podem gerar retrabalho

| Prioridade | Ponto | Risco de retrabalho |
| --- | --- | --- |
| Alta | D-02 define “hoje + quatro dias”, mas RF-03 ainda usa “cinco dias seguintes” e as suposições tratam o período como pendente. | O modelo de dados, a chamada da API, o layout e os testes podem implementar janelas diferentes. |
| Alta | D-03 define Celsius como padrão, mas não decide se a preferência Fahrenheit será salva localmente. | A equipe pode escolher estado temporário, `localStorage` ou persistência sem um contrato de produto. |
| Alta | D-04 proíbe persistência no servidor, mas o documento não define claramente o que pode ser salvo no navegador. | Cache, última cidade e preferência de unidade podem gerar decisões divergentes de privacidade e UX. |
| Média | A seção de requisitos, a revisão de classificação e a revisão cética repetem perguntas e requisitos em formatos diferentes. | Pode haver mais de uma fonte de verdade e alterações aplicadas apenas em uma seção. |
| Média | A matriz de riscos recomenda horários de atualização, cache e monitoramento, mas esses comportamentos não estão nos requisitos funcionais. | O risco é reconhecido, mas não existe compromisso verificável de produto ou operação. |

### Pontos ainda vagos

- **Contrato do clima atual:** não estão definidos os campos obrigatórios, a
  unidade, o arredondamento, o horário da medição e o comportamento para campos
  ausentes.
- **Contrato da previsão:** falta definir dados por dia, previsão diária ou
  horária, datas exibidas, temperaturas mínima e máxima e precipitação.
- **Busca:** faltam tamanho mínimo, busca vazia, busca parcial, quantidade e
  ordenação dos resultados, além dos identificadores para cidades homônimas.
- **Tempo e localização:** não há decisão sobre fuso horário da cidade, formato
  de data, horário da última atualização e significado de “hoje”.
- **Atualização:** não está definido se a aplicação atualiza automaticamente,
  se mantém dados anteriores durante uma nova busca ou se exige ação manual.
- **Falhas:** timeout, retry, dados parciais, perda de conexão, limite da API e
  respostas inválidas ainda não possuem comportamentos distintos.
- **Qualidade:** “navegadores modernos”, “carregar rapidamente” e “condições
  normais de rede” não são critérios suficientemente mensuráveis.
- **Operação:** não há definição de monitoramento, responsável por incidentes,
  limites de uso da Open-Meteo ou plano quando o provedor estiver indisponível.
- **Escopo:** localização automática, offline, alertas, favoritos, histórico,
  analytics e notificações aparecem como dúvidas, mas não estão explicitamente
  classificados como incluídos ou fora do MVP.

### Artefatos que faltam para iniciar a especificação com segurança

1. **Decisões consolidadas:** atualizar RF-03 e as suposições para refletir
   definitivamente “hoje + quatro dias” e registrar a política de armazenamento
   local.
2. **Contrato de dados:** listar os campos mínimos do geocoding, clima atual e
   previsão, incluindo tipos, unidades, datas e campos opcionais.
3. **Fluxo de busca:** descrever entrada, resultados, seleção, cidade ambígua,
   nenhum resultado e nova busca.
4. **Máquina de estados da consulta:** definir vazio, carregando, sucesso, erro,
   dados parciais e retry, inclusive durante buscas concorrentes.
5. **Requisitos mensuráveis:** fixar navegadores, larguras de tela, WCAG,
   timeout, metas de performance e disponibilidade.
6. **Escopo do MVP:** marcar localização, offline, cache, alertas, favoritos,
   histórico, analytics e notificações como incluídos ou explicitamente fora.
7. **Critérios de aceite:** transformar cada requisito em cenários verificáveis
   com entrada, resultado esperado e tratamento de erro.
8. **Métricas de produto:** definir como serão avaliadas buscas concluídas,
   tempo até o resultado, sucesso na seleção da cidade e retorno dos usuários.

### Veredito

O discovery é suficiente para iniciar uma especificação preliminar, mas ainda
não é um contrato seguro para arquitetura ou implementação. Os bloqueadores
principais são o contrato de dados, o fluxo de busca, o tratamento de erros,
timezone e datas, a política de armazenamento local e os limites mensuráveis de
qualidade. Depois dessas decisões, a especificação pode derivar histórias de
usuário e critérios de aceite sem depender de suposições da equipe técnica.