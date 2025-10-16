// "use client";

// import { useState } from 'react';
// import { FaCheckCircle, FaEnvelope } from 'react-icons/fa';
// import { authService } from '@/services/login_service';
// import { useRouter } from "next/navigation";

// // import '../../styles/forgot-password.css';

// const ForgotPasswordPage: React.FC = () => {

//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState<string | undefined>(undefined);
//   const [error, setError] = useState("");

//   const router = useRouter();

//   const handleFPSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess(undefined);

//     try {
//       await authService.forgotPassword(email);
//       const message = "E-mail de troca de senha foi enviado com sucesso!"
      
//       setSuccess(message);
//       setTimeout(() => {
//         router.push("/pages/reset-password?token=");
//       }, 2000);

//     } catch (error: any) {
//       if (error.response) {
//         switch (error.response.status) {
//           case 404:
//             setError("Usuário não encontrado.");
//             break;
//           default:
//             setError("Ocorreu um erro durante o login. Tente novamente.");
//         }
//         return;
//       } 
        
//       setError(error.message || "Erro desconhecido durante o login");

//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="fp-page">
//       <img src="/register_img.png" alt="Background" className="background-image" />
//       <div className="fp-container">
//         <form className="fp-form" onSubmit={handleFPSubmit}>
//           <h1 className="fp-title">Stuff.</h1>
//           <h2 className="fp-subtitle">Esqueceu sua senha?</h2>
//           <p className="fp-description">Tudo bem. Nós o(a) ajudaremos!</p>

//           {error && <div className="error-message">{error}</div>}
//           {success && (
//             <div className="success-message">
//               <FaCheckCircle className="success-icon" />
//                 {success}. Redirecionando...
//                 </div>
//           )}

//           <div className="input-container">
//             <FaEnvelope className="input-icon" />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               className="input-field"
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="send-email-button"
//             disabled={loading}
//           >
//             {loading ? "Enviando..." : "Verificar E-mail"}
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// }

// export default ForgotPasswordPage;