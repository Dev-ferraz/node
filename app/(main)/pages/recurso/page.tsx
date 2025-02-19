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
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Projeto } from '@/types/projeto';
import { RecursoService } from '@/service/RecursoService';
//import { UsuarioService } from '@/service/UsuarioService';
//const usuarioService = new UsuarioService();

function Recurso() {
    let recursoVazio: Projeto.Recurso = {
        id: 0,
        nome: '',
        chave: '',
    };

    const [recursos, setRecursos] = useState<Projeto.Recurso[]>([]);
    const [recursoDialog, setRecursoDialog] = useState(false);
    const [deleteRecursoDialog, setDeleteRecursoDialog] = useState(false);
    const [deleteRecursosDialog, setDeleteRecursosDialog] = useState(false);
    const [recurso, setRecurso] = useState<Projeto.Recurso>(recursoVazio);
    const [selectedRecursos, setSelectedRecursos] = useState<Projeto.Recurso[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const recursoService = useMemo(() => new RecursoService(), []);
//-----------------------------------------------------------------------------------------------
    useEffect(() => {
        if(recursos.length == 0)
        recursoService.listarTodos()
            .then((response) => {
                console.log(response.data);
                if (Array.isArray(response.data)) {
                    setRecursos(response.data); // Atualizar com os dados recebidos
                } else {
                    setRecursos([]); // Se não for um array, definir como array vazio
                }
            })
            .catch((error) => {
                console.error(error);
                setRecursos([]); // Em caso de erro, garantir que `usuarios` seja um array vazio
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recursoService, recurso]);

//-----------------------------------------------------------------------------------------------

    const openNew = () => {
        setRecurso(recursoVazio);
        setSubmitted(false);
        setRecursoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setRecursoDialog(false);
    };

    const hideDeleteRecursoDialog = () => {
        setDeleteRecursoDialog(false);
    };

    const hideDeleteRecursosDialog = () => {
        setDeleteRecursosDialog(false);
    };
//---------------------------------------------------------------------
//   Onde eu chamo meu front-end
const saveRecurso = () => {
    setSubmitted(true);

    if (!recurso.id) {
        recursoService.inserir(recurso)
            .then((response) => {
                setRecursos([...recursos, response.data]);
                setRecurso(recursoVazio);
                setRecursoDialog(false);
                setRecursos ([]);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Recurso cadastrado com sucesso!'
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
        recursoService.alterar(recurso.id, recurso)
            .then((response) => {
                const updatedRecursos = recursos.map((u) => (u.id === recurso.id ? response.data : u));
                setRecursos(updatedRecursos);
                setRecurso(recursoVazio);
                setRecursoDialog(false);
                setRecursos ([]);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Recurso alterado com sucesso!'
                });
            }).catch((error) => {
                console.error(error.response.data.message);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao alterar recurso! ' + error.response.data.message // Alterado para error.response
                });
            });
    }
};

//-----------------------------------------------------------------

    const editRecurso = (recurso: Projeto.Recurso) => {
        setRecurso({ ...recurso });
        setRecursoDialog(true);
    };

    const confirmDeleteRecurso = (usuario: Projeto.Recurso) => {
        setRecurso(usuario);
        setDeleteRecursoDialog(true);
    };
//------------------------------------------------------------------
//Deletar------------
const deleteRecurso = () => {
    if (recurso.id) {
        recursoService.excluir(recurso.id).then((response) => {
            // Aqui, você pode atualizar a lista de usuários em vez de limpá-la
            setRecursos(prevRecursos => prevRecursos.filter(u => u.id !== recurso.id));
            setRecurso(recursoVazio);
            setDeleteRecursoDialog(false);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Recurso deletado com sucesso!',
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

    //----------------------------------------

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteRecursosDialog(true);
    };


//--------------------------------------------
//deletar varios usuários
    const deleteSelectedRecursos = () => {

        Promise.all(selectedRecursos?.map(async (_recurso) => {
            if(_recurso.id){
           await recursoService.excluir(_recurso.id)
        }

        })).then((response) => {
            setRecursos ([]);
            setRecurso(recursoVazio);
            setDeleteRecursoDialog(false);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Recurso deletado com sucesso!',
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

        setDeleteRecursosDialog(false);
    };
//-------------------------------------------------------------------
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, nome: string) => {
        const val = e.target.value || '';
        let _recurso = { ...recurso };
        _recurso[nome] = val;

        setRecurso(_recurso);
    };

    const leftToolbarTemplate = () => (
        <div className="my-2">
            <Button label="Novo" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
            <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedRecursos || !selectedRecursos.length} />
        </div>
    );

    const rightToolbarTemplate = () => (
        <React.Fragment>
            <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Importar" className="mr-2 inline-block" />
            <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={exportCSV} />
        </React.Fragment>
    );

    const idBodyTemplate = (rowData: Projeto.Recurso) => (
        <>
            <span className="p-column-title">Código</span>
            {rowData.id}
        </>
    );

    const nomeBodyTemplate = (rowData: Projeto.Recurso) => (
        <>
            <span className="p-column-title">Nome</span>
            {rowData.nome}
        </>
    );


    const chavelBodyTemplate = (rowData: Projeto.Recurso) => (
        <>
            <span className="p-column-title">Chave</span>
            {rowData.chave}
        </>
    );

    const actionBodyTemplate = (rowData: Projeto.Recurso) => (
        <>
            <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editRecurso(rowData)} />
            <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteRecurso(rowData)} />
        </>
    );

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Recursos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const recursoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveRecurso} />
        </>
    );

    const deleteRecursoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteRecursoDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteRecurso} />
        </>
    );

    const deleteRecursosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteRecursosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedRecursos} />
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
                        value={recursos}
                        selection={selectedRecursos}
                        onSelectionChange={(e) => setSelectedRecursos(e.value as Projeto.Recurso[])}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} usuários"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum recurso encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nome" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="chave" header="Chave" sortable body={chavelBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>

                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={recursoDialog} style={{ width: '450px' }} header="Detalhes de Recursos" modal className="p-fluid" footer={recursoDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText
                                id="nome"
                                value={recurso.nome}
                                onChange={(e) => onInputChange(e, 'nome')}
                                required
                                autoFocus
                                className={classNames({ 'p-invalid': submitted && !recurso.nome })}
                            />
                            {submitted && !recurso.nome && <small className="p-error">Recurso é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="chave">Chave</label>
                            <InputText
                                id="login"
                                value={recurso.chave}
                                onChange={(e) => onInputChange(e, 'chave')}
                                required
                                className={classNames({ 'p-invalid': submitted && ! recurso.chave })}
                            />
                            {submitted && !recurso.chave && <small className="p-error">Chave é obrigatório.</small>}
                        </div>

                    </Dialog>

                    <Dialog visible={deleteRecursoDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteRecursoDialogFooter} onHide={hideDeleteRecursoDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {recurso && <span>Você tem certeza que deseja deletar o recurso<b>{recurso.nome}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteRecursosDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteRecursosDialogFooter} onHide={hideDeleteRecursosDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {recurso && <span>Você tem certeza que deseja deletar os recursos selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Recurso;
