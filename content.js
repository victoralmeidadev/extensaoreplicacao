chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action == "copiar_dados_liferay") {
    let array = [];
    let inputs = document.querySelectorAll(
      "div.control-group.field-wrapper .field, div.control-group.field-wrapper .aui-field-select"
    );
    [...inputs].map(item => {
      if (!item.value.match(/(\/image\/journal\/article+)/g)) {
        array.push(item.value.replace(/(")+/g, "'"));
      }
    });
    //console.log("Copie este array: " + JSON.stringify(array));

    sendResponse({ data: JSON.stringify(array) });
  } else if (msg.action == "colar_dados_liferay") {
    let arrayPaste = JSON.parse(msg.dados);
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
});
