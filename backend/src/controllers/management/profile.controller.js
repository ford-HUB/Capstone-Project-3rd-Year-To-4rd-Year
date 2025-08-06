import models from "../../models/index.js";

export const createOrUpdateInfo = async (req, res) => {
  try {
    const { firstname, lastname, middle_initial, gender, email_address, phone_number, bio, department } = req.validatedBody
    const { Staff, Coordinator, Department } = models

    const accountId = req.user.account_id
    const roleType = req.user.Role.name

    const staffPk = await Staff.findOne({ where: { account_id: accountId } })
    const coordinatorPk = await Coordinator.findOne({ where: { account_id: accountId } })
    
    if (req.user.Role.name !== 'staff' && !req.validatedBody.department) {
      return res.json({ message: 'Department is required for coordinators' });
    }

    if(roleType !== 'staff') {
      const [dept] = await Department.findOrCreate({
        where: { department_name: department },
        defaults: {
          department_name: department
        }
      })

      await Coordinator.upsert({
        coordinator_id: coordinatorPk?.coordinator_id,
        account_id: accountId,
        department_id: dept.department_id,
        firstname: firstname,
        lastname: lastname,
        middle_initial: middle_initial,
        gender: gender,
        email_address: email_address,
        phone_number: phone_number === '' ? null : phone_number,
        bio: bio
      })

      return res.json({ success: true, message: 'Information successfully created' })
    }

    await Staff.upsert({
      staff_id: staffPk?.staff_id,
      account_id: accountId,
      firstname: firstname,
      lastname: lastname,
      middle_initial: middle_initial,
      gender: gender,
      email_address: email_address,
      phone_number: phone_number === '' ? null : phone_number,
      bio: bio
    })

    return res.json({ success: true, message: 'Information successfully created' })

  } catch (error) {
    res.json({ success: false, message: 'Internal Server Error' })
    console.log('create or update management info failed', error.message)
  }
}

export const createOrUpdateAddress = async (req, res) => {
  try {
    const { province, city, postal_code, brgy } = req.validatedBody
    const { Staff, Coordinator } = models

    const accountId = req.user.account_id
    const roleType = req.user.Role.name

    if(roleType !== 'staff') {
      await Coordinator.update(
        {
          province: province,
          city: city,
          postal_code: postal_code,
          brgy: brgy
        },{ where: { account_id: accountId } }
      )

      return res.json({ success: true, message: 'address successfully added' })
    }

    await Staff.update(
      {
        province: province,
        city: city,
        postal_code: postal_code,
        brgy: brgy
      },{ where: { account_id: accountId } }
    )

    return res.json({ success: true, message: 'address successfully added' })

  } catch (error) {
    res.json({ success: false, message: 'Internal Server Error' })
    console.log('create or update management address failed ', error.message)
  }
}

export const updateAccountEmailAvatar = async (req, res) => {
  try {
    const { email } = req.validatedBody
    const { Accounts, Staff, Coordinator } = models
    const avatar = req.file.path
    const accountId = req.user.account_id
    const roleType = req.user.Role.name

    const newEmail = await Accounts.update(
      { email: email },
      { where: { account_id: accountId } }
    )

    if(!newEmail) { return res.json({ success: false, message: 'account email failed to update' }) }

    if(roleType !== 'staff') {
      const updateAvatar = await Coordinator.update(
        { profile_image: avatar },
        { where: { account_id: accountId } }
      )

      if(!updateAvatar) { return res.json({ message: 'avatar failed to upload' }) }
      return res.json({ success: true, message: 'account successfully updated' })
    }

    const updateAvatar = await Staff.update(
      { profile_image: avatar },
      { where: { account_id: accountId } }
    )

    if(!updateAvatar) { return res.json({ success: false, message: 'avatar failed to upload' }) }
    return res.json({ success: true, message: 'account successfully updated' })

  } catch (error) {
    res.json({ success: true, message: 'Internal Server Error' })
    console.log('update account management failed: ', error.message)
  }
}

export const updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.validatedBody
    const { Accounts } = models
    const accountId = req.user.account_id

    let salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(newPassword, salt)

    const accountValid = await Accounts.findOne({ where: { account_id: accountId } })

    if(!accountValid) { return res.json({ message: 'account not found' }) }

    const updatePassword = await Accounts.update(
      { password: hashPassword },
      { where: { account_id: accountValid.account_id } }
    )

    if(!updatePassword) { return res.json({ success: false, message: 'password failed to change' }) }

    return res.json({ success: true, message: 'password successfully changed' })

  } catch (error) {
    res.json({ success: false, message: 'Internal Server Error' })
    console.log('new password management failed: ', error.message)
  }
}
