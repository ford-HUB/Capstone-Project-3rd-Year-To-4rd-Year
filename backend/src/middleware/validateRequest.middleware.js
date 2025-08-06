
export const validateRequest = (definedSchema) => {
    return (req, res, next) => {
        const { error, value } = definedSchema.validate(req.body, { abortEarly: false })

        if(error)
        {
            const errorMessage = error.details.map(detail => detail.message); // all the messages na iyang ma kuha is it will pass to errorMessage var
            return res.json({ errorMessage })
        }

        req.validatedBody = value
        next()

    }
}