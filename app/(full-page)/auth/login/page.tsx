/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useMemo, useRef, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { LoginService } from '../../../../service/LoginService';
import { Toast } from 'primereact/toast';
import Link from 'next/link';

const LoginPage = () => {


    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');

    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const loginService = useMemo(() => new LoginService(), []);

    const toast = useRef<Toast>(null);
//---------------------------------------------------------------------

    const efetuarLogin = () => {
        loginService.login(login, senha)
            .then((response) => {
                console.log("Sucesso no login:", response);

                if (response.data.token) {
                    localStorage.setItem('TOKEN_APLICACAO_FRONTEND', response.data.token);
                    router.push('/');
                    window.location.reload();
                } else {
                    throw new Error("Token não recebido");
                }
            })
            .catch((error) => {
                console.error("Erro ao efetuar login:", error);

                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Login ou Senha estão inválidos!'
                });

                setLogin('');
                setSenha('');
            });

//-----------------------------------------------------------------
    }

    return (
        <div className={containerClassName}>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
            <img src="/layout/images/logo_nome.svg" alt="Logo Pássaro" width="145" height="145" />


                <div

                style={{
                borderRadius: '56px',
                padding: '0.3rem',
                color: 'white', // Texto branco para contraste
                backgroundColor: 'black' // Certifique-se de usar 'backgroundColor'
                 }}
                >

                     <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <span className="text-600 font-medium">INSERIR CADASTRO</span>
                        </div>

                        <div>
                            <label htmlFor="login" className="block text-900 text-xl font-medium mb-2">
                                Login
                            </label>
                            <InputText id="login" value={login} onChange={(e) => setLogin(e.target.value)} type="text" placeholder="Digite seu login" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="senha" className="block text-900 font-medium text-xl mb-2">
                                Senha
                            </label>
                            <Password inputId="senha" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer"

                                style={{ color: 'black' }}
                                onClick={() => router.push('/auth/newuser')}>
                                    Sou novo por aqui!
                                </a>

                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'black' }}
>
                                Esqueceu sua senha?
                                </a>
                            </div>
                            <Button
                                 label="Entrar"
                                 className="w-full p-3 text-xl"
                                 onClick={() => efetuarLogin()}
                                 style={{ backgroundColor: '#40E0D0', color: 'black',
                                    borderColor: 'black', borderWidth: '1.5px' }}
                        />



                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
