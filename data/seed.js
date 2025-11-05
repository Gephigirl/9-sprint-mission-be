import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { name: '중고 노트북', description: '상태 양호', price: 500000, tags: ['노트북','전자제품'], likeCount: 0 },
      { name: '키보드 팝니다', description: '기계식, 축 청축', price: 30000, tags: ['키보드','컴퓨터'], likeCount: 0 },
      { name: '아이폰 케이스', description: '깨끗해요', price: 8000, tags: ['악세사리'], likeCount: 0 }
    ]
  });


  const article1 = await prisma.article.create({
    data: {
      title: '첫 번째 글',
      content: '안녕하세요 자유게시판!'
    }
  });

  const article2 = await prisma.article.create({
    data: {
      title: '두 번째 글',
      content: '두 번째 글 내용입니다.'
    }
  });

  await prisma.comment.createMany({
    data: [
      { content: '첫 번째 글 댓글이에요!', articleId: article1.id },
      { content: '첫 번째 글 추가 댓글', articleId: article1.id },
      { content: '두 번째 글 댓글!', articleId: article2.id },
      { content: '첫 번째 댓글', articleId: article1.id },
      { content: '두 번째 댓글', articleId: article1.id },
      { content: '세 번째 댓글', articleId: article1.id },
      { content: '네 번째 댓글', articleId: article1.id },
      { content: '다섯 번째 댓글', articleId: article1.id }
    ]
  });

  await prisma.comment.create({
  data: { content: "대댓글 내용", articleId: 1, parentId: 3 } 
});

  console.log('Seed 완료');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
