# To-Do List

O projeto é uma aplicação de gerenciamento de tarefas. Uma 'To-Do List' que permite o usuário adicionar tarefas e gerenciá-las, isso é, editá-las, apagá-las e controlá-las.

A aplicação permite o cadastro e autenticação de usuários. Cada usuário pode gerenciar somente as suas próprias tarefas.

Cada tarefa consiste de:

- Título:
  - Obrigatório.
  - Deve ter entre 3 e 100 caracteres.
- Descrição:
  - Opcional.
- Data de vencimento:
  - Obrigatório.
  - Válida e no futuro.
- Status (pendente/concluída):
  - Obrigatório.
  - Deve ser atualizada para concluída apenas se data atual estiver dentro do prazo.

# Como rodar localmente

Para rodar o projeto localmente, é necessário clonar o repositório. Para tanto, é necessário possuir o Git instalado. Também é preciso possuir o Node instalado.

1 - Abra o terminal e navegue até a pasta desejada para clonar o repositório, depois, insira esse comando no terminal:

```md
    git clone https://github.com/eduardo-evaristo/teste.athenas.git
```

2 - Após isso, deverá haver dentro da pasta selecionada, os mesmos arquivos do repositório. Dentro da mesma pasta, agora é necessário navegar até a pasta 'react' e à pasta 'express' e no terminal, inserir o comando:

```md
    npm install
```

Note que esse comando deve ser inserido em ambas as pastas.

3 - Dentro da pasta express, no terminal insira o comando:

```md
    node app.js
```

O arquivo de variáveis de ambiente não está disponível no repositório. Caso queira testar a aplicação usando minha própria instância do PostgreSQL do Supabase e chave do JSON Web Token, crie um arquivo chamado config.env na raíz da pasta express e insira o seguinte nele.

```md
# Dados do PostgreSQL

PGPASSWORD="nBwX0v4QICAUpVqY"
PGHOST="aws-0-sa-east-1.pooler.supabase.com"
PGPORT=6543
PGDATABASE="postgres"
PGUSER="postgres.rlfoenslpnqxbmamczij"

# Chave privada do JWT

JWT_PRIVATE_KEY=ef5074e83fe83e64108de28179333bfbee4ba5a8032281b1147bd26d555114a1dc99f488a7d6022eb73c0af1b81f98eafd358ddef63f2c589a72a9ee1c4c2569
```

No entanto, caso queira utilizar sua própria instância, apenas substitua as informações e crie as tabelas abaixo. O banco de dados do Supabase possui SSL desativado por padrão.

```md
CREATE TABLE IF NOT EXISTS usuarios (
id SERIAL PRIMARY KEY,
username VARCHAR UNIQUE NOT NULL,
password VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS tarefas (
id SERIAL PRIMARY KEY,
titulo VARCHAR(100) NOT NULL,
descricao VARCHAR,
dt_vencimento VARCHAR NOT NULL,
situacao VARCHAR NOT NULL,
id_usuario INT REFERENCES usuarios(id)
);
```

4 - E na pasta react, insira no terminal:

```md
    npm run dev
```

Agora tanto a aplicação React quando a aplicação Node deverão estar rodando, note que uma URL será mostrada após o comando `npm run dev`, lá é onde está a aplicação React.
Agora é só usar a aplicação. Note que para adicionar tarefas é necessário ter se cadastrado e feito login antes.

A API espera por uma requisição vinda de `localhost:5173`, portanto, pode ser necessário mudar isso no arquivo `app.js` no middleware relativo ao cors.

# Stack Utilizada

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,nodejs,express,supabase,postgres,bootstrap" />
  </a>
</p>

<p align="center">
    Foi utilizado React e Bootstrap no front-end da aplicação. No back-end, para a construção da API: Nodejs, Express e uma instância do PostgreSQL no Supabase para o banco de dados.
</a>

- Front end

  - [React](https://reactjs.org/)
  - [Bootstrap](https://getbootstrap.com/)

- Back end

  - [Node.js](https://nodejs.org/)
  - [Express](https://expressjs.com/)
  - [PostgreSQL (Supabase)](https://supabase.com/)
