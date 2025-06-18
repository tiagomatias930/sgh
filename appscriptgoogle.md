Vou explicar em português como usar o Google Apps Script fornecido para **criar**, **listar** e **editar** dados no banco de dados baseado em Google Sheets. A explicação será focada nos endpoints e funções relevantes, com exemplos práticos de requisições HTTP, incluindo detalhes sobre os parâmetros necessários e o formato das respostas. Também abordarei possíveis problemas e boas práticas, mantendo a explicação clara e concisa.

---

### **Visão Geral**
O script utiliza Google Sheets como um banco de dados, onde cada "banco" é uma planilha (Spreadsheet) e cada "coleção" é uma aba (Sheet) dentro da planilha. As operações de **criar** (inserir), **listar** (buscar) e **editar** (atualizar) dados são realizadas através de requisições HTTP POST para a URL do aplicativo web implantado.

As ações principais são:
- **Criar (inserir)**: Adiciona novos documentos a uma coleção (`insert`, `set`, `add`).
- **Listar (buscar)**: Recupera documentos de uma coleção com ou sem filtros (`find`, `findDocumentId`, `listColection`).
- **Editar (atualizar)**: Modifica documentos existentes em uma coleção (`update`, `atualizar`, `up`).

---

### **1. Criar (Inserir) Dados**
A inserção de dados é feita com a ação `insert` (ou aliases `set`, `add`). Isso adiciona um novo documento a uma coleção, criando automaticamente um `_id` único e um campo `createdAt` com a data de criação.

#### **Endpoint**
- **Método**: POST
- **URL**: `<URL_DO_APLICATIVO_WEB>`
- **Cabeçalhos**: `Content-Type: application/json`
- **Corpo** (JSON):
  ```json
  {
    "acao": "insert",
    "banco": "nome_do_banco",
    "colecao": "nome_da_colecao",
    "campo1": "valor1",
    "campo2": "valor2"
  }
  ```
  - `acao`: Deve ser `insert`, `set` ou `add`.
  - `banco`: Nome do banco de dados (nome da planilha).
  - `colecao`: Nome da coleção (nome da aba).
  - Outros campos (ex.: `campo1`, `campo2`): Dados do documento, que devem corresponder aos campos definidos ao criar a coleção.

#### **Funcionamento Interno**
- A função `insertDocument(dbName, collectionName, data)` é chamada.
- Gera um `_id` único com `Utilities.getUuid()` e adiciona `createdAt` com a data atual.
- Verifica se a coleção atingiu o limite de linhas (`MAX_ROWS_PER_SHARD = 10000`) usando `splitLastShardIfNeeded`. Se necessário, cria uma nova aba (ex.: `nome_da_colecao_2`).
- Adiciona o documento como uma nova linha na aba, mapeando os campos aos cabeçalhos definidos na criação da coleção.

#### **Exemplo de Requisição**
Inserir um documento na coleção `usuarios` no banco `meu_banco`:
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "acao": "insert",
  "banco": "meu_banco",
  "colecao": "usuarios",
  "nome": "João Silva",
  "idade": 30
}' <URL_DO_APLICATIVO_WEB>
```

#### **Resposta Esperada**
```json
{
  "_id": "123e4567-e89b-12d3-a456-426614174000",
  "createdAt": "2025-06-14T22:37:00.000Z",
  "nome": "João Silva",
  "idade": 30
}
```

#### **Pré-requisitos**
- O banco (`meu_banco`) deve existir (crie com `createDatabase`).
- A coleção (`usuarios`) deve existir com os campos `nome` e `idade` definidos (crie com `createCollection`).

#### **Possíveis Erros**
- **Erro**: `"Database 'meu_banco' não encontrado."` → Crie o banco primeiro com a ação `createDatabase`.
- **Erro**: `"Coleção 'usuarios' não existe."` → Crie a coleção com `createCollection`.
- **Solução**: Antes de inserir, use:
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"acao":"createDatabase","banco":"meu_banco"}' <URL_DO_APLICATIVO_WEB>
  curl -X POST -H "Content-Type: application/json" -d '{"acao":"createCollection","banco":"meu_banco","colecao":"usuarios","campos":["nome","idade"]}' <URL_DO_APLICATIVO_WEB>
  ```

---

### **2. Listar (Buscar) Dados**
A listagem de dados pode ser feita de três maneiras:
- **Listar coleções** (`listColection`): Retorna os nomes das coleções em um banco.
- **Buscar documentos com filtros** (`find`): Recupera documentos de uma coleção com filtros opcionais, ordenação e limite.
- **Buscar documento por ID** (`findDocumentId`): Recupera um documento específico por seu `_id`.

#### **2.1. Listar Coleções**
- **Ação**: `listColection`, `listC`, `listc`, `getCs`
- **Corpo**:
  ```json
  {
    "acao": "listColection",
    "banco": "nome_do_banco"
  }
  ```
- **Resposta**: Lista de nomes de coleções (ex.: `["usuarios", "produtos"]`).

#### **Exemplo**
Listar coleções no banco `meu_banco`:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"acao":"listColection","banco":"meu_banco"}' <URL_DO_APLICATIVO_WEB>
```

#### **Resposta**
```json
["usuarios", "produtos"]
```

#### **2.2. Buscar Documentos com Filtros**
- **Ação**: `find`, `findc`, `findcc`, `findColection`
- **Corpo**:
  ```json
  {
    "acao": "find",
    "banco": "nome_do_banco",
    "colecao": "nome_da_colecao",
    "filter": { "campo": "valor" },
    "options": {
      "sort": { "campo": 1 },
      "limit": 10,
      "skip": 0,
      "projection": { "campo1": 1 }
    }
  }
  ```
  - `filter`: Condições para filtrar (ex.: `{"idade": 30}` ou `{"idade": {"$gt": 25}}` para maior que 25).
  - `options`:
    - `sort`: Ordena por um campo (`1` para ascendente, `-1` para descendente).
    - `limit`: Limita o número de resultados.
    - `skip`: Pula um número de resultados.
    - `projection`: Inclui apenas campos especificados (ex.: `{"nome": 1}`).

#### **Funcionamento Interno**
- Usa `findAdvanced(dbName, collectionName, filter, options)`:
  - Busca documentos em todas as abas da coleção (`nome_da_colecao_1`, `nome_da_colecao_2`, etc.).
  - Aplica filtros com `matches(doc, filter)`, suportando `$gt`, `$lt`, `$in`.
  - Aplica ordenação, limite e projeção conforme especificado.

#### **Exemplo**
Buscar usuários com idade maior que 25, ordenados por nome:
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "acao": "find",
  "banco": "meu_banco",
  "colecao": "usuarios",
  "filter": { "idade": { "$gt": 25 } },
  "options": { "sort": { "nome": 1 }, "limit": 5 }
}' <URL_DO_APLICATIVO_WEB>
```

#### **Resposta**
```json
[
  {
    "_id": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2025-06-14T22:37:00.000Z",
    "nome": "João Silva",
    "idade": 30
  },
  {
    "_id": "456e7890-e89b-12d3-a456-426614174001",
    "createdAt": "2025-06-14T22:38:00.000Z",
    "nome": "Maria Oliveira",
    "idade": 28
  }
]
```

#### **2.3. Buscar Documento por ID**
- **Ação**: `findDocumentId`, `findd`, `getD`
- **Corpo**:
  ```json
  {
    "acao": "findDocumentId",
    "banco": "nome_do_banco",
    "colecao": "nome_da_colecao",
    "id": "<ID_DO_DOCUMENTO>"
  }
  ```

#### **Exemplo**
Buscar um usuário por ID:
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "acao": "findDocumentId",
  "banco": "meu_banco",
  "colecao": "usuarios",
  "id": "123e4567-e89b-12d3-a456-426614174000"
}' <URL_DO_APLICATIVO_WEB>
```

#### **Resposta**
```json
{
  "_id": "123e4567-e89b-12d3-a456-426614174000",
  "createdAt": "2025-06-14T22:37:00.000Z",
  "nome": "João Silva",
  "idade": 30
}
```

#### **Possíveis Erros**
- **Erro**: `"Parâmetros obrigatórios: db, colecao"` → Verifique se `banco` e `colecao` estão no corpo da requisição.
- **Erro**: `"Database 'nome_do_banco' não encontrado."` → Crie o banco primeiro.

---

### **3. Editar (Atualizar) Dados**
A atualização de dados é feita com a ação `update` (ou aliases `atualizar`, `up`). Atualiza um documento específico com base em seu `_id`.

#### **Endpoint**
- **Método**: POST
- **URL**: `<URL_DO_APLICATIVO_WEB>`
- **Cabeçalhos**: `Content-Type: application/json`
- **Corpo**:
  ```json
  {
    "acao": "update",
    "banco": "nome_do_banco",
    "colecao": "nome_da_colecao",
    "id": "<ID_DO_DOCUMENTO>",
    "campo1": "novo_valor1",
    "campo2": "novo_valor2"
  }
  ```

#### **Funcionamento Interno**
- Usa `updateDocument(dbName, collectionName, id, updates)`:
  - Localiza o documento com o `_id` especificado em todas as abas da coleção.
  - Atualiza apenas os campos fornecidos em `updates` que existem nos cabeçalhos da coleção.
  - Retorna o documento atualizado ou `null` se não encontrado.

#### **Exemplo**
Atualizar a idade de um usuário:
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "acao": "update",
  "banco": "meu_banco",
  "colecao": "usuarios",
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "idade": 31
}' <URL_DO_APLICATIVO_WEB>
```

#### **Resposta**
```json
{
  "_id": "123e4567-e89b-12d3-a456-426614174000",
  "createdAt": "2025-06-14T22:37:00.000Z",
  "nome": "João Silva",
  "idade": 31
}
```

#### **Possíveis Erros**
- **Erro**: `"Parâmetro obrigatório para update: id"` → Inclua o campo `id` no corpo.
- **Erro**: Documento não encontrado → Verifique se o `_id` está correto.

---

### **Boas Práticas**
1. **Validação de Dados**:
   - Antes de inserir ou atualizar, verifique se os campos correspondВП

System: correspondem aos cabeçalhos da coleção.
2. **Otimização de Desempenho**:
   - Para coleções grandes, considere usar a função de indexação (`buildIndex`) para acelerar buscas por ID.
   - Evite muitas requisições simultâneas devido aos limites do Google Apps Script (ex.: 6 minutos de execução).
3. **Segurança**:
   - Restrinja o acesso ao aplicativo web para evitar uso não autorizado.
   - Valide os dados de entrada no cliente para evitar erros.
4. **Backup**:
   - Faça backup regular das planilhas para evitar perda de dados.

### **Exemplo Completo de Fluxo**
1. Criar banco e coleção:
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"acao":"createDatabase","banco":"meu_banco"}' <URL_DO_APLICATIVO_WEB>
   curl -X POST -H "Content-Type: application/json" -d '{"acao":"createCollection","banco":"meu_banco","colecao":"usuarios","campos":["nome","idade"]}' <URL_DO_APLICATIVO_WEB>
   ```
2. Inserir um documento:
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"acao":"insert","banco":"meu_banco","colecao":"usuarios","nome":"João Silva","idade":30}' <URL_DO_APLICATIVO_WEB>
   ```
3. Listar documentos:
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"acao":"find","banco":"meu_banco","colecao":"usuarios"}' <URL_DO_APLICATIVO_WEB>
   ```
4. Atualizar um documento:
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"acao":"update","banco":"meu_banco","colecao":"usuarios","id":"123e4567-e89b-12d3-a456-426614174000","idade":31}' <URL_DO_APLICATIVO_WEB>
   ```

### **Problemas Conhecidos**
- **Limite de Linhas**: Coleções são divididas em novas abas quando atingem 10.000 linhas, mas operações em coleções muito grandes podem ser lentas.
- **Campos Não Declarados**: Se tentar inserir/atualizar campos que não estão nos cabeçalhos da coleção, eles serão ignorados.
- **Erros de Pasta**: Certifique-se de corrigir o uso de `DriveApp.getFoldersByName("DATA_PRIVATE_AXYHS").next()` nas funções de upload, conforme mencionado anteriormente.

Se precisar de mais exemplos, explicações sobre outras funções (ex.: `groupBy`, `importJsonToCollection`) ou ajuda com testes, é só avisar!