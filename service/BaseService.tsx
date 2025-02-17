
import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:8080"
});


export class BaseService {

    url: string;

    constructor(url: string){
        this.url = url;
    }


    ListarTodos() {
        return axiosInstance.get(this.url);
    }


    inserir(objeto: any) {
        return axiosInstance.post(this.url, objeto);
    }


    alterar(id: number, objeto: any) {
        return axiosInstance.put(`${this.url}/${id}`, objeto);
    }


    excluir(id: number) {
        return axiosInstance.delete(`${this.url}/${id}`);
    }
}
