// 'use client';

// import { useEffect, useState } from 'react';
// import { FaCheckCircle, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
// import { authService } from '@/services/login_service';
// import { useRouter, useSearchParams } from "next/navigation";

// import '../../styles/reset-password.css';

// const ResetPasswordPage: React.FC = () => {

//   const [formData, setFormData] = useState({
//     password: "",
//     passwordConfirm: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState<string | undefined>(undefined);
//   const [error, setError] = useState("");
  
//   const router = useRouter();
//   const searchParams = useSearchParams();
  
//   const token = searchParams.get('token');
//   const [isTokenValid, setIsTokenValid] = useState<boolean>(!!(token && token.trim() !== ""));


//   useEffect(() => {
//     const tokenFromUrl = searchParams.get('token');
//     const isValid = !!(tokenFromUrl && tokenFromUrl.trim() !== "");
//     setIsTokenValid(isValid);

//     if (!isValid) {
//       setError("Insira o token enviado no E-mail na URL!");
//     } else {
//       setError("");
//     }
//   }, [searchParams]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const checkPasswordRules = (password: string) => {
//     return {
//       hasUppercase: /[A-Z]/.test(password),
//       hasLowercase: /[a-z]/.test(password),
//       hasNumber: /\d/.test(password),
//       hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
//       hasValidLength: password.length >= 12 && password.length <= 16,
//     };
//   };

//   const passwordRules = checkPasswordRules(formData.password);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess(undefined);

//     if (formData.password !== formData.passwordConfirm) {
//       setError("As senhas não coincidem");
//       return;
//     }

//     const allRulesValid = Object.values(passwordRules).every(rule => rule);
//     if (!allRulesValid) {
//       setError("A senha não atende a todos os requisitos");
//       return;
//     }

//     setLoading(true);
//     try {

//       const resetPasswordInfo = { token: token as string, newPassword: formData.password };

//       await authService.resetPassword(resetPasswordInfo);
//       setSuccess("Senha trocada com sucesso! Faça o login com sua nova senha.");

//       setTimeout(() => {
//         router.push("/pages/login");
//       }, 2000);

//     } catch (error: any) {
//       if (error.response) {
//         switch (error.response.status) {
//           case 400:
//             setError("A senha enviada é inválida!");
//             break;
//           case 401:
//             setError("Usuário não autenticado!");
//             break;
//           case 403:
//             setError("O token enviado não é valido!");
//             break;
//           case 404:
//             setError("Não foi possível encontrar o usuário para a alteração");
//             break;
//           default:
//             setError("Ocorreu um erro durante a troca de senha. Tente novamente.");
//         }
//         return;
//       }

//       setError(error.message || "Erro desconhecido durante o login");

//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="rp-page">
//       <img src="/register_img.png" alt="Background" className="background-image" />
//       <div className="rp-container">
//         <form className="rp-form" onSubmit={handleSubmit}>
//           <h1 className="rp-title">Stuff.</h1>
//           <h2 className="rp-subtitle">Troca de Senha</h2>
//           <p className="rp-description">Tudo certo agora! Digite sua nova senha.</p>

//           {error && <div className="error-message">{error}</div>}
//           {success && (
//             <div className="success-message">
//               <FaCheckCircle className="success-icon" />
//               {success}. Redirecionando...
//             </div>
//           )}

//           <div className="input-container">
//             <FaLock className="input-icon" />
//             <input
//               type={showPassword ? "text" : "password"}
//               disabled={!isTokenValid}
//               name="password"
//               placeholder="Nova Senha"
//               className="input-field"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//             <div
//               className="input-icon-right"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </div>
//           </div>

//           <div className="password-rules">
//             <p className={passwordRules.hasUppercase ? "rule valid" : formData.password ? "rule invalid" : "rule"}>
//               Pelo menos 1 letra maiúscula
//             </p>
//             <p className={passwordRules.hasLowercase ? "rule valid" : formData.password ? "rule invalid" : "rule"}>
//               Pelo menos 1 letra minúscula
//             </p>
//             <p className={passwordRules.hasNumber ? "rule valid" : formData.password ? "rule invalid" : "rule"}>
//               Pelo menos 1 número
//             </p>
//             <p className={passwordRules.hasSpecialChar ? "rule valid" : formData.password ? "rule invalid" : "rule"}>
//               Pelo menos 1 caractere especial
//             </p>
//             <p className={passwordRules.hasValidLength ? "rule valid" : formData.password ? "rule invalid" : "rule"}>
//               Entre 12 e 16 caracteres
//             </p>
//           </div>

//           <div className="input-container">
//             <FaLock className="input-icon-left" />
//             <input
//               disabled={!isTokenValid}
//               type={showPassword ? "text" : "password"}
//               name="passwordConfirm"
//               placeholder="Confirme sua senha"
//               className="input-field"
//               value={formData.passwordConfirm}
//               onChange={handleChange}
//               required
//             />
//             <div
//               className="input-icon-right"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="rp-button"
//             disabled={!isTokenValid || loading}
//           >
//             {loading ? "Trocando..." : "Trocar Senha"}
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// }

// export default ResetPasswordPage;