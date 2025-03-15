import { atom } from "recoil";

export const profileState = atom({
    key: 'user',
    default: {
        id: '',
        username: '',
        email: '',
        balance: 0,
        password: ''
    }
})