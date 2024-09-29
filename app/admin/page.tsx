const AdminPage = () => {
  return (
    <section className={''}>
      <div className={'w-full inline-flex justify-center'}>
        <button
          className={
            'w-1/3 h-1/3 m-10 shadow hover:shadow-xl text-black text-2xl aspect-square bg-blue-200 p-10 hover:rounded-3xl transition-slow'
          }
          content={'블로그 업로드'}
        >
          블로그 업로드
        </button>
        <button
          className={
            'w-1/3 h-1/3 m-10 shadow hover:shadow-xl text-black text-2xl aspect-square bg-amber-200 p-10 hover:rounded-3xl transition-slow'
          }
          content={'포트폴리오 업로드'}
        >
          포트폴리오 업로드
        </button>
      </div>
    </section>
  );
};

export default AdminPage;
