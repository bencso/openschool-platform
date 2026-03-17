import { Link } from 'react-router-dom';

interface CourseCardProps {
  id: number;
  name: string;
  description: string | null;
}

export default function CourseCard({ id, name, description }: CourseCardProps) {
  return (
    <div className="card course-card">
      <h3>{name}</h3>
      <p>{description || 'Nincs leírás.'}</p>
      <Link to={`/courses/${id}`} className="btn btn-secondary" style={{ marginTop: 12 }}>
        Részletek
      </Link>
    </div>
  );
}
