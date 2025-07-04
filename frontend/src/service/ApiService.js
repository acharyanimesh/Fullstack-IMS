import axios from 'axios'
import cryptoJs from 'crypto-js'

export default class ApiService {
    static BASE_URL = 'http://localhost:5050'
    static ENCRYPTION_KEY = "inventorymgmtsys"

    // Encryption of data
    static encryptData(data) {
        return cryptoJs.AES.encrypt(data, this.ENCRYPTION_KEY).toString()
    }

    // Decryption of data
    static decryptData(data) {
        const bytes = cryptoJs.AES.decrypt(data, this.ENCRYPTION_KEY)
        return bytes.toString(cryptoJs.enc.Utf8)
    }

    // Save token with encryption
    static saveToken(token) {
        const encryptedToken = this.encryptData(token)
        localStorage.setItem('token', encryptedToken)
    }

    // Retrieve token
    static getToken() {
        const encryptedToken = localStorage.getItem('token')
        if (!encryptedToken) return null;
        return this.decryptData(encryptedToken)
    }

    // Save Role
    static saveRole(role) {
        const encryptedRole = this.encryptData(role)
        localStorage.setItem('role', encryptedRole)
    }

    // Retrieve Role
    static getRole() {
        const encryptedRole = localStorage.getItem('role')
        if (!encryptedRole) return null;
        return this.decryptData(encryptedRole)
    }

    // Check if user is authenticated
    static isAuthenticated() {
        const token = this.getToken()
        return token !== null && token !== ''
    }

    // Check if user is admin
    static isAdmin() {
        const role = this.getRole()
        return role === 'ADMIN'
    }

    // Check if user is manager or admin
    static isManagerOrAdmin() {
        const role = this.getRole()
        return role === 'ADMIN' || role === 'MANAGER'
    }

    // Logout user
    static logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    // Get headers for authenticated requests
    static getHeaders() {
        const token = this.getToken();
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }

    // Get headers without authentication
    static getPublicHeaders() {
        return {
            "Content-Type": "application/json"
        }
    }

    // AUTHENTICATION API METHODS
    static async register(registerData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/auth/register`, registerData, {
                headers: this.getPublicHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async login(loginData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/auth/login`, loginData, {
                headers: this.getPublicHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    // USER API METHODS
    static async getAllUsers(page = 0, size = 10) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/users?page=${page}&size=${size}`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async getUserById(userId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/users/${userId}`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async getCurrentUser() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/users/profile`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async updateUser(userId, userData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/users/${userId}`, userData, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async updateCurrentUser(userData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/users/profile`, userData, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async deleteUser(userId) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/api/users/${userId}`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    // CATEGORY API METHODS
    static async getAllCategories(page = 0, size = 10) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/categories?page=${page}&size=${size}`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async getCategoryById(categoryId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/categories/${categoryId}`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async createCategory(categoryData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/categories`, categoryData, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async updateCategory(categoryId, categoryData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/categories/${categoryId}`, categoryData, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async deleteCategory(categoryId) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/api/categories/${categoryId}`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    // SUPPLIER API METHODS
    static async getAllSuppliers(page = 0, size = 10) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/suppliers?page=${page}&size=${size}`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async getSupplierById(supplierId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/suppliers/${supplierId}`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async createSupplier(supplierData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/suppliers`, supplierData, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async updateSupplier(supplierId, supplierData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/suppliers/${supplierId}`, supplierData, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async deleteSupplier(supplierId) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/api/suppliers/${supplierId}`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    // PRODUCT API METHODS
    static async getAllProducts(page = 0, size = 10) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/products?page=${page}&size=${size}`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async getProductById(productId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/products/${productId}`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async getProductsByCategory(categoryId, page = 0, size = 10) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/products/category/${categoryId}?page=${page}&size=${size}`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async getLowStockProducts(threshold = 10, page = 0, size = 10) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/products/low-stock?threshold=${threshold}&page=${page}&size=${size}`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async createProduct(productData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/products`, productData, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async updateProduct(productId, productData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/products/${productId}`, productData, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async updateProductStock(productId, quantity, operation) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/products/${productId}/stock?quantity=${quantity}&operation=${operation}`, {}, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async deleteProduct(productId) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/api/products/${productId}`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    // TRANSACTION API METHODS
    static async getAllTransactions(page = 0, size = 10) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/transactions?page=${page}&size=${size}`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async getTransactionById(transactionId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/transactions/${transactionId}`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async getTransactionsByType(type, page = 0, size = 10) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/transactions/type/${type}?page=${page}&size=${size}`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async getTransactionsByStatus(status, page = 0, size = 10) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/transactions/status/${status}?page=${page}&size=${size}`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async purchaseProduct(transactionData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/transactions/purchase`, transactionData, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async sellProduct(transactionData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/transactions/sell`, transactionData, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async returnProduct(transactionData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/transactions/return`, transactionData, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async updateTransactionStatus(transactionId, status) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/transactions/${transactionId}/status?status=${status}`, {}, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    // DASHBOARD API METHODS
    static async getDashboardOverview() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/dashboard/overview`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async getInventoryAlerts() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/dashboard/alerts`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    static async getTopProducts(limit = 10) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/dashboard/top-products?limit=${limit}`, {
                headers: this.getHeaders()
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }
}


