
# docker-compose.yml                
## project structure
```                    
dotatryhard_discord/
    package-lock.json
    README.md
    Dockerfile
    Procfile
    index.js
    package.json
    yarn.lock
    docker-compose.yml                
```
## Sumário do Projeto: Bot Discord Dota 2

**Nome do Projeto:** bot

**Versão:** 1.0.0

**Gerência de Pacotes:** npm

**Dependências:** discord.js, dotenv, https, node-fetch (produção); nodemon (desenvolvimento)

**Versão Node.js:** >=16.6.0

**Versão npm:** >=7.0.0


## Propósito e Descrição do Projeto:

Bot Discord que busca dados de jogadores de Dota 2 em uma API externa. Responde a comandos com prefixo `!`. O comando `!help` lista os comandos disponíveis. `!account_id` ou `!nickName` busca um jogador por ID da conta ou apelido, exibindo suas estatísticas e links para suas partidas recentes e detalhes da taxa de vitórias. Se um jogador não for encontrado, fornece instruções para tornar os perfis Steam e Dota 2 públicos. Os dados são buscados periodicamente (a cada 7 horas) e armazenados em cache.  Utiliza Docker Compose para execução.


## Regras de Negócio:

O bot opera com base em comandos de entrada do usuário. Busca dados de uma API específica, respeitando quaisquer limites de taxa impostos por essa API. A precisão dos dados depende da confiabilidade da API externa e das configurações de privacidade do perfil Dota 2 do usuário. O bot deve lidar com erros potenciais de forma elegante, fornecendo mensagens informativas ao usuário em caso de problemas (por exemplo, jogador não encontrado, erros da API).


## Pipeline:

1. **Inicialização:** O bot se conecta ao Discord usando um token de variáveis de ambiente. Inicializa buscando dados da API externa.
2. **Busca Periódica de Dados:** Uma tarefa agendada recupera dados atualizados do jogador da API a cada 7 horas, atualizando os dados em cache.
3. **Tratamento de Comandos:** O bot escuta mensagens com o prefixo de comando especificado.
4. **Busca de Dados:** Com base no comando, o bot busca nos dados em cache um jogador usando seu ID de conta ou apelido (correspondência parcial sem diferenciação de maiúsculas e minúsculas).
5. **Geração de Resposta:** Se um jogador for encontrado, o bot exibe suas estatísticas e links relevantes. Se não encontrado, fornece instruções para tornar seu perfil público.
6. **Envio de Mensagem:** O bot envia a resposta formatada de volta ao canal do Discord.
7. **Tratamento de Erros:** O bot inclui tratamento de erros para casos em que os dados não estão disponíveis ou um jogador não é encontrado.  Utiliza Docker Compose para gerenciamento e execução.
                
                