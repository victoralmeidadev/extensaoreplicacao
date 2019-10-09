document.addEventListener("DOMContentLoaded", function() {
  let botaoCopiar = document.querySelector(".button-copiar-dados-liferay");
  let botaoColar = document.querySelector(".button-colar-dados-liferay");

  botaoCopiar.addEventListener("click", onClickCopiar);
  botaoColar.addEventListener("click", onClickColar);

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
});
