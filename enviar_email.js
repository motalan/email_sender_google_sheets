/**
 * @OnlyCurrentDoc
 */

// --- FUNÇÃO DE MENU ---
// Cria os dois menus personalizados na planilha ao abri-la
function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('Disparador de E-mails')
      .addItem('1. Buscar Links dos Arquivos', 'abrirSeletorDePasta_BuscarLinks')
      .addSeparator() // Adiciona uma linha divisória no menu
      .addItem('2. Enviar E-mails Pendentes', 'enviarEmails')
      .addToUi();
}


// --- LÓGICA DO MENU 1: BUSCAR LINKS ---

// Abre a caixa de diálogo para o usuário inserir a URL da pasta
function abrirSeletorDePasta_BuscarLinks() {
  const html = HtmlService.createHtmlOutputFromFile('SeletorDePasta')
      .setWidth(400)
      .setHeight(250);
  SpreadsheetApp.getUi().showModalDialog(html, 'Selecione a Pasta de Anexos');
}

// Processa a busca dos arquivos na pasta e preenche a coluna "Link do Anexo"
function processarBuscaDeLinks(urlDaPasta) {
  try {
    const idDaPasta = extrairIdDaUrl(urlDaPasta);
    if (!idDaPasta) {
      throw new Error("URL da pasta inválida. Verifique o link e tente novamente.");
    }

    const pastaDosAnexos = DriveApp.getFolderById(idDaPasta);
    const planilha = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Página1"); // Mude o nome da aba se necessário
    const range = planilha.getRange(2, 1, planilha.getLastRow() - 1, 7); // Pega todas as 7 colunas
    const dados = range.getValues();

    dados.forEach(function(linha, indice) {
      const nomeDoArquivo = linha[4]; // Coluna E
      
      if (nomeDoArquivo) { // Só executa se houver um nome de arquivo
        const arquivos = pastaDosAnexos.getFilesByName(nomeDoArquivo);
        
        if (arquivos.hasNext()) {
          const arquivoEncontrado = arquivos.next();
          const linkDoArquivo = arquivoEncontrado.getUrl();
          planilha.getRange(indice + 2, 6).setValue(linkDoArquivo); // Coloca o link na Coluna F
        } else {
          planilha.getRange(indice + 2, 6).setValue("Arquivo não encontrado");
        }
      }
    });

    SpreadsheetApp.getUi().alert('Busca Concluída!', 'A coluna "Link do Anexo" foi atualizada.', SpreadsheetApp.getUi().ButtonSet.OK);

  } catch (e) {
    SpreadsheetApp.getUi().alert('Falha na Busca', e.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}


// --- LÓGICA DO MENU 2: ENVIAR E-MAILS ---

// Envia os e-mails usando os links da Coluna F como anexos
function enviarEmails() {
  try {
    const planilha = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Página1");
    const range = planilha.getRange(2, 1, planilha.getLastRow() - 1, 7);
    const dados = range.getValues();
    
    dados.forEach(function(linha, indice) {
      const statusEnvio = linha[6]; // Coluna G

      // Só envia se o status estiver vazio
      if (statusEnvio === "") {
        const nome = linha[0], email = linha[1], assunto = linha[2];
        let mensagem = linha[3];
        const linkDoAnexo = linha[5]; // Coluna F

        mensagem = mensagem.replace("{{nome}}", nome);
        const opcoesEmail = { name: 'Sistema de RH' };
        
        // Verifica se há um link de anexo válido
        if (linkDoAnexo && linkDoAnexo.startsWith("http")) {
          const idDoArquivo = extrairIdDoLinkDoArquivo(linkDoAnexo);
          const anexo = DriveApp.getFileById(idDoArquivo);
          opcoesEmail.attachments = [anexo];
          
          MailApp.sendEmail(email, assunto, mensagem, opcoesEmail);
          planilha.getRange(indice + 2, 7).setValue("E-mail com anexo enviado");
        } else {
          // Se não houver link ou o link for inválido (ex: "Arquivo não encontrado"), envia sem anexo
          MailApp.sendEmail(email, assunto, mensagem, opcoesEmail);
          planilha.getRange(indice + 2, 7).setValue("E-mail enviado (sem anexo)");
        }
      }
    });

    SpreadsheetApp.getUi().alert('Envio Concluído!', 'Todos os e-mails pendentes foram processados.', SpreadsheetApp.getUi().ButtonSet.OK);

  } catch (e) {
     SpreadsheetApp.getUi().alert('Falha no Envio', e.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}


// --- FUNÇÕES AUXILIARES ---

// Extrai o ID da URL de uma pasta
function extrairIdDaUrl(url) {
  const regex = /\/folders\/([a-zA-Z0-9-_]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Extrai o ID de um link de arquivo
function extrairIdDoLinkDoArquivo(url) {
  const regex = /\/d\/([a-zA-Z0-9-_]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
