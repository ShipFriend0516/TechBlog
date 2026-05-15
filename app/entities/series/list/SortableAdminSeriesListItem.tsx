import AdminSeriesListItem from '@/app/entities/series/list/AdminSeriesListItem';
import { Series } from '@/app/types/Series';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableAdminSeriesListItemProps {
  series: Series;
  handleUpdateSeries: (series: Series) => void;
  handleDeleteClick: (slug: string) => void;
}

const SortableAdminSeriesListItem = ({
  series,
  handleUpdateSeries,
  handleDeleteClick,
}: SortableAdminSeriesListItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: series._id });

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
        position: isDragging ? 'relative' : undefined,
      }}
    >
      <AdminSeriesListItem
        series={series}
        handleUpdateSeries={handleUpdateSeries}
        handleDeleteClick={handleDeleteClick}
        dragHandleListeners={listeners}
        isDragging={isDragging}
      />
    </li>
  );
};

export default SortableAdminSeriesListItem;
