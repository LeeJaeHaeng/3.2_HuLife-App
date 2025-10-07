// In-memory data store (will be replaced with real database)
import type {
  User,
  Hobby,
  SurveyResponse,
  UserHobby,
  Community,
  CommunityMember,
  Post,
  Comment,
  Schedule,
  Review,
} from "./schema"

class DataStore {
  private users: Map<string, User> = new Map()
  private hobbies: Map<string, Hobby> = new Map()
  private surveyResponses: Map<string, SurveyResponse> = new Map()
  private userHobbies: Map<string, UserHobby> = new Map()
  private communities: Map<string, Community> = new Map()
  private communityMembers: Map<string, CommunityMember> = new Map()
  private posts: Map<string, Post> = new Map()
  private comments: Map<string, Comment> = new Map()
  private schedules: Map<string, Schedule> = new Map()
  private reviews: Map<string, Review> = new Map()

  constructor() {
    this.initializeSampleData()
  }

  private initializeSampleData() {
    // Initialize sample hobbies
    const sampleHobbies: Hobby[] = [
      {
        id: "1",
        name: "수채화",
        category: "미술",
        description:
          "물감과 붓을 이용한 아름다운 그림 그리기. 초보자도 쉽게 시작할 수 있으며, 창의력과 집중력을 향상시킵니다.",
        difficulty: 2,
        indoorOutdoor: "indoor",
        socialIndividual: "both",
        budget: "medium",
        imageUrl: "/watercolor-painting-hobby-for-seniors.jpg",
        benefits: ["창의력 향상", "스트레스 해소", "집중력 개선", "소근육 발달"],
        requirements: ["수채화 물감 세트", "붓", "수채화 종이", "물통"],
        curriculum: [
          { week: 1, title: "기초 도구 사용법", content: "붓 잡는 법, 물감 섞기, 종이 선택하기" },
          { week: 2, title: "기본 기법 익히기", content: "번지기, 그라데이션, 레이어링 기법" },
          { week: 3, title: "간단한 풍경화", content: "하늘, 나무, 산 그리기" },
          { week: 4, title: "정물화 그리기", content: "과일, 꽃 등 정물 표현하기" },
        ],
        reviews: [],
      },
      {
        id: "2",
        name: "등산",
        category: "스포츠",
        description: "자연 속에서 즐기는 건강한 운동. 심폐 기능 향상과 함께 아름다운 경치를 감상할 수 있습니다.",
        difficulty: 3,
        indoorOutdoor: "outdoor",
        socialIndividual: "both",
        budget: "low",
        imageUrl: "/senior-hiking-group-mountain.jpg",
        benefits: ["심폐 기능 향상", "근력 강화", "자연 치유", "사회적 교류"],
        requirements: ["등산화", "등산복", "배낭", "등산 스틱"],
        curriculum: [
          { week: 1, title: "등산 기초", content: "장비 선택, 안전 수칙, 스트레칭" },
          { week: 2, title: "초급 코스 도전", content: "낮은 산 등반, 호흡법 익히기" },
          { week: 3, title: "중급 코스 도전", content: "중급 산 등반, 체력 관리" },
          { week: 4, title: "고급 기술", content: "긴 코스 등반, 날씨 대응법" },
        ],
        reviews: [],
      },
      {
        id: "3",
        name: "서예",
        category: "문화",
        description: "붓과 먹으로 아름다운 글씨를 쓰는 전통 예술. 마음의 평화와 집중력을 기를 수 있습니다.",
        difficulty: 3,
        indoorOutdoor: "indoor",
        socialIndividual: "individual",
        budget: "medium",
        imageUrl: "/korean-calligraphy-senior-hobby.jpg",
        benefits: ["집중력 향상", "마음의 평화", "전통 문화 이해", "손글씨 개선"],
        requirements: ["붓", "먹", "벼루", "한지"],
        reviews: [],
      },
      {
        id: "4",
        name: "요가",
        category: "건강",
        description: "몸과 마음의 균형을 찾는 운동. 유연성과 근력을 동시에 기를 수 있습니다.",
        difficulty: 2,
        indoorOutdoor: "indoor",
        socialIndividual: "both",
        budget: "low",
        imageUrl: "/senior-yoga-class-peaceful.jpg",
        benefits: ["유연성 향상", "근력 강화", "스트레스 해소", "균형감각 개선"],
        requirements: ["요가 매트", "편한 운동복", "요가 블록"],
        reviews: [],
      },
      {
        id: "5",
        name: "사진",
        category: "예술",
        description: "카메라로 순간을 포착하는 예술. 세상을 새로운 시각으로 바라보는 법을 배웁니다.",
        difficulty: 3,
        indoorOutdoor: "both",
        socialIndividual: "individual",
        budget: "high",
        imageUrl: "/senior-photography-hobby-camera.jpg",
        benefits: ["관찰력 향상", "창의력 개발", "추억 기록", "예술적 감각"],
        requirements: ["카메라", "렌즈", "삼각대", "메모리 카드"],
        reviews: [],
      },
      {
        id: "6",
        name: "원예",
        category: "자연",
        description: "식물을 키우며 자연과 교감하는 활동. 정서적 안정과 성취감을 느낄 수 있습니다.",
        difficulty: 2,
        indoorOutdoor: "outdoor",
        socialIndividual: "individual",
        budget: "medium",
        imageUrl: "/senior-gardening-community.jpg",
        benefits: ["정서적 안정", "성취감", "신체 활동", "자연 교감"],
        requirements: ["화분", "흙", "씨앗/모종", "원예 도구"],
        reviews: [],
      },
    ]

    sampleHobbies.forEach((hobby) => this.hobbies.set(hobby.id, hobby))

    // Initialize sample communities
    const sampleCommunities: Community[] = [
      {
        id: "1",
        name: "서울 수채화 동호회",
        hobbyId: "1",
        description: "매주 토요일 오전, 함께 수채화를 그리는 모임입니다.",
        location: "서울 강남구",
        schedule: "매주 토요일 10:00-12:00",
        memberCount: 12,
        maxMembers: 15,
        imageUrl: "/senior-painting-hobby.jpg",
        leaderId: "sample-leader-1",
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        name: "북한산 등산 클럽",
        hobbyId: "2",
        description: "건강한 등산을 함께하는 시니어 모임입니다.",
        location: "서울 강북구",
        schedule: "매주 수요일 09:00-14:00",
        memberCount: 20,
        maxMembers: 25,
        imageUrl: "/senior-hiking-group-mountain.jpg",
        leaderId: "sample-leader-2",
        createdAt: new Date("2024-02-01"),
      },
    ]

    sampleCommunities.forEach((community) => this.communities.set(community.id, community))

    // Initialize sample posts
    const samplePosts: Post[] = [
      {
        id: "1",
        userId: "sample-user-1",
        userName: "김영희",
        title: "수채화 초보자를 위한 팁",
        content: "수채화를 시작하시는 분들께 도움이 될 만한 팁을 공유합니다...",
        category: "미술",
        likes: 24,
        comments: 8,
        views: 156,
        createdAt: new Date("2024-03-10"),
      },
      {
        id: "2",
        userId: "sample-user-2",
        userName: "박철수",
        title: "북한산 등산 코스 추천",
        content: "초보자도 쉽게 오를 수 있는 북한산 코스를 소개합니다...",
        category: "스포츠",
        likes: 45,
        comments: 12,
        views: 289,
        createdAt: new Date("2024-03-12"),
      },
    ]

    samplePosts.forEach((post) => this.posts.set(post.id, post))
  }

  // User methods
  getUser(id: string): User | undefined {
    return this.users.get(id)
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.email === email)
  }

  createUser(user: Omit<User, "id" | "createdAt">): User {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }
    this.users.set(newUser.id, newUser)
    return newUser
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id)
    if (!user) return undefined
    const updated = { ...user, ...updates }
    this.users.set(id, updated)
    return updated
  }

  // Hobby methods
  getAllHobbies(): Hobby[] {
    return Array.from(this.hobbies.values())
  }

  getHobby(id: string): Hobby | undefined {
    return this.hobbies.get(id)
  }

  getHobbiesByCategory(category: string): Hobby[] {
    return Array.from(this.hobbies.values()).filter((h) => h.category === category)
  }

  searchHobbies(query: string): Hobby[] {
    const lowerQuery = query.toLowerCase()
    return Array.from(this.hobbies.values()).filter(
      (h) =>
        h.name.toLowerCase().includes(lowerQuery) ||
        h.description.toLowerCase().includes(lowerQuery) ||
        h.category.toLowerCase().includes(lowerQuery),
    )
  }

  // Survey methods
  saveSurveyResponse(response: Omit<SurveyResponse, "id" | "completedAt">): SurveyResponse {
    const newResponse: SurveyResponse = {
      ...response,
      id: `survey-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      completedAt: new Date(),
    }
    this.surveyResponses.set(newResponse.id, newResponse)
    return newResponse
  }

  getSurveyResponse(userId: string): SurveyResponse | undefined {
    return Array.from(this.surveyResponses.values()).find((r) => r.userId === userId)
  }

  // UserHobby methods
  getUserHobbies(userId: string): UserHobby[] {
    return Array.from(this.userHobbies.values()).filter((uh) => uh.userId === userId)
  }

  addUserHobby(userHobby: Omit<UserHobby, "id" | "startedAt">): UserHobby {
    const newUserHobby: UserHobby = {
      ...userHobby,
      id: `uh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      startedAt: new Date(),
    }
    this.userHobbies.set(newUserHobby.id, newUserHobby)
    return newUserHobby
  }

  updateUserHobby(id: string, updates: Partial<UserHobby>): UserHobby | undefined {
    const userHobby = this.userHobbies.get(id)
    if (!userHobby) return undefined
    const updated = { ...userHobby, ...updates }
    this.userHobbies.set(id, updated)
    return updated
  }

  // Community methods
  getAllCommunities(): Community[] {
    return Array.from(this.communities.values())
  }

  getCommunity(id: string): Community | undefined {
    return this.communities.get(id)
  }

  getCommunitiesByHobby(hobbyId: string): Community[] {
    return Array.from(this.communities.values()).filter((c) => c.hobbyId === hobbyId)
  }

  createCommunity(community: Omit<Community, "id" | "createdAt" | "memberCount">): Community {
    const newCommunity: Community = {
      ...community,
      id: `comm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      memberCount: 1,
      createdAt: new Date(),
    }
    this.communities.set(newCommunity.id, newCommunity)
    return newCommunity
  }

  // Community Member methods
  joinCommunity(communityId: string, userId: string): CommunityMember {
    const member: CommunityMember = {
      id: `cm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      communityId,
      userId,
      joinedAt: new Date(),
      role: "member",
    }
    this.communityMembers.set(member.id, member)

    // Update member count
    const community = this.communities.get(communityId)
    if (community) {
      community.memberCount++
      this.communities.set(communityId, community)
    }

    return member
  }

  getUserCommunities(userId: string): Community[] {
    const userMemberships = Array.from(this.communityMembers.values()).filter((cm) => cm.userId === userId)

    return userMemberships
      .map((cm) => this.communities.get(cm.communityId))
      .filter((c): c is Community => c !== undefined)
  }

  // Post methods
  getAllPosts(): Post[] {
    return Array.from(this.posts.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  getPost(id: string): Post | undefined {
    return this.posts.get(id)
  }

  createPost(post: Omit<Post, "id" | "createdAt" | "likes" | "comments" | "views">): Post {
    const newPost: Post = {
      ...post,
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date(),
    }
    this.posts.set(newPost.id, newPost)
    return newPost
  }

  // Schedule methods
  getUserSchedules(userId: string): Schedule[] {
    return Array.from(this.schedules.values())
      .filter((s) => s.userId === userId)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  createSchedule(schedule: Omit<Schedule, "id">): Schedule {
    const newSchedule: Schedule = {
      ...schedule,
      id: `sched-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    this.schedules.set(newSchedule.id, newSchedule)
    return newSchedule
  }

  // Review methods
  getHobbyReviews(hobbyId: string): Review[] {
    return Array.from(this.reviews.values())
      .filter((r) => r.hobbyId === hobbyId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  createReview(review: Omit<Review, "id" | "createdAt">): Review {
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }
    this.reviews.set(newReview.id, newReview)

    // Update hobby reviews
    const hobby = this.hobbies.get(review.hobbyId)
    if (hobby) {
      hobby.reviews.push(newReview)
      this.hobbies.set(hobby.id, hobby)
    }

    return newReview
  }
}

// Singleton instance
export const db = new DataStore()
