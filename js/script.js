
    
document.addEventListener("DOMContentLoaded", () => {
  
  // Elementos principais
  const container = document.getElementById("container");
  const registerBtn = document.getElementById("register"); // botão de mudar para aba de cadastro
  const loginToggleBtn = document.getElementById("login"); // botão de mudar para aba de login
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  

  // Inicializar Firestore
  const db = firebase.firestore();

  // Alternar para tela de cadastro
  if (registerBtn && container) {
    registerBtn.addEventListener("click", () => {
      container.classList.add("active");
    });
  }

  // Alternar para tela de login
  if (loginToggleBtn && container) {
    loginToggleBtn.addEventListener("click", () => {
      container.classList.remove("active");
    });
  }

  // Função de validação de senha
function isValidPassword(password) {
  // A senha deve ter pelo menos uma letra, um número e 6 ou mais caracteres
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return regex.test(password);
}

// Cadastro de usuário
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    const nome = document.querySelector('input[placeholder="Name"]').value;
    const mensagem = document.getElementById("mensagem");

    // Validações básicas
    if (!email || !senha || !confirmarSenha || !nome) {
      mensagem.textContent = "Por favor, preencha todos os campos.";
      mensagem.style.color = "red";
      return;
    }

    // Valida se as senhas coincidem
    if (senha !== confirmarSenha) {
      mensagem.textContent = "As senhas não coincidem!";
      mensagem.style.color = "red";
      return;
    }

    // Validação de comprimento da senha
    if (senha.length < 6) {
      mensagem.textContent = "A senha deve ter no mínimo 6 caracteres.";
      mensagem.style.color = "red";
      return;
    }

    // Validação de senha (letras e números)
    if (!isValidPassword(senha)) {
      mensagem.textContent = "A senha deve conter pelo menos uma letra e um número.";
      mensagem.style.color = "red";
      return;
    }

    // Cadastro no Firebase Authentication
    firebase.auth().createUserWithEmailAndPassword(email, senha)
      .then((userCredential) => {
        const user = userCredential.user;

        // Salvar dados no Firestore
        db.collection("users").doc(user.uid).set({
          nome: nome,
          email: user.email,
          criadoEm: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
          mensagem.textContent = "Cadastro realizado com sucesso!";
          mensagem.style.color = "green";
          console.log("Usuário salvo no Firestore.");
          container.classList.remove("active"); // Volta para aba de login
        })
        .catch((error) => {
          mensagem.textContent = "Erro ao salvar dados no Firestore.";
          mensagem.style.color = "red";
          console.error("Erro Firestore:", error);
        });
      })
      .catch((error) => {
        mensagem.textContent = error.message;
        mensagem.style.color = "red";
        console.error("Erro no cadastro:", error);
      });
  });
}

  // Login de usuário
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email2").value.trim();
      const senha = document.getElementById("passwordLogin").value;

      if (!email || !senha) {
        alert("Preencha todos os campos para login.");
        return;
      }

      firebase.auth().signInWithEmailAndPassword(email, senha)
        .then((userCredential) => {
          alert("Login realizado com sucesso!");
          console.log("Usuário logado:", userCredential.user);
          // window.location.href = "pagina-destino.html"; // descomente se quiser redirecionar
        })
        .catch((error) => {
          let mensagem;
          switch (error.code) {
            case "auth/invalid-email":
              mensagem = "E-mail inválido.";
              break;
            case "auth/user-not-found":
              mensagem = "Usuário não encontrado.";
              break;
            case "auth/wrong-password":
              mensagem = "Senha incorreta.";
              break;
            case "auth/invalid-credential":
              mensagem = "Credenciais inválidas.";
              break;
            default:
              mensagem = error.message;
          }
          alert("Erro no login: " + mensagem);
          console.error("Erro no login:", error);
        });
    });
  }
});

function verificarSenhas(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;
  const nome = document.querySelector('input[placeholder="Name"]').value;
  const mensagem = document.getElementById("mensagem");

  if (!email || !senha || !confirmarSenha || !nome) {
      mensagem.textContent = "Preencha todos os campos!";
      mensagem.style.color = "red";
      return;
  }

  if (senha !== confirmarSenha) {
      mensagem.textContent = "As senhas não coincidem!";
      mensagem.style.color = "red";
      return;
  }

  // Inicializar Firestore
  const db = firebase.firestore();

  firebase.auth().createUserWithEmailAndPassword(email, senha)
      .then(userCredential => {
          const user = userCredential.user;

          // Salvar dados no Firestore
          db.collection("users").doc(user.uid).set({
              nome: nome,
              email: user.email,
              criadoEm: firebase.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
              mensagem.textContent = "Cadastro realizado com sucesso!";
              mensagem.style.color = "green";
              console.log("Usuário salvo no Firestore.");
              // Redirecionar se quiser:
              // window.location.href = "login.html";
          })
          .catch(error => {
              mensagem.textContent = "Erro ao salvar dados no Firestore.";
              console.error("Erro Firestore:", error);
          });
      })
      .catch(error => {
          mensagem.textContent = error.message;
          mensagem.style.color = "red";
          console.error("Erro no cadastro:", error);
      });

      
}

