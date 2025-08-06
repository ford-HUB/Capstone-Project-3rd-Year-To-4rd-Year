import models from "../../models/index.js"
import { db } from "../../config/db.js"

export const addEvent = async (req, res) => {
    const t = await db.transaction()
    try {
        const {
            title,
            description,
            event_started,
            event_ended,
            location,
            max_participants,
            organizer_name,
            category,
            department,
        } = req.validatedBody

        const event_image = req.file.path

        if (!req.file) { return res.json({ message: 'Event image is required' }) }

        const {
            Event,
            Category,
            Department,
            EventDepartment,
            EventCategory,
            Organizer
        } = models


        const organizer = await Organizer.create({
            name: organizer_name
        }, { transaction: t })

        const newEvent = await Event.create({
            title: title,
            description: description,
            event_started: event_started,
            event_ended: event_ended,
            location: location,
            latitude: null,
            longitude: null,
            max_participants: max_participants,
            organizer_id: organizer.organizer_id,
            event_image: event_image
        }, { transaction: t })

        const newCategory = await Category.create({
            name: category
        }, { transaction: t })

        await EventCategory.create({
            event_id: newEvent.event_id,
            category_id: newCategory.category_id
        }, { transaction: t })

        // if the the category is school then it will insert department
        if(category === 'School')
        {
            const newDepartment = await Department.create({
            department_name: department
            }, { transaction: t })

            await EventDepartment.create({
                event_id: newEvent.event_id,
                department_id: newDepartment.department_id
            }, { transaction: t })
        }

        await t.commit()
        res.json({ success: true, message: 'Event Successfully Created' })

        
    } catch (error) {
        await t.rollback()
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('Add Event controller failed :', error.message)
    }
}

export const listEvent = async (req, res) => {
    try {
        const {
            Event,
            Category,
            Department,
            Organizer
        } = models

        const events = await Event.findAll({ include: [
            {
                model: Category,
                through: { attributes: [] }
            },
            {
                model: Department,
                through: { attributes: [] }
            },
            {
                model: Organizer
            }
        ] })

        if(!events) { return res.json({ message: 'event list not empty' }) }
        
        res.json({ success: true, message: 'list of events', list: events })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('Get Event controller failed :', error.message)
    }
}

export const updateEvent = async (req, res) => {
    const t = await db.transaction(); 

    try {
        const id = req.params.id;
        const {
            title,
            description,
            event_started,
            event_ended,
            location,
            max_participants,
            organizer_name,
            category,
            department,
        } = req.validatedBody;

        const event_image = req.file.path

        const {
            Event,
            Category,
            Department,
            EventDepartment,
            EventCategory,
            Organizer
        } = models;

        const eventExist = await Event.findOne({
            where: { event_id: id },
            include: [
                {
                    model: Category,
                    through: { attributes: [] }
                },
                {
                    model: Department,
                    through: { attributes: [] }
                },
                {
                    model: Organizer
                }
            ]
        });

        if (!eventExist) {
            return res.status(404).json({ message: 'Event not found' });
        }

        await Organizer.update(
            { name: organizer_name },
            {
                where: { organizer_id: eventExist.Organizer?.organizer_id },
                transaction: t
            }
        );

        await Event.update({
            title,
            description,
            event_started,
            event_ended,
            location,
            max_participants,
            event_image
        }, {
            where: { event_id: eventExist.event_id },
            transaction: t
        });

        // Update first Category if exist
        const currentCategory = eventExist.Categories?.[0];
        if (currentCategory) {
            await Category.update(
                { name: category },
                {
                    where: { category_id: currentCategory.category_id },
                    transaction: t
                }
            );

            await EventCategory.update(
                {
                    event_id: eventExist.event_id,
                    category_id: currentCategory.category_id
                },
                {
                    where: {
                        event_id: eventExist.event_id,
                        category_id: currentCategory.category_id
                    },
                    transaction: t
                }
            );
        }

        if (category === 'School') {
            const currentDept = eventExist.Departments?.[0];
            if (currentDept) {
                await Department.update(
                    { department_name: department },
                    {
                        where: { department_id: currentDept.department_id },
                        transaction: t
                    }
                );

                await EventDepartment.update(
                    {
                        event_id: eventExist.event_id,
                        department_id: currentDept.department_id
                    },
                    {
                        where: {
                            event_id: eventExist.event_id,
                            department_id: currentDept.department_id
                        },
                        transaction: t
                    }
                );
            }
        }

        await t.commit();
        return res.json({ success: true, message: 'Event Successfully Updated' });

    } catch (error) {
        await t.rollback();
        console.error('Update Event controller failed:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const destroyEventId = async (req, res) => {
    const t = await db.transaction()
    try {
        const id = req.params.id
        const { Event, Category } = models

        const event = await Event.findOne({ where: { event_id: id },
            include: [
                {
                    model: Category,
                    through: { attributes: [] }
                }
            ],
            transaction: t
        })

        if(!event) { t.rollback(); return res.json({ message: 'event id not found' }) }

        await Event.destroy({ where: { event_id: event.event_id }, transaction: t })

        const category = event.Categories?.[0]
        await Category.destroy({ where: { category_id: category.category_id }, transaction: t })
        
        await t.commit()
        res.json({ success: true, message: 'select event successfully deleted' })

    } catch (error) {
        await t.rollback()
        console.error('Delete Event By Id controller failed:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const destroyEvents = async (req, res) => {
    try {
        const { Event, EventCategory } = models

        await Event.destroy({ where: {}, truncate: false })
        await EventCategory.destroy({ where: {}, truncate: false })

        res.json({ success: true, message: 'All Events Successfully Destroyed' })

    } catch (error) {
        console.error('Delete All Events controller failed:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
