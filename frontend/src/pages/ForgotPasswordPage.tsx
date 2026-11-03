import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = email.includes("@") ? "" : "Geçerli bir e-posta girin.";
    setError(found);
    setSent(found === "");
  }

  return (
    <>
      <h2 className="bolum-baslik">Şifremi Unuttum</h2>
      <p>Kayıtlı e-posta adresinizi yazın, şifre yenileme bağlantısı gönderelim.</p>
      {sent && <p className="mesaj mesaj-basarili" role="status">Bağlantı {email} adresine gönderildi (demo).</p>}
      <form className="form form-auth" noValidate onSubmit={handleSubmit}>
        <div className="form-alani">
          <label htmlFor="forgot-email">E-posta</label>
          <input id="forgot-email" name="email" type="email" autoComplete="email" value={email}
            onChange={(e) => { setEmail(e.target.value); setSent(false); }}
            aria-invalid={error ? true : undefined} aria-describedby={error ? "forgot-email-error" : undefined} />
          {error && <span className="hata-metni" id="forgot-email-error" role="alert">{error}</span>}
        </div>
        <button className="buton" type="submit">Bağlantı gönder</button>
      </form>
      <p><Link to="/login">← Girişe dön</Link></p>
    </>
  );
}

export default ForgotPasswordPage;
