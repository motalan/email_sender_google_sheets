# Disparador de E-mails com Anexos via Google Sheets

![Plataforma](https://img.shields.io/badge/plataforma-Google%20Apps%20Script-orange.svg)

Este projeto é uma solução de automação criada com **Google Apps Script** para enviar e-mails personalizados em massa a partir de uma planilha do Google Sheets. A principal funcionalidade é a capacidade de anexar arquivos específicos do Google Drive para cada destinatário, buscando-os pelo nome em uma pasta designada.

## 🚀 Problema que Resolve

Enviar comunicados, holerites, relatórios ou qualquer tipo de documento personalizado para uma longa lista de contatos é uma tarefa demorada e suscetível a erros. Esta ferramenta centraliza todo o processo em uma única planilha do Google Sheets, automatizando a busca de arquivos no Drive e o envio dos e-mails, com rastreamento de status para evitar envios duplicados.

## ✨ Funcionalidades Principais

* **Menu Personalizado:** Adiciona um menu "Disparador de E-mails" diretamente na interface do Google Sheets para fácil acesso.
* **Fluxo de Trabalho em 2 Passos:** Separa a busca dos arquivos do envio dos e-mails, permitindo uma verificação segura antes do disparo.
* **Busca Dinâmica de Anexos:** Encontra arquivos em uma pasta específica do Google Drive com base no nome do arquivo informado na planilha.
* **Interface Simples:** Utiliza uma caixa de diálogo para que o usuário possa facilmente informar a pasta do Drive a ser utilizada.
* **Rastreamento de Status:** Atualiza a planilha com o status do envio (`E-mail enviado`, `Anexo não encontrado`, etc.) para garantir controle e evitar duplicidade.
* **Personalização de Mensagens:** Permite o uso de placeholders (ex: `{{nome}}`) no corpo do e-mail para uma comunicação mais pessoal.

## ⚙️ Como Funciona (O Fluxo de Trabalho)

O script opera em um processo de duas etapas para garantir segurança e precisão:

1.  **Etapa 1: Buscar Links dos Arquivos**
    * O usuário aciona o Menu 1.
    * Uma janela pop-up solicita a URL da pasta do Google Drive onde os anexos estão armazenados.
    * O script varre a coluna "Nome do Arquivo" da planilha, procura cada arquivo na pasta informada e preenche a coluna "Link do Anexo" com a URL do arquivo correspondente. Caso não encontre, ele informa na célula.

2.  **Etapa 2: Enviar E-mails**
    * Após verificar que os links foram encontrados corretamente, o usuário aciona o Menu 2.
    * O script percorre a planilha, lê as informações de cada linha (destinatário, assunto, mensagem).
    * Ele utiliza o link na coluna "Link do Anexo" para anexar o arquivo correto.
    * Envia o e-mail e, por fim, atualiza a coluna "Status do Envio".

## 🛠️ Instalação e Configuração

Siga os passos abaixo para implementar esta automação na sua própria planilha.

### 1. Preparação da Planilha
Crie uma nova planilha no Google Sheets e nomeie a primeira aba como `Página1` (ou ajuste o nome no código). A planilha deve ter as seguintes 7 colunas, exatamente nesta ordem:

| Coluna A | Coluna B | Coluna C | Coluna D | Coluna E | Coluna F | Coluna G |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Nome** | **E-mail** | **Assunto** | **Mensagem** | **Nome do Arquivo** | **Link do Anexo** | **Status do Envio**|

* **Nome do Arquivo:** Preencha com o nome completo do arquivo, incluindo a extensão (ex: `relatorio_joao.pdf`).
* **Link do Anexo** e **Status do Envio:** Deixe em branco. O script preencherá estas colunas.

### 2. Instalação do Script
1.  Com a planilha aberta, vá em **Extensões > Apps Script**.
2.  No editor que se abrir, apague o conteúdo do arquivo `Code.gs` e cole o código do [arquivo `Code.gs`](/Code.gs) deste repositório.
3.  Clique no ícone **+** ao lado de "Arquivos" e selecione **HTML**. Dê o nome de `SeletorDePasta` para o novo arquivo.
4.  Apague o conteúdo padrão e cole o código do [arquivo `SeletorDePasta.html`](/SeletorDePasta.html) deste repositório.
5.  Clique no ícone de **Salvar projeto** (disquete).

### 3. Autorização
1.  Volte para a sua planilha e **recarregue a página**. Um novo menu chamado "Disparador de E-mails" deverá aparecer.
2.  Na primeira vez que você usar uma das opções do menu, o Google solicitará permissão para que o script acesse sua planilha, seu Google Drive e envie e-mails em seu nome. Siga os passos para autorizar.
    * *Pode ser necessário clicar em "Avançado" e "Acessar projeto (não seguro)", o que é um procedimento padrão para scripts pessoais.*

## 🚀 Modo de Uso

1.  Preencha as colunas **Nome, E-mail, Assunto, Mensagem** e **Nome do Arquivo** com os dados desejados.
2.  Clique em **Disparador de E-mails > 1. Buscar Links dos Arquivos**.
3.  Cole a URL da pasta do Google Drive onde seus arquivos estão e clique em "Buscar Links".
4.  Verifique a coluna **Link do Anexo** para confirmar que os arquivos foram encontrados.
5.  Quando estiver tudo certo, clique em **Disparador de E-mails > 2. Enviar E-mails Pendentes**.
6.  Aguarde a execução. A coluna **Status do Envio** será atualizada informando o resultado de cada linha.

## 📂 Estrutura dos Arquivos

* `Code.gs`: Contém toda a lógica do lado do servidor (back-end), incluindo as funções para criar o menu, interagir com a planilha, buscar arquivos no Drive e enviar e-mails via Gmail.
* `SeletorDePasta.html`: Contém a estrutura da caixa de diálogo (front-end) que solicita a URL da pasta ao usuário.
