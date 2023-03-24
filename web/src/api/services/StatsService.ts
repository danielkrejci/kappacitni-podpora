import { Stats } from '../models/Stats'
import { ADMIN_API_URL, ApiService } from './ApiService'

export class StatsService {
    static async getStats() {
        return await ApiService.get<Stats>(`${ADMIN_API_URL}/admin/stats`)
    }
}
