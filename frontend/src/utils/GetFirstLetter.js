export const GetFirstLetter = (letters) => {

    if(letters === '' || letters === undefined) return

    const grabFirstLetter = letters?.charAt(0).toUpperCase()
    return grabFirstLetter
}