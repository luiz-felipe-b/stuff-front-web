
import React from 'react';
import { redirect } from 'next/navigation';
import Button from '@/components/Button/Button';
import { Dog } from 'lucide-react';

export default function Home() {
  // Instantly redirect to /login
  redirect('/login');

  // Home page code is preserved for future use or conditional rendering
  return (
    <div className="min-h-screen flex flex-col bg-stuff-mid text-gray-900">
      {/* <Button variant='primary' size='md' className='flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition' palette='success' href="/pages/register/">
        <Dog />
        <span className="button-text">Começar</span>
        <Dog />
      </Button> */}
      <nav className="flex items-center justify-between px-8 py-4 bg-stuff-mid shadow">
        <div className="text-2xl font-bold text-green-700">Stuff.</div>
        <ul className="flex gap-6 text-lg">
          <li><a href="#sobre_nos">Sobre nós</a></li>
          <li><a href="#clientes">Nossos Clientes</a></li>
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#contato">Contatos</a></li>
          <li><a href="/pages/login/">Login</a></li>
        </ul>
      </nav>

      <main className="flex-1 px-8 py-6">
        <section className="flex flex-col items-center justify-center py-16">
          <h1>Bem-vindo ao Stuff</h1>
          <p>O seu gerenciamento cada vez melhor.</p>
        </section>

        <section id="sobre_nos" className="py-12 max-w-3xl mx-auto">
          <h2>Sobre nós</h2>
          <p>Lorem ipsum dolor sit amet. A enim accusantium quo doloribus aliquid et eveniet atque est iste optio. Ea consequatur beatae sit consectetur possimus qui recusandae quia et fugiat internos est aperiam sequi est temporibus sint ea dolores explicabo. Et natus rerum quo minima soluta aut reiciendis facilis in maiores odio! </p><p>Eum ratione laudantium ut galisum porro eum fugiat repudiandae aut quae quia. Id facilis harum qui excepturi fuga sed ullam expedita non fugit odio. </p><p>Aut beatae harum et omnis consequatur eum dolorem quos et doloribus quis et labore esse ea quaerat illum. Eum sunt dolores ut delectus rerum sed velit porro aut sunt ducimus id illo recusandae aut labore quaerat. Et cupiditate nihil eum voluptates nesciunt 33 quod aliquam eos eaque perferendis.</p>
        </section>

        <section id="clientes" className="py-12 max-w-4xl mx-auto">
          <h2>Nossos Clientes</h2>
          <div className="flex gap-8 justify-center">
            <div className="flex flex-col items-center gap-2">
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

        <section id="servicos" className="py-12 max-w-4xl mx-auto">
          <h2>Serviços</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <h3>Básico</h3>
              <p>Controle simples de estoque</p>
              <p><strong>R$29/mês</strong></p>
            </div>
            <div className="bg-green-100 rounded-lg shadow p-6 flex flex-col items-center border-2 border-green-600">
              <h3>Plus</h3>
              <p>Relatórios + Múltiplos usuários</p>
              <p><strong>R$59/mês</strong></p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <h3>Plus +</h3>
              <p>Integrações + Suporte dedicado</p>
              <p><strong>R$99/mês</strong></p>
            </div>
          </div>
        </section>

        <section id="contato" className="py-12 max-w-4xl mx-auto">
          <h2>Contatos</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <form className="flex flex-col gap-4 bg-white rounded-lg shadow p-6 flex-1">
              <input type="text" placeholder="Nome" required className="border rounded px-4 py-2" />
              <input type="email" placeholder="Email" required className="border rounded px-4 py-2" />
              <textarea placeholder="Mensagem" required className="border rounded px-4 py-2" />
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">Enviar</button>
            </form>
            <div className="bg-green-50 rounded-lg shadow p-6 flex-1">
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

      <footer className="bg-white py-8 mt-12 shadow">
        <ul className="flex gap-6 justify-center mb-4">
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