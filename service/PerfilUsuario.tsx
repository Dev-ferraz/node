import { BaseService } from "./BaseService";

export class PerfilUsuarioService extends BaseService {
    api: any;
    basePath: any;
    constructor() {
        super("/perfilUsuario");
    }

    // Método para alterar o perfil do usuário
    alterar(perfilUsuario) {
        // Assume que o perfilUsuario possui um id que é usado na URL
        return this.api.put(`${this.basePath}/${perfilUsuario.id}`, perfilUsuario);
    }
}
