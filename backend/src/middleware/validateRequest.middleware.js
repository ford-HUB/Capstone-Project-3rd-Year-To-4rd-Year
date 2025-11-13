
export const validateRequest = (definedSchema) => {
    return (req, res, next) => {
        const { error, value } = definedSchema.validate(req.body, { abortEarly: false, convert: true })

        if(error)
        {
            const errorMessage = error.details.map(detail => detail.message); // all the messages na iyang ma kuha is it will pass to errorMessage var
            return res.json({ success: false, message: errorMessage.join(', ') })
        }

        req.validatedBody = value
        next()

    }
}