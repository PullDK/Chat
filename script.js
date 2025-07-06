// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDQT2Ym09pLHBkXbCsGnec47DDtzS3toS0",
  authDomain: "sistemadelogin-8cab1.firebaseapp.com",
  projectId: "sistemadelogin-8cab1",
  appId: "1:668546945664:web:171cd892aeeac6c30b0c65"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Elementos
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const showPasswordCheckbox = document.getElementById("show-password");
const nameInput = document.getElementById("name"); // Só existe no cadastro
const messageEl = document.getElementById("message");

// Mostrar ou ocultar senha
if (showPasswordCheckbox && passwordInput) {
  showPasswordCheckbox.addEventListener("change", () => {
    passwordInput.type = showPasswordCheckbox.checked ? "text" : "password";
  });
}

function setLoading(isLoading, button) {
  if (isLoading) {
    button.disabled = true;
    button.textContent = "Processando...";
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText;
  }
}
 
function showMessage(msg, isError = true) {
  const message = document.getElementById("message");
  message.textContent = msg;
  message.style.color = isError ? "red" : "green";
}

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

// Cadastro
window.signup = function() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const button = document.querySelector("button[onclick='signup()']");
  button.dataset.originalText = button.textContent;

  if (!name) return showMessage("Digite seu nome.");
  if (!validateEmail(email)) return showMessage("Email inválido.");
  if (password.length < 6) return showMessage("Senha deve ter pelo menos 6 caracteres.");

  setLoading(true, button);

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      return userCredential.user.updateProfile({ displayName: name });
    })
    .then(() => {
      showMessage("Cadastro realizado com sucesso!", false);
      setTimeout(() => window.location.href = "index.html", 1200);
    })
    .catch(e => showMessage(e.message))
    .finally(() => setLoading(false, button));
};

// Login
window.login = function() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const button = document.querySelector("button[onclick='login()']");
  button.dataset.originalText = button.textContent;

  if (!validateEmail(email)) return showMessage("Email inválido.");
  if (!password) return showMessage("Digite sua senha.");

  setLoading(true, button);

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      showMessage("Login realizado!", false);
      setTimeout(() => window.location.href = "chat.html", 800);
    })
    .catch(e => showMessage(e.message))
    .finally(() => setLoading(false, button));
};

// Mostrar/ocultar senha
document.querySelectorAll("#show-password").forEach(checkbox => {
  checkbox.addEventListener("change", function() {
    const pwdInput = this.closest("div").querySelector("input[type='password'], input[type='text'][id='password']");
    if (pwdInput) {
      pwdInput.type = this.checked ? "text" : "password";
    }
  });
});

// ...dentro do onSnapshot, após criar messageEl...
messageEl.addEventListener("click", function(e) {
  if (e.button !== 0) return;
  if (messageEl.parentNode.querySelector(".reply-btn")) return;

  const replyBtn = document.createElement("button");
  replyBtn.className = "reply-btn";
  replyBtn.title = "Responder";
  replyBtn.textContent = "↩";
  replyBtn.type = "button";
  replyBtn.onclick = function(ev) {
    ev.stopPropagation();
    replyMessage(doc.id);
  };

  const wrapper = document.createElement("div");
  wrapper.className = "message-wrapper";
  messageEl.parentNode.insertBefore(wrapper, messageEl);
  wrapper.appendChild(messageEl);
  wrapper.appendChild(replyBtn);

  function removeBtn(ev) {
    if (!wrapper.contains(ev.target)) {
      if (replyBtn.parentNode) replyBtn.parentNode.removeChild(replyBtn);
      chatBox.insertBefore(messageEl, wrapper);
      wrapper.remove();
      document.removeEventListener("mousedown", removeBtn);
    }
  }
  document.addEventListener("mousedown", removeBtn);
});

// Não coloque CSS aqui!
