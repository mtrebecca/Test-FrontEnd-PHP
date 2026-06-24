# Design Plan — Pessoa e Envolvimento

## Entendimento do PRD

O sistema atual já gerencia **Empresas** e **Relatos**, mas falta uma peça essencial para a operação de investigação: saber **quem** está envolvido em cada relato.

O PRD propõe dois conceitos complementares:

1. **Pessoa** — cadastro central reutilizável de indivíduos, independente de empresa.
2. **Envolvimento** — vínculo entre uma pessoa e um relato, com um tipo que define o papel (relatante, testemunha, vítima ou denunciado).

O usuário principal é o **membro de comitê**, responsável por registrar e investigar relatos.

---

## Épico 1: Pessoa

### O que será construído

- Uma nova página **"Pessoas"** acessível pelo menu lateral.
- Tabela listando todas as pessoas cadastradas (nome, CPF, e-mail, data de nascimento).
- Modal de **cadastro** com os 4 campos obrigatórios.
- Modal de **edição** para atualizar dados de uma pessoa existente.
- Ação de **exclusão** com confirmação.

### Decisões

| Decisão | Justificativa |
|---------|---------------|
| Seguir a mesma estrutura de pastas e padrões do domínio `company` | Manter consistência no projeto facilita manutenção e revisão |
| CPF exibido com máscara (XXX.XXX.XXX-XX) na tabela | Melhora legibilidade para o usuário |
| CPF enviado apenas como 11 dígitos numéricos para a API | Contrato da API exige apenas dígitos |
| Data de nascimento com DatePicker do Ant Design | Evita erros de formato e melhora UX |
| Tratamento de erro 409 (CPF duplicado) com mensagem amigável | PRD exige unicidade de CPF como regra de negócio |

### Regras de negócio

- Todos os campos são obrigatórios (nome, CPF, email, data de nascimento).
- CPF deve ter exatamente 11 dígitos numéricos.
- CPF é único no sistema — duplicata retorna erro 409.
- Pessoas pertencem ao sistema, não a uma empresa específica.

---

## Épico 2: Envolvimento

### O que será construído

- Na tela de **Relatos**, um botão/ação para gerenciar os **envolvidos** de cada relato.
- Modal ou painel mostrando a lista de envolvidos com nome, CPF e tipo.
- Formulário para adicionar envolvimento: select de pessoa + select de tipo.
- Ação para remover um envolvimento.
- Indicador visual de **"Anônimo"** na tabela de relatos quando não há relatante (`is_anonymous = true`).

### Decisões

| Decisão | Justificativa |
|---------|---------------|
| Gerenciamento de envolvidos via modal acessado pela tabela de relatos | Mantém o fluxo centrado no relato, que é o contexto de uso do membro de comitê |
| Select de pessoa carregado dinamicamente da API `/people` | Permite reutilizar o cadastro de pessoas existente |
| Tag colorida para indicar tipo de envolvimento | Facilita identificação visual rápida |
| Badge/Tag "Anônimo" na coluna de status do relato | PRD exige que a distinção anônimo/identificado seja clara sem inspecionar envolvidos |

### Tipos de envolvimento

| Tipo | Label exibido | Descrição |
|------|---------------|-----------|
| `whistleblower` | Relatante | Quem fez o relato |
| `witness` | Testemunha | Quem presenciou |
| `victim` | Vítima | Quem foi afetado |
| `denounced` | Denunciado | Quem é acusado |

### Regras de negócio

- Uma pessoa pode aparecer apenas uma vez por relato (duplicata retorna 409).
- Um relato sem nenhum envolvido do tipo `whistleblower` é considerado **anônimo**.
- O campo `is_anonymous` é calculado pelo backend, não pelo frontend.
- `record_id` e `person_id` inválidos retornam 404.

---

## Riscos identificados

| Risco | Mitigação |
|-------|-----------|
| Backend não pode ser alterado — qualquer limitação da API é definitiva | Consultar `API.md` e testar rotas via Insomnia antes de implementar |
| Volume de pessoas pode crescer — select pode ficar lento | Para o escopo atual é aceitável; futuramente poderia usar busca com debounce |
| Usuário pode tentar vincular pessoa inexistente | Frontend carrega apenas pessoas existentes no select, minimizando o risco |
| CPF inválido (menos ou mais de 11 dígitos) | Validação no formulário antes de enviar à API |

---

## Tecnologias utilizadas

Toda a implementação segue o stack já existente no `client/`:

- **React 19** com componentes funcionais
- **TypeScript 5** para tipagem
- **Ant Design 5** para componentes de UI
- **React Router 7** para navegação
- **Day.js** para manipulação de datas
- **Vite** como bundler
