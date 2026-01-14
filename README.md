# Tarefa Maikon 13 - InversifyJS

Este projeto contém o código-fonte da tarefa "Tarefa Maikon 13". O objetivo desta tarefa é implementar um serviço HTTP Node.js + TypeScript usando InversifyJS para praticar o Princípio de Inversão de Dependência (DIP) e Inversão de Controle (IoC).

## Estrutura do Projeto

O projeto está estruturado da seguinte forma:

- `src/domain`: Contém a lógica de negócio principal da aplicação.
  - `report-service.ts`: O serviço de relatório que contém a lógica de negócio.
  - `logger.ts`: A interface do logger.
  - `mailer.ts`: A interface do mailer.
- `src/infra`: Contém as implementações de infraestrutura.
    - `logger/winston.ts`: A implementação do logger com Winston.
    - `mailer/nodemailer.ts`: A implementação do mailer com Nodemailer.
- `src/adapters/http`: Contém os adaptadores HTTP para a aplicação.
  - `report-http-adapter.ts`: O adaptador HTTP para o serviço de relatório.
- `src/main.ts`: O arquivo principal para rodar a aplicação.
- `src/container.ts`: A configuração do container InversifyJS.
- `src/types.ts`: Os tipos do InversifyJS.
- `.env`: As variáveis de ambiente.
- `package.json`: As dependências do projeto.
- `tsconfig.json`: A configuração do TypeScript.

## Como rodar a aplicação

1. Instale as dependências:
   ```
   npm install
   ```
2. Rode a aplicação em modo de desenvolvimento:
   ```
   npm run dev
   ```
3. Rode a aplicação em modo de produção:
    ```
    npm start
    ```

Você pode acessar a aplicação em `http://localhost:3000/relatorio?email=seu_email@dominio.com&n=5`.

## Como rodar os testes

Para rodar todos os testes, execute:
```
npm test
```

Para rodar um teste específico, execute:
```
npm test -- <caminho_para_o_arquivo_de_teste>
```