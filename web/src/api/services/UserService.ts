import { User, UserCreate, UserEdit, UserType } from '../models/User'
import { ADMIN_API_URL, ApiService } from './ApiService'

export class UserService {
    static async getUsers(type: UserType) {
        return await ApiService.get<User[]>(`${ADMIN_API_URL}/admin/users/${type.toLocaleLowerCase()}s`)
    }

    static async deleteOperator(userId: number) {
        return await ApiService.delete<boolean>(`${ADMIN_API_URL}/admin/users/${userId}`)
    }

    static async editUser(userId: number, user: UserEdit) {
        return await ApiService.post<boolean>(`${ADMIN_API_URL}/admin/users/${userId}`, JSON.stringify(user))
    }

    static async createOperator(user: UserCreate) {
        return await ApiService.post<boolean>(`${ADMIN_API_URL}/admin/users`, JSON.stringify(user))
    }
}
