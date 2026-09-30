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