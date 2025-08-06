import models from "../../models/index.js";
import bcrypt from "bcrypt"

export const getCurrentProfile = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const { Director, PaymentInfo } = models;

    const Info = await Director.findOne({
      where: { account_id: accountId },
      include: {
        model: PaymentInfo
      }
    });

    // Check if Director Info doesn't exist
    if (!Info) {
      return res.json({ success: false, info:null, message: 'Must manually add your personal information'});
    }
    
    return res.json({ success: true, directorInfo: Info, paymentInfo: Info.PaymentInfo || null });

  } catch (error) {
    res.json({ success: false, message: 'Internal Server Error' });
    console.error('get current profile failed:', error.message);
    return
  }
};

export const createOrUpdateDirectorInformation = async (req, res) => {
    try {
        const { facebook, insta, linkedin, X, firstname, lastname, email_address, phone_number, role_bio, school } = req.validatedBody
        const { Director, SocialLinks } = models

        const accountId = req.user.account_id
        console.log(accountId)
        const isDirectorExist = await Director.findOne({ where: { account_id: accountId } })

        const [newSocialLinks] = await SocialLinks.upsert({
            social_links_id: isDirectorExist?.social_links_id,
            facebook: facebook,
            insta: insta,
            linkedin: linkedin,
            X:X
        })

        const [newInfo] = await Director.upsert({
            director_id: isDirectorExist?.director_id,
            account_id: isDirectorExist ? isDirectorExist.account_id : accountId,
            social_links_id: newSocialLinks?.social_links_id,
            firstname: firstname,
            lastname: lastname,
            email_address: email_address,
            phone_number: phone_number,
            role_bio: role_bio,
            school: school
        })

        if(!newInfo) { return res.json({ success: true, message: 'Information not successfully created' }) }
        return res.json({ success: true, message: 'Information successfully created' })

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('create director info failed', error.message)
        return
    }
}

export const createOrUpdateDirectorAddress = async (req, res) => {
  try {
    const { province, city, postal_code, brgy } = req.validatedBody
    const { Director } = models

    const accountId = req.user.account_id

    const [newAddress] = await Director.update(
      {
        province: province,
        city: city,
        postal_code: postal_code,
        brgy: brgy
      },

      { where: { account_id: accountId } }
    )

    if(!newAddress) { return res.json({ success: false, message: 'address not successfully added' }) }

    return res.json({ success: true, message: 'address successfully added' })

  } catch (error) {
    res.json({ success: false, message: 'Internal Server Error' })
    console.log('create director address failed ', error.message)
    return
  }
}

export const updateAccountEmailAvatar = async (req, res) => {
  try {
    const { email } = req.validatedBody
    const { Accounts, Director } = models
    const avatar = req.file.path
    const accountId = req.user.account_id

    const defaultEmail = await Accounts.findByPk(accountId)

    const newEmail = await Accounts.update(
      { email: email ? email : defaultEmail},
      { where: { account_id: accountId } }
    )

    const updateProfile = await Director.update(
      { profile_image: avatar },
      { where: { account_id: accountId } }

    )

    if(!updateProfile) { return res.json({ success: false, message: 'avatar failed to upload' }) }

    if(!newEmail) { return res.json({ success: false, message: 'account email failed change' }) }

    return res.json({ success: true, message: 'profile successfully changed' })

  } catch (error) {
    res.json({ success: true, message: 'Internal Server Error' })
    console.log('update account email and avatar director failed: ', error.message)
  }
}

export const updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.validatedBody
    const { Accounts } = models
    const accountId = req.user.account_id

    let salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(newPassword, salt)

    const accoundValid = await Accounts.findOne({ where: { account_id: accountId } })

    if(!accoundValid) { return res.json({ success: false, message: 'account not found' }) }

    const updatePassword = await Accounts.update(
      { password: hashPassword },
      { where: { account_id: accoundValid.account_id } }
    )

    if(!updatePassword) { return res.json({ success: false, message: 'new password not successfully created' }) }

    return res.json({ success: true, message: 'new password successfully created' })

  } catch (error) {
    res.json({ success: false, message: 'Internal Server Error' })
    console.log('update password director failed: ', error.message)
  }
}
