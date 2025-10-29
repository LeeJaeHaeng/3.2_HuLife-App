import { db } from "@/lib/db";
import { users, userHobbies, hobbies, surveyResponses, userActivities } from "@/lib/db/schema";
import { eq, and, inArray, sql, desc } from "drizzle-orm";

/**
 * User feature vector for KNN clustering
 */
interface UserFeatureVector {
  userId: string;
  features: {
    // Survey-based features (0-1 normalized)
    outdoorPreference: number;
    socialPreference: number;
    creativePreference: number;
    physicalPreference: number;
    budgetPreference: number;

    // Hobby category preferences (0-1 normalized by count)
    categoryPreferences: { [category: string]: number };

    // Activity-based features
    totalActivities: number;
    viewHobbyCount: number;
    addInterestCount: number;

    // Hobby interaction features
    totalInterests: number;
    completedHobbies: number;
  };
}

/**
 * KNN-based Collaborative Filtering Recommendation Engine
 */
export class KNNRecommendationEngine {

  /**
   * Build user feature vector from survey, hobbies, and activities
   */
  static async buildUserFeatureVector(userId: string): Promise<UserFeatureVector> {
    // Get survey responses
    const surveyData = await db.select()
      .from(surveyResponses)
      .where(eq(surveyResponses.userId, userId))
      .limit(1);

    // Get user's interested hobbies with hobby details
    const userHobbyData = await db.select({
      hobbyId: userHobbies.hobbyId,
      status: userHobbies.status,
      category: hobbies.category,
    })
      .from(userHobbies)
      .leftJoin(hobbies, eq(userHobbies.hobbyId, hobbies.id))
      .where(eq(userHobbies.userId, userId));

    // Get user activities
    const activities = await db.select()
      .from(userActivities)
      .where(eq(userActivities.userId, userId));

    // Calculate survey-based preferences
    let surveyPreferences = {
      outdoorPreference: 0.5,
      socialPreference: 0.5,
      creativePreference: 0.5,
      physicalPreference: 0.5,
      budgetPreference: 0.5,
    };

    if (surveyData.length > 0 && surveyData[0].responses) {
      const responses = surveyData[0].responses;
      const q1 = Number(responses["1"]) || 3;
      const q2 = Number(responses["2"]) || 3;
      const q3 = Number(responses["3"]) || 3;
      const q4 = Number(responses["4"]) || 3;
      const q5 = Number(responses["5"]) || 3;
      const q6 = Number(responses["6"]) || 3;
      const q7 = Number(responses["7"]) || 3;
      const q8 = Number(responses["8"]) || 3;

      surveyPreferences = {
        outdoorPreference: ((q1 + q2) / 2 - 1) / 4,
        socialPreference: ((q3 + q4) / 2 - 1) / 4,
        creativePreference: ((q5 + q6) / 2 - 1) / 4,
        physicalPreference: (q7 - 1) / 4,
        budgetPreference: (q8 - 1) / 4,
      };
    }

    // Calculate category preferences
    const categoryCount: { [category: string]: number } = {};
    userHobbyData.forEach(item => {
      if (item.category) {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
      }
    });

    // Normalize category preferences
    const totalHobbies = userHobbyData.length || 1;
    const categoryPreferences: { [category: string]: number } = {};
    Object.keys(categoryCount).forEach(category => {
      categoryPreferences[category] = categoryCount[category] / totalHobbies;
    });

    // Activity-based features
    const viewHobbyCount = activities.filter(a => a.activityType === 'view_hobby').length;
    const addInterestCount = activities.filter(a => a.activityType === 'add_hobby_interest').length;

    // Hobby interaction features
    const completedHobbies = userHobbyData.filter(h => h.status === 'completed').length;

    return {
      userId,
      features: {
        ...surveyPreferences,
        categoryPreferences,
        totalActivities: activities.length,
        viewHobbyCount,
        addInterestCount,
        totalInterests: userHobbyData.length,
        completedHobbies,
      }
    };
  }

  /**
   * Calculate cosine similarity between two user feature vectors
   */
  static calculateCosineSimilarity(vectorA: UserFeatureVector, vectorB: UserFeatureVector): number {
    const featuresA = vectorA.features;
    const featuresB = vectorB.features;

    // Collect all numeric features
    const numericFeaturesA = [
      featuresA.outdoorPreference,
      featuresA.socialPreference,
      featuresA.creativePreference,
      featuresA.physicalPreference,
      featuresA.budgetPreference,
      featuresA.totalActivities / 100, // Normalize
      featuresA.viewHobbyCount / 50,
      featuresA.addInterestCount / 20,
      featuresA.totalInterests / 10,
      featuresA.completedHobbies / 5,
    ];

    const numericFeaturesB = [
      featuresB.outdoorPreference,
      featuresB.socialPreference,
      featuresB.creativePreference,
      featuresB.physicalPreference,
      featuresB.budgetPreference,
      featuresB.totalActivities / 100,
      featuresB.viewHobbyCount / 50,
      featuresB.addInterestCount / 20,
      featuresB.totalInterests / 10,
      featuresB.completedHobbies / 5,
    ];

    // Add category preference features
    const allCategories = new Set([
      ...Object.keys(featuresA.categoryPreferences),
      ...Object.keys(featuresB.categoryPreferences),
    ]);

    allCategories.forEach(category => {
      numericFeaturesA.push(featuresA.categoryPreferences[category] || 0);
      numericFeaturesB.push(featuresB.categoryPreferences[category] || 0);
    });

    // Calculate cosine similarity
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < numericFeaturesA.length; i++) {
      dotProduct += numericFeaturesA[i] * numericFeaturesB[i];
      magnitudeA += numericFeaturesA[i] ** 2;
      magnitudeB += numericFeaturesB[i] ** 2;
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) return 0;

    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Find K nearest neighbors for a user
   */
  static async findKNearestNeighbors(
    targetUserId: string,
    k: number = 5
  ): Promise<Array<{ userId: string; similarity: number }>> {
    // Get target user's feature vector
    const targetVector = await this.buildUserFeatureVector(targetUserId);

    // Get all other users who have survey responses or hobbies
    const allUsers = await db.select({ id: users.id })
      .from(users)
      .where(sql`${users.id} != ${targetUserId}`)
      .limit(100); // Limit for performance

    // Build feature vectors for all users and calculate similarity
    const similarities: Array<{ userId: string; similarity: number }> = [];

    for (const user of allUsers) {
      try {
        const userVector = await this.buildUserFeatureVector(user.id);
        const similarity = this.calculateCosineSimilarity(targetVector, userVector);

        if (similarity > 0) { // Only include users with positive similarity
          similarities.push({
            userId: user.id,
            similarity,
          });
        }
      } catch (error) {
        console.error(`Error building vector for user ${user.id}:`, error);
      }
    }

    // Sort by similarity and return top K
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, k);
  }

  /**
   * Get hobby recommendations based on KNN collaborative filtering
   */
  static async getKNNRecommendations(
    userId: string,
    k: number = 5,
    topN: number = 10
  ): Promise<Array<{ hobbyId: string; score: number; reason: string }>> {
    // Find K nearest neighbors
    const neighbors = await this.findKNearestNeighbors(userId, k);

    if (neighbors.length === 0) {
      console.log(`[KNN] No neighbors found for user ${userId}`);
      return [];
    }

    console.log(`[KNN] Found ${neighbors.length} neighbors for user ${userId}`);

    // Get current user's hobbies to exclude
    const currentUserHobbies = await db.select({ hobbyId: userHobbies.hobbyId })
      .from(userHobbies)
      .where(eq(userHobbies.userId, userId));

    const currentHobbyIds = new Set(currentUserHobbies.map(h => h.hobbyId));

    // Get hobbies from similar users
    const neighborUserIds = neighbors.map(n => n.userId);
    const neighborHobbies = await db.select({
      hobbyId: userHobbies.hobbyId,
      userId: userHobbies.userId,
      status: userHobbies.status,
    })
      .from(userHobbies)
      .where(inArray(userHobbies.userId, neighborUserIds));

    // Calculate weighted scores for each hobby
    const hobbyScores: { [hobbyId: string]: number } = {};
    const hobbyNeighbors: { [hobbyId: string]: number } = {}; // Count of neighbors who have this hobby

    neighborHobbies.forEach(item => {
      // Skip hobbies user already has
      if (currentHobbyIds.has(item.hobbyId)) return;

      // Find similarity of the neighbor who has this hobby
      const neighbor = neighbors.find(n => n.userId === item.userId);
      if (!neighbor) return;

      // Weight score by similarity and hobby status
      let weight = neighbor.similarity;
      if (item.status === 'completed') weight *= 1.5; // Boost completed hobbies
      else if (item.status === 'learning') weight *= 1.2; // Boost learning hobbies

      hobbyScores[item.hobbyId] = (hobbyScores[item.hobbyId] || 0) + weight;
      hobbyNeighbors[item.hobbyId] = (hobbyNeighbors[item.hobbyId] || 0) + 1;
    });

    // Sort and format recommendations
    const recommendations = Object.entries(hobbyScores)
      .map(([hobbyId, score]) => ({
        hobbyId,
        score: score / neighbors.length, // Normalize by number of neighbors
        reason: `${hobbyNeighbors[hobbyId]}명의 비슷한 취향을 가진 사용자가 관심을 가지고 있습니다`,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);

    console.log(`[KNN] Generated ${recommendations.length} recommendations`);

    return recommendations;
  }

  /**
   * Get hybrid recommendations (combining content-based and collaborative filtering)
   */
  static async getHybridRecommendations(
    userId: string,
    allHobbies: any[],
    contentBasedWeight: number = 0.5,
    collaborativeWeight: number = 0.5
  ): Promise<any[]> {
    try {
      // Get KNN collaborative filtering recommendations
      const knnRecs = await this.getKNNRecommendations(userId, 5, 20);

      // Create a map of hobby scores from KNN
      const knnScoreMap = new Map(knnRecs.map(r => [r.hobbyId, r.score]));

      // Get content-based recommendations (from existing engine)
      // This will be combined in the API layer

      return knnRecs.map(rec => {
        const hobby = allHobbies.find(h => h.id === rec.hobbyId);
        return hobby ? {
          ...hobby,
          knnScore: rec.score,
          knnReason: rec.reason,
        } : null;
      }).filter(Boolean);
    } catch (error) {
      console.error('[KNN Hybrid] Error generating hybrid recommendations:', error);
      return [];
    }
  }
}
