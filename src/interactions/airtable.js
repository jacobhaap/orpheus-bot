import { getInfoForUser, transcript } from '../utils'

export default async (bot, message) => {
  try {
    const { slackUser } = await getInfoForUser(message.user)

    if (!slackUser.is_owner) {
      throw new Error('Only Slack owners can run this command!')
    }

    const userID = message.text.match(/<@([a-zA-Z0-9]*)>/)[1]

    if (!userID) {
      throw new Error('No user was tagged in the message!')
    }

    const info = await getInfoForUser(userID)

    if (!info.person) {
      throw new Error(
        'No Airtable could be found or created for the user in question'
      )
    }

    bot.replyPrivateDelayed(message, JSON.stringify(info))
  } catch (err) {
    console.error(err)
    bot.replyPrivateDelayed(message, transcript('errors.general', { err }))
  }
}
