# Visão Geral do Projeto

Esta é uma extensão do Chrome desenvolvida para auxiliar desenvolvedores e testadores, fornecendo uma ferramenta rápida para gerar números de CPF e CNPJ brasileiros válidos. Inclui também um bloco de notas com salvamento automático e uma interface moderna com temas claro e escuro.

# Arquitetura de Componentes

A aplicação foi refatorada para uma arquitetura baseada em componentes para maior clareza, manutenibilidade e reutilização de código.

*   **Componentes de UI (`src/components/ui`):** Pequenos componentes reutilizáveis que formam a base da interface, como botões, abas e outros elementos visuais.
*   **Componentes de Ícones (`src/components/icons`):** Componentes dedicados para cada ícone SVG, permitindo fácil reutilização e estilização.
*   **Componentes de Funcionalidades (`src/components/features`):** Componentes maiores que encapsulam uma funcionalidade específica, como o gerador de documentos, o bloco de notas e o seletor de tema.

# Design da Interface (Revisão)

*   **Estilo Sofisticado:** A interface foi redesenhada com um visual moderno e minimalista, utilizando um esquema de cores suaves, tipografia clara e ícones intuitivos para melhorar a experiência do usuário.
*   **Temas:** Suporte completo para temas claro e escuro, com a capacidade de o usuário alternar manualmente ou sincronizar com as preferências do sistema operacional.
*   **Layout:** A estrutura principal é organizada em abas para separar claramente a funcionalidade de geração de documentos do bloco de notas.

# Plano de Implementação

1.  **Estrutura do Projeto:**
    *   Criar as pastas `src/components/ui`, `src/components/icons`, `src/components/features` e `src/composables`.
    *   Remover o componente `HelloWorld.vue`.

2.  **Manifesto e Permissões:**
    *   Atualizar o `public/manifest.json` para incluir a permissão `storage` para persistência de dados.

3.  **Estilização e Tema:**
    *   Atualizar o `src/style.css` com variáveis para os temas claro e escuro.
    *   Criar um composable `useTheme.ts` para gerenciar a lógica de troca de tema.
    *   Desenvolver o componente `ThemeToggle.vue` para a interface do usuário.

4.  **Funcionalidade Principal:**
    *   **Gerador de Documentos:**
        *   Criar `src/utils/documentUtils.ts` com a lógica para gerar CPFs e CNPJs válidos.
        *   Desenvolver o componente `Generator.vue` para exibir os documentos gerados.
    *   **Bloco de Notas:**
        *   Criar um composable `useStorage.ts` para abstrair a API `chrome.storage`.
        *   Desenvolver o componente `Notepad.vue` com uma área de texto que salva o conteúdo automaticamente.

5.  **Componente Principal (`App.vue`):**
    *   Integrar os componentes de funcionalidades (`Generator`, `Notepad`, `ThemeToggle`) em um layout com abas.
    *   Utilizar os componentes de UI para criar a estrutura das abas.

# Histórico de Alterações

*   Adicionado um título "Tema" à seção de configuração de tema na aba "Configurações".
*   Definido o tamanho padrão da janela da extensão para `350px` de largura e `500px` de altura para uma melhor experiência de usuário.
*   Refatorado o componente `Generator.vue` para separar os geradores de CPF e CNPJ em duas seções distintas, com títulos individuais e listados verticalmente.
