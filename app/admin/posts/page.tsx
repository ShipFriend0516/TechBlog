'use client';
import { useEffect, useState } from 'react';
import { Post } from '@/app/types/Post';
import axios from 'axios';
import PostListItem from '@/app/entities/post/list/PostListItem';
import DeleteModal from '@/app/entities/common/Modal/DeleteModal';
import { deletePost } from '@/app/entities/post/api/postAPI';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '@/app/entities/common/Loading/LoadingIndicator';
import useToast from '@/app/hooks/useToast';

const AdminPostListPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    const response = await axios.get('/api/posts');
    const data = await response.data;
    setPosts(data.posts);
    setLoading(false);
  };

  const handleEdit = (postId: string) => {
    toast.success('글 수정 페이지로 이동합니다.');
    router.push(`/admin/write?postId=${postId}`);
  };

  const handleDeleteClick = (postId: string) => {
    setSelectedPost(postId);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
    setPosts(posts.filter((post) => post._id !== selectedPost));
    setShowDeleteDialog(false);
    setSelectedPost(null);

    const response = await deletePost(selectedPost);
    if (response.status === 200) {
      toast.success('삭제되었습니다.');
    } else {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className=" rounded-lg shadow">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">게시글 관리</h1>
        </div>
        {loading && (
          <div className={'w-1/3 mx-auto py-20'}>
            <LoadingIndicator message={'글 로딩 중...'} />
          </div>
        )}
        <div className="divide-y">
          {posts.map((post) => (
            <PostListItem
              key={post._id}
              post={post}
              handleEdit={() => handleEdit(post._id)}
              handleDelete={() => handleDeleteClick(post._id)}
            />
          ))}
        </div>
      </div>

      {showDeleteDialog && (
        <DeleteModal
          onCancel={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminPostListPage;
