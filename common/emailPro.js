export const emailPro = (str) => {
    let str1 = ''
    for (let i=0; i<str.length; i++) {
        if(str[i] == '.' || str[i] == '#' || str[i] == '$' || str[i] == '/' || str[i] == '[' || str[i] == ']') {str1 += '_'}
        else str1 += str[i]
    }
    return str1
}