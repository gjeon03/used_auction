/*
- 판매자 o
- 상품명 o
- 경매 시작가 o
- 즉시 입찰가 o
- 경매 기간 o
- 상품 올림 시기 o
- 구매자 o
- 판매 내용 o
- 사진 o
- 카테고리 o
*/

const fakeDb = [
  {
    owner: "gilddong@naver.com",
    title: "ipod",
    description: "happy apple",
    start: 3000,
    end: 15000,
    buyer: "gjeon03@gmail.com",
    fileUrl:
      "https://images.unsplash.com/photo-1631229039588-c852e3dc0287?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYzMTgwODYwNA&ixlib=rb-1.2.1&q=80&w=1080",
    createdAt: "2021.11.19",
    term: 3,
    category: "it",
  },
];

export default fakeDb;
