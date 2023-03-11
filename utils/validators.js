

// Validate register input
export const validatRegisterInput = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {};
    if(username.trim() === ''){
        errors.username = "Username can't be empty.";
    }
    if(email.trim() === ''){
        errors.email = "Email can't be empty.";
    }else{
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if(!email.match(regEx)){
            errors.email = 'Email is invalid.';
        }
    }
    if(password === ''){
        errors.password = "Password can't be empty."
    }else if(password !== confirmPassword){
        errors.confirmPassword = "Passwords don't match."
    }

    return {
        errors,
        valid:Object.keys(errors).length < 1
    }
};



// Validate login input
export const validateLoginInput = (username, password) => {
    const errors = {};
    if(username === ''){
        errors.username = "Username can't be empty.";
    }
    if(password === ''){
        errors.password = "Password can't be empty.";
    }

    return {
        errors,
        valid:Object.keys(errors).length < 1
    }
};