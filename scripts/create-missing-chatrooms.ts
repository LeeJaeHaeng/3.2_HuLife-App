import { db } from '../lib/db'
import { communities, chatRooms } from '../lib/db/schema'
import { eq, notInArray } from 'drizzle-orm'
import { randomUUID } from 'crypto'

async function createMissingChatRooms() {
  console.log('Checking for communities without chat rooms...')

  // Get all communities
  const allCommunities = await db.query.communities.findMany()
  console.log(`Found ${allCommunities.length} communities`)

  // Get all existing chat rooms
  const existingChatRooms = await db.query.chatRooms.findMany()
  const communityIdsWithChatRooms = new Set(existingChatRooms.map(cr => cr.communityId))

  // Find communities without chat rooms
  const communitiesWithoutChatRooms = allCommunities.filter(
    c => !communityIdsWithChatRooms.has(c.id)
  )

  console.log(`Found ${communitiesWithoutChatRooms.length} communities without chat rooms`)

  if (communitiesWithoutChatRooms.length === 0) {
    console.log('All communities already have chat rooms!')
    return
  }

  // Create chat rooms for communities that don't have one
  for (const community of communitiesWithoutChatRooms) {
    const chatRoomId = randomUUID()
    await db.insert(chatRooms).values({
      id: chatRoomId,
      communityId: community.id,
    })
    console.log(`✓ Created chat room for community: ${community.name} (${community.id})`)
  }

  console.log(`\n✅ Successfully created ${communitiesWithoutChatRooms.length} chat rooms!`)
}

createMissingChatRooms()
  .then(() => {
    console.log('\nDone!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
