// "use client";

// import React, { useState } from "react";
// import "../../styles/register.css";
// import { FaEnvelope, FaUser, FaLock, FaEyeSlash, FaEye } from "react-icons/fa";
// import { RegisterService } from "../../services/register_service";
// import { useRouter } from "next/navigation";

// const RegisterPage: React.FC = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     userName: "",
//     password: "",
//     passwordConfirm: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);
//   const router = useRouter();

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
//     setSuccess(false);
  
//     // Validações
//     if (formData.password !== formData.passwordConfirm) {
//       setError("As senhas não coincidem");
//       return;
//     }
  
//     const allRulesValid = Object.values(passwordRules).every(rule => rule);
//     if (!allRulesValid) {
//       setError("A senha não atende a todos os requisitos");
//       return;
//     }
    
//     try {
//       setLoading(true);
//       console.log("Iniciando processo de registro...");
  
//       await RegisterService.register({
//         firstName: formData.firstName.trim(),
//         lastName: formData.lastName.trim(),
//         userName: formData.userName.trim(),
//         email: formData.email.trim().toLowerCase(),
//         password: formData.password,
//       });
  
//       setSuccess(true);
//       setTimeout(() => router.push("/pages/login"), 2000);
      
//     } catch (err: any) {
//       console.error("Erro completo no registro:", err);
      
//       let errorMessage = "Erro durante o registro";
      
//       if (err.message.includes("Credenciais de administrador")) {
//         errorMessage = "Erro no servidor. Contate o suporte.";
//       } 
//       else if (err.response?.data?.message) {
//         errorMessage = err.response.data.message;
//       }
//       else if (err.message) {
//         errorMessage = err.message;
//       }
  
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="register-page">
//       <img src="/register_img.png" alt="Background" className="background-image" />
//       <div className="register-form-container">
//         <form className="register-form" onSubmit={handleSubmit}>
//           <h1 className="register-title">Stuff.</h1>
//           <h2 className="register-subtitle">Então você é novo aqui?</h2>
//           <p className="register-description">Diga-nos um pouco sobre você</p>

//           {error && <div className="error-message">{error}</div>}
//           {success && <div className="success-message">Conta criada com sucesso! Redirecionando...</div>}

//           <div className="input-container">
//             <FaEnvelope className="input-icon" />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               className="input-field"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="input-row">
//             <div className="input-container">
//               <FaUser className="input-icon" />
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="Nome"
//                 className="input-field"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="input-container">
//               <FaUser className="input-icon" />
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Sobrenome"
//                 className="input-field"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           <div className="input-container">
//               <FaUser className="input-icon" />
//               <input
//                 type="text"
//                 name="userName"
//                 placeholder="Nome de usuário"
//                 className="input-field"
//                 value={formData.userName}
//                 onChange={handleChange}
//                 required
//               />
//           </div> 

//           <div className="input-container">
//             <FaLock className="input-icon" />
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Senha"
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
//             className="register-button"
//             disabled={loading}
//           >
//             {loading ? "Criando conta..." : "Criar minha conta"}
//           </button>

//           <p className="login-redirect">
//             Já tem uma conta? <a href="/pages/login">Faça seu login</a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;