export default function validString(value) {
    // check the type
    if (typeof(value) !== 'string') {
        return false;
    }
    // check that is consists of characters that arent just spaces
    const spaceLessString = value.replace(/\s/g, ''); // this uses regex to remove "whitespace" (spaces)
    if (!spaceLessString.length) {
        return false;
    }
    // if value contains non-space characters and it is a string, it is valid
    else {
        return true;
    }
}
