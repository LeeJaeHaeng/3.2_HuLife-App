// assets/hobbyImages.js
// 이미지 파일이 없는 항목은 주석 처리된 최종 버전입니다.
const hobbyImages = {
  // ㄱ
  '가죽공예': require('./hobbies/hobby_leather.png'),
  '게이트볼': require('./hobbies/hobby_gateball.png'),
  '경락 마사지': require('./hobbies/hobby_meridian_massage.png'),
  '골동품 감정': require('./hobbies/hobby_antique_appraisal.png'), // 추가
  '골프': require('./hobbies/hobby_golf.png'),
  '국궁': require('./hobbies/hobby_gukgung.png'),
  '국악': require('./hobbies/hobby_gugak.png'),
  '걷기': require('./hobbies/hobby_walking.png'),
  '검도': require('./hobbies/hobby_kendo.png'),
  '기타': require('./hobbies/hobby_guitar.png'),
  '꽃꽃이': require('./hobbies/hobby_flower_arrangement.png'),
  // ㄴ
  '낚시': require('./hobbies/hobby_fishing.png'),
  '노래교실': require('./hobbies/hobby_singing_class.png'),
  // ㄷ
  '다도': require('./hobbies/hobby_tea_ceremony.png'),
  '단전호흡': require('./hobbies/hobby_abdominal_breathing.png'),
  '댄스': require('./hobbies/hobby_dance.png'), // '춤'과 매핑 확인
  '독서 지도': require('./hobbies/hobby_reading_coaching.png'),
  '독서 토론': require('./hobbies/hobby_book_discussion.png'),
  '도자기 공예': require('./hobbies/hobby_pottery.png'),
  '도예': require('./hobbies/hobby_ceramics.png'),
  '드럼': require('./hobbies/hobby_drums.png'),
  '드론 조종': require('./hobbies/hobby_drone_piloting.png'),
  '등산': require('./hobbies/hobby_hiking.png'),
  '뜨개질': require('./hobbies/hobby_knitting.png'),
  // ㄹ
  '레고': require('./hobbies/hobby_lego.png'),
  // ㅁ
  '마술': require('./hobbies/hobby_magic.png'),
  '매듭공예': require('./hobbies/hobby_knot_craft.png'),
  '멘토링': require('./hobbies/hobby_mentoring.png'), // 추가
  '명상': require('./hobbies/hobby_meditation.png'),
  '모형 제작': require('./hobbies/hobby_model_making.png'),
  '목공예': require('./hobbies/hobby_woodworking.png'), // '목공예 배우기' 와 매핑 확인
  '목공예 배우기': require('./hobbies/hobby_woodworking.png'),
  '민화': require('./hobbies/hobby_minhwa.png'),
  '민화 그리기': require('./hobbies/hobby_minhwa.png'),
  // ㅂ
  '바둑': require('./hobbies/hobby_baduk.png'),
  '바이올린': require('./hobbies/hobby_violin.png'), // 추가
  // '발효 음식': require('./hobbies/hobby_fermented_food.png'), // ❓ 파일 없음, 주석 처리
  '박물관 탐방': require('./hobbies/hobby_museum_tour.png'),
  '반려견 훈련': require('./hobbies/hobby_dog_training.png'), // 추가
  '배구': require('./hobbies/hobby_volleyball.png'),
  '배드민턴': require('./hobbies/hobby_badminton.png'), // 추가
  '베이킹': require('./hobbies/hobby_baking.png'),
  '버섯 재배': require('./hobbies/hobby_mushroom_cultivation.png'),
  '볼링': require('./hobbies/hobby_bowling.png'),
  '분재': require('./hobbies/hobby_bonsai.png'), // 추가
  '블로깅': require('./hobbies/hobby_blogging.png'), // '블로그 운영' 과 매핑 확인
  '블로그 운영': require('./hobbies/hobby_blogging.png'),
  '비누 만들기': require('./hobbies/hobby_soap_making.png'),
  // ㅅ
  '사진': require('./hobbies/hobby_photography.png'),
  '서예': require('./hobbies/hobby_calligraphy.png'),
  '서핑': require('./hobbies/hobby_surfing.png'),
  '색소폰': require('./hobbies/hobby_saxophone.png'),
  '수경 재배': require('./hobbies/hobby_hydroponics.png'),
  '수상스키': require('./hobbies/hobby_water_skiing.png'),
  '수영': require('./hobbies/hobby_swimming.png'),
  '수채화': require('./hobbies/hobby_watercolor.png'),
  '수묵화': require('./hobbies/hobby_ink_wash_painting.png'),
  '스마트폰 활용': require('./hobbies/hobby_smartphone_usage.png'),
  '스쿼시': require('./hobbies/hobby_squash.png'),
  '스트레칭': require('./hobbies/hobby_stretching.png'),
  '스키': require('./hobbies/hobby_skiing.png'),
  '승마': require('./hobbies/hobby_horse_riding.png'), // 추가
  '시 쓰기': require('./hobbies/hobby_poetry_writing.png'), // 추가
  // ㅇ
  '아로마테라피': require('./hobbies/hobby_aromatherapy.png'),
  '아크릴화': require('./hobbies/hobby_acrylic_painting.png'),
  '암벽등반': require('./hobbies/hobby_rock_climbing.png'),
  '양식 요리': require('./hobbies/hobby_western_cuisine.png'), // 추가
  '양초 공예': require('./hobbies/hobby_candle_craft.png'),
  '어린이 교육': require('./hobbies/hobby_kids_education.png'), // 추가
  '에어로빅': require('./hobbies/hobby_aerobics.png'),
  '영어회화': require('./hobbies/hobby_english_conversation.png'),
  '영화 감상': require('./hobbies/hobby_movie_watching.png'),
  '오카리나': require('./hobbies/hobby_ocarina.png'),
  '요가': require('./hobbies/hobby_yoga.png'),
  '요트': require('./hobbies/hobby_yacht.png'),
  '우표 수집': require('./hobbies/hobby_stamp_collecting.png'),
  '우쿨렐레': require('./hobbies/hobby_ukulele.png'),
  '유리공예': require('./hobbies/hobby_glass_craft.png'), // ❓ 파일 없음, 주석 처리
  '유화': require('./hobbies/hobby_oil_painting.png'),
  '인라인 스케이트': require('./hobbies/hobby_inline_skating.png'),
  '일본어': require('./hobbies/hobby_japanese.png'), // 추가
  '일본 요리': require('./hobbies/hobby_japanese_cuisine.png'),
  '일식요리': require('./hobbies/hobby_japanese_cuisine.png'), // 중복 확인
  '자수': require('./hobbies/hobby_embroidery.png'), // 추가
  // ㅈ
  '자전거': require('./hobbies/hobby_bicycle.png'),
  '장기': require('./hobbies/hobby_janggi.png'),
  '재능 기부': require('./hobbies/hobby_talent_donation.png'), // '특별 재능 기부' 와 매핑 확인
  '조경': require('./hobbies/hobby_landscaping.png'),
  '조깅': require('./hobbies/hobby_jogging.png'),
  '조류 관찰': require('./hobbies/hobby_bird_watching.png'), // 추가
  '족구': require('./hobbies/hobby_jokgu.png'),
  '종이접기': require('./hobbies/hobby_paper_folding.png'),
  '중국 요리': require('./hobbies/hobby_chinese_cuisine.png'), // '중식요리' 와 매핑 확인
  '중국어': require('./hobbies/hobby_chinese.png'), // 추가
  '중식요리': require('./hobbies/hobby_chinese_cuisine.png'),
  // ㅊ
  '차 문화': require('./hobbies/hobby_tea_culture.png'), // 추가
  '체스': require('./hobbies/hobby_chess.png'),
  '첼로': require('./hobbies/hobby_cello.png'),
  '천문학': require('./hobbies/hobby_astronomy.png'), // 추가
  '천체관측': require('./hobbies/hobby_astronomical_observation.png'), // 추가
  '철학 독서': require('./hobbies/hobby_philosophy_reading.png'),
  // ㅋ
  '카약': require('./hobbies/hobby_kayak.png'),
  '캘리그라피': require('./hobbies/hobby_calligraphy.png'),
  '캠핑': require('./hobbies/hobby_camping.png'),
  '커피 로스팅': require('./hobbies/hobby_coffee_roasting.png'),
  '컴퓨터 활용': require('./hobbies/hobby_computer_skills.png'),
  '코딩': require('./hobbies/hobby_coding.png'),
  '퀼트': require('./hobbies/hobby_quilt.png'), // 추가
  // ㅌ
  '탁구': require('./hobbies/hobby_table_tennis.png'),
  '태극권': require('./hobbies/hobby_taekkyeon.png'), // 파일 이름 확인: taekkyeon.png 사용
  '태껸': require('./hobbies/hobby_taekkyeon.png'),
  '테니스': require('./hobbies/hobby_tennis.png'),
  '텃밭 가꾸기': require('./hobbies/hobby_gardening.png'),
  '특별 재능 기부': require('./hobbies/hobby_talent_donation.png'),
  '여행': require('./hobbies/hobby_travel.png'), // 추가
  // ㅍ
  '판소리': require('./hobbies/hobby_pansori.png'),
  '퍼즐': require('./hobbies/hobby_puzzle.png'),
  '푸드 스타일링': require('./hobbies/hobby_presentation_food.png'), // 추가
  '피아노': require('./hobbies/hobby_piano.png'),
  '필라테스': require('./hobbies/hobby_pilates.png'),
  // ㅎ
  '하모니카': require('./hobbies/hobby_harmonica.png'),
  '한문 공부': require('./hobbies/hobby_hanmun_study.png'),
  '한식 요리': require('./hobbies/hobby_korean_cuisine.png'), // 추가
  '한지 공예': require('./hobbies/hobby_hanji_craft.png'),
  '합창': require('./hobbies/hobby_choir.png'),
  '헬스': require('./hobbies/hobby_fitness.png'), // 추가
  '화훼 원예': require('./hobbies/hobby_horticulture.png'), // '꽃꽃이' 와 매핑 확인
  '환경보호': require('./hobbies/hobby_environmental_protection.png'), // 추가
  '역사 공부': require('./hobbies/hobby_history_study.png'), // 추가
  // '궁도': require('./hobbies/hobby_archery.png'), // ❓ 파일 없음, 주석 처리
};

export default hobbyImages;