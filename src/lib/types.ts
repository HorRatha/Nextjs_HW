export type CreateCarType = {
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    description: string;
    color: string;
    fuel_type: string;
    transmission: string;
    image: string;
};

export type UpdateCarType = {
    id?: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    description: string;
    color: string;
    fuel_type: string;
    transmission: string;
    image: string;
};

export type LoginData = {
    email: string;
    password: string;
};

export type SignupData = {
    username: string;
    email: string;
    password: string;
    confirmed_password: string;
};

export type LoginResponse = {
    token?: string;
    access_token?: string;
    accessToken?: string;
    authToken?: string;
    refreshToken?: string;
    refresh_token?: string;
    user?: any;
    message?: string;
};