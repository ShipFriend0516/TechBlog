import { Post } from '@/app/types/Post';
import { FaPencil } from 'react-icons/fa6';
import { FaTrash } from 'react-icons/fa';

const PostListItem = (props: {
  post: Post;
  handleEdit: () => void;
  handleDelete: () => void;
}) => {
  return (
    <div className="p-4 hover:bg-gray-700/50">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{props.post.title}</h2>
          {props.post.subTitle && (
            <p className="text-sm text-gray-500 mt-1">{props.post.subTitle}</p>
          )}
          <div className="flex gap-4 mt-2 text-sm text-gray-600">
            <span>작성자: {props.post.author}</span>
            <span>
              작성일: {new Date(props.post.date).toLocaleDateString()}
            </span>
            <span>읽는 시간: {props.post.timeToRead}분</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={props.handleEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <FaPencil className="w-5 h-5" />
          </button>
          <button
            onClick={props.handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <FaTrash className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostListItem;
