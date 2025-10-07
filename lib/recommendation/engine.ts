import type { Hobby } from "@/lib/db/schema"

interface UserProfile {
  outdoorPreference: number // 0-1
  socialPreference: number // 0-1
  creativePreference: number // 0-1
  physicalPreference: number // 0-1
  budgetPreference: number // 0-1 (0=low, 1=high)
  difficultyPreference: number // 1-5
}

export class RecommendationEngine {
  // Convert survey responses to user profile
  static createUserProfile(responses: { [key: string]: number | string }): UserProfile {
    // Question mapping:
    // Q1-2: Outdoor preference (1=실내, 5=야외)
    // Q3-4: Social preference (1=혼자, 5=함께)
    // Q5-6: Creative preference (1=낮음, 5=높음)
    // Q7: Physical activity preference (1=낮음, 5=높음)
    // Q8: Budget preference (1=저렴, 5=고급)

    // Calculate average scores (1-5 scale) then normalize to 0-1
    const q1 = Number(responses["1"]) || 3
    const q2 = Number(responses["2"]) || 3
    const q3 = Number(responses["3"]) || 3
    const q4 = Number(responses["4"]) || 3
    const q5 = Number(responses["5"]) || 3
    const q6 = Number(responses["6"]) || 3
    const q7 = Number(responses["7"]) || 3
    const q8 = Number(responses["8"]) || 3

    // Average the related questions, then normalize to 0-1 scale
    const outdoorScore = ((q1 + q2) / 2 - 1) / 4  // (avg-1)/4 maps 1-5 to 0-1
    const socialScore = ((q3 + q4) / 2 - 1) / 4
    const creativeScore = ((q5 + q6) / 2 - 1) / 4
    const physicalScore = (q7 - 1) / 4
    const budgetScore = (q8 - 1) / 4

    // Infer difficulty preference based on physical activity and creative preferences
    const difficultyScore =
      physicalScore > 0.6 && creativeScore > 0.6 ? 4 :
      physicalScore > 0.6 ? 3 :
      creativeScore > 0.6 ? 3 :
      physicalScore > 0.4 || creativeScore > 0.4 ? 2 : 1

    return {
      outdoorPreference: Math.max(0, Math.min(1, outdoorScore)),
      socialPreference: Math.max(0, Math.min(1, socialScore)),
      creativePreference: Math.max(0, Math.min(1, creativeScore)),
      physicalPreference: Math.max(0, Math.min(1, physicalScore)),
      budgetPreference: Math.max(0, Math.min(1, budgetScore)),
      difficultyPreference: difficultyScore,
    }
  }

  // Calculate match score between user profile and hobby
  static calculateMatchScore(profile: UserProfile, hobby: Hobby): number {
    let score = 0

    // Indoor/Outdoor matching (weight: 25%)
    const outdoorWeight = 0.25
    if (hobby.indoorOutdoor === "both") {
      // "both" gets medium score - not automatically high
      score += outdoorWeight * 0.5
    } else if (hobby.indoorOutdoor === "outdoor") {
      // Strong preference match: high outdoor preference (>0.5) gets bonus
      score += outdoorWeight * profile.outdoorPreference
    } else {
      // Indoor: inverse of outdoor preference
      score += outdoorWeight * (1 - profile.outdoorPreference)
    }

    // Social/Individual matching (weight: 25%)
    const socialWeight = 0.25
    if (hobby.socialIndividual === "both") {
      score += socialWeight * 0.5
    } else if (hobby.socialIndividual === "social") {
      score += socialWeight * profile.socialPreference
    } else {
      score += socialWeight * (1 - profile.socialPreference)
    }

    // Creative matching (weight: 20%)
    const creativeWeight = 0.2
    const creativeCategories = ["미술", "예술", "문화"]
    if (creativeCategories.includes(hobby.category)) {
      // Creative hobbies strongly reward creative preference
      score += creativeWeight * profile.creativePreference
    } else {
      // Non-creative hobbies: slight bonus for low creative preference
      score += creativeWeight * (0.3 + (1 - profile.creativePreference) * 0.7)
    }

    // Physical activity matching (weight: 20%)
    const physicalWeight = 0.2
    const physicalCategories = ["스포츠", "건강"]
    if (physicalCategories.includes(hobby.category)) {
      // Physical hobbies strongly reward physical preference
      score += physicalWeight * profile.physicalPreference
    } else {
      // Non-physical hobbies: slight bonus for low physical preference
      score += physicalWeight * (0.3 + (1 - profile.physicalPreference) * 0.7)
    }

    // Budget matching (weight: 5%)
    const budgetWeight = 0.05
    const budgetScore = hobby.budget === "low" ? 0 : hobby.budget === "medium" ? 0.5 : 1
    const budgetDiff = Math.abs(budgetScore - profile.budgetPreference)
    score += budgetWeight * (1 - budgetDiff)

    // Difficulty matching (weight: 5%)
    const difficultyWeight = 0.05
    const difficultyScore = (hobby.difficulty - 1) / 4 // Normalize 1-5 to 0-1
    const profileDifficultyScore = (profile.difficultyPreference - 1) / 4
    const difficultyDiff = Math.abs(difficultyScore - profileDifficultyScore)
    score += difficultyWeight * (1 - difficultyDiff)

    // Normalize score to 0-100
    return Math.round(score * 100)
  }

  // Get top N recommendations for user
  static getRecommendations(
    profile: UserProfile,
    hobbies: Hobby[],
    topN = 5,
  ): Array<Hobby & { matchScore: number; reasons: string[] }> {
    const scoredHobbies = hobbies.map((hobby) => {
      const matchScore = this.calculateMatchScore(profile, hobby)
      const reasons = this.generateReasons(profile, hobby)

      return {
        ...hobby,
        matchScore,
        reasons,
      }
    })

    // Sort by match score and return top N
    return scoredHobbies.sort((a, b) => b.matchScore - a.matchScore).slice(0, topN)
  }

  // Generate reasons for recommendation
  private static generateReasons(profile: UserProfile, hobby: Hobby): string[] {
    const reasons: string[] = []

    // Outdoor/Indoor match
    if (hobby.indoorOutdoor === "outdoor" && profile.outdoorPreference > 0.6) {
      reasons.push("야외 활동을 선호하시는 분께 적합합니다")
    } else if (hobby.indoorOutdoor === "indoor" && profile.outdoorPreference < 0.4) {
      reasons.push("실내에서 편안하게 즐길 수 있습니다")
    }

    // Social match
    if (hobby.socialIndividual === "social" && profile.socialPreference > 0.6) {
      reasons.push("사람들과 함께 즐기는 활동입니다")
    } else if (hobby.socialIndividual === "individual" && profile.socialPreference < 0.4) {
      reasons.push("혼자서도 충분히 즐길 수 있습니다")
    }

    // Creative match
    const creativeCategories = ["미술", "예술", "문화"]
    if (creativeCategories.includes(hobby.category) && profile.creativePreference > 0.6) {
      reasons.push("창의력을 발휘할 수 있는 활동입니다")
    }

    // Physical match
    const physicalCategories = ["스포츠", "건강"]
    if (physicalCategories.includes(hobby.category) && profile.physicalPreference > 0.6) {
      reasons.push("건강 증진에 도움이 됩니다")
    }

    // Budget match
    if (hobby.budget === "low") {
      reasons.push("경제적으로 부담이 적습니다")
    }

    // Difficulty match
    if (hobby.difficulty <= 2) {
      reasons.push("초보자도 쉽게 시작할 수 있습니다")
    }

    // If no specific reasons, add general ones
    if (reasons.length === 0) {
      reasons.push("다양한 연령대가 즐기는 인기 취미입니다")
    }

    return reasons.slice(0, 3) // Return top 3 reasons
  }
}
