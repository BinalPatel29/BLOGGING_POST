import { application } from "express";

export async function apiFetch(endpoint, options = {}) {
    const baseurl = 'http://localhost:3000';
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type' : 'application.json',
        ...( token ? { Authorization : `Bearer ${token}` } : {} ),
        ...apiFetch( options.headers || {})
    };

    const url = endpoint.startsWith('http') ? endpoint : `${baseurl}${endpoint}`;

    try{
        const response = await fetch(url , {
            ...options,
            headers
        });

        if(!response.ok){
            const errorText = await response.text();
            throw new Error(`Response status: ${response.status} ${errorText}`);

            const contentType = response.headers.get('content-type');
            if(contentType && contentType.includes('application.json')){
                return await response.json();
            }
            return await response.text();
        }
    }
    catch(error){
        console.error(error.message);
        throw error;
    }
}