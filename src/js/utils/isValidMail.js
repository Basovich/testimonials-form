export function isValidMail(value) {
    const regExpEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return regExpEmail.test(value);
}
