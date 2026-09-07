// auth.controller se encarga de manejar la lógica de autenticación de usuarios, como el inicio de sesión y la verificación de credenciales.
const login = (req, res) => {
    const { email, password } = req.body;

    if (
        email === "admin@salita.com" &&
        password === "12345"
    ) {
        return res.status(200).json({ ok: true, token: "token_falso_123" });
    }

    return res.status(401).json({ ok: false, error: "Credenciales inválidas" });
};

module.exports = { login };