import models from "../../models/index.js"

export const createCertificateTemplate = async (req, res) => {
    try {
        const { html_raw_template, default_cert_title } = req.validatedBody
        const { left_logo, center_logo, right_logo, signature_img, badge_img } = req.files.path
        const category_id = req.params.category_id

        const { Certificate_Template } = models

        const leftLogoPath = left_logo?.[0]?.path || null;
        const centerLogoPath = center_logo?.[0]?.path || null;
        const rightLogoPath = right_logo?.[0]?.path || null;
        const signatureImgPath = signature_img?.[0]?.path;
        const badgeImgPath = badge_img?.[0]?.path || null;

        if(!signatureImgPath) { return res.json({ message: 'Signature image is required' }) }


        const existingTemplate = await Certificate_Template.findOne({ where: { category_id: category_id } })
        if(existingTemplate) { return res.json({ message: 'template is already exist ' }) }

        const newTemplate = await Certificate_Template.create({
            category_id: category_id,
            html_raw_template: html_raw_template,
            left_logo: leftLogoPath,
            center_logo: centerLogoPath,
            right_logo: rightLogoPath,
            signature_img: signatureImgPath,
            badge_img: badgeImgPath,
            default_cert_title: default_cert_title
        })

        if(!newTemplate) { return res.json({ message: 'new template failed to create' }) }

        return res.json({ success: true, message: 'Certificate Template Saved' })

    } catch (error) {
        res.json({ message: 'Internal Server Error' })
        console.log('create template failed: ', error.message)
    }
}

export const insertSelectedTemplate = async (req, res) => {
    try {
        const selectedTemplateId = req.params.templete_id
        const selectedEventId = req.params.event_id
        const imageFile = req.files

        const { Event, Category, Certificate_Template } = models

        const event = await Event.findByPk(selectedEventId, {
            include: {
                model: Category,
                include: {
                    model: Certificate_Template,
                    as: 'cert_template'
                }
            }
        })

        if(!event || !event.Category || !event.Category.cert_template) { return res.json({ message: 'Event or template not found' }) }
        
        

        

    } catch (error) {
        res.json({ message: 'Internal Server Error' })
        console.log('insert selected template failed: ', error.message)
    }
}