import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

interface RegisterErrors { name?: string; email?: string; password?: string; password2?: string }

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found: RegisterErrors = {};
    if (name.trim().length < 3) found.name = "Ad soyad en az 3 karakter olmalı.";
    if (!email.includes("@")) found.email = "Geçerli bir e-posta girin.";
    if (password.length < 6) found.password = "Şifre en az 6 karakter olmalı.";
    if (password2 !== password || password2.length === 0) found.password2 = "Şifreler aynı değil.";
    setErrors(found);
    setSent(Object.keys(found).length === 0);
  }

  return (
    <>
      <h2 className="bolum-baslik">Kayıt Ol</h2>
      {sent && <p className="mesaj mesaj-basarili" role="status">Form geçerli. Gerçek kayıt Sprint 10’da.</p>}
      <form className="form form-auth" noValidate onSubmit={handleSubmit}>
        <div className="form-alani">
          <label htmlFor="register-name">Ad Soyad</label>
          <input id="register-name" name="name" autoComplete="name" value={name}
            onChange={(e) => { setName(e.target.value); setSent(false); }}
            aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? "register-name-error" : undefined} />
          {errors.name && <span className="hata-metni" id="register-name-error" role="alert">{errors.name}</span>}
        </div>
        <div className="form-alani">
          <label htmlFor="register-email">E-posta</label>
          <input id="register-email" name="email" type="email" autoComplete="email" value={email}
            onChange={(e) => { setEmail(e.target.value); setSent(false); }}
            aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? "register-email-error" : undefined} />
          {errors.email && <span className="hata-metni" id="register-email-error" role="alert">{errors.email}</span>}
        </div>
        <div className="form-alani">
          <label htmlFor="register-password">Şifre</label>
          <input id="register-password" name="password" type="password" autoComplete="new-password" value={password}
            onChange={(e) => { setPassword(e.target.value); setSent(false); }}
            aria-invalid={errors.password ? true : undefined} aria-describedby={errors.password ? "register-password-error" : undefined} />
          {errors.password && <span className="hata-metni" id="register-password-error" role="alert">{errors.password}</span>}
        </div>
        <div className="form-alani">
          <label htmlFor="register-password2">Şifre (tekrar)</label>
          <input id="register-password2" name="password2" type="password" autoComplete="new-password" value={password2}
            onChange={(e) => { setPassword2(e.target.value); setSent(false); }}
            aria-invalid={errors.password2 ? true : undefined} aria-describedby={errors.password2 ? "register-password2-error" : undefined} />
          {errors.password2 && <span className="hata-metni" id="register-password2-error" role="alert">{errors.password2}</span>}
        </div>
        <button className="buton" type="submit">Kayıt ol</button>
      </form>
      <p><Link to="/login">Zaten hesabın var mı? Giriş yap</Link></p>
    </>
  );
}

export default RegisterPage;
