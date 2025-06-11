# Stuff Repositório

Este repositório contém o código-fonte do frontend web do sistema Stuff, desenvolvido com Next.js e TypeScript. O objetivo do projeto é oferecer uma interface moderna, responsiva e eficiente para gerenciamento de Ativos, integrando-se a uma API backend.

O uso do TypeScript garante maior segurança, produtividade e facilidade de manutenção no desenvolvimento, enquanto o Next.js proporciona renderização otimizada, roteamento automático e excelente performance. O projeto também utiliza Axios para requisições HTTP e está preparado para receber Tailwind CSS para estilização.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (recomendado: versão 18 ou superior)
- [npm](https://www.npmjs.com/)

## Instalação

Clone o repositório e instale as dependências:

```sh
git clone https://github.com/seu-usuario/stuff-front-web.git
cd stuff-front-web
npm install
```

## Configuração de variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis (exemplo):

```env
NEXT_PUBLIC_STUFF_API= x
NEXT_PUBLIC_ADMIN_EMAIL= x
NEXT_PUBLIC_ADMIN_PASSWORD= x
```

## Rodando o projeto em modo desenvolvimento

```sh
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Build para produção

```sh
npm run build
npm start
```

## Scripts disponíveis

- `dev`: Inicia o servidor de desenvolvimento
- `build`: Gera o build de produção
- `start`: Inicia o servidor em modo produção
- `lint`: Executa o linter

## Tecnologias

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [Axios](https://axios-http.com/)
- [Tailwind CSS](https://tailwindcss.com/) (A ser implementado)

---