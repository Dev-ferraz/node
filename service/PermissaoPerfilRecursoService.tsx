// PerfilService.ts
import { BaseService } from './BaseService';

export class PermissaoPerfilRecursoService extends BaseService {
    constructor() {
        super("/permissaoPerfilRecurso");  // Define o endpoint base para PerfilService
    }
}
