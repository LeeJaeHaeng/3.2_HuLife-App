import { db } from '../lib/db/index'
import { sql } from 'drizzle-orm'

async function fixColumns() {
  try {
    console.log('🔧 컬럼 타입 변경 시작...')

    // Check if images column exists, if not add it
    try {
      await db.execute(sql`ALTER TABLE posts ADD COLUMN images LONGTEXT`)
      console.log('✅ posts.images 컬럼 추가 완료')
    } catch (e: any) {
      console.log('⚠️  posts.images 추가 실패:', e.message)
      console.log('📋 전체 에러 객체:', JSON.stringify(e, null, 2))

      // Try to get the cause (original MySQL error)
      const cause = e.cause
      if (cause) {
        console.log('📋 원인 에러:', JSON.stringify(cause, null, 2))
        console.log('📋 원인 code:', cause.code)
      }

      if (e.message.includes('Duplicate column') ||
          e.code === 'ER_DUP_FIELDNAME' ||
          cause?.code === 'ER_DUP_FIELDNAME' ||
          e.message.includes('already exists')) {
        console.log('ℹ️  posts.images 컬럼이 이미 존재함 - MODIFY 시도')
        // Column exists, modify it
        await db.execute(sql`ALTER TABLE posts MODIFY COLUMN images LONGTEXT`)
        console.log('✅ posts.images → LONGTEXT 변경 완료')
      } else {
        console.error('❌ 예상치 못한 에러')
        throw e
      }
    }

    // Modify user_image to LONGTEXT
    await db.execute(sql`ALTER TABLE posts MODIFY COLUMN user_image LONGTEXT`)
    console.log('✅ posts.user_image → LONGTEXT 변경 완료')

    // Modify profile_image to LONGTEXT
    await db.execute(sql`ALTER TABLE users MODIFY COLUMN profile_image LONGTEXT`)
    console.log('✅ users.profile_image → LONGTEXT 변경 완료')

    // Modify post_comments.user_image to LONGTEXT
    await db.execute(sql`ALTER TABLE post_comments MODIFY COLUMN user_image LONGTEXT`)
    console.log('✅ post_comments.user_image → LONGTEXT 변경 완료')

    console.log('\n🎉 모든 컬럼 타입 변경 완료!')
  } catch (error: any) {
    console.error('❌ 오류 발생:', error.message)
    throw error
  }
}

fixColumns()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
