import { User, UserCreate, UserEdit, UserType } from '../models/User'
import { ApiService } from './ApiService'

export class UserService {
    static async getUsers(type: UserType) {
        return await ApiService.get<User[]>(`http://localhost:8081/users/${type.toLocaleLowerCase()}s`)
    }

    static async deleteOperator(userId: number) {
        return await ApiService.delete<boolean>(`http://localhost:8081/users/${userId}`)
    }

    static async editUser(userId: number, user: UserEdit) {
        return await ApiService.post<boolean>(`http://localhost:8081/users/${userId}`, JSON.stringify(user))
    }

    static async createOperator(user: UserCreate) {
        return await ApiService.post<boolean>('http://localhost:8081/users', JSON.stringify(user))
    }
}
