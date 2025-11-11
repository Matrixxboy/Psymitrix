export const fetchAdminData = async (adminData) => {
    try {
        const response = await api.post(
            'admin/login',
            adminData
        );
        return { success: true, data: response.data.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to login as Admin' }
    }
}