"use client"

import Head from 'next/head';
import '../../styles/profile.css';
import Header from '@/app/components/header/header';
import { useUser } from "../../../context/UserContext"
import { Edit, Save, CircleX, UserCircle2, IdCardLanyard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';

export default function Profile() {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
  });

  const [hasEnteredEdit, setHasEnteredEdit] = useState(false);

  // Atualiza formData com os dados do user ao carregar
  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.username || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <Header activeTab='' />
      <main className="main">
        <section className='main__top'>
          <div className='main__top__texts'>
            <h1> Seu perfil{user?.firstName ? `, ${user.firstName}!` : ""}</h1>
            <p>Visualize e edite os dados do seu perfil abaixo:</p>
          </div>

          {!hasEnteredEdit ? (
            <button onClick={() => setHasEnteredEdit(true)}>
              <Edit />
              Editar Perfil
            </button>
          ) : (
            <div className="edit__buttons">
              <button onClick={() => console.log("Atualizando:", formData)}>
                <Save />
                Atualizar Perfil
              </button>
              <button onClick={() => setHasEnteredEdit(false)}>
                <CircleX />
                Cancelar
              </button>
            </div>
          )}
        </section>

        {hasEnteredEdit ? (
          <section className='main__edit'>

              <div className='main__edit__input'>
                <legend>Username</legend>
                <div className="input__container">
                  <FaUser className="input__container__icon" />
                  <input
                    type="text"
                    name="userName"
                    placeholder="Username"
                    className="input-field"
                    value={formData["userName"]}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className='main__edit__input'>
                <legend>Primeiro Nome</legend>
                <div className="input__container">
                  <FaUser className="input__container__icon" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Primeiro Nome"
                    className="input-field"
                    value={formData["firstName"]}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className='main__edit__input'>
                <legend>Último Nome</legend>
                <div className="input__container">
                  <FaUser className="input__container__icon" />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Último Nome"
                    className="input-field"
                    value={formData["lastName"]}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
          </section>
        ) : (
          <section className='main__info'>
            <div className='main__info__container'>
                <UserCircle2 className='main__info__container__icon' />
                <h2>{user?.username}</h2>
                <h3>Nome de Usuário</h3>
            </div>
            <div className='main__info__container'>
                <IdCardLanyard className='main__info__container__icon' />
                <h2>{user?.firstName} {user?.lastName}</h2>
                <h3>Nome Completo</h3>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
