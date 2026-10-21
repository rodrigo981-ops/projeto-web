
const campoCPF = document.querySelector("#cpf");
const campoTelefone = document.querySelector("#telefone");
const formulario = document.querySelector("#formContato");
const mensagem = document.querySelector("#mensagem");

// Formata o CPF enquanto o usuário digita
campoCPF.addEventListener("input", () => {
    let valor = campoCPF.value.replace(/\D/g, "").slice(0, 11);

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    campoCPF.value = valor;
});

// Formata o telefone enquanto o usuário digita
campoTelefone.addEventListener("input", () => {
    let valor = campoTelefone.value.replace(/\D/g, "").slice(0, 11);

    if (valor.length > 10) {
        valor = valor.replace(
            /^(\d{2})(\d{5})(\d{1,4}).*/,
            "($1) $2-$3"
        );
    } else if (valor.length > 6) {
        valor = valor.replace(
            /^(\d{2})(\d{4})(\d{1,4}).*/,
            "($1) $2-$3"
        );
    } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d+)/, "($1) $2");
    }

    campoTelefone.value = valor;
});

// Valida o CPF
function cpfValido(cpf) {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i);
    }

    let digito = (soma * 10) % 11;

    if (digito === 10) {
        digito = 0;
    }

    if (digito !== Number(cpf[9])) {
        return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i);
    }

    digito = (soma * 10) % 11;

    if (digito === 10) {
        digito = 0;
    }

    return digito === Number(cpf[10]);
}

// Exibe as mensagens de erro
function mostrarErro(campo, idErro, texto) {
    document.querySelector(idErro).textContent = texto;

    campo.classList.toggle("invalido", Boolean(texto));

    campo.setAttribute(
        "aria-invalid",
        texto ? "true" : "false"
    );
}

// Validação do formulário
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nome = document.querySelector("#nome");
    const email = document.querySelector("#email");

    const cpfCorreto = cpfValido(campoCPF.value);

    const partesNome = nome.value.trim().split(/\s+/);

    const nomeCorreto =
        partesNome.length >= 2 &&
        partesNome.every(parte => /\p{L}/u.test(parte));

    const emailCorreto =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

    const numerosTelefone =
        campoTelefone.value.replace(/\D/g, "");

    const telefoneCorreto =
        numerosTelefone.length === 10 ||
        numerosTelefone.length === 11;

    mostrarErro(
        campoCPF,
        "#erroCpf",
        cpfCorreto ? "" : "Digite um CPF válido."
    );

    mostrarErro(
        nome,
        "#erroNome",
        nomeCorreto ? "" : "Digite seu nome completo."
    );

    mostrarErro(
        email,
        "#erroEmail",
        emailCorreto ? "" : "Digite um e-mail válido."
    );

    mostrarErro(
        campoTelefone,
        "#erroTelefone",
        telefoneCorreto ? "" : "Digite um telefone com DDD."
    );

    if (
        cpfCorreto &&
        nomeCorreto &&
        emailCorreto &&
        telefoneCorreto
    ) {
        mensagem.textContent =
            "Validação concluída! Os dados estão corretos.";

        mensagem.style.color = "#38bdf8";
    } else {
        mensagem.textContent =
            "Confira os campos destacados e tente novamente.";

        mensagem.style.color = "#fda4af";
    }
});

// Atualiza o ano do rodapé automaticamente
document.querySelector("#ano").textContent =
    new Date().getFullYear();