export declare namespace Projeto {
    type Usuario = {
        id?: number;
        nome: string;
        login: string;
        senha: string;
        email: string;
    };
    type Recurso = {
        id?: number;
        nome: string;
        chave: string;
    }

    type Perfil = {
        nome: any;
        length: number;
        id?: number;
        descricao: string;
    }

    type PerfilUsuario = {
        id?: number;
        perfil: Perfil;
        usuario: Usuario;
    }

    type PermissaoPerfilRecurso = {
        id?: number;
        perfil: Perfil;
        recurso: Recurso;
    }

}
