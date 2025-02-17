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
import { PerfilService } from '@/service/PerfilService';
import '@styles/Perfil.css';

//import { UsuarioService } from '@/service/UsuarioService';
//const usuarioService = new UsuarioService();


function Perfil() {
    let perfilVazio: Projeto.Perfil = {
        id: 0,
        descricao: '',
        length: 0,
        nome: undefined
    };

    const [perfils, setPerfils] = useState<Projeto.Perfil[]>([]);
    const [perfilDialog, setPerfilDialog] = useState(false);
    const [perfilDialogVisible, setPerfilDialogVisible] = useState(false);
    const [deletePerfilDialog, setDeletePerfilDialog] = useState(false);
    const [deletePerfilsDialog, setDeletePerfilsDialog] = useState(false);
    const [perfil, setPerfil] = useState<Projeto.Perfil>(perfilVazio);
    const [selectedPerfils, setSelectedPerfils] = useState<Projeto.Perfil[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const perfilService = useMemo(() => new PerfilService(), []);
//-----------------------------------------------------------------------------------------------
useEffect(() => {
    perfilService.ListarTodos()
        .then((response) => {
            console.log(response.data);
            if (Array.isArray(response.data)) {
                setPerfils(response.data);
            } else {
                setPerfils([]);
            }
        })
        .catch((error) => {
            console.error(error);
            setPerfils([]);
        });
}, [perfilService]);  // Remover `perfil` da lista de dependências

//-----------------------------------------------------------------------------------------------

const openNewPerfilDialog = () => {
    setPerfil(perfilVazio);
    setSubmitted(false);
    setPerfilDialog(true);  // Consistente com o estado perfilDialog
};

const hideDialog = () => {
    setSubmitted(false);
    setPerfilDialog(false);  // Usando setPerfilDialog para fechar o diálogo
};

const hideDeletePerfilDialog = () => {
    setDeletePerfilDialog(false);
};

const hideDeletePerfilsDialog = () => {
    setDeletePerfilsDialog(false);
};

const savePerfil = () => {
    setSubmitted(true);

    if (!perfil.id) {
        perfilService.inserir(perfil)
            .then((response) => {
                setPerfils([...perfils, response.data]);
                setPerfil(perfilVazio);
                setPerfilDialogVisible(false);
                setPerfilDialog(false);

                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Perfil cadastrado com sucesso!'
                });
            })
            .catch((error) => {
                console.error(error.response?.data?.message || 'Erro ao salvar!');
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao salvar! ' + (error.response?.data?.message || 'Erro desconhecido')
                });
            });
    } else {
        perfilService.alterar(perfil.id, perfil)
            .then((response) => {
                const updatedPerfils = perfils.map((u) => (u.id === perfil.id ? response.data : u));
                setPerfils(updatedPerfils);
                setPerfil(perfilVazio);
                setPerfilDialogVisible(true);
                setPerfilDialog(false);

                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Perfil alterado com sucesso!'
                });
            })
            .catch((error) => {
                console.error(error.response?.data?.message || 'Erro ao alterar perfil!');
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao alterar perfil! ' + (error.response?.data?.message || 'Erro desconhecido')
                });
            });
    }
};

// Editar perfil
const editPerfil = (perfil: Projeto.Perfil) => {
    setPerfil({ ...perfil });
    setPerfilDialogVisible(true);
};

// Confirmar exclusão
const confirmDeletePerfil = (perfil: Projeto.Perfil) => {
    setPerfil(perfil);
    setDeletePerfilDialog(true);
};

// Deletar perfil
const deletePerfil = () => {
    if (perfil.id) {
        perfilService.excluir(perfil.id).then(() => {
            setPerfils((prevPerfils) => prevPerfils.filter((u) => u.id !== perfil.id));
            setPerfil(perfilVazio);
            setDeletePerfilDialog(false);
            setPerfilDialog(false);

            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Perfil deletado com sucesso!',
                life: 3000
            });
        }).catch(() => {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: 'Erro ao deletar perfil!',
                life: 3000
            });
        });
    }
};

const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeletePerfilsDialog(true);
};

// Deletar vários perfis
const deleteSelectedPerfils = () => {
    Promise.all(
        selectedPerfils.map(async (selectedPerfil) => {
            if (selectedPerfil.id) {
                await perfilService.excluir(selectedPerfil.id);
            }
        })
    )
        .then(() => {
            setPerfils(perfils.filter((p) => !selectedPerfils.includes(p)));
            setSelectedPerfils([]);
            setDeletePerfilsDialog(false);
            setPerfilDialog(false);

            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Perfis deletados com sucesso!',
                life: 3000
            });
        })
        .catch(() => {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: 'Erro ao deletar perfis!',
                life: 3000
            });
        });
};
//-------------------------------------------------------------------
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, nome: string) => {
        const val = e.target.value || '';
        let _perfil = { ...perfil };
        _perfil[nome] = val;

        setPerfil(_perfil);
    };
//---------------------------------------------
// Editar meu botoes novo, excluir
    const leftToolbarTemplate = () => (
        <div className="my-2">
            <Button
                label="Novo"
                icon="pi pi-plus"
                severity="success"
                className="mr-2 button-novo"
                onClick={openNewPerfilDialog}
            />
            <Button
                label="Excluir"
                icon="pi pi-trash"
                severity="danger"
                className="button-excluir"
                onClick={confirmDeleteSelected}
                disabled={!selectedPerfils || !selectedPerfils.length}
            />
        </div>
    );
//------------------------------------------------------------
    const rightToolbarTemplate = () => (
        <React.Fragment>
            <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Importar" className="mr-2 inline-block" />
            <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={exportCSV} />
        </React.Fragment>
    );

    const idBodyTemplate = (rowData: Projeto.Perfil) => (
        <>
            <span className="p-column-title">Código</span>
            {rowData.id}
        </>
    );

    const descricaoBodyTemplate = (rowData: Projeto.Perfil) => (
        <>
            <span className="p-column-title">Descrição</span>
            {rowData.descricao}
        </>
    );



    const actionBodyTemplate = (rowData: Projeto.Perfil) => (
        <>
            <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPerfil(rowData)} />
            <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePerfil(rowData)} />
        </>
    );

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Perfil</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const perfilDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={savePerfil} />
        </>
    );

    const deletePerfilDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deletePerfil} />
        </>
    );

    const deletePerfilsDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilsDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedPerfils} />
        </>
    );

    return (
        <div className="grid crud-demo page-background"> {/* Adicione a classe aqui */}
        <div className="col-12">
            <div className="card">
                <Toast ref={toast} />
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

                <DataTable
                    ref={dt}
                    value={perfils}
                    selection={selectedPerfils}
                    onSelectionChange={(e) => setSelectedPerfils(e.value as Projeto.Perfil[])}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    className="datatable-responsive"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} usuários"
                    globalFilter={globalFilter}
                    emptyMessage="Nenhuma descrição encontrado."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                    <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    <Column field="descricao" header="Descrição" sortable body={descricaoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={perfilDialog} style={{ width: '450px' }} header="Detalhes da Descrição" modal className="p-fluid" footer={perfilDialogFooter} onHide={hideDialog}>
                    <div className="field">
                        <label htmlFor="descricao">Descrição</label>
                        <InputText
                            id="descricao"
                            value={perfil.descricao}
                            onChange={(e) => onInputChange(e, 'descricao')}
                            required
                            autoFocus
                            className={classNames({ 'p-invalid': submitted && !perfil.descricao })}
                        />
                        {submitted && !perfil.descricao && <small className="p-error">Descrição obrigatória.</small>}
                    </div>
                </Dialog>

                <Dialog visible={deletePerfilDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deletePerfilDialogFooter} onHide={hideDeletePerfilDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {perfil && <span>Você tem certeza que deseja deletar <b>{perfil.descricao}</b>?</span>}
                    </div>
                </Dialog>

                <Dialog visible={deletePerfilsDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deletePerfilsDialogFooter} onHide={hideDeletePerfilsDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {perfil && <span>Você tem certeza que deseja deletar descrição?</span>}
                    </div>
                </Dialog>
            </div>
        </div>
    </div>
    )
};


export default Perfil;
