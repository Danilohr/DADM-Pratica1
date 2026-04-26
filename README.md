# SmartMarket - Aplicativo de Lista de Compras

Você foi contratado para desenvolver um aplicativo móvel de lista de supermercado chamado **SmartMarket**, utilizando **React Native** e **Firebase Firestore** como banco de dados em nuvem.

## Objetivo

O aplicativo deve:

- ter uma tela de login via e-mail e senha com autenticação via **Firebase Authentication**;
- permitir recuperação de senha por e-mail;
- permitir que o usuário registre os produtos que pretende comprar com seus respectivos valores;
- calcular automaticamente o valor total a pagar;
- armazenar as listas no **Firebase Firestore**.

## Gerenciamento da Lista de Compras

O usuário pode:

- criar produtos;
- editar produtos;
- excluir produtos.

Cada produto deve conter os seguintes campos:

- `nomeProduto` (`string`, obrigatório)
- `quantidade` (`number`, obrigatório)
- `precoUnitario` (`number`, obrigatório)
- `dataAdicao` (`timestamp`, gerado automaticamente)

## Cálculo Automático

O aplicativo deve calcular automaticamente:

- valor total de cada produto: `quantidade × precoUnitario`;
- valor total da lista: soma de todos os produtos.

O total deve ser exibido em tempo real conforme o usuário adiciona ou altera produtos.

## Interface

Telas obrigatórias:

- tela de login;
- tela de recuperação de senha;
- tela de produtos da lista selecionada;
- exibição dinâmica do total geral da lista.

## Desafio Extra (Opcional)

- Permitir que o usuário marque produtos como comprados, diferenciando visualmente os itens já adquiridos.
- Gerar um resumo da compra com a quantidade total de produtos e o gasto total.

## Material de Apoio

- [Autenticação do Firebase Auth](https://www.notion.so/9-Persist-ncia-e-Autentica-o-com-Firebase-no-React-Native-2b3fecaedbb480ea80f9e5982d137f98)
- [To-do List com Firebase](https://www.notion.so/10-React-Native-To-Do-List-com-Firebase-294fecaedbb48092be20f802d4cc27f4)