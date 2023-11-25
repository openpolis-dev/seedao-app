import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function SNSEntrancePage() {
  return (
    <div>
      <Link to="/sns/register">
        <Button>Started</Button>
      </Link>
    </div>
  );
}
