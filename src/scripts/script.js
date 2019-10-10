document.addEventListener("DOMContentLoaded", function() {
  //INSIRA O ID DO SEU USUARIO NO SISTEMA NA VARIAVEL ABAIXO
  const ID_USUARIO = "106";

  let botaoCopiar = document.querySelector("#button-copiar-dados-liferay");
  let botaoColar = document.querySelector("#button-colar-dados-liferay");
  let botaoCopiarSistemaPendencia = document.querySelector(
    "#button-copiar-sistema-dados-liferay"
  );
  let botaoColarSistema = document.querySelector(
    "#button-colar-sistema-dados-liferay"
  );

  botaoCopiar.addEventListener("click", onClickCopiar);
  botaoColar.addEventListener("click", onClickColar);
  botaoCopiarSistemaPendencia.addEventListener(
    "click",
    onClickCopiarGerarPendencia
  );
  botaoColarSistema.addEventListener("click", onClickColarFromSistema);

  function onClickCopiar() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "copiar_dados_liferay", dados: "" },
        function(response) {
          let textAreaCopiar = document.querySelector(
            ".input-liferay-item.copiar"
          );
          textAreaCopiar.innerHTML = response.data;
        }
      );
    });
  }

  function onClickColar() {
    //pega o array inserido no input pra colar
    let textAreaColar = document
      .querySelector(".input-liferay-item.colar")
      .value.trim();

    if (textAreaColar !== "") {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "colar_dados_liferay", dados: textAreaColar },
          function(response) {
            document.querySelector(
              ".colar-dados-liferay-result-text"
            ).innerHTML = "Sucesso!";
          }
        );
      });
    } else {
      alert("Insira o array que deseja colar no formulário");
    }
  }

  function onClickCopiarGerarPendencia() {
    if (ID_USUARIO == "") {
      showAlertInsiraID();
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            action: "copiar_gerar_pendencia_liferay",
            dados: { id_usuario: ID_USUARIO, url_tab: tabs[0].url }
          },
          function(response) {}
        );
      });
    }
  }

  function onClickColarFromSistema() {
    if (ID_USUARIO == "") {
      showAlertInsiraID();
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            action: "colar_conteudo_from_sistema",
            dados: { id_usuario: ID_USUARIO, url_tab: tabs[0].url }
          },
          function(response) {}
        );
      });
    }
  }

  function showAlertInsiraID() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "show_alert_insira_id", dados: "" },
        function(response) {}
      );
    });
  }
});
