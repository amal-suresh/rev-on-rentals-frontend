
// export const userApi ="https://rev-on-rentals-1.onrender.com/"
// export const adminApi ="https://rev-on-rentals-1.onrender.com/admin"
// export const partnerApi ="https://rev-on-rentals-1.onrender.com/partner"
// export const socketApi ="https://rev-on-rentals-1.onrender.com/"


const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

export const userApi = cleanBaseUrl;
export const adminApi = `${cleanBaseUrl}admin`;
export const partnerApi = `${cleanBaseUrl}partner`;
export const socketApi = cleanBaseUrl;




