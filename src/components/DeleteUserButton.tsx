'use client';

import { deleteUser } from '@/lib/dbActions';
import { Button } from 'react-bootstrap';
import swal from 'sweetalert';
import { useRouter } from 'next/navigation';

const DeleteUserButton = ({ userID }: { userID: number; }) => {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteUser(userID);
      swal('Success', 'User has been Removed', 'success', { timer: 2000 });
      router.push('/admin');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <Button
      onClick={handleDelete}
      style={{
        display: 'inline-block',
        backgroundColor: '#FF474C',
        color: 'black',
        borderRadius: '9999px',
        border: 'none',
        padding: '0.5rem 1rem',
        textDecoration: 'none',
        fontWeight: 'bold' as const,
      }}
    >
      Delete User
    </Button>
  );
};

export default DeleteUserButton;
