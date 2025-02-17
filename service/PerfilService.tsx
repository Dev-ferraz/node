// PerfilService.ts
import { BaseService } from './BaseService';

export class PerfilService extends BaseService {
    constructor() {
        super("/Perfil");  // Define o endpoint base para PerfilService
    }
}
