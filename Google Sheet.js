const scriptURL = 'https://script.google.com/macros/s/AKfycbz-OFtcGi2aSeO3L7B89Omuwg84i1qJFeWZe508JQnrsz520k8gYFl9G0JDkkMZCtbxCQ/exec';
const form = document.forms['contact-form'];

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const jsonData = {};
  const fileFields = ['rgCnh', 'comprovante', 'evento', 'cadin'];
  let filesProcessed = 0;

  // Processa os arquivos PDF como Base64
  fileFields.forEach(field => {
    const file = formData.get(field);
    if (file && file.size > 0) {
      const reader = new FileReader();
      reader.onload = function(e) {
        jsonData[field] = e.target.result; // Base64
        filesProcessed++;
        if (filesProcessed === fileFields.length) {
          sendData(jsonData);
        }
      };
      reader.readAsDataURL(file);
    } else {
      jsonData[field] = '';
      filesProcessed++;
      if (filesProcessed === fileFields.length) {
        sendData(jsonData);
      }
    }
  });

  // Adiciona os campos de texto
  formData.forEach((value, key) => {
    if (!fileFields.includes(key)) {
      jsonData[key] = value;
    }
  });

  // Função para enviar os dados
  function sendData(data) {
    fetch(scriptURL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
      if (!response.ok) throw new Error('Erro na resposta do servidor');
      alert("Dados enviados com sucesso!");
      window.location.reload();
    })
    .catch(error => {
      console.error('Erro de envio de dados', error.message);
    });
  }
});