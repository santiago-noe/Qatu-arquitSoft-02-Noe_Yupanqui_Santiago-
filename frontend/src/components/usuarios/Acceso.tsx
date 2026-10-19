'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { usuariosApi } from '@/lib/api/usuarios';
import styles from './usuarios.module.css';

export default function Acceso({ registro = false }: { registro?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [pendiente, setPendiente] = useState(false);

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPendiente(true);
    setError('');
    try {
      await usuariosApi(registro ? '/auth/registro' : '/auth/login', 'POST', {
        email: form.get('email'), password: form.get('password'),
        ...(registro ? { nombre: form.get('nombre') } : {}),
      });
      router.replace('/cuenta');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Intenta nuevamente.');
    } finally { setPendiente(false); }
  }

  return <section className={styles.panel} aria-labelledby="titulo-acceso">
    <span className="eyebrow">TU CUENTA QATU</span>
    <h1 id="titulo-acceso">{registro ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}</h1>
    <p>{registro ? 'Comienza con una cuenta de cliente para encontrar herramientas y oficios cerca de ti.' : 'Ingresa para gestionar tu perfil.'}</p>
    <form onSubmit={enviar} className={styles.form}>
      {registro && <label>Nombre<input name="nombre" autoComplete="name" required minLength={2} maxLength={100}/></label>}
      <label>Correo electrónico<input name="email" type="email" autoComplete="email" required maxLength={254}/></label>
      <label>Contraseña<input name="password" type="password" autoComplete={registro ? 'new-password' : 'current-password'} required minLength={12} maxLength={128} aria-describedby="ayuda-password"/></label>
      <small id="ayuda-password">Entre 12 y 128 caracteres.</small>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <button className="button primary" disabled={pendiente}>{pendiente ? 'Procesando…' : registro ? 'Crear cuenta' : 'Ingresar'}</button>
    </form>
    <p>{registro ? '¿Ya tienes cuenta?' : '¿Primera vez en Qatu?'} <Link href={registro ? '/ingresar' : '/registro'}>{registro ? 'Ingresa' : 'Crea tu cuenta'}</Link></p>
  </section>;
}
