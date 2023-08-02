export const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * nombre: needs to be a string, received: ${user.firstname};
    * apellido: needs to be a string, received: ${user.lastname};
    * email: needs to be a string, received: ${user.email};
    * password: needs to be a string, received: ${user.password};
    * age: needs to be a number, received: ${user.age};`;
}

export const loginUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * email: needs to be a string, received: ${user.email};
    * password: needs to be a string, received: ${user.password};`
}

export const generateCartError = (cartID,cart) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * cart ID: needs to be an existing cart ID, received: ${cartID};
    * cart of mongo: needs to be a valid cart, not undefined, received: ${cart};`
}