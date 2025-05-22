import React from 'react';
import './styles/home.css';

export default function Home() {
  return (
    <div className="root">

      <nav className="navbar">
        <div className="logo">Stuff.</div>
        <ul className="nav-links">
          <li><a href="#sobre_nos">Sobre nós</a></li>
          <li><a href="#clientes">Nossos Clientes</a></li>
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#contato">Contatos</a></li>
          <li><a href="/pages/login/">Login</a></li>
        </ul>
      </nav>

      <main className="main-content">
        <section className="hero">
          <h1>Bem-vindo ao Stuff</h1>
          <p>O seu gerenciamento cada vez melhor.</p>
        </section>

        <section id="sobre_nos" className="section">
          <h2>Sobre nós</h2>
          <p>Lorem ipsum dolor sit amet. A enim accusantium quo doloribus aliquid et eveniet atque est iste optio. Ea consequatur beatae sit consectetur possimus qui recusandae quia et fugiat internos est aperiam sequi est temporibus sint ea dolores explicabo. Et natus rerum quo minima soluta aut reiciendis facilis in maiores odio! </p><p>Eum ratione laudantium ut galisum porro eum fugiat repudiandae aut quae quia. Id facilis harum qui excepturi fuga sed ullam expedita non fugit odio. </p><p>Aut beatae harum et omnis consequatur eum dolorem quos et doloribus quis et labore esse ea quaerat illum. Eum sunt dolores ut delectus rerum sed velit porro aut sunt ducimus id illo recusandae aut labore quaerat. Et cupiditate nihil eum voluptates nesciunt 33 quod aliquam eos eaque perferendis.</p>
        </section>

        <section id="clientes" className="section clientes">
          <h2>Nossos Clientes</h2>
          <div className="carrossel-clientes">
            <div className="cliente-item">
              <img src="/cliente1.avif" alt="Cliente 1" />
              <p>Empresa Alfa</p>
            </div>
            <div className="cliente-item">
              <img src="/cliente2.avif" alt="Cliente 2" />
              <p>Empresa Beta</p>
            </div>
            <div className="cliente-item">
              <img src="/cliente3.avif" alt="Cliente 3" />
              <p>Empresa Gama</p>
            </div>
          </div>
        </section>

        <section id="servicos" className="section">
          <h2>Serviços</h2>
          <div className="planos">
            <div className="plano-card">
              <h3>Básico</h3>
              <p>Controle simples de estoque</p>
              <p><strong>R$29/mês</strong></p>
            </div>
            <div className="plano-card destaque">
              <h3>Plus</h3>
              <p>Relatórios + Múltiplos usuários</p>
              <p><strong>R$59/mês</strong></p>
            </div>
            <div className="plano-card">
              <h3>Plus +</h3>
              <p>Integrações + Suporte dedicado</p>
              <p><strong>R$99/mês</strong></p>
            </div>
          </div>
        </section>

        <section id="contato" className="section">
          <h2>Contatos</h2>
          <div className="contato-container">
            <form className="form-contato">
              <input type="text" placeholder="Nome" required />
              <input type="email" placeholder="Email" required />
              <textarea placeholder="Mensagem" required></textarea>
              <button type="submit">Enviar</button>
            </form>
            <div className="card-contato">
              <h3>Fale conosco</h3>
              <p>Telefone: (11) 99999-9999</p>
              <p>Email: contato@stuff.com</p>
              <p>
                Redes:
                <br />
                <a href="#">Instagram</a> | <a href="#">LinkedIn</a> | <a href="#">Facebook</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <ul className="footer-links">
          <li><a href="#sobre_nos">Sobre nós</a></li>
          <li><a href="#clientes">Clientes</a></li>
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#contato">Contatos</a></li>
        </ul>
        <p>Sistema de estoque moderno, seguro e personalizável.</p>
        <p>© 2025 Stuff. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}