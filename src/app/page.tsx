import React from 'react';
import './styles/home.css';

export default function Home() {
  return (
    <div className="root">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Stuff</div>
        <ul className="nav-links">
          <li><a href="#contatos">Contatos</a></li>
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#clientes">Nossos Clientes</a></li>
          <li><a href="/auth/login/">Login</a></li>
        </ul>
      </nav>

      <main className="main-content">
        <section className="hero">
          <h1>Bem-vindo ao Stuff</h1>
          <p>O seu gerenciamento cada vez melhor.</p>
        </section>

        <section id="servicos" className="section">
          <h2>Serviços</h2>
          <p><p>Lorem ipsum dolor sit amet. A enim accusantium quo doloribus aliquid et eveniet atque est iste optio. Ea consequatur beatae sit consectetur possimus qui recusandae quia et fugiat internos est aperiam sequi est temporibus sint ea dolores explicabo. Et natus rerum quo minima soluta aut reiciendis facilis in maiores odio! </p><p>Eum ratione laudantium ut galisum porro eum fugiat repudiandae aut quae quia. Id facilis harum qui excepturi fuga sed ullam expedita non fugit odio. </p><p>Aut beatae harum et omnis consequatur eum dolorem quos et doloribus quis et labore esse ea quaerat illum. Eum sunt dolores ut delectus rerum sed velit porro aut sunt ducimus id illo recusandae aut labore quaerat. Et cupiditate nihil eum voluptates nesciunt 33 quod aliquam eos eaque perferendis. </p>
          </p>
        </section>

        <section id="clientes" className="section">
          <h2>Nossos Clientes</h2>
          <p><p>Lorem ipsum dolor sit amet. A enim accusantium quo doloribus aliquid et eveniet atque est iste optio. Ea consequatur beatae sit consectetur possimus qui recusandae quia et fugiat internos est aperiam sequi est temporibus sint ea dolores explicabo. Et natus rerum quo minima soluta aut reiciendis facilis in maiores odio! </p><p>Eum ratione laudantium ut galisum porro eum fugiat repudiandae aut quae quia. Id facilis harum qui excepturi fuga sed ullam expedita non fugit odio. </p><p>Aut beatae harum et omnis consequatur eum dolorem quos et doloribus quis et labore esse ea quaerat illum. Eum sunt dolores ut delectus rerum sed velit porro aut sunt ducimus id illo recusandae aut labore quaerat. Et cupiditate nihil eum voluptates nesciunt 33 quod aliquam eos eaque perferendis. </p>
          </p>
        </section>

        <section id="contatos" className="section">
          <h2>Contatos</h2>
          <p><p>Lorem ipsum dolor sit amet. A enim accusantium quo doloribus aliquid et eveniet atque est iste optio. Ea consequatur beatae sit consectetur possimus qui recusandae quia et fugiat internos est aperiam sequi est temporibus sint ea dolores explicabo. Et natus rerum quo minima soluta aut reiciendis facilis in maiores odio! </p><p>Eum ratione laudantium ut galisum porro eum fugiat repudiandae aut quae quia. Id facilis harum qui excepturi fuga sed ullam expedita non fugit odio. </p><p>Aut beatae harum et omnis consequatur eum dolorem quos et doloribus quis et labore esse ea quaerat illum. Eum sunt dolores ut delectus rerum sed velit porro aut sunt ducimus id illo recusandae aut labore quaerat. Et cupiditate nihil eum voluptates nesciunt 33 quod aliquam eos eaque perferendis. </p>
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Stuff. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
