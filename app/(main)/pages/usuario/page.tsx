/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Projeto } from '@/types/projeto';
import { UsuarioService } from '@/service/UsuarioService';
const usuarioService = new UsuarioService();

const Usuario = () => {
    let usuarioVazio: Projeto.Usuario = {
        id: 0,
        nome: '',
        login: '',
        senha: '',
        email: '',
    };

    const [usuarios, setUsuarios] = useState<Projeto.Usuario[]>([]);
    const [usuarioDialog, setUsuarioDialog] = useState(false);
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState(false);
    const [deleteUsuariosDialog, setDeleteUsuariosDialog] = useState(false);
    const [usuario, setUsuario] = useState<Projeto.Usuario>(usuarioVazio);
    const [selectedUsuarios, setSelectedUsuarios] = useState<Projeto.Usuario[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
//-----------------------------------------------------------------------------------------------
useEffect(() => {
    if (usuarios.length === 0) {
        usuarioService.ListarTodos()
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setUsuarios(response.data);
                } else {
                    setUsuarios([]);
                }
            })
            .catch((error) => {
                console.error(error);
                setUsuarios([]);
            });
    }
}, [usuarioService, usuario]); // Lista de dependências vazia para garantir execução única


//-----------------------------------------------------------------------------------------------

    const openNew = () => {
        setUsuario(usuarioVazio);
        setSubmitted(false);
        setUsuarioDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUsuarioDialog(false);
    };

    const hideDeleteUsuarioDialog = () => {
        setDeleteUsuarioDialog(false);
    };

    const hideDeleteUsuariosDialog = () => {
        setDeleteUsuariosDialog(false);
    };
//---------------------------------------------------------------------
//   Onde eu chamo meu front-end
const saveUsuario = () => {
    setSubmitted(true);

    if (!usuario.id) {
        usuarioService.inserir(usuario)
            .then((response) => {
                setUsuarios([...usuarios, response.data]); // Atualiza a lista de usuários com o novo
                setUsuario(usuarioVazio); // Limpa o usuário
                setUsuarioDialog(false); // Fecha o dialog
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Usuário cadastrado com sucesso!'
                });
            }).catch((error) => {
                console.error(error.response.data.message);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao salvar! ' + error.response.data.message
                });
            });
    } else {
        usuarioService.alterar(usuario.id, usuario)
            .then((response) => {
                const updatedUsuarios = usuarios.map((u) =>
                    u.id === usuario.id ? response.data : u
                );
                setUsuarios(updatedUsuarios); // Atualiza a lista de usuários com os dados alterados
                setUsuario(usuarioVazio); // Limpa o usuário
                setUsuarioDialog(false); // Fecha o dialog
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Usuário alterado com sucesso!'
                });
            }).catch((error) => {
                console.error(error.response.data.message);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao alterar! ' + error.response.data.message
                });
            });
    }
};

//-----------------------------------------------------------------

    const editUsuario = (usuario: Projeto.Usuario) => {
        setUsuario({ ...usuario });
        setUsuarioDialog(true);
    };

    const confirmDeleteUsuario = (usuario: Projeto.Usuario) => {
        setUsuario(usuario);
        setDeleteUsuarioDialog(true);
    };
//------------------------------------------------------------------
//Deletar------------
const deleteUsuario = () => {
    if (usuario.id) {
        usuarioService.excluir(usuario.id).then((response) => {
            // Aqui, você pode atualizar a lista de usuários em vez de limpá-la
            setUsuarios(prevUsuarios => prevUsuarios.filter(u => u.id !== usuario.id));
            setUsuario(usuarioVazio);
            setDeleteUsuarioDialog(false);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Usuário deletado com sucesso!',
                life: 3000
            });
        }).catch(() => {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: 'Erro ao deletar usuário!',
                life: 3000
            });
        });
    }
};


    //------------------------------------------------------------------

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteUsuariosDialog(true);
    };


//--------------------------------------------
//deletar varios usuários
    const deleteSelectedUsuarios = () => {

        Promise.all(selectedUsuarios?.map(async (_usuario) => {
            if(_usuario.id){
           await usuarioService.excluir(_usuario.id)
        }

        })).then((response) => {
            setUsuarios ([]);
            setUsuario(usuarioVazio);
            setDeleteUsuarioDialog(false);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Usuário deletado com sucesso!',
                life: 3000
            });


        }).catch((error) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao deletado usuários!',
                life: 3000
            });

        })



        setDeleteUsuariosDialog(false);
    };



    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, nome: string) => {
        const val = e.target.value || '';
        let _usuario = { ...usuario };
        _usuario[nome] = val;

        setUsuario(_usuario);
    };

    const leftToolbarTemplate = () => (
        <div className="my-2">
            <Button label="Novo" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
            <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsuarios || !selectedUsuarios.length} />
        </div>
    );

    const rightToolbarTemplate = () => (
        <React.Fragment>
            <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Importar" className="mr-2 inline-block" />
            <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={exportCSV} />
        </React.Fragment>
    );

    const idBodyTemplate = (rowData: Projeto.Usuario) => (
        <>
            <span className="p-column-title">Código</span>
            {rowData.id}
        </>
    );

    const nomeBodyTemplate = (rowData: Projeto.Usuario) => (
        <>
            <span className="p-column-title">Nome</span>
            {rowData.nome}
        </>
    );

    const loginBodyTemplate = (rowData: Projeto.Usuario) => (
        <>
            <span className="p-column-title">Login</span>
            {rowData.login}
        </>
    );

    const emailBodyTemplate = (rowData: Projeto.Usuario) => (
        <>
            <span className="p-column-title">Email</span>
            {rowData.email}
        </>
    );

    const actionBodyTemplate = (rowData: Projeto.Usuario) => (
        <>
            <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUsuario(rowData)} />
            <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUsuario(rowData)} />
        </>
    );

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Usuários</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const usuarioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveUsuario} />
        </>
    );

    const deleteUsuarioDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteUsuarioDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteUsuario} />
        </>
    );

    const deleteUsuariosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteUsuariosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedUsuarios} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

                    <DataTable
                        ref={dt}
                        value={usuarios}
                        selection={selectedUsuarios}
                        onSelectionChange={(e) => setSelectedUsuarios(e.value as Projeto.Usuario[])}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} usuários"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum usuário encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nome" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="login" header="Login" sortable body={loginBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header="Email" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={usuarioDialog} style={{ width: '450px' }} header="Detalhes de Usuários" modal className="p-fluid" footer={usuarioDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText
                                id="nome"
                                value={usuario.nome}
                                onChange={(e) => onInputChange(e, 'nome')}
                                required
                                autoFocus
                                className={classNames({ 'p-invalid': submitted && !usuario.nome })}
                            />
                            {submitted && !usuario.nome && <small className="p-error">Nome é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="login">Login</label>
                            <InputText
                                id="login"
                                value={usuario.login}
                                onChange={(e) => onInputChange(e, 'login')}
                                required
                                className={classNames({ 'p-invalid': submitted && !usuario.login })}
                            />
                            {submitted && !usuario.login && <small className="p-error">Login é obrigatório.</small>}
                        </div>

                        <div className="field">
                       <label htmlFor="senha">Senha</label>
                       <InputText
                             id="senha"
                             value={usuario.senha}
                             onChange={(e) => onInputChange(e, 'senha')}
                             required
                             className={classNames({ 'p-invalid': submitted && !usuario.senha })}
                              />
                            {submitted && !usuario.senha && <small className="p-error">Senha é obrigatória.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                value={usuario.email}
                                onChange={(e) => onInputChange(e, 'email')}
                                required
                                className={classNames({ 'p-invalid': submitted && !usuario.email })}
                            />
                            {submitted && !usuario.email && <small className="p-error">Email é obrigatório.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsuarioDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteUsuarioDialogFooter} onHide={hideDeleteUsuarioDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && <span>Você tem certeza que deseja deletar <b>{usuario.nome}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsuariosDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteUsuariosDialogFooter} onHide={hideDeleteUsuariosDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && <span>Você tem certeza que deseja deletar os usuários selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};


export default Usuario;
