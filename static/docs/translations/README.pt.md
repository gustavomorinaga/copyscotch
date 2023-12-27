# Motor de Busca Semelhante ao Google

🔍 Implementação simples de um motor de busca semelhante ao Google utilizando [TypeScript](https://www.typescriptlang.org/) e [SvelteKit](https://kit.svelte.dev/).

<p align="left">
  <a href="/LICENSE" title="Exibir a Licença MIT">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="Licença MIT">
  </a>
  <a href="https://kit.svelte.dev" title="Abrir o Site do SvelteKit">
    <img src="https://img.shields.io/badge/SvelteKit-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00" alt="Feito com SvelteKit" />
  </a>
  <a href="https://www.typescriptlang.org/docs" title="Abrir o Site do TypeScript">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="Feito com TypeScript" />
  </a>
  <a href="https://tailwindcss.com" title="Abrir o Site do Tailwind">
    <img src="https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Feito com Tailwind" />
  </a>
</p>

## 🌎 Traduções

<kbd>[<img title="English" alt="English" src="https://flagicons.lipis.dev/flags/4x3/us.svg" width="22">](/static/docs/translations/README.en.md)</kbd>
<kbd>[<img title="Português Brasileiro" alt="Português Brasileiro" src="https://flagicons.lipis.dev/flags/4x3/br.svg" width="22">](/static/docs/translations/README.pt.md)</kbd>

## Introdução

Este projeto é um motor de busca simples que imita o motor de busca do Google.

O motor de busca do Google é um sistema muito complexo, mas eu tentei torná-lo o mais simples possível. O aplicativo é baseado em um arquivo JSON que contém os dados de artigos simples que são exibidos na página. O motor de busca deve ser capaz de pesquisar artigos por título, descrição e conteúdo.

Casos que o motor de busca deve ser capaz de lidar:

- Pesquisar artigos por título, descrição e conteúdo.
- Usar operadores de pesquisa para filtrar os resultados por:
  - frase exata (por exemplo, "hello world")
  - qualquer uma das palavras (por exemplo, hello world)
  - incluir palavras-chave (por exemplo, +hello +world)
  - excluir palavras-chave (por exemplo, -hello -world)
- Registrar o número de resultados encontrados.
- Registrar o tempo que levou para realizar a pesquisa.

## Pilha Tecnológica

| Ferramenta/Serviço                                | Categoria                         | Descrição                                                                                                           |
| ------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [Vite](https://vitejs.dev/)                       | Ferramentas de Compilação         | Uma ferramenta de compilação que oferece uma experiência de desenvolvimento mais rápida para projetos web modernos. |
| [CSSNANO](https://cssnano.co/)                    | CSS                               | Um minificador modular, construído em cima do ecossistema PostCSS.                                                  |
| [PostCSS](https://postcss.org)                    | CSS                               | Uma ferramenta para transformar CSS com JavaScript.                                                                 |
| [Tailwind CSS](https://tailwindcss.com/)          | CSS                               | Um framework CSS de utilidade em primeiro lugar.                                                                    |
| [ESLint](https://eslint.org/)                     | Ferramentas JavaScript/TypeScript | Uma ferramenta para identificar e relatar padrões no código ECMAScript/JavaScript.                                  |
| [Prettier](https://prettier.io/)                  | Ferramentas JavaScript/TypeScript | Um formatador de código com opiniões.                                                                               |
| [TypeScript](https://www.typescriptlang.org/)     | Ferramentas JavaScript/TypeScript | Um conjunto tipado de JavaScript que compila para JavaScript simples.                                               |
| [shadcn-svelte](https://www.shadcn-svelte.com/)   | Componentes UI                    | Componentes acessíveis e personalizáveis que você pode copiar e colar em seus aplicativos.                          |
| [TanStack Virtual](https://tanstack.com/virtual/) | UI Components                     | Headless UI para Virtualizar Grandes Listas de Elementos                                                            |
| [SvelteKit](https://kit.svelte.dev/)              | Frameworks Web                    | Um framework para construir aplicativos web de alta performance.                                                    |

## 📜 Licença

Este projeto está licenciado sob a **Licença MIT** - consulte a página [LICENSE](/LICENSE) para mais detalhes.

<p align="center">
 ❤️ Obrigado pela sua atenção!
</p>
