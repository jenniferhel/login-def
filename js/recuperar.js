// Inicialize o Firebase Authentication
const auth = firebase.auth();

// Função de mensagem de erro
function getAuthErrorMessage(error) {
    switch (error.code) {
        case 'auth/invalid-email':
            return 'O e-mail fornecido não é válido.';
        case 'auth/user-not-found':
            return 'Nenhum usuário encontrado com esse e-mail.';
        case 'auth/missing-email':
            return 'O e-mail é obrigatório.';
        default:
            return 'Erro desconhecido. Tente novamente mais tarde.';
    }
}

// Função de recuperação de senha
async function resetPassword(email) {
    try {
        // Envia o link de recuperação de senha para o e-mail fornecido
        await auth.sendPasswordResetEmail(email);
        return { success: true, message: "E-mail de recuperação enviado!" };
    } catch (error) {
        // Retorna a mensagem de erro caso falhe
        return { success: false, message: getAuthErrorMessage(error) };
    }
}
