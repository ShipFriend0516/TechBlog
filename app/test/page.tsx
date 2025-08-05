'use client';

import React, { useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { FaReact, FaBolt, FaUsers, FaTools, FaTrophy } from 'react-icons/fa';

const SearchToPortfolio = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const { scrollY } = useScroll();

  // 스크롤에 따른 변환값들 - 스크롤 양 2.5배 증가
  const searchOpacity = useTransform(scrollY, [750, 1250], [1, 0]);
  const backgroundOpacity = useTransform(scrollY, [500, 1000], [1, 0]);
  const contentOpacity = useTransform(scrollY, [1000, 1500], [0, 1]);
  const contentY = useTransform(scrollY, [1000, 1500], [100, 0]);

  // 스크롤에 따른 타이핑 효과
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      const searchText = 'ShipFriend';
      const progress = Math.min(latest / 750, 1); // 0-750px 스크롤 범위로 증가
      const typedLength = Math.floor(progress * searchText.length);

      if (typedLength <= searchText.length) {
        setSearchValue(searchText.slice(0, typedLength));
        setIsTypingComplete(typedLength === searchText.length);
      }
    });

    return () => unsubscribe();
  }, [scrollY]);

  return (
    <div className="relative">
      {/* 그라데이션 배경 오버레이 - 밝은 색 */}
      {/*<motion.div*/}
      {/*  className="fixed inset-0 bg-gradient-to-br from-gray-100 via-white to-gray-50 z-50"*/}
      {/*  style={{ opacity: backgroundOpacity }}*/}
      {/*  initial={{ opacity: 1 }} // 처음에 보임*/}
      {/*/>*/}

      {/* 검색 섹션 - 페이지 로드시 즉시 표시 */}
      <motion.section
        className="fixed inset-0 flex flex-col items-center justify-center z-60"
        style={{ opacity: searchOpacity }}
        initial={{ opacity: 1 }} // 즉시 표시
      >
        <motion.div
          className="relative max-w-lg mx-auto w-full px-6"
          initial={{ opacity: 1, y: 0 }} // 즉시 표시
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative bg-white rounded-full px-6 py-4 shadow-2xl">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <div className="flex-1 text-lg text-gray-700 font-medium">
                {searchValue || '스크롤해서 탐색해보세요...'}
                {/* 타이핑 커서 효과 */}
                <AnimatePresence>
                  {!isTypingComplete && searchValue.length > 0 && (
                    <motion.span
                      className="text-gray-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      |
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 스크롤 힌트 */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-600 text-sm flex flex-col items-center"
          >
            <span className="mb-2 font-medium">스크롤해서 탐색하기</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* 포트폴리오 콘텐츠 */}
      <motion.div
        className="relative z-50"
        style={{
          opacity: contentOpacity,
          y: contentY,
        }}
      >
        {/* 스페이서 - 스크롤을 위한 공간 */}
        <div className="h-screen" />

        {/* About Me 섹션 - 모노톤 디자인 */}
        <section className="min-h-screen bg-gray-50 px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              {/* 프로필 이미지 */}
              <motion.div
                className="relative order-2 lg:order-1"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative w-80 h-80 mx-auto">
                  {/* 메인 프로필 이미지 */}
                  <motion.div
                    className="w-full h-full rounded-2xl overflow-hidden bg-white shadow-xl border border-gray-200"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src="/images/profile/profile.jpg"
                      alt="서정우 프로필"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* 플로팅 기술 뱃지들 - 모노톤 */}
                  <motion.div
                    className="absolute -top-3 -right-3 bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg border border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    animate={{ y: [0, -3, 0] }}
                    style={{
                      animationDuration: '3s',
                      animationIterationCount: 'infinite',
                    }}
                  >
                    React
                  </motion.div>
                  <motion.div
                    className="absolute top-16 -left-6 bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg border border-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    animate={{ y: [0, -3, 0] }}
                    style={{
                      animationDuration: '3s',
                      animationIterationCount: 'infinite',
                      animationDelay: '1s',
                    }}
                  >
                    Next.js
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-3 left-6 bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg border border-gray-500"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    animate={{ y: [0, -3, 0] }}
                    style={{
                      animationDuration: '3s',
                      animationIterationCount: 'infinite',
                      animationDelay: '2s',
                    }}
                  >
                    TypeScript
                  </motion.div>
                </div>
              </motion.div>

              {/* 소개 텍스트 */}
              <div className="space-y-8 order-1 lg:order-2">
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <motion.h2
                    className="text-5xl font-bold text-gray-900 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    Frontend
                    <br />
                    <span className="text-gray-600">Developer</span>
                  </motion.h2>

                  <motion.div
                    className="mt-4 h-1 w-16 bg-gray-800"
                    initial={{ width: 0 }}
                    whileInView={{ width: 64 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                  />
                </motion.div>

                <motion.h3
                  className="text-xl text-gray-700 font-light tracking-wide"
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  서정우 <span className="text-gray-500">/</span> Jeongwoo Seo
                </motion.h3>

                <motion.p
                  className="text-lg text-gray-600 leading-relaxed font-light"
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  viewport={{ once: true }}
                >
                  사용자 경험과 깔끔한 코드 작성에 중점을 두고 있으며, 멈추지
                  않는 기술의 변화를 즐깁니다. React, Next.js, TypeScript를 주로
                  사용하여 실제 문제를 해결하는 웹 서비스를 만듭니다.
                </motion.p>

                {/* 특징 - 모노톤 스타일 */}
                <motion.div
                  className="grid grid-cols-1 gap-4 mt-10"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  {[
                    {
                      icon: <FaBolt className="text-xl" />,
                      title: '성능 최적화',
                      desc: 'Core Web Vitals 80% 개선',
                      delay: 0.9,
                    },
                    {
                      icon: <FaUsers className="text-xl" />,
                      title: '협업 문화',
                      desc: '부스트캠프 수료',
                      delay: 1.0,
                    },
                    {
                      icon: <FaTools className="text-xl" />,
                      title: '문제 해결',
                      desc: '600줄→135줄 리팩토링',
                      delay: 1.1,
                    },
                    {
                      icon: <FaTrophy className="text-xl" />,
                      title: '실사용자',
                      desc: '100+ 사용자 확장프로그램',
                      delay: 1.2,
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: item.delay }}
                      viewport={{ once: true }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="text-gray-600">{item.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* 소셜 링크 - 모노톤 */}
                <motion.div
                  className="flex space-x-4 mt-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.3 }}
                  viewport={{ once: true }}
                >
                  <motion.a
                    href="https://github.com/ShipFriend0516"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 border border-gray-800"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span className="font-medium">GitHub</span>
                  </motion.a>

                  <motion.a
                    href="mailto:sjw4371@naver.com"
                    className="flex items-center space-x-3 bg-white text-gray-900 px-6 py-3 rounded-lg border border-gray-300 hover:border-gray-400 hover:shadow-sm transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">Contact</span>
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 동료들의 피드백 섹션 */}
        <section className="min-h-screen bg-gray-100 px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                동료들은 저를..
              </h2>
              <div className="h-1 w-20 bg-gray-800 mx-auto" />
            </motion.div>

            <div className="space-y-12">
              {[
                {
                  feedback:
                    '구현 퀄리티가 높고, 문제 해결 과정을 체계적으로 정리해서 공유하는 개발자입니다.',
                  trait: '체계적 사고',
                  author: '부스트캠프 동료',
                  position: 'left',
                },
                {
                  feedback:
                    '왜 이렇게 개발했는지에 대한 근거를 명확히 설명하는 전문성을 가진 개발자입니다.',
                  trait: '논리적 사고',
                  author: '부스트캠프 동료',
                  position: 'right',
                },
                {
                  feedback:
                    '빠른 구현력으로 앞서 나가면서도 동료들에게 적극적으로 피드백을 주는 개발자입니다.',
                  trait: '리더십',
                  author: '부스트캠프 동료',
                  position: 'left',
                },
                {
                  feedback:
                    '자신의 주장을 강하게 어필하지 않으면서도 팀 활동에서 윤활유 역할을 하는 개발자입니다.',
                  trait: '협업 능력',
                  author: '부스트캠프 동료',
                  position: 'right',
                },
                {
                  feedback:
                    '함께 일하면 많은 것을 배울 수 있고, 팀에 꼭 필요한 존재로 인식되는 개발자입니다.',
                  trait: '지식 공유',
                  author: '부스트캠프 동료',
                  position: 'left',
                },
                {
                  feedback:
                    '학습에 대한 진지한 고민과 질문을 통해 동료들에게도 도움이 되는 개발자입니다.',
                  trait: '성장 마인드',
                  author: '부스트캠프 동료',
                  position: 'right',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={`flex ${item.position === 'right' ? 'justify-end' : 'justify-start'}`}
                  initial={{
                    opacity: 0,
                    x: item.position === 'right' ? 100 : -100,
                    y: 50,
                  }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3,
                    ease: 'easeOut',
                  }}
                  viewport={{ once: true, margin: '-100px' }}
                >
                  <div
                    className={`max-w-lg ${item.position === 'right' ? 'text-right' : 'text-left'}`}
                  >
                    <motion.div
                      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 relative hover:shadow-xl transition-shadow duration-300"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* 말풍선 꼬리 */}
                      <div
                        className={`absolute top-6 ${item.position === 'right' ? '-right-2' : '-left-2'} w-4 h-4 bg-white border-gray-200 ${item.position === 'right' ? 'border-r border-b' : 'border-l border-t'} transform rotate-45`}
                      />

                      {/* 특성 뱃지 */}
                      <div
                        className={`inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full mb-3 ${item.position === 'right' ? 'ml-auto' : ''}`}
                      >
                        {item.trait}
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-4 font-medium">
                        "{item.feedback}"
                      </p>
                      <div
                        className={`text-sm text-gray-500 ${item.position === 'right' ? 'text-right' : 'text-left'}`}
                      >
                        <span className="font-medium">— {item.author}</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Projects 섹션 - 모노톤 */}
        <section className="min-h-screen bg-white px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                대표 프로젝트
              </h2>
              <div className="h-1 w-20 bg-gray-800 mx-auto" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* PREVIEW 프로젝트 */}
              <motion.div
                className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-white text-5xl font-bold tracking-wider">
                    PREVIEW
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    PREVIEW
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    WebRTC 기반 화상 면접 스터디 플랫폼
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
                      React
                    </span>
                    <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
                      WebRTC
                    </span>
                    <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
                      Fullstack
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-gray-900 text-white py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                      GitHub
                    </button>
                    <button className="flex-1 bg-white text-gray-900 py-2.5 px-4 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors font-medium">
                      세부 정보
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Primitive 프로젝트 */}
              <motion.div
                className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <div className="text-white text-3xl font-bold tracking-wider">
                    PRIMITIVE
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Primitive
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    프로그래밍 동아리 홍보 및 프로젝트 공유 플랫폼
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
                      React
                    </span>
                    <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
                      TypeScript
                    </span>
                    <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
                      Firebase
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-gray-900 text-white py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                      배포
                    </button>
                    <button className="flex-1 bg-white text-gray-900 py-2.5 px-4 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors font-medium">
                      GitHub
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default SearchToPortfolio;
