import React from 'react';
import PostHeader from '@/app/entities/post/PostHeader';
import PostBody from '@/app/entities/post/PostBody';
import example from '@/app/public/thumbnail_example.jpg';
const PortfolioBlogUI = () => {
  return (
    <section className={'bg-transparent w-full h-screen'}>
      <article className={'post'}>
        <PostHeader
          title={'개인 프로젝트를 성공하는 3가지 방법'}
          subTitle={'with Claude AI'}
          author={'Jeongwoo'}
          date={new Date().getTime()}
          timeToRead={3}
          backgroundThumbnail={example}
        />
        <PostBody
          content={
            '개인 프로젝트를 성공적으로 완수하기 위해서는 철학적 사고와 심리적 접근이 도움이 될 수 있습니다. 다음은 그 중 3가지 방법입니다.\n' +
            '\n' +
            '스토이시즘의 정신 - 개인 프로젝트를 수행할 때 스토아 철학의 태도를 가지는 것이 도움이 됩니다. 즉, 우리가 통제할 수 있는 것에 집중하고, 그렇지 않은 것들은 받아들이는 자세입니다. 어려움에 부딪혔을 때 좌절하거나 포기하지 않고, 우리가 할 수 있는 최선을 다하며 지속적으로 노력하는 것이 중요합니다. 프로젝트 자체에 의미를 부여하고, 과정 속에서 배우고 성장하는 것에 가치를 두는 태도가 필요합니다.\n' +
            "성장 마인드셋 - 캐롤 드웩 박사가 제시한 '성장 마인드셋'은 우리의 능력이 고정된 것이 아니라 노력과 학습을 통해 발전할 수 있다는 신념입니다. 이런 마음가짐은 실패를 두려워하지 않고 도전하게 만들며, 어려운 상황을 극복할 수 있는 힘이 됩니다. 프로젝트를 진행하면서 실수를 하더라도 그것을 배움의 기회로 삼고, 지속적으로 개선해 나가는 자세가 필요합니다.\n" +
            '자기 동기부여 - 개인 프로젝트를 성공적으로 마무리하기 위해서는 강한 내적 동기가 필수적입니다. 자신이 하는 일의 의미와 가치를 되새기고, 목표를 달성했을 때의 성취감을 상상하며 스스로를 독려하는 것이 중요합니다. 또한 작은 성과에도 보람을 느끼고 자신을 격려하는 태도를 가져야 합니다. 자신만의 보상 체계를 만들어 동기부여를 높이는 방법도 효과적일 수 있습니다.\n' +
            '\n' +
            '이처럼 개인 프로젝트의 성공을 위해서는 어려움을 극복하는 정신력, 실패를 두려워하지 않는 성장 마인드셋, 그리고 강한 내적 동기부여가 요구됩니다. 이러한 철학적이고 심리적인 접근을 통해 개인 프로젝트를 성공적으로 완수할 수 있을 것입니다.'
          }
        />
      </article>
      <footer></footer>
    </section>
  );
};

export default PortfolioBlogUI;
