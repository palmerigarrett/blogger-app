export default function validEmail(value) {
    const atSignIndex = value.indexOf('@')
    const atSignExists = atSignIndex !== -1
    const dotIsValid = value.indexOf('.', atSignIndex) !== -1
    const isValidEmail = atSignExists && dotIsValid
    
    return isValidEmail
}
