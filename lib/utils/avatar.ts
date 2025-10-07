/**
 * 사용자 이름을 기반으로 아바타 이미지 URL을 생성합니다.
 * DiceBear API를 사용하여 일관된 아바타를 생성합니다.
 */
export function generateAvatar(name: string, seed?: string): string {
  // 이름이나 시드를 사용하여 일관된 아바타 생성
  const avatarSeed = seed || name;

  // DiceBear Avatars API - thumbs 스타일 (친근한 느낌)
  // 다른 옵션: bottts, avataaars, personas, lorelei, notionists
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(avatarSeed)}&backgroundColor=FF7A5C,FFB4A2,FFF5F0&radius=50`;
}

/**
 * 사용자 이름의 첫 글자를 추출합니다.
 */
export function getInitials(name: string): string {
  if (!name) return "?";

  const words = name.trim().split(" ");
  if (words.length === 1) {
    return name.charAt(0).toUpperCase();
  }

  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

/**
 * 이름을 기반으로 배경색을 생성합니다.
 */
export function getAvatarColor(name: string): string {
  const colors = [
    "#FF7A5C", // 오렌지 (메인 컬러)
    "#FF6B4A",
    "#FFB4A2",
    "#4CAF50",
    "#2196F3",
    "#9C27B0",
    "#FF9800",
    "#E91E63",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
