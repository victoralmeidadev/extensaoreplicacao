chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action == "copiar_dados_liferay") {
    sendResponse({ data: copiarDadosForm() });
  } else if (msg.action == "colar_dados_liferay") {
    colarDadosForm(msg.dados);
  } else if (msg.action == "copiar_gerar_pendencia_liferay") {
    if (msg.dados.url_tab.match(/portal-stg/g) !== null) {
      let id_current_user = msg.dados.id_usuario;
      let url_current_tab = msg.dados.url_tab.split("?")[0];
      let id_current_modulo = document.querySelector(
        "input[name='_15_title_pt_BR']"
      ).value;
      let array_conteudo = copiarDadosForm();

      const data = {
        url_current_tab,
        id_current_modulo,
        array_conteudo,
        id_current_user
      };

      gerarPendenciaSistema(data);
    } else {
      alert(
        "Opa usuário, ainda bem que eu validei essa tentativa. Por favor, mais atenção, parece que você não está no portal-stg do Liferay."
      );
    }
  } else if (msg.action == "colar_conteudo_from_sistema") {
    if (msg.dados.url_tab.match(/portal-stg/g) !== null) {
      let id_current_modulo = document.querySelector(
        "input[name='_15_title_pt_BR']"
      ).value;

      const data = {
        id_current_modulo
      };

      colarConteudoFromSistema(data);
    } else {
      alert(
        "Opa usuário, ainda bem que eu validei essa tentativa. Por favor, mais atenção, parece que você não está no portal-stg do Liferay."
      );
    }
  } else if (msg.action == "show_alert_insira_id") {
    alert(
      "Por favor, insira o ID do seu usuário no sistema para prosseguir com essa ação!"
    );
  }
});

function copiarDadosForm() {
  let array = [];
  let inputs = document.querySelectorAll(
    "div.control-group.field-wrapper .field, div.control-group.field-wrapper .aui-field-select"
  );
  [...inputs].map(item => {
    if (!item.value.match(/(\/image\/journal\/article+)/g)) {
      array.push(item.value.replace(/(")+/g, "'"));
    }
  });

  return JSON.stringify(array);
  //console.log("Copie este array: " + JSON.stringify(array));
}

function colarDadosForm(arrayText) {
  let arrayPaste = JSON.parse(arrayText);
  let clearedInputsCount = [];
  let inputsPaste = document.querySelectorAll(
    "div.control-group.field-wrapper .field, div.control-group.field-wrapper .aui-field-select"
  );

  [...inputsPaste].map(item => {
    if (!item.value.match(/(\/image\/journal\/article+)/g)) {
      clearedInputsCount.push(item);
    }
  });

  if (clearedInputsCount.length === arrayPaste.length) {
    for (let i = 0; i < clearedInputsCount.length; i++) {
      if (!arrayPaste[i].match(/(\/image\/journal\/article+)/g)) {
        clearedInputsCount[i].value = arrayPaste[i];
      }
    }
  } else {
    alert(
      "Confira se o formulário onde você copiou os dados é igual o que está tentando colar."
    );
  }
}

function gerarPendenciaSistema(data) {
  // Exemplo de requisição POST
  let ajax = new XMLHttpRequest();

  // Seta tipo de requisição: Post e a URL da API
  ajax.open("POST", URL_REQUISICAO, true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  // Seta paramêtros da requisição e envia a requisição
  ajax.send(
    `token=${TOKEN}&receivedFromApi=${true}&codigoComponente=${
      data.id_current_modulo
    }&urlPublicado=${data.url_current_tab}&scriptReplicar=${encodeURIComponent(
      data.array_conteudo
    )}&lasUserUpdate=${data.id_current_user}&gerarPendencia=${true}`
  );

  // Cria um evento para receber o retorno.
  ajax.onreadystatechange = function() {
    // Caso o state seja 4 e o http.status for 200, é porque a requisiçõe deu certo.
    if (ajax.readyState == 4 && ajax.status == 200) {
      let data = ajax.responseText;

      // Retorno do Ajax
      alert(data);
    }
  };
}

function colarConteudoFromSistema(data) {
  // Exemplo de requisição POST
  let ajax = new XMLHttpRequest();

  // Seta tipo de requisição: Post e a URL da API
  ajax.open("POST", URL_REQUISICAO, true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  // Seta paramêtros da requisição e envia a requisição
  ajax.send(
    `token=${TOKEN}&receivedFromApi=${true}&codigoComponente=${
      data.id_current_modulo
    }&colarConteudoSistema=${true}`
  );

  // Cria um evento para receber o retorno.
  ajax.onreadystatechange = function() {
    // Caso o state seja 4 e o http.status for 200, é porque a requisiçõe deu certo.
    if (ajax.readyState == 4 && ajax.status == 200) {
      let data = ajax.responseText;

      colarDadosForm(data);

      alert("Conteúdo inserido com sucesso no módulo!");
    }
  };
}
